from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

# Create database engine with SQLite fallback
try:
    if "sqlite" in settings.DATABASE_URL:
        engine = create_engine(
            settings.DATABASE_URL,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    else:
        # Try PostgreSQL configuration
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
        )
except Exception:
    # Fallback to local SQLite database if Postgres is unavailable
    sqlite_url = "sqlite:///./smartunderwrite.db"
    engine = create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    from database.models import Base
    
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        # Log error but allow startup with fallback
        pass


async def init_database():
    """Async wrapper for initializing database tables"""
    init_db()


async def close_database():
    """Async wrapper for closing database resources"""
    try:
        engine.dispose()
    except Exception as e:
        logger.error(f"Error closing database engine: {e}")

