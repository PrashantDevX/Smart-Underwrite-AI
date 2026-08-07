"""
SmartUnderwrite AI - FastAPI Backend
Enterprise AI-Powered Loan Underwriting Platform
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from loguru import logger
import sys

from config.settings import settings
from database.connection import init_database, close_database

# Configure logging
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
    level=settings.LOG_LEVEL
)
logger.add(
    settings.LOG_FILE,
    rotation="500 MB",
    retention="10 days",
    level=settings.LOG_LEVEL
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting SmartUnderwrite AI Backend...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Deployment: {settings.DEPLOYMENT_PLATFORM}")
    
    try:
        # Initialize database
        await init_database()
        logger.success("✓ Database connected")
        
        # Load ML models
        from services.risk_engine import risk_engine
        logger.success("✓ Risk engine initialized")
        
        from services.fraud_engine import fraud_engine
        logger.success("✓ Fraud engine initialized")
        
        # Initialize RAG if enabled
        if settings.ENABLE_RAG:
            from services.rag_service import rag_service
            await rag_service.initialize()
            logger.success("✓ RAG service initialized")
        
        logger.success("=" * 60)
        logger.success("🎉 SmartUnderwrite AI Backend is READY!")
        logger.success(f"📍 API URL: {settings.get_base_url()}")
        logger.success("=" * 60)
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")
    await close_database()
    logger.info("✓ Shutdown complete")

# Create FastAPI app
app = FastAPI(
    title="SmartUnderwrite AI",
    description="Enterprise AI-Powered Loan Underwriting Platform",
    version="2.5.1",
    lifespan=lifespan,
    docs_url="/docs" if not settings.is_production() else None,
    redoc_url="/redoc" if not settings.is_production() else None,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "deployment": settings.DEPLOYMENT_PLATFORM,
        "version": "2.5.1"
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "SmartUnderwrite AI Backend",
        "version": "2.5.1",
        "docs": f"{settings.get_base_url()}/docs",
        "health": f"{settings.get_base_url()}/health"
    }

# Import and include routers
from api.routes import underwriting, risk, fraud, analytics, monitor

app.include_router(underwriting.router, prefix="/api", tags=["Underwriting"])
app.include_router(risk.router, prefix="/api", tags=["Risk"])
app.include_router(fraud.router, prefix="/api", tags=["Fraud"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])
app.include_router(monitor.router, prefix="/api", tags=["Monitor"])

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": str(exc) if not settings.is_production() else "Internal server error",
            "timestamp": None
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD
    )
