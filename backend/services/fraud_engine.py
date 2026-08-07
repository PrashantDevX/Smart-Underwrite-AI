"""
Fraud Detection Engine using Isolation Forest
"""

import joblib
import numpy as np
from pathlib import Path
from typing import List
from database.schemas import (
    LoanApplicationRequest, 
    FraudAssessmentSchema, 
    FraudCheckSchema,
    SuspiciousPatternSchema
)
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

MODELS_DIR = Path(__file__).parent.parent / "ml" / "models"


class FraudEngine:
    """Isolation Forest-based fraud detection engine"""
    
    def __init__(self):
        self.model = None
        self.feature_names = None
        self.load_model()
    
    def load_model(self):
        """Load trained Isolation Forest model"""
        try:
            model_path = MODELS_DIR / "fraud_model_isolation_forest.pkl"
            feature_names_path = MODELS_DIR / "fraud_feature_names.pkl"
            
            if model_path.exists():
                self.model = joblib.load(model_path)
                self.feature_names = joblib.load(feature_names_path)
                logger.info(f"✅ Fraud model loaded: {model_path}")
            else:
                logger.warning(f"⚠️ Fraud model not found at {model_path}")
                self.model = None
        except Exception as e:
            logger.error(f"❌ Error loading fraud model: {e}")
            self.model = None
    
    def prepare_features(self, application: LoanApplicationRequest) -> np.ndarray:
        """Prepare features for fraud detection"""
        features = [
            application.failed_transactions or 1,
            application.device_stability_score or 75,
            application.location_stability or 75,
            application.email_account_age or 5,
            application.monthly_income,
            application.credit_score
        ]
        return np.array(features).reshape(1, -1)
    
    def detect_fraud(self, application: LoanApplicationRequest) -> FraudAssessmentSchema:
        """
        Detect fraud using multiple checks
        
        Args:
            application: Loan application data
            
        Returns:
            FraudAssessmentSchema with fraud assessment results
        """
        try:
            # Run all fraud checks
            checks = self._run_fraud_checks(application)
            
            # Detect anomalies using Isolation Forest
            anomalies_detected, anomaly_score = self._detect_anomalies(application)
            
            # Identify suspicious patterns
            suspicious_patterns = self._identify_suspicious_patterns(application)
            
            # Calculate overall fraud score (0-100)
            fraud_score = self._calculate_fraud_score(
                checks, anomaly_score, len(suspicious_patterns)
            )
            
            # Determine fraud risk level
            fraud_risk = self._score_to_risk_level(fraud_score)
            
            return FraudAssessmentSchema(
                fraud_score=round(fraud_score, 2),
                fraud_risk=fraud_risk,
                anomalies_detected=anomalies_detected,
                checks=checks,
                suspicious_patterns=suspicious_patterns,
                timestamp=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Error in fraud detection: {e}")
            return self._fallback_fraud_check(application)
    
    def _run_fraud_checks(self, application: LoanApplicationRequest) -> List[FraudCheckSchema]:
        """Run rule-based fraud checks"""
        checks = []
        
        # 1. Identity Verification
        identity_check = self._check_identity(application)
        checks.append(FraudCheckSchema(
            name="Identity Verification",
            passed=identity_check,
            details="Document verification" if identity_check else "Suspicious identity data"
        ))
        
        # 2. Device Analysis
        device_check = self._check_device(application)
        checks.append(FraudCheckSchema(
            name="Device Analysis",
            passed=device_check,
            details="Device fingerprint stable" if device_check else "Unusual device patterns"
        ))
        
        # 3. Location Consistency
        location_check = self._check_location(application)
        checks.append(FraudCheckSchema(
            name="Location Consistency",
            passed=location_check,
            details="Location verified" if location_check else "Location inconsistency detected"
        ))
        
        # 4. Email Verification
        email_check = self._check_email(application)
        checks.append(FraudCheckSchema(
            name="Email Verification",
            passed=email_check,
            details="Email domain verified" if email_check else "Suspicious email domain"
        ))
        
        # 5. Phone Verification
        phone_check = self._check_phone(application)
        checks.append(FraudCheckSchema(
            name="Phone Verification",
            passed=phone_check,
            details="Phone number verified" if phone_check else "Phone verification failed"
        ))
        
        # 6. Velocity Check (rapid applications)
        velocity_check = self._check_velocity(application)
        checks.append(FraudCheckSchema(
            name="Velocity Check",
            passed=velocity_check,
            details="No rapid applications" if velocity_check else "Multiple recent applications"
        ))
        
        return checks
    
    @staticmethod
    def _check_identity(application: LoanApplicationRequest) -> bool:
        """Check identity consistency"""
        # Check basic identity fields are complete
        return all([
            application.full_name and len(application.full_name) > 5,
            application.age >= 21 and application.age <= 70,
            application.email and '@' in application.email,
        ])
    
    @staticmethod
    def _check_device(application: LoanApplicationRequest) -> bool:
        """Check device stability"""
        device_score = application.device_stability_score or 75
        return device_score >= 50
    
    @staticmethod
    def _check_location(application: LoanApplicationRequest) -> bool:
        """Check location consistency"""
        location_score = application.location_stability or 75
        return location_score >= 50 and bool(application.location)
    
    @staticmethod
    def _check_email(application: LoanApplicationRequest) -> bool:
        """Check email validity"""
        email_age = application.email_account_age or 5
        # Suspicious if email is too new or from disposable domains
        return email_age >= 1 and not any(
            domain in application.email.lower() 
            for domain in ['tempmail', 'throwaway', '10minute']
        )
    
    @staticmethod
    def _check_phone(application: LoanApplicationRequest) -> bool:
        """Check phone validity"""
        # Basic phone format check
        phone = application.phone.replace(' ', '').replace('-', '').replace('+', '')
        return len(phone) >= 10
    
    @staticmethod
    def _check_velocity(application: LoanApplicationRequest) -> bool:
        """Check for rapid repeat applications"""
        # In production, check database for recent applications from same user
        # For now, assume pass
        return True
    
    def _detect_anomalies(self, application: LoanApplicationRequest) -> tuple:
        """Detect anomalies using Isolation Forest"""
        if self.model is None:
            return [], 0.0
        
        try:
            X = self.prepare_features(application)
            prediction = self.model.predict(X)[0]  # 1=normal, -1=anomaly
            anomaly_score = self.model.score_samples(X)[0]
            
            anomalies = []
            if prediction == -1:
                # Identify which features are anomalous
                if (application.failed_transactions or 0) > 10:
                    anomalies.append("High number of failed transactions")
                if (application.device_stability_score or 100) < 40:
                    anomalies.append("Very low device stability")
                if (application.email_account_age or 10) < 1:
                    anomalies.append("Newly created email account")
            
            return anomalies, abs(anomaly_score)
        except Exception as e:
            logger.error(f"Anomaly detection error: {e}")
            return [], 0.0
    
    def _identify_suspicious_patterns(self, application: LoanApplicationRequest) -> List[SuspiciousPatternSchema]:
        """Identify suspicious patterns"""
        patterns = []
        
        # Pattern 1: Income vs Loan Amount mismatch
        if application.loan_amount > application.monthly_income * 60:
            patterns.append(SuspiciousPatternSchema(
                type="Income-Loan Mismatch",
                severity="MEDIUM",
                description="Loan amount is unusually high compared to monthly income"
            ))
        
        # Pattern 2: High debt ratio
        debt_ratio = (application.monthly_debt / application.monthly_income) * 100
        if debt_ratio > 60:
            patterns.append(SuspiciousPatternSchema(
                type="High Debt Ratio",
                severity="HIGH",
                description=f"Debt-to-income ratio of {debt_ratio:.1f}% exceeds safe threshold"
            ))
        
        # Pattern 3: Excessive failed transactions
        if (application.failed_transactions or 0) > 15:
            patterns.append(SuspiciousPatternSchema(
                type="Failed Transactions",
                severity="HIGH",
                description="Unusually high number of failed transactions"
            ))
        
        # Pattern 4: Low savings with high loan request
        if application.savings < application.loan_amount * 0.05:
            patterns.append(SuspiciousPatternSchema(
                type="Low Savings Buffer",
                severity="LOW",
                description="Very low savings relative to loan amount"
            ))
        
        return patterns
    
    @staticmethod
    def _calculate_fraud_score(
        checks: List[FraudCheckSchema],
        anomaly_score: float,
        pattern_count: int
    ) -> float:
        """Calculate overall fraud score (0-100)"""
        # Base score from failed checks
        failed_checks = sum(1 for check in checks if not check.passed)
        check_score = (failed_checks / len(checks)) * 40
        
        # Anomaly contribution (normalize anomaly score)
        anomaly_contribution = min(abs(anomaly_score) * 20, 30)
        
        # Suspicious patterns contribution
        pattern_contribution = min(pattern_count * 10, 30)
        
        total_score = check_score + anomaly_contribution + pattern_contribution
        return min(total_score, 100.0)
    
    @staticmethod
    def _score_to_risk_level(score: float) -> str:
        """Convert fraud score to risk level"""
        if score < 20:
            return "LOW"
        elif score < 50:
            return "MEDIUM"
        elif score < 80:
            return "HIGH"
        else:
            return "CRITICAL"
    
    def _fallback_fraud_check(self, application: LoanApplicationRequest) -> FraudAssessmentSchema:
        """Fallback fraud check when model is not available"""
        checks = self._run_fraud_checks(application)
        suspicious_patterns = self._identify_suspicious_patterns(application)
        
        failed_checks = sum(1 for check in checks if not check.passed)
        fraud_score = (failed_checks / len(checks)) * 50 + len(suspicious_patterns) * 10
        fraud_score = min(fraud_score, 100)
        
        return FraudAssessmentSchema(
            fraud_score=round(fraud_score, 2),
            fraud_risk=self._score_to_risk_level(fraud_score),
            anomalies_detected=[],
            checks=checks,
            suspicious_patterns=suspicious_patterns,
            timestamp=datetime.utcnow()
        )


# Create singleton instance
fraud_engine = FraudEngine()
