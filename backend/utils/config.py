"""
Configuration Utility for SmartUnderwrite AI
Exposes application settings and environment configurations
"""

from config.settings import settings

def get_config():
    """Get global settings instance"""
    return settings

# Export settings
__all__ = ["settings", "get_config"]
