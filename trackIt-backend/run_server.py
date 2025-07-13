import os
import sys
import uvicorn

def run_server(env: str = "development"):
    os.environ["ENVIRONMENT"] = env
    port = int(os.environ.get('PORT', 8000))  # Reads $PORT from Railway, or 8000 as default
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",  # Must be 0.0.0.0 so Railway can access it
        port=port,
        reload=(env == "development")  # Reload only in development
    )

if __name__ == "__main__":
    env = sys.argv[1] if len(sys.argv) > 1 else "development"
    run_server(env) 