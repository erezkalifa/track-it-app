import os
import sys
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_server(env: str = "development"):
    os.environ["ENVIRONMENT"] = env
    
    # Get PORT from environment with fallback to 8000
    try:
        port = int(os.getenv("PORT", "8000"))
        logger.info(f"Starting server on port {port}")
    except ValueError as e:
        logger.error(f"Invalid PORT value: {os.getenv('PORT')}. Using default port 8000")
        port = 8000

    # Log environment information
    logger.info(f"Environment: {env}")
    logger.info(f"Host: 0.0.0.0")
    logger.info(f"Port: {port}")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=env == "development"
    )

if __name__ == "__main__":
    env = sys.argv[1] if len(sys.argv) > 1 else "development"
    run_server(env) 