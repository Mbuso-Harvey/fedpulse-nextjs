import json
import os
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import Any, Optional
from urllib.parse import urlparse
from supabase import create_client, Client
from config import settings
from services.auth import get_current_user
from services.entitlements import EntitlementError, get_subscription_entitlement

router = APIRouter(tags=["billing"])

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Optional[Client] = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

class CheckoutSessionRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str
    customer_email: Optional[str] = None

class PortalSessionRequest(BaseModel):
    return_url: str


def _require_stripe() -> None:
    if not stripe.api_key:
        raise HTTPException(status_code=503, detail="Billing service is not configured")


def _allowed_price_ids() -> set[str]:
    return {value.strip() for value in os.getenv("STRIPE_ALLOWED_PRICE_IDS", "").split(",") if value.strip()}


def _validate_return_url(value: str) -> str:
    parsed = urlparse(value)
    allowed_hosts = {host.strip().lower() for host in os.getenv("CHECKOUT_ALLOWED_HOSTS", "").split(",") if host.strip()}
    localhost = parsed.scheme == "http" and parsed.hostname in {"localhost", "127.0.0.1"}
    if parsed.scheme != "https" and not localhost:
        raise HTTPException(status_code=422, detail="Return URL must use HTTPS")
    if not parsed.hostname or (not localhost and parsed.hostname.lower() not in allowed_hosts):
        raise HTTPException(status_code=422, detail="Return URL is not an approved application host")
    return value


def _user_id(user: Any) -> str:
    if isinstance(user, dict):
        value = user.get("id") or user.get("sub")
    else:
        value = None
    if not value:
        raise HTTPException(status_code=401, detail="Verified user identifier is required")
    return str(value)


def _configured_plans() -> list[dict[str, Any]]:
    raw = os.getenv("FEDPULSE_BILLING_PLANS_JSON", "")
    if not raw:
        raise HTTPException(status_code=503, detail="Billing plans are not configured")
    try:
        plans = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=503, detail="Billing plan configuration is invalid") from exc
    if not isinstance(plans, list) or not all(isinstance(plan, dict) and plan.get("id") and plan.get("price_id") for plan in plans):
        raise HTTPException(status_code=503, detail="Billing plan configuration is incomplete")
    return plans


def _price_tiers() -> dict[str, str]:
    try:
        mapping = json.loads(os.getenv("STRIPE_PRICE_TIER_MAP_JSON", "{}"))
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=503, detail="Stripe price tier configuration is invalid") from exc
    if not isinstance(mapping, dict) or not mapping:
        raise HTTPException(status_code=503, detail="Stripe price tier configuration is missing")
    return {str(key): str(value).casefold() for key, value in mapping.items()}


def _upsert_subscription(*, user_id: str, customer_id: str, subscription: Any) -> None:
    if not supabase:
        raise HTTPException(status_code=503, detail="Subscription service is not configured")
    items = subscription.get("items", {}).get("data", [])
    price_id = items[0].get("price", {}).get("id") if items else None
    tier = _price_tiers().get(str(price_id))
    if not price_id or not tier:
        raise HTTPException(status_code=422, detail="Stripe subscription price is not approved")
    try:
        supabase.table("billing_customers").upsert({"user_id": user_id, "stripe_customer_id": customer_id}, on_conflict="user_id").execute()
        supabase.table("billing_subscriptions").upsert({"user_id": user_id, "stripe_customer_id": customer_id, "stripe_subscription_id": str(subscription["id"]), "stripe_price_id": str(price_id), "tier": tier, "status": str(subscription.get("status") or "incomplete"), "current_period_end": subscription.get("current_period_end")}, on_conflict="user_id").execute()
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Subscription provisioning failed") from exc

@router.post("/billing/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest, user: dict = Depends(get_current_user)):
    _require_stripe()
    _user_id(user)
    allowed_price_ids = _allowed_price_ids()
    if request.price_id not in allowed_price_ids:
        raise HTTPException(status_code=422, detail="Price is not an approved subscription plan")
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price": request.price_id,
                    "quantity": 1,
                }
            ],
            mode="subscription",
            success_url=_validate_return_url(request.success_url) + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=_validate_return_url(request.cancel_url),
            customer_email=request.customer_email,
            client_reference_id=_user_id(user),
        )
        return {"session_id": session.id, "url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/billing/create-portal-session")
async def create_portal_session(request: PortalSessionRequest, user: dict = Depends(get_current_user)):
    _require_stripe()
    verified_user_id = _user_id(user)
    if not supabase:
        raise HTTPException(status_code=503, detail="Customer billing identity service is not configured")
    try:
        billing_customer_id = supabase.table("billing_customers").select("stripe_customer_id").eq("user_id", verified_user_id).single().execute().data.get("stripe_customer_id")
        if not billing_customer_id:
            raise HTTPException(status_code=404, detail="No billing customer found")
        session = stripe.billing_portal.Session.create(
            customer=billing_customer_id,
            return_url=_validate_return_url(request.return_url),
        )
        return {"url": session.url}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/billing/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")

    _require_stripe()
    if not webhook_secret:
        raise HTTPException(status_code=503, detail="Stripe webhook verification is not configured")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id, customer_id, subscription_id = session.get("client_reference_id"), session.get("customer"), session.get("subscription")
        if not user_id or not customer_id or not subscription_id:
            raise HTTPException(status_code=422, detail="Subscription checkout event is incomplete")
        _upsert_subscription(user_id=str(user_id), customer_id=str(customer_id), subscription=stripe.Subscription.retrieve(subscription_id))

    elif event["type"] == "customer.subscription.updated":
        subscription = event["data"]["object"]
        if supabase:
            rows = supabase.table("billing_subscriptions").select("user_id").eq("stripe_subscription_id", subscription.get("id")).execute().data or []
            if len(rows) == 1:
                _upsert_subscription(user_id=str(rows[0]["user_id"]), customer_id=str(subscription.get("customer")), subscription=subscription)
    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        if supabase:
            supabase.table("billing_subscriptions").update({"status": "canceled"}).eq("stripe_subscription_id", subscription.get("id")).execute()
    elif event["type"] == "invoice.payment_failed":
        invoice = event["data"]["object"]
        if supabase and invoice.get("subscription"):
            supabase.table("billing_subscriptions").update({"status": "past_due"}).eq("stripe_subscription_id", invoice["subscription"]).execute()

    return {"status": "success"}

@router.get("/billing/subscription-status")
async def get_subscription_status(user: dict = Depends(get_current_user)):
    user_id = _user_id(user)
    try:
        subscription = get_subscription_entitlement(user_id)
    except EntitlementError:
        raise HTTPException(status_code=503, detail="Subscription status is unavailable")
    if not subscription:
        raise HTTPException(status_code=404, detail="No subscription found")
    return {"tier": subscription.tier, "status": subscription.status, "current_period_end": subscription.current_period_end}

@router.get("/billing/plans")
async def get_plans():
    return _configured_plans()
