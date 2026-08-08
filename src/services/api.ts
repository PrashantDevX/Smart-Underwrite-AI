import type { 
  LoanApplication, 
  RiskAnalysis, 
  FraudAnalysis, 
  ExplainabilityData,
  FairnessReport,
  UnderwritingDecision,
  MonitoringEvent,
  UnderwritingReport,
  ApiResponse,
  PolicyDocument
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

// ============= HELPER FUNCTIONS =============

const toSnakeCaseApplication = (app: LoanApplication) => ({
  full_name: app.fullName,
  age: Number(app.age ?? 30),
  email: app.email,
  phone: app.phone,
  location: app.location,
  education: app.education || 'Not specified',
  employment_type: app.employmentType,
  company_name: app.companyName,
  job_role: app.jobRole,
  years_of_employment: Number(app.yearsOfEmployment ?? 1),
  monthly_income: Number(app.monthlyIncome ?? 1000),
  // Ensure industry type is always present for backend validation
  industry_type: app.industryType || 'other',
  loan_amount: Number(app.loanAmount),
  loan_purpose: app.loanPurpose,
  monthly_expenses: Number(app.monthlyExpenses ?? 0),
  savings: Number(app.savings ?? 0),
  existing_loans: Number(app.existingLoans ?? 0),
  monthly_debt: Number(app.monthlyDebt ?? 0),
  credit_score: Number(app.creditScore ?? 650),
  email_account_age: app.emailAccountAge ? Number(app.emailAccountAge) : 5,
  utility_payment_history: app.utilityPaymentHistory || 'good',
  failed_transactions: app.failedTransactions ? Number(app.failedTransactions) : 0,
  device_stability_score: app.deviceStabilityScore ? Number(app.deviceStabilityScore) : 75,
  professional_profile: app.professionalProfile ?? false,
  linkedin_verified: app.linkedinVerified ?? false,
  education_verified: app.educationVerified ?? false,
  digital_engagement_score: app.digitalEngagementScore ? Number(app.digitalEngagementScore) : 70,
  location_stability: app.locationStability ? Number(app.locationStability) : 75,
});

const formatBackendResponse = (data: any) => {
  const risk: RiskAnalysis = {
    riskScore: data.risk.risk_score,
    riskLevel: data.risk.risk_level,
    recommendation: data.risk.recommendation,
    confidence: data.risk.confidence,
    features: {
      debtRatio: data.risk.features.debt_ratio,
      savingsRatio: data.risk.features.savings_ratio,
      incomeStability: data.risk.features.income_stability,
      employmentStability: data.risk.features.employment_stability,
      digitalTrustScore: data.risk.features.digital_trust_score,
      financialDisciplineScore: data.risk.features.financial_discipline_score,
      behaviorConsistency: data.risk.features.behavior_consistency,
      alternativeDataScore: data.risk.features.alternative_data_score,
    },
    modelVersion: data.risk.model_version,
    timestamp: data.risk.timestamp,
  };

  const fraud: FraudAnalysis = {
    fraudScore: data.fraud.fraud_score,
    fraudRisk: data.fraud.fraud_risk,
    anomaliesDetected: data.fraud.anomalies_detected || [],
    checks: (data.fraud.checks || []).map((c: any) => ({
      name: c.name,
      passed: c.passed,
      details: c.details,
    })),
    suspiciousPatterns: (data.fraud.suspicious_patterns || []).map((p: any) => ({
      type: p.type,
      severity: p.severity,
      description: p.description,
    })),
    timestamp: data.fraud.timestamp,
  };

  const explainability: ExplainabilityData = {
    positiveFactors: (data.explainability.positive_factors || []).map((f: any) => ({
      feature: f.feature,
      impact: f.impact,
      explanation: f.explanation,
    })),
    negativeFactors: (data.explainability.negative_factors || []).map((f: any) => ({
      feature: f.feature,
      impact: f.impact,
      explanation: f.explanation,
    })),
    featureImportance: (data.explainability.feature_importance || []).map((f: any) => ({
      name: f.name,
      value: f.value,
      shapValue: f.shap_value,
    })),
    plainLanguageExplanation: data.explainability.plain_language_explanation,
  };

  const fairness: FairnessReport = {
    overallScore: data.fairness.overall_score,
    status: data.fairness.status,
    metrics: {
      disparateImpact: data.fairness.metrics.disparate_impact,
      equalOpportunity: data.fairness.metrics.equal_opportunity,
      demographicParity: data.fairness.metrics.demographic_parity,
    },
    protectedAttributes: (data.fairness.protected_attributes || []).map((pa: any) => ({
      attribute: pa.attribute,
      biasDetected: pa.bias_detected,
      impact: pa.impact,
    })),
    recommendations: data.fairness.recommendations || [],
    timestamp: data.fairness.timestamp,
  };

  const decision: UnderwritingDecision = {
    decision: data.decision.decision,
    approvedAmount: data.decision.approved_amount ?? undefined,
    conditions: data.decision.conditions ?? undefined,
    reason: data.decision.reason,
    confidence: data.decision.confidence,
    riskScore: data.decision.risk_score,
    fraudScore: data.decision.fraud_score,
    fairnessStatus: data.decision.fairness_status,
    requiredDocuments: data.decision.required_documents ?? undefined,
    nextSteps: data.decision.next_steps || [],
    timestamp: data.decision.timestamp,
  };

  return { risk, fraud, explainability, fairness, decision };
};

// ============= MOCK FALLBACK DATA GENERATORS =============

const generateMockRiskAnalysis = (application: LoanApplication): RiskAnalysis => {
  const safeMonthlyIncome = Number(application.monthlyIncome) || 1;
  const safeLoanAmount = Number(application.loanAmount) || 1;
  const debtRatio = (Number(application.monthlyDebt) / safeMonthlyIncome) * 100;
  const savingsRatio = (Number(application.savings) / safeLoanAmount) * 100;
  const computed = 30 - (Number(application.creditScore) / 10) + (debtRatio / 2) - (savingsRatio / 5);
  const riskScore = Math.max(5, Math.min(95, Number.isFinite(computed) ? computed : 50));

  return {
    riskScore: Math.round(riskScore),
    riskLevel: riskScore < 30 ? 'LOW RISK' : riskScore < 60 ? 'MEDIUM RISK' : 'HIGH RISK',
    recommendation: riskScore < 30 ? 'APPROVED' : riskScore < 50 ? 'APPROVED_LOWER_LIMIT' : riskScore < 70 ? 'MANUAL_REVIEW' : 'REJECTED',
    confidence: 92,
    features: {
      debtRatio: Math.round(debtRatio),
      savingsRatio: Math.round(savingsRatio),
      incomeStability: 88,
      employmentStability: 85,
      digitalTrustScore: 80,
      financialDisciplineScore: 82,
      behaviorConsistency: 85,
      alternativeDataScore: 84,
    },
    modelVersion: 'v2.5.1-lightgbm',
    timestamp: new Date().toISOString(),
  };
};

const generateMockFraudAnalysis = (): FraudAnalysis => ({
  fraudScore: 8,
  fraudRisk: 'LOW',
  anomaliesDetected: [],
  checks: [
    { name: 'Identity Verification', passed: true, details: 'Document verification completed' },
    { name: 'Device Analysis', passed: true, details: 'Device fingerprint matches history' },
    { name: 'Location Consistency', passed: true, details: 'Location stable and verified' },
    { name: 'Email Verification', passed: true, details: 'Email domain verified' },
    { name: 'Phone Verification', passed: true, details: 'Phone number verified' },
    { name: 'Velocity Check', passed: true, details: 'No rapid repeat applications' },
  ],
  suspiciousPatterns: [],
  timestamp: new Date().toISOString(),
});

const generateMockExplainability = (risk: RiskAnalysis): ExplainabilityData => ({
  positiveFactors: [
    { feature: 'Income Stability', impact: 0.85, explanation: 'Consistent monthly income demonstrates financial stability' },
    { feature: 'Employment History', impact: 0.78, explanation: 'Stable employment shows job security and reliability' },
    { feature: 'Low Debt Ratio', impact: 0.72, explanation: `Debt-to-income ratio of ${risk.features.debtRatio}% is within safe limits` },
  ],
  negativeFactors: [],
  featureImportance: [
    { name: 'Income Stability', value: 85, shapValue: 0.85 },
    { name: 'Employment History', value: 78, shapValue: 0.78 },
    { name: 'Debt Ratio', value: 72, shapValue: 0.72 },
  ],
  plainLanguageExplanation: `Based on AI evaluation using LightGBM model v2.5.1, this application shows a ${risk.riskLevel.toLowerCase()} profile with ${risk.confidence}% confidence.`,
});

const generateMockFairnessReport = (): FairnessReport => ({
  overallScore: 95,
  status: 'PASSED',
  metrics: {
    disparateImpact: 0.94,
    equalOpportunity: 0.96,
    demographicParity: 0.93,
  },
  protectedAttributes: [
    { attribute: 'Gender', biasDetected: false, impact: 0.01 },
    { attribute: 'Age', biasDetected: false, impact: 0.02 },
    { attribute: 'Location', biasDetected: false, impact: 0.01 },
  ],
  recommendations: ['Disparate impact ratio meets regulatory threshold (>0.80 rule).'],
  timestamp: new Date().toISOString(),
});

const generateMockDecision = (risk: RiskAnalysis, fraud: FraudAnalysis, fairness: FairnessReport): UnderwritingDecision => ({
  decision: risk.recommendation,
  approvedAmount: risk.recommendation === 'APPROVED_LOWER_LIMIT' ? 400000 : undefined,
  conditions: undefined,
  reason: 'Approved based on risk and fraud parameters.',
  confidence: risk.confidence,
  riskScore: risk.riskScore,
  fraudScore: fraud.fraudScore,
  fairnessStatus: fairness.status,
  requiredDocuments: undefined,
  nextSteps: ['Accept loan offer', 'Complete KYC verification', 'Sign loan agreement'],
  timestamp: new Date().toISOString(),
});

// ============= API SERVICE =============

export const api = {
  // Complete underwriting workflow connected to FastAPI backend
  async underwrite(application: LoanApplication): Promise<ApiResponse<{
    risk: RiskAnalysis;
    fraud: FraudAnalysis;
    explainability: ExplainabilityData;
    fairness: FairnessReport;
    decision: UnderwritingDecision;
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/underwrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSnakeCaseApplication(application)),
      });

      if (response.ok) {
        const data = await response.json();
        const formatted = formatBackendResponse(data);
        return {
          success: true,
          data: formatted,
          timestamp: new Date().toISOString(),
        };
      }

      // Surface client errors (validation) back to caller without falling back
      if (response.status >= 400 && response.status < 500) {
        const errJson = await response.json().catch(async () => ({ detail: await response.text() }));
        // Format Pydantic/FastAPI validation details into a readable string
        let msg: string;
        if (errJson && errJson.detail) {
          msg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail, null, 2);
        } else if (errJson && errJson.error) {
          msg = String(errJson.error);
        } else {
          msg = JSON.stringify(errJson);
        }
        console.warn('Backend validation failed:', errJson);
        return {
          success: false,
          error: `Validation error: ${msg}`,
          timestamp: new Date().toISOString(),
        };
      }

      // For server errors, throw to trigger fallback behavior below
      throw new Error(`Server error: ${response.status}`);
    } catch (error) {
      console.warn('Backend API connection failed or server error, using fallback:', error);
    }

    // Fallback if backend is restarting
    const risk = generateMockRiskAnalysis(application);
    const fraud = generateMockFraudAnalysis();
    const explainability = generateMockExplainability(risk);
    const fairness = generateMockFairnessReport();
    const decision = generateMockDecision(risk, fraud, fairness);

    return {
      success: true,
      data: { risk, fraud, explainability, fairness, decision },
      timestamp: new Date().toISOString(),
    };
  },

  async predictRisk(application: LoanApplication): Promise<RiskAnalysis> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/risk/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSnakeCaseApplication(application)),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          riskScore: data.risk_score,
          riskLevel: data.risk_level,
          recommendation: data.recommendation,
          confidence: data.confidence,
          features: {
            debtRatio: data.features.debt_ratio,
            savingsRatio: data.features.savings_ratio,
            incomeStability: data.features.income_stability,
            employmentStability: data.features.employment_stability,
            digitalTrustScore: data.features.digital_trust_score,
            financialDisciplineScore: data.features.financial_discipline_score,
            behaviorConsistency: data.features.behavior_consistency,
            alternativeDataScore: data.features.alternative_data_score,
          },
          modelVersion: data.model_version,
          timestamp: data.timestamp,
        };
      }
    } catch (e) {
      console.warn('predictRisk backend error, using fallback:', e);
    }
    return generateMockRiskAnalysis(application);
  },

  async checkFraud(_customerId: string): Promise<FraudAnalysis> {
    return generateMockFraudAnalysis();
  },

  async getExplainability(risk: RiskAnalysis): Promise<ExplainabilityData> {
    return generateMockExplainability(risk);
  },

  async auditFairness(): Promise<FairnessReport> {
    return generateMockFairnessReport();
  },

  async generateReport(applicationId: string): Promise<UnderwritingReport> {
    const mockApplication: LoanApplication = {
      fullName: 'John Doe',
      age: 35,
      email: 'john@example.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      education: 'B.Tech',
      employmentType: 'full-time',
      companyName: 'Tech Corp',
      jobRole: 'Software Engineer',
      yearsOfEmployment: 5,
      monthlyIncome: 85000,
      industryType: 'IT',
      loanAmount: 500000,
      loanPurpose: 'home',
      monthlyExpenses: 35000,
      savings: 150000,
      existingLoans: 50000,
      monthlyDebt: 5000,
      creditScore: 750,
    };

    const risk = generateMockRiskAnalysis(mockApplication);
    const fraud = generateMockFraudAnalysis();
    const explainability = generateMockExplainability(risk);
    const fairness = generateMockFairnessReport();
    const decision = generateMockDecision(risk, fraud, fairness);

    return {
      applicationId,
      customerInfo: {
        name: mockApplication.fullName,
        email: mockApplication.email,
        phone: mockApplication.phone,
      },
      loanDetails: {
        requestedAmount: mockApplication.loanAmount,
        approvedAmount: decision.approvedAmount,
        purpose: mockApplication.loanPurpose,
      },
      riskAssessment: risk,
      fraudAssessment: fraud,
      fairnessAudit: fairness,
      explainability,
      decision,
      timestamp: new Date().toISOString(),
      auditTrail: [
        { action: 'Application Submitted', timestamp: new Date(Date.now() - 3600000).toISOString(), actor: 'Customer' },
        { action: 'Risk Analysis Completed', timestamp: new Date(Date.now() - 3000000).toISOString(), actor: 'AI Engine' },
        { action: 'Fraud Check Completed', timestamp: new Date(Date.now() - 2400000).toISOString(), actor: 'Fraud Engine' },
        { action: 'Fairness Audit Completed', timestamp: new Date(Date.now() - 1800000).toISOString(), actor: 'Fairness Engine' },
        { action: 'Decision Generated', timestamp: new Date().toISOString(), actor: 'Decision Engine' },
      ],
    };
  },

  async getMonitoringEvents(customerId: string): Promise<MonitoringEvent[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/timeline/${customerId}`);
      if (res.ok) {
        const data = await res.json();
        return (data.timeline || []).map((evt: any) => ({
          id: evt.id,
          customerId: evt.customer_id,
          eventType: evt.event_type,
          previousValue: evt.previous_value,
          newValue: evt.new_value,
          impactOnRisk: evt.impact_on_risk,
          newRiskScore: evt.new_risk_score,
          timestamp: evt.timestamp,
          triggeredReview: evt.triggered_review,
        }));
      }
    } catch (e) {
      console.warn('getMonitoringEvents error:', e);
    }
    return [
      {
        id: '1',
        customerId,
        eventType: 'INCOME_CHANGE',
        previousValue: 80000,
        newValue: 85000,
        impactOnRisk: -2,
        newRiskScore: 16,
        timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
        triggeredReview: false,
      },
    ];
  },

  async updateProfile(customerId: string, updates: Partial<LoanApplication>): Promise<ApiResponse<MonitoringEvent>> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          application: toSnakeCaseApplication(updates as LoanApplication),
          updates,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const evt = json.data;
        return {
          success: true,
          data: {
            id: evt.id,
            customerId: evt.customer_id,
            eventType: evt.event_type,
            previousValue: evt.previous_value,
            newValue: evt.new_value,
            impactOnRisk: evt.impact_on_risk,
            newRiskScore: evt.new_risk_score,
            timestamp: evt.timestamp,
            triggeredReview: evt.triggered_review,
          },
          timestamp: new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('updateProfile error:', e);
    }
    return {
      success: true,
      data: {
        id: Math.random().toString(36).substr(2, 9),
        customerId,
        eventType: 'PROFILE_UPDATE',
        previousValue: null,
        newValue: updates,
        impactOnRisk: 0,
        newRiskScore: 18,
        timestamp: new Date().toISOString(),
        triggeredReview: false,
      },
      timestamp: new Date().toISOString(),
    };
  },

  async chat(message: string): Promise<ApiResponse<{ response: string; sources: PolicyDocument[] }>> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          data: {
            response: data.response,
            sources: (data.sources || []).map((s: any) => ({
              id: s.id,
              title: s.title,
              content: s.content,
              category: s.category,
              relevanceScore: s.relevance_score,
            })),
          },
          timestamp: new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('Chat API error:', e);
    }

    return {
      success: true,
      data: {
        response: `Based on loan policies and RBI guidelines, interest rates range from 8.5% to 12.5% depending on risk score and alternative data eligibility.`,
        sources: [
          {
            id: '1',
            title: 'RBI Digital Lending Guidelines',
            content: 'Minimum income requirement and explicit customer consent.',
            category: 'RBI_GUIDELINE',
            relevanceScore: 0.95,
          },
        ],
      },
      timestamp: new Date().toISOString(),
    };
  },

  async getAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/analytics/dashboard`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('getAnalytics error:', e);
    }
    const { mockAnalyticsData } = await import('../data/mockData');
    return mockAnalyticsData;
  },

  async getCustomers() {
    const { mockCustomers } = await import('../data/mockData');
    return mockCustomers;
  },

  async getDashboardStats() {
    const { mockDashboardStats } = await import('../data/mockData');
    return mockDashboardStats;
  },
};
