from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    age = Column(Integer)
    location = Column(String)
    education = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    applications = relationship("LoanApplication", back_populates="customer")
    monitoring_events = relationship("MonitoringEvent", back_populates="customer")


class LoanApplication(Base):
    __tablename__ = "loan_applications"
    
    id = Column(String, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.id"))
    
    # Employment
    employment_type = Column(String)
    company_name = Column(String)
    job_role = Column(String)
    years_of_employment = Column(Float)
    monthly_income = Column(Float)
    industry_type = Column(String)
    
    # Financial
    loan_amount = Column(Float)
    loan_purpose = Column(String)
    monthly_expenses = Column(Float)
    savings = Column(Float)
    existing_loans = Column(Float)
    monthly_debt = Column(Float)
    credit_score = Column(Integer)
    
    # Alternative Data (JSON)
    alternative_data = Column(JSON)
    
    # Consent
    consent_data = Column(JSON)
    
    # Status
    status = Column(String, default="pending")  # pending, approved, rejected, review
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    customer = relationship("Customer", back_populates="applications")
    risk_assessment = relationship("RiskAssessment", back_populates="application", uselist=False)
    fraud_assessment = relationship("FraudAssessment", back_populates="application", uselist=False)
    fairness_report = relationship("FairnessReport", back_populates="application", uselist=False)
    decision = relationship("UnderwritingDecision", back_populates="application", uselist=False)


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    
    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("loan_applications.id"))
    
    risk_score = Column(Float)
    risk_level = Column(String)  # LOW RISK, MEDIUM RISK, HIGH RISK
    recommendation = Column(String)
    confidence = Column(Float)
    
    # Engineered Features (JSON)
    features = Column(JSON)
    
    # Model Info
    model_version = Column(String)
    model_type = Column(String, default="lightgbm")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    application = relationship("LoanApplication", back_populates="risk_assessment")
    explainability = relationship("Explainability", back_populates="risk_assessment", uselist=False)


class FraudAssessment(Base):
    __tablename__ = "fraud_assessments"
    
    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("loan_applications.id"))
    
    fraud_score = Column(Float)
    fraud_risk = Column(String)  # LOW, MEDIUM, HIGH, CRITICAL
    anomalies_detected = Column(JSON)
    checks = Column(JSON)
    suspicious_patterns = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    application = relationship("LoanApplication", back_populates="fraud_assessment")


class Explainability(Base):
    __tablename__ = "explainability"
    
    id = Column(String, primary_key=True, index=True)
    risk_assessment_id = Column(String, ForeignKey("risk_assessments.id"))
    
    positive_factors = Column(JSON)
    negative_factors = Column(JSON)
    feature_importance = Column(JSON)
    plain_language_explanation = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    risk_assessment = relationship("RiskAssessment", back_populates="explainability")


class FairnessReport(Base):
    __tablename__ = "fairness_reports"
    
    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("loan_applications.id"))
    
    overall_score = Column(Float)
    status = Column(String)  # PASSED, WARNING, FAILED
    metrics = Column(JSON)
    protected_attributes = Column(JSON)
    recommendations = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    application = relationship("LoanApplication", back_populates="fairness_report")


class UnderwritingDecision(Base):
    __tablename__ = "underwriting_decisions"
    
    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("loan_applications.id"))
    
    decision = Column(String)  # APPROVED, APPROVED_LOWER_LIMIT, MANUAL_REVIEW, etc.
    approved_amount = Column(Float, nullable=True)
    conditions = Column(JSON, nullable=True)
    reason = Column(Text)
    confidence = Column(Float)
    
    risk_score = Column(Float)
    fraud_score = Column(Float)
    fairness_status = Column(String)
    
    required_documents = Column(JSON, nullable=True)
    next_steps = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    application = relationship("LoanApplication", back_populates="decision")


class MonitoringEvent(Base):
    __tablename__ = "monitoring_events"
    
    id = Column(String, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.id"))
    
    event_type = Column(String)  # INCOME_CHANGE, EMPLOYMENT_CHANGE, etc.
    previous_value = Column(JSON)
    new_value = Column(JSON)
    impact_on_risk = Column(Float)
    new_risk_score = Column(Float)
    triggered_review = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    customer = relationship("Customer", back_populates="monitoring_events")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, index=True)
    application_id = Column(String)
    action = Column(String)
    actor = Column(String)
    details = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)


class PolicyDocument(Base):
    __tablename__ = "policy_documents"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    category = Column(String)  # LOAN_POLICY, UNDERWRITING_RULE, RBI_GUIDELINE, etc.
    embedding = Column(JSON, nullable=True)  # Vector embedding for RAG
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
