from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import (
    billing,
    departments,
    health,
    pipeline,
    recommendations,
    renewals,
    search,
    suppliers,
)


app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
)

origins = [
    origin.strip()
    for origin in settings.cors_origins.split(",")
    if origin.strip() and not origin.strip().startswith("https://*.")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.up\.railway\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_prefix = "/api/v1"

app.include_router(health.router, prefix=api_prefix)
app.include_router(search.router, prefix=api_prefix)
app.include_router(renewals.router, prefix=f"{api_prefix}/ca/renewals")
app.include_router(departments.router, prefix=api_prefix)
app.include_router(suppliers.router, prefix=api_prefix)
app.include_router(recommendations.router, prefix=api_prefix)
app.include_router(billing.router, prefix=api_prefix)
app.include_router(pipeline.router, prefix=api_prefix)

# Temporary compatibility route. Remove after clients migrate to /api/v1/ca/renewals.
app.include_router(
    renewals.router,
    prefix=f"{api_prefix}/renewals",
    include_in_schema=False,
)


@app.get("/")
async def root() -> dict[str, str]:
    return {
        "message": "FedPulse Procurement Intelligence API",
        "version": settings.api_version,
        "environment": settings.environment,
    }
