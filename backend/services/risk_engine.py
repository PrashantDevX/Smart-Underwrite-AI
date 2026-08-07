"""
Risk Prediction Engine using LightGBM
"""

import joblib
import numpy as np
from pathlib import Path
from typing import Dict, Any
from database.schemas import LoanApplicationRequest, RiskAssessmentSchema, EngineeredFeaturesSchema
from services.feature_engineering import feature_engineer
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

MODELS_DIR = Path(__file__).parent.parent / "ml" / "models"


class RiskEngine:
    """LightGBM-based risk prediction engine"""
    
    def __init__(self):
        self.model = None
        self.feature_names = None
        self.model_version = "v2.5.1-lightgbm"
        self.load_model()
    
    def load_model(self):
        """Load trained LightGBM model"""
        try:
            model_path = MODELS_DIR / "risk_model_lightgbm.pkl"
            feature_names_path = MODELS_DIR / "feature_names.pkl"
            
            if model_path.exists():
                self.model = joblib.load(model_path)
                self.feature_names = joblib.load(feature_names_path)
                logger.info(f"✅ Risk model loaded: {model_path}")
            else:
                logger.warning(f"⚠️ Model not found at {model_path}. Run ml/train_model.py first!")
                self.model = None
        except Exception as e:
            logger.error(f"❌ Error loading model: {e}")
            self.model = None
    
    def prepare_features(self, application: LoanApplicationRequest, features: EngineeredFeaturesSchema) -> np.ndarray:
        """Prepare feature array for model prediction"""
        # Feature order must match training data
        feature_dict = {
            'age': application.age,
            'credit_score': application.credit_score,
            'monthly_income': application.monthly_income,
            'years_of_employment': application.years_of_employment,
            'monthly_expenses': application.monthly_expenses,
            'savings': application.savings,
            'existing_loans': application.existing_loans,
            'monthly_debt': application.monthly_debt,
            'email_account_age': application.email_account_age or 5,
            'utility_payment_score': self._convert_utility_to_score(application.utility_payment_history),
            'failed_transactions': application.failed_transactions or 1,
            'device_stability_score': application.device_stability_score or 75,
            'digital_engagement_score': application.digital_engagement_score or 70,
            'location_stability': application.location_stability or 75,
            'debt_ratio': features.debt_ratio,
            'savings_ratio': features.savings_ratio,
            'income_stability': features.income_stability,
            'employment_stability': features.employment_stability,
            'financial_discipline_score': features.financial_discipline_score,
            'digital_trust_score': features.digital_trust_score,
        }
        
        # Ensure correct order
        if self.feature_names:
            feature_array = np.array([feature_dict[name] for name in self.feature_names])
        else:
            feature_array = np.array(list(feature_dict.values()))
        
        return feature_array.reshape(1, -1)
    
    @staticmethod
    def _convert_utility_to_score(utility_history: str = None) -> float:
        """Convert utility payment history to numeric score"""
        score_map = {
            'excellent': 95,
            'good': 80,
            'fair': 60,
            'poor': 30
        }
        return score_map.get((utility_history or 'good').lower(), 75)
    
    def predict_risk(self, application: LoanApplicationRequest, features: EngineeredFeaturesSchema) -> RiskAssessmentSchema:
        """
        Predict loan risk using LightGBM model
        
        Args:
            application: Loan application data
            features: Engineered features
            
        Returns:
            RiskAssessmentSchema with prediction results
        """
        try:
            if self.model is None:
                # Fallback to rule-based prediction if model not loaded
                logger.warning("Using fallback rule-based prediction")
                return self._fallback_prediction(application, features)
            
            # Prepare features
            X = self.prepare_features(application, features)
            
            # Get prediction
            risk_category = self.model.predict(X)[0]  # 0=low, 1=medium, 2=high
            risk_probabilities = self.model.predict_proba(X)[0]
            
            # Convert to risk score (0-100)
            risk_score = self._category_to_score(risk_category, risk_probabilities)
            
            # Determine risk level
            risk_level = self._score_to_level(risk_score)
            
            # Determine recommendation
            recommendation = self._score_to_recommendation(risk_score, features.debt_ratio)
            
            # Calculate confidence (inverse of entropy)
            confidence = self._calculate_confidence(risk_probabilities)
            
            return RiskAssessmentSchema(
                risk_score=round(risk_score, 2),
                risk_level=risk_level,
                recommendation=recommendation,
                confidence=round(confidence, 2),
                features=features,
                model_version=self.model_version,
                timestamp=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Error in risk prediction: {e}")
            return self._fallback_prediction(application, features)
    
    @staticmethod
    def _category_to_score(category: int, probabilities: np.ndarray) -> float:
        """Convert category prediction to continuous risk score"""
        # Base scores for each category
        base_scores = {0: 15, 1: 45, 2: 75}
        base = base_scores[category]
        
        # Add uncertainty based on probability distribution
        uncertainty = (1 - max(probabilities)) * 15
        
        return base + uncertainty
    
    @staticmethod
    def _score_to_level(score: float) -> str:
        """Convert risk score to risk level"""
        if score < 30:
            return "LOW RISK"
        elif score < 60:
            return "MEDIUM RISK"
        else:
            return "HIGH RISK"
    
    @staticmethod
    def _score_to_recommendation(score: float, debt_ratio: float) -> str:
        """Determine recommendation based on risk score and debt ratio"""
        if score < 25:
            return "APPROVED"
        elif score < 35 and debt_ratio < 30:
            return "APPROVED_LOWER_LIMIT"
        elif score < 70:
            return "MANUAL_REVIEW"
        elif score < 80:
            return "NEED_MORE_DOCUMENTS"
        else:
            return "REJECTED"
    
    @staticmethod
    def _calculate_confidence(probabilities: np.ndarray) -> float:
        """Calculate prediction confidence (0-100)"""
        # Use maximum probability as confidence
        max_prob = max(probabilities)
        
        # Convert to percentage
        confidence = max_prob * 100
        
        # Adjust based on probability distribution
        entropy = -sum(p * np.log(p + 1e-10) for p in probabilities)
        max_entropy = np.log(len(probabilities))
        normalized_entropy = entropy / max_entropy
        
        # Higher entropy = lower confidence
        adjusted_confidence = confidence * (1 - normalized_entropy * 0.2)
        
        return min(adjusted_confidence, 99.9)
    
    def _fallback_prediction(self, application: LoanApplicationRequest, features: EngineeredFeaturesSchema) -> RiskAssessmentSchema:
        """Rule-based fallback prediction when model is not available"""
        # Calculate risk score using simple rules
        risk_components = {
            'credit_score_risk': max(0, (750 - application.credit_score) / 10),
            'debt_risk': features.debt_ratio * 0.5,
            'income_risk': max(0, 50 - features.income_stability) * 0.3,
            'employment_risk': max(0, 50 - features.employment_stability) * 0.3,
            'savings_risk': max(0, 30 - features.savings_ratio) * 0.2,
        }
        
        risk_score = sum(risk_components.values())
        risk_score = np.clip(risk_score, 0, 100)
        
        risk_level = self._score_to_level(risk_score)
        recommendation = self._score_to_recommendation(risk_score, features.debt_ratio)
        
        # Simple confidence based on data completeness
        data_completeness = sum([
            bool(application.email_account_age),
            bool(application.utility_payment_history),
            bool(application.device_stability_score),
            bool(application.professional_profile),
        ]) / 4
        confidence = 70 + (data_completeness * 20)
        
        return RiskAssessmentSchema(
            risk_score=round(risk_score, 2),
            risk_level=risk_level,
            recommendation=recommendation,
            confidence=round(confidence, 2),
            features=features,
            model_version="v1.0.0-fallback",
            timestamp=datetime.utcnow()
        )


# Create singleton instance
risk_engine = RiskEngine()
