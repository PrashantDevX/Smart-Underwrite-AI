"""
Multi-Agent Underwriting Coordinator & Self-Review Agent
Coordinates specialized agents:
  Feature Engineering -> Fraud Detection -> Risk Prediction -> Explainability -> Fairness Audit -> Decision Engine -> Report Generation -> Self-Review Agent
"""

from typing import Dict, Any
from database.schemas import (
    LoanApplicationRequest,
    UnderwriteResponse,
    EngineeredFeaturesSchema,
    RiskAssessmentSchema,
    FraudAssessmentSchema,
    ExplainabilitySchema,
    FairnessReportSchema,
    UnderwritingDecisionSchema
)
from services.feature_engineering import feature_engineer
from services.fraud_engine import fraud_engine
from services.risk_engine import risk_engine
from services.explainability import explainability_engine
from services.fairness import fairness_engine
from services.decision_engine import decision_engine
from utils.logger import logger


class MultiAgentCoordinator:
    """Multi-Agent Architecture Coordinator for SmartUnderwrite AI"""

    def __init__(self):
        self.feature_agent = feature_engineer
        self.fraud_agent = fraud_engine
        self.risk_agent = risk_engine
        self.explainability_agent = explainability_engine
        self.fairness_agent = fairness_engine
        self.decision_agent = decision_engine

    def execute_underwriting_pipeline(self, application: LoanApplicationRequest) -> UnderwriteResponse:
        """
        Execute full end-to-end multi-agent underwriting workflow
        """
        logger.info(f"[START] Multi-Agent Pipeline started for applicant: {application.full_name}")

        # 1. Feature Engineering Agent
        features: EngineeredFeaturesSchema = self.feature_agent.engineer_features(application)
        logger.info("[OK] Agent 1: Feature Engineering complete")

        # 2. Fraud Detection Agent
        fraud: FraudAssessmentSchema = self.fraud_agent.detect_fraud(application)
        logger.info(f"[OK] Agent 2: Fraud Detection complete (Score: {fraud.fraud_score})")

        # 3. Risk Prediction Agent (LightGBM)
        risk: RiskAssessmentSchema = self.risk_agent.predict_risk(application, features)
        logger.info(f"[OK] Agent 3: Risk Prediction complete (Score: {risk.risk_score})")

        # 4. Explainability Agent (SHAP)
        explainability: ExplainabilitySchema = self.explainability_agent.explain_prediction(risk, application)
        logger.info("[OK] Agent 4: Explainability SHAP values complete")

        # 5. Fairness Agent (Fairlearn principles)
        fairness: FairnessReportSchema = self.fairness_agent.audit_application(application, risk)
        logger.info(f"[OK] Agent 5: Fairness Audit complete (Status: {fairness.status})")

        # 6. Decision Engine Agent
        decision: UnderwritingDecisionSchema = self.decision_agent.evaluate_decision(
            application, risk, fraud, fairness
        )
        logger.info(f"[OK] Agent 6: Decision Engine complete (Decision: {decision.decision})")

        # 7. Self-Review Agent Verification
        decision = self._self_review_check(risk, fraud, fairness, explainability, decision)
        logger.info("[OK] Agent 7: Self-Review Agent verification complete")

        return UnderwriteResponse(
            risk=risk,
            fraud=fraud,
            explainability=explainability,
            fairness=fairness,
            decision=decision
        )

    @staticmethod
    def _self_review_check(
        risk: RiskAssessmentSchema,
        fraud: FraudAssessmentSchema,
        fairness: FairnessReportSchema,
        explainability: ExplainabilitySchema,
        decision: UnderwritingDecisionSchema
    ) -> UnderwritingDecisionSchema:
        """
        Self-Review Agent: Automatically verifies policy, safety, confidence thresholds & audit compliance.
        If any checks fail, flags for MANUAL_REVIEW.
        """
        checks_passed = True
        flag_reasons = []

        # Check 1: Fraud Checked
        if fraud.fraud_score is None or len(fraud.checks) == 0:
            checks_passed = False
            flag_reasons.append("Fraud checks were incomplete")

        # Check 2: Fairness Audit
        if fairness.status == "FAILED":
            checks_passed = False
            flag_reasons.append("Fairness audit failed regulatory compliance")

        # Check 3: Explanation Generated
        if not explainability.plain_language_explanation:
            checks_passed = False
            flag_reasons.append("Missing plain language explanation")

        # Check 4: Confidence Acceptable (>65%)
        if risk.confidence < 65.0:
            checks_passed = False
            flag_reasons.append(f"Prediction confidence ({risk.confidence}%) below safe threshold (65%)")

        if not checks_passed and decision.decision not in ["REJECTED", "MANUAL_REVIEW"]:
            logger.warning(f"⚠️ Self-Review Agent flagged application for manual review: {', '.join(flag_reasons)}")
            decision.decision = "MANUAL_REVIEW"
            decision.reason += f" [Self-Review Flag: {'; '.join(flag_reasons)}]"

        return decision


# Singleton instance
agent_coordinator = MultiAgentCoordinator()
