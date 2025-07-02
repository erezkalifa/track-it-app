from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

# Load environment variables based on ENVIRONMENT
env = os.getenv("ENVIRONMENT", "development")
env_file = f"config/environments/{env}.env"
load_dotenv(env_file)

class Settings(BaseSettings):
    DATABASE_URL: str
    DEBUG: bool
    ENVIRONMENT: str
    CORS_ORIGINS: list[str]
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        env_file = env_file

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings() 