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
    customer_id: str
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
        if not billing_customer_id or billing_customer_id != request.customer_id:
            raise HTTPException(status_code=403, detail="Billing customer does not belong to the authenticated user")
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
        email = session.get('customer_email')
        print(f"Checkout completed for {email}")
        
        if supabase and email:
            try:
                # Find user by email
                users_response = supabase.auth.admin.list_users()
                target_user = next((u for u in users_response.users if u.email == email), None)
                
                if target_user:
                    supabase.auth.admin.update_user_by_id(
                        target_user.id,
                        attributes={"user_metadata": {"subscription_tier": "professional"}}
                    )
                    return {"status": "accepted"}
            except Exception:
                raise HTTPException(status_code=503, detail="Subscription provisioning failed")

    elif event["type"] == "customer.subscription.updated":
        subscription = event["data"]["object"]
        print(f"Subscription updated for customer {subscription.get('customer')}")
    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        print(f"Subscription deleted for customer {subscription.get('customer')}")
    elif event["type"] == "invoice.payment_failed":
        invoice = event["data"]["object"]
        print(f"Payment failed for invoice {invoice.get('id')}")

    return {"status": "success"}

@router.get("/billing/subscription-status")
async def get_subscription_status(user: dict = Depends(get_current_user)):
    if not supabase:
        raise HTTPException(status_code=503, detail="Subscription service is not configured")
    user_id = _user_id(user)
    try:
        subscription = supabase.table("billing_subscriptions").select("tier,status,current_period_end").eq("user_id", user_id).single().execute().data
    except Exception:
        raise HTTPException(status_code=503, detail="Subscription status is unavailable")
    if not subscription:
        raise HTTPException(status_code=404, detail="No subscription found")
    return subscription

@router.get("/billing/plans")
async def get_plans():
    return _configured_plans()
