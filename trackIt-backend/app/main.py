import os
import sys
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, jobs
from app.db.init_db import init_db
from app.config import settings
from app.db.session import engine
from app.db.base import Base
from sqlalchemy import text

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Log environment information
logger.info(f"Environment: {settings.ENVIRONMENT}")
logger.info(f"Debug mode: {settings.DEBUG}")
logger.info(f"Database URL: {settings.DATABASE_URL.split('@')[-1]}")  # Log only host part for security

# Configure CORS
origins = [
    "http://localhost:5173",  # React dev server
    "http://localhost:5174",  # Vite dev server
    "http://localhost:8000",  # FastAPI server
    "https://track-it-app-frontend-production.up.railway.app",  # Production frontend
    "http://track-it-app-frontend-production.up.railway.app",   # Production frontend (HTTP)
    "https://track-it-app-backend-production.up.railway.app",  # Production backend
    "http://track-it-app-backend-production.up.railway.app",   # Production backend (HTTP)
]

logger.info(f"Configured CORS origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    try:
        # Initialize database
        logger.info("Initializing database...")
        init_db()
        logger.info("Database initialized successfully")
        
        # Test database connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            logger.info("Database connection test successful")
            
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        sys.exit(1)

@app.on_event("shutdown")
async def shutdown_event():
    try:
        logger.info("Closing database connections...")
        engine.dispose()
        logger.info("Database connections closed successfully")
    except Exception as e:
        logger.error(f"Error closing database connections: {str(e)}")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])

@app.get("/")
async def root():
    try:
        # Test database connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            db_status = "healthy"
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        db_status = "unhealthy"

    response = {
        "message": "Welcome to TrackIt API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "database_status": db_status,
        "status": "healthy" if db_status == "healthy" else "unhealthy"
    }
    
    logger.info(f"Health check response: {response}")
    return response 