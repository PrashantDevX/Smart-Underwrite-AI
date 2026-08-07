"""
Feature Engineering Service
Calculates all engineered features from raw loan application data
"""

import numpy as np
from database.schemas import LoanApplicationRequest, EngineeredFeaturesSchema


class FeatureEngineer:
    """Feature engineering for loan underwriting"""
    
    @staticmethod
    def calculate_debt_ratio(monthly_debt: float, monthly_income: float) -> float:
        """Calculate debt-to-income ratio"""
        if monthly_income == 0:
            return 100.0
        return min((monthly_debt / monthly_income) * 100, 100.0)
    
    @staticmethod
    def calculate_savings_ratio(savings: float, loan_amount: float) -> float:
        """Calculate savings as percentage of loan amount"""
        if loan_amount == 0:
            return 100.0
        return min((savings / loan_amount) * 100, 100.0)
    
    @staticmethod
    def calculate_income_stability(
        years_of_employment: float,
        monthly_income: float,
        failed_transactions: int = 0
    ) -> float:
        """Calculate income stability score (0-100)"""
        # Base score from employment duration and income level
        base_score = (years_of_employment * 10) + (monthly_income / 1000)
        
        # Penalty for failed transactions
        penalty = failed_transactions * 2
        
        score = base_score - penalty
        return float(np.clip(score, 0, 100))
    
    @staticmethod
    def calculate_employment_stability(
        years_of_employment: float,
        employment_type: str
    ) -> float:
        """Calculate employment stability score (0-100)"""
        # Base score from years
        base_score = min(years_of_employment * 15, 70)
        
        # Bonus for full-time employment
        employment_bonus = {
            'full-time': 20,
            'part-time': 10,
            'self-employed': 15,
            'contract': 8
        }
        bonus = employment_bonus.get(employment_type.lower(), 10)
        
        return float(np.clip(base_score + bonus, 0, 100))
    
    @staticmethod
    def calculate_digital_trust_score(
        email_account_age: int = 0,
        device_stability_score: int = 0,
        digital_engagement_score: int = 0
    ) -> float:
        """Calculate digital trust score from alternative data (0-100)"""
        # Weight different components
        email_component = min(email_account_age * 5, 30)
        device_component = (device_stability_score / 100) * 35
        engagement_component = (digital_engagement_score / 100) * 35
        
        total = email_component + device_component + engagement_component
        return float(np.clip(total, 0, 100))
    
    @staticmethod
    def calculate_financial_discipline_score(
        debt_ratio: float,
        utility_payment_history: str = "good",
        credit_score: int = 650
    ) -> float:
        """Calculate financial discipline score (0-100)"""
        # Start with credit score normalized
        base_score = ((credit_score - 300) / 550) * 50  # Credit score contribution: 0-50
        
        # Subtract debt ratio impact
        debt_penalty = debt_ratio * 0.5
        
        # Add utility payment bonus
        utility_bonus = {
            'excellent': 30,
            'good': 20,
            'fair': 10,
            'poor': 0
        }
        utility_score = utility_bonus.get(utility_payment_history.lower(), 15)
        
        total = base_score - debt_penalty + utility_score
        return float(np.clip(total, 0, 100))
    
    @staticmethod
    def calculate_behavior_consistency(
        location_stability: int = 70,
        device_stability_score: int = 70,
        failed_transactions: int = 0
    ) -> float:
        """Calculate behavior consistency score (0-100)"""
        # Average of stability metrics
        stability_avg = (location_stability + device_stability_score) / 2
        
        # Penalty for failed transactions
        penalty = min(failed_transactions * 3, 30)
        
        score = stability_avg - penalty
        return float(np.clip(score, 0, 100))
    
    @staticmethod
    def calculate_alternative_data_score(
        email_account_age: int = 0,
        professional_profile: bool = False,
        linkedin_verified: bool = False,
        education_verified: bool = False,
        utility_payment_history: str = "good"
    ) -> float:
        """Calculate alternative data score (0-100)"""
        score = 0.0
        
        # Email age component (max 25 points)
        score += min(email_account_age * 3, 25)
        
        # Professional presence (25 points)
        if professional_profile:
            score += 15
        if linkedin_verified:
            score += 10
        
        # Education verification (20 points)
        if education_verified:
            score += 20
        
        # Utility payments (30 points)
        utility_points = {
            'excellent': 30,
            'good': 20,
            'fair': 10,
            'poor': 0
        }
        score += utility_points.get(utility_payment_history.lower(), 15)
        
        return float(np.clip(score, 0, 100))
    
    @classmethod
    def engineer_features(cls, application: LoanApplicationRequest) -> EngineeredFeaturesSchema:
        """
        Calculate all engineered features from application data
        
        Args:
            application: Loan application data
            
        Returns:
            EngineeredFeaturesSchema with all calculated features
        """
        # Calculate all features
        debt_ratio = cls.calculate_debt_ratio(
            application.monthly_debt,
            application.monthly_income
        )
        
        savings_ratio = cls.calculate_savings_ratio(
            application.savings,
            application.loan_amount
        )
        
        income_stability = cls.calculate_income_stability(
            application.years_of_employment,
            application.monthly_income,
            application.failed_transactions or 0
        )
        
        employment_stability = cls.calculate_employment_stability(
            application.years_of_employment,
            application.employment_type
        )
        
        digital_trust_score = cls.calculate_digital_trust_score(
            application.email_account_age or 0,
            application.device_stability_score or 70,
            application.digital_engagement_score or 70
        )
        
        financial_discipline_score = cls.calculate_financial_discipline_score(
            debt_ratio,
            application.utility_payment_history or "good",
            application.credit_score
        )
        
        behavior_consistency = cls.calculate_behavior_consistency(
            application.location_stability or 70,
            application.device_stability_score or 70,
            application.failed_transactions or 0
        )
        
        alternative_data_score = cls.calculate_alternative_data_score(
            application.email_account_age or 0,
            application.professional_profile or False,
            application.linkedin_verified or False,
            application.education_verified or False,
            application.utility_payment_history or "good"
        )
        
        return EngineeredFeaturesSchema(
            debt_ratio=round(debt_ratio, 2),
            savings_ratio=round(savings_ratio, 2),
            income_stability=round(income_stability, 2),
            employment_stability=round(employment_stability, 2),
            digital_trust_score=round(digital_trust_score, 2),
            financial_discipline_score=round(financial_discipline_score, 2),
            behavior_consistency=round(behavior_consistency, 2),
            alternative_data_score=round(alternative_data_score, 2)
        )


# Create singleton instance
feature_engineer = FeatureEngineer()
