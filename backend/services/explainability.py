"""
Explainability Service using SHAP values
"""

import numpy as np
from typing import List
from database.schemas import (
    RiskAssessmentSchema,
    ExplainabilitySchema,
    FeatureImportanceSchema,
    ShapValueSchema,
    LoanApplicationRequest
)
import logging

logger = logging.getLogger(__name__)


class ExplainabilityEngine:
    """Generate SHAP-based explanations for risk predictions"""
    
    def __init__(self):
        self.shap_explainer = None
        # In production, load SHAP explainer here
        # self.shap_explainer = shap.TreeExplainer(model)
    
    def explain_prediction(
        self, 
        risk_assessment: RiskAssessmentSchema,
        application: LoanApplicationRequest
    ) -> ExplainabilitySchema:
        """
        Generate explanation for risk prediction
        
        Args:
            risk_assessment: Risk assessment result
            application: Original application data
            
        Returns:
            ExplainabilitySchema with detailed explanation
        """
        try:
            # Generate SHAP-style feature importance
            feature_importance = self._calculate_feature_importance(risk_assessment, application)
            
            # Separate positive and negative factors
            positive_factors = self._extract_positive_factors(feature_importance, risk_assessment)
            negative_factors = self._extract_negative_factors(feature_importance, risk_assessment)
            
            # Generate plain language explanation
            plain_explanation = self._generate_plain_language(
                risk_assessment, positive_factors, negative_factors, application
            )
            
            return ExplainabilitySchema(
                positive_factors=positive_factors,
                negative_factors=negative_factors,
                feature_importance=feature_importance,
                plain_language_explanation=plain_explanation
            )
            
        except Exception as e:
            logger.error(f"Error generating explanation: {e}")
            return self._fallback_explanation(risk_assessment)
    
    def _calculate_feature_importance(
        self,
        risk_assessment: RiskAssessmentSchema,
        application: LoanApplicationRequest
    ) -> List[ShapValueSchema]:
        """Calculate SHAP-style feature importance"""
        features = risk_assessment.features
        
        # Simulate SHAP values (in production, use actual SHAP library)
        # SHAP values represent impact on prediction
        importance_data = [
            {
                'name': 'Income Stability',
                'value': features.income_stability,
                'shap_value': self._calculate_shap_value(features.income_stability, True)
            },
            {
                'name': 'Employment Stability',
                'value': features.employment_stability,
                'shap_value': self._calculate_shap_value(features.employment_stability, True)
            },
            {
                'name': 'Financial Discipline',
                'value': features.financial_discipline_score,
                'shap_value': self._calculate_shap_value(features.financial_discipline_score, True)
            },
            {
                'name': 'Digital Trust',
                'value': features.digital_trust_score,
                'shap_value': self._calculate_shap_value(features.digital_trust_score, True)
            },
            {
                'name': 'Debt Ratio',
                'value': features.debt_ratio,
                'shap_value': self._calculate_shap_value(features.debt_ratio, False)
            },
            {
                'name': 'Savings Ratio',
                'value': features.savings_ratio,
                'shap_value': self._calculate_shap_value(features.savings_ratio, True)
            },
            {
                'name': 'Behavior Consistency',
                'value': features.behavior_consistency,
                'shap_value': self._calculate_shap_value(features.behavior_consistency, True)
            },
            {
                'name': 'Alternative Data',
                'value': features.alternative_data_score,
                'shap_value': self._calculate_shap_value(features.alternative_data_score, True)
            },
        ]
        
        # Sort by absolute SHAP value (importance)
        importance_data.sort(key=lambda x: abs(x['shap_value']), reverse=True)
        
        return [
            ShapValueSchema(
                name=item['name'],
                value=round(item['value'], 2),
                shap_value=round(item['shap_value'], 3)
            )
            for item in importance_data
        ]
    
    @staticmethod
    def _calculate_shap_value(feature_value: float, is_positive: bool) -> float:
        """
        Calculate simulated SHAP value
        
        Args:
            feature_value: Feature value (0-100)
            is_positive: Whether higher value is positive for approval
            
        Returns:
            SHAP value (-1 to 1)
        """
        # Normalize to 0-1
        normalized = feature_value / 100
        
        # Convert to SHAP-like value
        if is_positive:
            # High value = positive impact (reduces risk)
            shap = (normalized - 0.5) * 2  # Range: -1 to 1
        else:
            # High value = negative impact (increases risk)
            shap = (0.5 - normalized) * 2  # Range: -1 to 1
        
        return shap
    
    def _extract_positive_factors(
        self,
        feature_importance: List[ShapValueSchema],
        risk_assessment: RiskAssessmentSchema
    ) -> List[FeatureImportanceSchema]:
        """Extract positive contributing factors"""
        positive = []
        features = risk_assessment.features
        
        for item in feature_importance:
            if item.shap_value > 0.1:  # Threshold for significance
                explanation = self._get_feature_explanation(
                    item.name, item.value, True, features
                )
                positive.append(FeatureImportanceSchema(
                    feature=item.name,
                    impact=abs(item.shap_value),
                    explanation=explanation
                ))
        
        return positive[:6]  # Top 6 positive factors
    
    def _extract_negative_factors(
        self,
        feature_importance: List[ShapValueSchema],
        risk_assessment: RiskAssessmentSchema
    ) -> List[FeatureImportanceSchema]:
        """Extract negative contributing factors"""
        negative = []
        features = risk_assessment.features
        
        for item in feature_importance:
            if item.shap_value < -0.1:  # Threshold for significance
                explanation = self._get_feature_explanation(
                    item.name, item.value, False, features
                )
                negative.append(FeatureImportanceSchema(
                    feature=item.name,
                    impact=abs(item.shap_value),
                    explanation=explanation
                ))
        
        return negative[:6]  # Top 6 negative factors
    
    @staticmethod
    def _get_feature_explanation(
        feature_name: str,
        value: float,
        is_positive: bool,
        features: any
    ) -> str:
        """Generate human-readable explanation for a feature"""
        explanations = {
            'Income Stability': {
                True: f"Strong income stability score of {value:.0f}% demonstrates consistent earnings",
                False: f"Income stability score of {value:.0f}% indicates variable income patterns"
            },
            'Employment Stability': {
                True: f"Employment stability score of {value:.0f}% shows secure job status",
                False: f"Employment stability at {value:.0f}% suggests less secure employment"
            },
            'Financial Discipline': {
                True: f"Financial discipline score of {value:.0f}% reflects responsible money management",
                False: f"Financial discipline score of {value:.0f}% indicates payment challenges"
            },
            'Digital Trust': {
                True: f"Digital trust score of {value:.0f}% from verified online presence and behavior",
                False: f"Digital trust score of {value:.0f}% shows limited digital footprint"
            },
            'Debt Ratio': {
                True: f"Debt-to-income ratio of {value:.1f}% is well below the 40% threshold",
                False: f"Debt-to-income ratio of {value:.1f}% exceeds recommended limits"
            },
            'Savings Ratio': {
                True: f"Savings ratio of {value:.1f}% provides good financial buffer",
                False: f"Savings ratio of {value:.1f}% indicates limited emergency funds"
            },
            'Behavior Consistency': {
                True: f"Behavior consistency score of {value:.0f}% shows stable patterns",
                False: f"Behavior consistency at {value:.0f}% indicates irregular activity"
            },
            'Alternative Data': {
                True: f"Alternative data score of {value:.0f}% from verified digital sources",
                False: f"Alternative data score of {value:.0f}% shows limited verification"
            },
        }
        
        return explanations.get(feature_name, {}).get(is_positive, f"{feature_name}: {value:.1f}")
    
    def _generate_plain_language(
        self,
        risk_assessment: RiskAssessmentSchema,
        positive_factors: List[FeatureImportanceSchema],
        negative_factors: List[FeatureImportanceSchema],
        application: LoanApplicationRequest
    ) -> str:
        """Generate plain language explanation"""
        features = risk_assessment.features
        
        # Introduction
        intro = f"Based on our AI analysis using {risk_assessment.model_version}, "
        intro += f"this application shows a {risk_assessment.risk_level.lower()} profile "
        intro += f"with {risk_assessment.confidence:.0f}% confidence. "
        
        # Risk score context
        risk_context = f"The risk score of {risk_assessment.risk_score:.0f}/100 "
        if risk_assessment.risk_score < 30:
            risk_context += "is excellent, indicating strong creditworthiness. "
        elif risk_assessment.risk_score < 60:
            risk_context += "is moderate, suggesting manageable risk with proper conditions. "
        else:
            risk_context += "requires careful review due to elevated risk indicators. "
        
        # Key strengths
        if positive_factors:
            strengths = "The primary positive factors are: "
            top_strengths = [f.feature.lower() for f in positive_factors[:3]]
            strengths += ", ".join(top_strengths) + ". "
        else:
            strengths = ""
        
        # Key concerns
        if negative_factors:
            concerns = "Areas of concern include: "
            top_concerns = [f.feature.lower() for f in negative_factors[:2]]
            concerns += " and ".join(top_concerns) + ". "
        else:
            concerns = ""
        
        # Recommendation
        recommendation = f"The overall assessment suggests {risk_assessment.recommendation.lower().replace('_', ' ')} "
        if risk_assessment.recommendation == "APPROVED":
            recommendation += f"for the requested loan amount of ₹{application.loan_amount:,.0f}."
        elif risk_assessment.recommendation == "APPROVED_LOWER_LIMIT":
            recommendation += f"with a modified loan amount to maintain safe debt levels."
        elif risk_assessment.recommendation == "MANUAL_REVIEW":
            recommendation += "pending additional review by underwriting team."
        else:
            recommendation += "based on current financial indicators."
        
        return intro + risk_context + strengths + concerns + recommendation
    
    def _fallback_explanation(self, risk_assessment: RiskAssessmentSchema) -> ExplainabilitySchema:
        """Fallback explanation when detailed analysis fails"""
        return ExplainabilitySchema(
            positive_factors=[
                FeatureImportanceSchema(
                    feature="Overall Assessment",
                    impact=0.8,
                    explanation=f"Risk score of {risk_assessment.risk_score} calculated"
                )
            ],
            negative_factors=[],
            feature_importance=[],
            plain_language_explanation=f"Assessment completed with {risk_assessment.confidence}% confidence"
        )


# Create singleton instance
explainability_engine = ExplainabilityEngine()
