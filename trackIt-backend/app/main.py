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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  # React dev server
    "http://localhost:8000",  # FastAPI server
    "https://track-it-app-production.up.railway.app",  # Production frontend
    "https://track-it-app-backend-production.up.railway.app",  # Production backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    try:
        # Initialize database
        logger.info("Initializing database...")
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        sys.exit(1)

@app.on_event("shutdown")
async def shutdown_event():
    try:
        logger.info("Closing database connections...")
        await engine.dispose()
        logger.info("Database connections closed successfully")
    except Exception as e:
        logger.error(f"Error closing database connections: {str(e)}")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])

@app.get("/")
async def root():
    try:
        return {
            "message": "Welcome to TrackIt API",
            "version": "1.0.0",
            "environment": settings.ENVIRONMENT,
            "status": "healthy"
        }
    except Exception as e:
        logger.error(f"Error in root endpoint: {str(e)}")
        return {
            "message": "Error in TrackIt API",
            "error": str(e),
            "status": "unhealthy"
        } 