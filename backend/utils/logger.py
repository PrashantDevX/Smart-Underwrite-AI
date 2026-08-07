"""
Logger Utility for SmartUnderwrite AI
Provides structured logging using Loguru
"""

import sys
from loguru import logger
from config.settings import settings

# Configure logger
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
    level=settings.LOG_LEVEL if hasattr(settings, 'LOG_LEVEL') else "INFO"
)

__all__ = ["logger"]
