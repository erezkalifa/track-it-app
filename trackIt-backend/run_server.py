import os
import sys
import uvicorn

def run_server(env: str = "development"):
    os.environ["ENVIRONMENT"] = env
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=env == "development"
    )

if __name__ == "__main__":
    env = sys.argv[1] if len(sys.argv) > 1 else "development"
    run_server(env) 