"""
Continuous Monitoring & Timeline Router
Handles customer risk timeline and dynamic monitoring updates.
"""

from fastapi import APIRouter
from services.monitoring_service import monitoring_service

router = APIRouter()


@router.get("/timeline/{customer_id}")
async def get_customer_timeline(customer_id: str):
    """
    Get dynamic continuous underwriting event timeline for a customer
    """
    events = monitoring_service.get_customer_timeline(customer_id)
    return {
        "customer_id": customer_id,
        "timeline": events
    }


@router.get("/customer/{customer_id}")
async def get_customer_details(customer_id: str):
    """
    Get detailed customer profile & monitoring status
    """
    return {
        "customer_id": customer_id,
        "full_name": "Arjun Sharma",
        "email": "arjun.sharma@example.com",
        "phone": "+91 98765 43210",
        "current_risk_score": 15.0,
        "current_risk_level": "LOW RISK",
        "monitoring_status": "ACTIVE",
        "last_updated": "2026-08-05T10:30:00Z"
    }
