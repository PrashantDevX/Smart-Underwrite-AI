"""
Fraud Detection Router
Standalone Isolation Forest fraud and anomaly detection endpoints.
"""

from fastapi import APIRouter, HTTPException
from database.schemas import LoanApplicationRequest, FraudAssessmentSchema
from services.fraud_engine import fraud_engine
from utils.logger import logger

router = APIRouter()


@router.post("/fraud/check", response_model=FraudAssessmentSchema)
async def check_fraud(application: LoanApplicationRequest):
    """
    Detect fraud and device/location anomalies using Isolation Forest
    """
    try:
        fraud_assessment = fraud_engine.detect_fraud(application)
        return fraud_assessment
    except Exception as e:
        logger.error(f"Error checking fraud: {e}")
        raise HTTPException(status_code=500, detail=str(e))
