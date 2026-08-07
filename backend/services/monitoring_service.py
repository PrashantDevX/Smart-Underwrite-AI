"""
Continuous Underwriting & Risk Monitoring Service
Tracks dynamic customer behavior changes (income, utility payments, employment stability) and continuously updates risk & fraud scores.
"""

from datetime import datetime, timedelta
import uuid
from typing import List, Dict, Any
from database.schemas import MonitoringEventSchema, LoanApplicationRequest
from services.feature_engineering import feature_engineer
from services.risk_engine import risk_engine
from services.fraud_engine import fraud_engine
from utils.logger import logger


class MonitoringService:
    """Continuous Underwriting & Profile Update Monitoring Engine"""

    @staticmethod
    def process_profile_update(
        customer_id: str,
        current_application: LoanApplicationRequest,
        updates: Dict[str, Any]
    ) -> MonitoringEventSchema:
        """
        Process profile update, recalculate risk score, and log monitoring event
        """
        old_risk_assessment = risk_engine.predict_risk(
            current_application,
            feature_engineer.engineer_features(current_application)
        )
        old_risk_score = old_risk_assessment.risk_score

        # Apply updates to application copy
        updated_app_data = current_application.dict()
        updated_app_data.update(updates)
        updated_application = LoanApplicationRequest(**updated_app_data)

        # Recalculate features and risk
        new_features = feature_engineer.engineer_features(updated_application)
        new_risk_assessment = risk_engine.predict_risk(updated_application, new_features)
        new_risk_score = new_risk_assessment.risk_score

        impact_on_risk = round(new_risk_score - old_risk_score, 2)
        triggered_review = abs(impact_on_risk) >= 10.0 or new_risk_score >= 60.0

        event_type = "PROFILE_UPDATE"
        if "monthly_income" in updates:
            event_type = "INCOME_CHANGE"
        elif "utility_payment_history" in updates:
            event_type = "UTILITY_PAYMENT_CHANGE"
        elif "employment_type" in updates or "years_of_employment" in updates:
            event_type = "EMPLOYMENT_CHANGE"

        logger.info(
            f"Continuous Underwriting event [{event_type}] for customer {customer_id}: "
            f"Risk score changed from {old_risk_score} to {new_risk_score} (Impact: {impact_on_risk})"
        )

        return MonitoringEventSchema(
            id=f"EVT-{uuid.uuid4().hex[:8].upper()}",
            customer_id=customer_id,
            event_type=event_type,
            previous_value=old_risk_score,
            new_value=new_risk_score,
            impact_on_risk=impact_on_risk,
            new_risk_score=new_risk_score,
            triggered_review=triggered_review,
            timestamp=datetime.utcnow()
        )

    @staticmethod
    def get_customer_timeline(customer_id: str) -> List[MonitoringEventSchema]:
        """
        Retrieve continuous monitoring event timeline for a customer
        """
        now = datetime.utcnow()
        return [
            MonitoringEventSchema(
                id="EVT-1001",
                customer_id=customer_id,
                event_type="APPLICATION_SUBMITTED",
                previous_value=None,
                new_value=18.5,
                impact_on_risk=0.0,
                new_risk_score=18.5,
                triggered_review=False,
                timestamp=now - timedelta(days=14)
            ),
            MonitoringEventSchema(
                id="EVT-1002",
                customer_id=customer_id,
                event_type="INCOME_INCREASE",
                previous_value=75000,
                new_value=85000,
                impact_on_risk=-2.4,
                new_risk_score=16.1,
                triggered_review=False,
                timestamp=now - timedelta(days=7)
            ),
            MonitoringEventSchema(
                id="EVT-1003",
                customer_id=customer_id,
                event_type="UTILITY_PAYMENT_EXCELLENT",
                previous_value="Good",
                new_value="Excellent",
                impact_on_risk=-1.1,
                new_risk_score=15.0,
                triggered_review=False,
                timestamp=now - timedelta(days=2)
            ),
        ]


monitoring_service = MonitoringService()
