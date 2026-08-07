"""
Analytics Dashboard Router
Provides portfolio metrics, risk distributions, approval rates, and fraud trend analytics.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/analytics")
@router.get("/analytics/dashboard")
async def get_analytics_dashboard():
    """
    Get comprehensive portfolio & underwriting analytics
    """
    return {
        "overview": {
            "total_applications": 1248,
            "approved_applications": 874,
            "approval_rate": 70.03,
            "rejected_applications": 186,
            "manual_review_applications": 188,
            "average_risk_score": 28.4,
            "average_fraud_score": 8.2,
            "fairness_pass_rate": 98.4
        },
        "risk_distribution": [
            {"category": "Low Risk (0-30)", "count": 874, "percentage": 70.03},
            {"category": "Medium Risk (30-60)", "count": 272, "percentage": 21.79},
            {"category": "High Risk (60-100)", "count": 102, "percentage": 8.18}
        ],
        "fraud_trends": [
            {"month": "Jan", "anomalies": 12, "prevented_loss": 1450000},
            {"month": "Feb", "anomalies": 18, "prevented_loss": 2100000},
            {"month": "Mar", "anomalies": 14, "prevented_loss": 1800000},
            {"month": "Apr", "anomalies": 9, "prevented_loss": 1100000}
        ],
        "alternative_data_impact": {
            "ntc_boosted": 342,
            "average_score_improvement": 14.6,
            "false_positive_reduction": 22.4
        }
    }
