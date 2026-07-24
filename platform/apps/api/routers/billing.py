import os
import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, List
from supabase import create_client, Client
from config import settings

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

@router.post("/billing/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest):
    if not stripe.api_key:
        return {"session_id": "mock_session", "url": f"{request.success_url}?session_id=mock_session"}
    
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
            success_url=request.success_url + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=request.cancel_url,
            customer_email=request.customer_email,
        )
        return {"session_id": session.id, "url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/billing/create-portal-session")
async def create_portal_session(request: PortalSessionRequest):
    if not stripe.api_key:
        return {"url": request.return_url}
        
    try:
        session = stripe.billing_portal.Session.create(
            customer=request.customer_id,
            return_url=request.return_url,
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/billing/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")

    if not stripe.api_key or not webhook_secret:
        print("Mock webhook received")
        return {"status": "success", "message": "mock webhook processed"}

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    print(f"Received webhook event: {event['type']}")

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
                    print(f"Updated {email} to professional tier in Supabase.")
                else:
                    print(f"User {email} not found in Supabase.")
            except Exception as e:
                print(f"Failed to update user in Supabase: {e}")

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
async def get_subscription_status():
    return {
        "tier": "pro",
        "status": "active",
        "current_period_end": "2027-01-01"
    }

@router.get("/billing/plans")
async def get_plans():
    return [
        {
            "id": "free",
            "name": "Free",
            "price": 0,
            "interval": "month",
            "features": ["Weekly digest", "Top 10 renewals", "Limited search"]
        },
        {
            "id": "watch",
            "name": "Procurement Watch",
            "price": 99,
            "interval": "month",
            "features": ["Full renewal radar", "Basic filters", "Weekly alerts", "Department profiles"]
        },
        {
            "id": "pro",
            "name": "Procurement Pro",
            "price": 299,
            "interval": "month",
            "popular": True,
            "features": ["All intelligence suites", "Unlimited filters", "Daily alerts", "CSV export", "Supplier analysis", "Recommendations"]
        },
        {
            "id": "team",
            "name": "Team",
            "price": 999,
            "interval": "month",
            "features": ["Everything in Pro", "5 team seats", "API access", "Custom alerts", "Dedicated support"]
        }
    ]
