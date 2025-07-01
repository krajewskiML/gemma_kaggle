from fastapi import APIRouter

from app.api.v1.endpoints import translation, forms, health

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(
    translation.router,
    prefix="/translate",
    tags=["translation"]
)

api_router.include_router(
    forms.router,
    prefix="/forms",
    tags=["forms"]
)

api_router.include_router(
    health.router,
    prefix="/health",
    tags=["health"]
) 