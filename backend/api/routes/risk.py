"""
Risk Prediction Router
Standalone LightGBM risk assessment and engineered feature endpoints.
"""

from fastapi import APIRouter, HTTPException
from database.schemas import LoanApplicationRequest, RiskAssessmentSchema
from services.feature_engineering import feature_engineer
from services.risk_engine import risk_engine
from utils.logger import logger

router = APIRouter()


@router.post("/risk/predict", response_model=RiskAssessmentSchema)
async def predict_risk(application: LoanApplicationRequest):
    """
    Predict loan borrower risk using LightGBM model
    """
    try:
        features = feature_engineer.engineer_features(application)
        risk_assessment = risk_engine.predict_risk(application, features)
        return risk_assessment
    except Exception as e:
        logger.error(f"Error predicting risk: {e}")
        raise HTTPException(status_code=500, detail=str(e))
