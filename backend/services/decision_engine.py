"""
Decision Engine Service
Combines Risk Score, Fraud Assessment, Fairness Audit, and Policy Rules to produce a final underwriting decision.
"""

from datetime import datetime
from typing import Optional, List
from database.schemas import (
    RiskAssessmentSchema,
    FraudAssessmentSchema,
    FairnessReportSchema,
    UnderwritingDecisionSchema,
    LoanApplicationRequest
)
from utils.logger import logger


class DecisionEngine:
    """Enterprise Underwriting Decision Engine"""

    @staticmethod
    def evaluate_decision(
        application: LoanApplicationRequest,
        risk: RiskAssessmentSchema,
        fraud: FraudAssessmentSchema,
        fairness: FairnessReportSchema
    ) -> UnderwritingDecisionSchema:
        """
        Evaluate loan application and generate decision output
        
        Outputs:
          - APPROVED
          - APPROVED_LOWER_LIMIT
          - MANUAL_REVIEW
          - NEED_MORE_DOCUMENTS
          - REJECTED
        """
        risk_score = risk.risk_score
        fraud_score = fraud.fraud_score
        fairness_status = fairness.status
        confidence = risk.confidence
        
        decision = "MANUAL_REVIEW"
        approved_amount: Optional[float] = None
        conditions: Optional[List[str]] = None
        required_documents: Optional[List[str]] = None
        next_steps: List[str] = []
        reason = ""

        # High Fraud Override
        if fraud_score > 60 or fraud.fraud_risk in ["HIGH", "CRITICAL"]:
            decision = "REJECTED"
            reason = f"Application flagged by Fraud Engine due to high risk indicators (Fraud Score: {fraud_score:.1f}/100)."
            next_steps = [
                "Contact compliance department",
                "Verify identity and credentials",
                "Re-apply after fraud clearing"
            ]

        # Severe Risk Override
        elif risk_score >= 75:
            decision = "REJECTED"
            reason = f"Risk score of {risk_score:.1f}/100 exceeds maximum allowable risk threshold."
            next_steps = [
                "Review rejection factors in detailed report",
                "Improve credit profile and lower debt ratio",
                "Re-apply after 3 months"
            ]

        # Approval Path: Low Risk & Low Fraud
        elif risk_score < 30 and fraud_score < 25:
            decision = "APPROVED"
            approved_amount = application.loan_amount
            reason = f"Low risk profile (Risk Score: {risk_score:.1f}/100) with verified fraud checks and passing fairness audit."
            next_steps = [
                "Accept loan offer",
                "Complete KYC verification",
                "Sign digital loan agreement",
                "Disbursement to registered bank account"
            ]

        # Approved with Lower Limit Path: Moderate Risk or High Debt Ratio
        elif (risk_score < 45 and fraud_score < 40) or (risk.features.debt_ratio > 40 and risk_score < 55):
            decision = "APPROVED_LOWER_LIMIT"
            # Calculate lower limit (e.g. 70% to 85% of requested amount)
            reduction_factor = max(0.6, 1.0 - (risk_score / 100))
            approved_amount = round(application.loan_amount * reduction_factor, -3)
            conditions = [
                "Maintain monthly debt-to-income ratio below 35%",
                "Provide latest 3 months salary slips",
                "Set up automated e-NACH EMI debit"
            ]
            reason = f"Approved with a modified lower loan limit of ₹{approved_amount:,.0f} to ensure debt serviceability (Risk Score: {risk_score:.1f}/100)."
            next_steps = [
                "Review modified loan offer details",
                "Accept reduced loan limit terms",
                "Submit requested salary verification documents"
            ]

        # Need More Documents Path: Borderline Risk or Missing Verification
        elif risk_score < 65 and fraud_score < 50:
            decision = "NEED_MORE_DOCUMENTS"
            required_documents = [
                "Last 6 months detailed bank statements",
                "Latest Income Tax Returns (ITR / Form 16)",
                "Employer Verification Letter / HR Confirmation",
                "Utility bill for address re-verification"
            ]
            reason = "Additional documentation required to verify financial buffer and income stability before final decision."
            next_steps = [
                "Upload requested documents via Customer Portal",
                "Allow 24-48 hours for document verification",
                "Underwriter team will complete review"
            ]

        # Fallback: Manual Review
        else:
            decision = "MANUAL_REVIEW"
            reason = "Application routed for manual underwriter review due to combination of risk score and complex financial signals."
            next_steps = [
                "Senior underwriter assigned for manual inspection",
                "Applicant will receive update within 24 hours",
                "No immediate action required from applicant"
            ]

        # Fairness Check Warning Note
        if fairness_status != "PASSED":
            reason += " (Note: Flagged for mandatory fairness compliance check)."

        logger.info(f"Decision Engine generated: {decision} for application amount {application.loan_amount}")

        return UnderwritingDecisionSchema(
            decision=decision,
            approved_amount=approved_amount,
            conditions=conditions,
            reason=reason,
            confidence=round(confidence, 2),
            risk_score=round(risk_score, 2),
            fraud_score=round(fraud_score, 2),
            fairness_status=fairness_status,
            required_documents=required_documents,
            next_steps=next_steps,
            timestamp=datetime.utcnow()
        )


# Singleton instance
decision_engine = DecisionEngine()
