from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "SmartUnderwrite AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    DEPLOYMENT_PLATFORM: str = "Local Engine / Hackathon MVP"
    
    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://yourdomain.com"
    ]
    
    # Database (using SQLite for development)
    DATABASE_URL: str = "sqlite:///./smartunderwrite.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # ML Models
    MODEL_PATH: str = "./ml/models"
    RISK_MODEL: str = "risk_model_lightgbm.pkl"
    FRAUD_MODEL: str = "fraud_model_isolation_forest.pkl"
    
    # Ollama (Local LLM)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "qwen2.5:3b"
    
    # Vector Database (RAG)
    CHROMA_DB_PATH: str = "./data/chroma_db"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    
    # External APIs (Alternative Data)
    LINKEDIN_API_KEY: str = ""
    EMPLOYMENT_VERIFY_API_KEY: str = ""
    UTILITY_API_KEY: str = ""
    EMAIL_VERIFY_API_KEY: str = ""
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Feature Flags
    ENABLE_FAIRNESS_AUDIT: bool = True
    ENABLE_FRAUD_CHECK: bool = True
    ENABLE_RAG: bool = True
    ENABLE_MONITORING: bool = True
    
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    def get_base_url(self) -> str:
        return f"http://{self.API_HOST}:{self.API_PORT}"

    def get_cors_origins(self) -> List[str]:
        return self.CORS_ORIGINS

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()


# Deployment-specific configurations
class DeploymentConfig:
    """Deployment-specific configurations"""
    
    @staticmethod
    def get_vercel_config():
        """Vercel deployment config (Frontend only)"""
        return {
            "framework": "vite",
            "buildCommand": "npm run build",
            "outputDirectory": "dist",
            "installCommand": "npm install",
        }
    
    @staticmethod
    def get_render_config():
        """Render deployment config (Backend)"""
        return {
            "type": "web",
            "runtime": "python",
            "buildCommand": "pip install -r requirements.txt",
            "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
            "healthCheckPath": "/health",
        }
    
    @staticmethod
    def get_railway_config():
        """Railway deployment config (Backend alternative)"""
        return {
            "build": {
                "builder": "NIXPACKS",
            },
            "deploy": {
                "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
                "restartPolicyType": "ON_FAILURE",
            },
        }
    
    @staticmethod
    def get_docker_config():
        """Docker deployment config"""
        return {
            "image": "python:3.11-slim",
            "workdir": "/app",
            "port": 8000,
            "command": "uvicorn main:app --host 0.0.0.0 --port 8000",
        }


deployment_config = DeploymentConfig()
