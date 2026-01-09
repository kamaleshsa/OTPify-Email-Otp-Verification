from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import auth, otp, dashboard, password_reset

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(otp.router, prefix=f"{settings.API_V1_STR}/otp", tags=["otp"])
app.include_router(
    dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"]
)
app.include_router(
    password_reset.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"]
)


@app.get("/")
def root():
    return {"message": "Welcome to Email OTP Service API"}
