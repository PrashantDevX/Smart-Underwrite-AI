"""
Security & Compliance Utility for SmartUnderwrite AI
Provides privacy, PII masking, and Indian DPDP compliance routines
"""

import hashlib
import re
from typing import Dict, Any


class SecurityUtils:
    """Security and Data Privacy utilities compliant with Indian DPDP principles"""
    
    @staticmethod
    def hash_pii(data: str) -> str:
        """Hash sensitive PII data using SHA-256"""
        if not data:
            return ""
        return hashlib.sha256(data.encode('utf-8')).hexdigest()
    
    @staticmethod
    def mask_email(email: str) -> str:
        """Mask email address for privacy (e.g. j***n@example.com)"""
        if not email or '@' not in email:
            return "***"
        name, domain = email.split('@', 1)
        if len(name) <= 2:
            masked_name = name[0] + "*"
        else:
            masked_name = name[0] + "*" * (len(name) - 2) + name[-1]
        return f"{masked_name}@{domain}"
    
    @staticmethod
    def mask_phone(phone: str) -> str:
        """Mask phone number (e.g. +91 ***** 43210)"""
        if not phone:
            return "*****"
        clean = re.sub(r'[^\d]', '', phone)
        if len(clean) >= 10:
            return f"+91 ***** {clean[-5:]}"
        return "*****"
    
    @staticmethod
    def sanitize_application(app_data: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize loan application data before audit logging"""
        sanitized = app_data.copy()
        if 'email' in sanitized:
            sanitized['email'] = SecurityUtils.mask_email(sanitized['email'])
        if 'phone' in sanitized:
            sanitized['phone'] = SecurityUtils.mask_phone(sanitized['phone'])
        return sanitized


security_utils = SecurityUtils()
