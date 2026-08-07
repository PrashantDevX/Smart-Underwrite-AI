from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime


# ============= REQUEST SCHEMAS =============

class ConsentDataSchema(BaseModel):
    professional_profile: bool
    employment_verification: bool
    digital_behaviour: bool
    email_metadata: bool
    utility_payments: bool
    public_information: bool


class LoanApplicationRequest(BaseModel):
    # Personal
    full_name: str
    age: int
    email: EmailStr
    phone: str
    location: str
    education: str
    
    # Employment
    employment_type: str
    company_name: str
    job_role: str
    years_of_employment: float
    monthly_income: float
    industry_type: str
    
    # Financial
    loan_amount: float
    loan_purpose: str
    monthly_expenses: float
    savings: float
    existing_loans: float
    monthly_debt: float
    credit_score: int
    
    # Alternative Data (optional)
    email_account_age: Optional[int] = None
    utility_payment_history: Optional[str] = None
    failed_transactions: Optional[int] = None
    device_stability_score: Optional[int] = None
    professional_profile: Optional[bool] = None
    linkedin_verified: Optional[bool] = None
    education_verified: Optional[bool] = None
    digital_engagement_score: Optional[int] = None
    location_stability: Optional[int] = None
    
    # Consent
    consent_data: Optional[ConsentDataSchema] = None


# ============= RESPONSE SCHEMAS =============

class EngineeredFeaturesSchema(BaseModel):
    debt_ratio: float
    savings_ratio: float
    income_stability: float
    employment_stability: float
    digital_trust_score: float
    financial_discipline_score: float
    behavior_consistency: float
    alternative_data_score: float


class RiskAssessmentSchema(BaseModel):
    risk_score: float
    risk_level: str
    recommendation: str
    confidence: float
    features: EngineeredFeaturesSchema
    model_version: str
    timestamp: datetime


class FeatureImportanceSchema(BaseModel):
    feature: str
    impact: float
    explanation: str


class ShapValueSchema(BaseModel):
    name: str
    value: float
    shap_value: float


class ExplainabilitySchema(BaseModel):
    positive_factors: List[FeatureImportanceSchema]
    negative_factors: List[FeatureImportanceSchema]
    feature_importance: List[ShapValueSchema]
    plain_language_explanation: str


class FraudCheckSchema(BaseModel):
    name: str
    passed: bool
    details: Optional[str] = None


class SuspiciousPatternSchema(BaseModel):
    type: str
    severity: str
    description: str


class FraudAssessmentSchema(BaseModel):
    fraud_score: float
    fraud_risk: str
    anomalies_detected: List[str]
    checks: List[FraudCheckSchema]
    suspicious_patterns: List[SuspiciousPatternSchema]
    timestamp: datetime


class ProtectedAttributeSchema(BaseModel):
    attribute: str
    bias_detected: bool
    impact: float


class FairnessMetricsSchema(BaseModel):
    disparate_impact: float
    equal_opportunity: float
    demographic_parity: float


class FairnessReportSchema(BaseModel):
    overall_score: float
    status: str
    metrics: FairnessMetricsSchema
    protected_attributes: List[ProtectedAttributeSchema]
    recommendations: List[str]
    timestamp: datetime


class UnderwritingDecisionSchema(BaseModel):
    decision: str
    approved_amount: Optional[float] = None
    conditions: Optional[List[str]] = None
    reason: str
    confidence: float
    risk_score: float
    fraud_score: float
    fairness_status: str
    required_documents: Optional[List[str]] = None
    next_steps: List[str]
    timestamp: datetime


class UnderwriteResponse(BaseModel):
    risk: RiskAssessmentSchema
    fraud: FraudAssessmentSchema
    explainability: ExplainabilitySchema
    fairness: FairnessReportSchema
    decision: UnderwritingDecisionSchema


class MonitoringEventSchema(BaseModel):
    id: str
    customer_id: str
    event_type: str
    previous_value: Any
    new_value: Any
    impact_on_risk: float
    new_risk_score: float
    triggered_review: bool
    timestamp: datetime


class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None


class PolicyDocumentSchema(BaseModel):
    id: str
    title: str
    content: str
    category: str
    relevance_score: Optional[float] = None


class ChatResponse(BaseModel):
    response: str
    sources: List[PolicyDocumentSchema]


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime
    services: Dict[str, str]
