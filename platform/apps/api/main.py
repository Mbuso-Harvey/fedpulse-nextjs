from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import health, search, renewals, departments, suppliers, recommendations, billing, pipeline
from config import settings
from routers import intelligence_products

app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
)

# CORS Middleware
origins = [origin.strip() for origin in settings.cors_origins.split(",") if not origin.strip().startswith("https://*.")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.up\.railway\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router Prefix
api_prefix = "/api/v1"

# Include routers
app.include_router(health.router, prefix=api_prefix)
app.include_router(search.router, prefix=api_prefix)
app.include_router(renewals.router, prefix=api_prefix)
app.include_router(departments.router, prefix=api_prefix)
app.include_router(suppliers.router, prefix=api_prefix)
app.include_router(recommendations.router, prefix=api_prefix)
app.include_router(billing.router, prefix=api_prefix)
app.include_router(pipeline.router, prefix=api_prefix)
app.include_router(intelligence_products.router, prefix=api_prefix)

@app.get("/")
async def root():
    return {"message": "Federal Procurement Intelligence Network API", "version": settings.api_version}
