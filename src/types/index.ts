// ============= CONSENT MANAGEMENT =============
export interface ConsentData {
  professionalProfile: boolean;
  employmentVerification: boolean;
  digitalBehaviour: boolean;
  emailMetadata: boolean;
  utilityPayments: boolean;
  publicInformation: boolean;
  timestamp: string;
}

// ============= LOAN APPLICATION =============
export interface LoanApplication {
  // Personal Information
  fullName: string;
  age: number;
  email: string;
  phone: string;
  location: string;
  education: string;
  
  // Employment Information
  employmentType: string;
  companyName: string;
  jobRole: string;
  yearsOfEmployment: number;
  monthlyIncome: number;
  industryType: string;
  
  // Financial Information
  loanAmount: number;
  loanPurpose: string;
  monthlyExpenses: number;
  savings: number;
  existingLoans: number;
  monthlyDebt: number;
  creditScore: number;
  
  // Alternative Data (requires consent)
  emailAccountAge?: number;
  utilityPaymentHistory?: string;
  failedTransactions?: number;
  deviceStabilityScore?: number;
  professionalProfile?: boolean;
  linkedinVerified?: boolean;
  educationVerified?: boolean;
  digitalEngagementScore?: number;
  locationStability?: number;
}

// ============= FEATURE ENGINEERING =============
export interface EngineeredFeatures {
  debtRatio: number;
  savingsRatio: number;
  incomeStability: number;
  employmentStability: number;
  digitalTrustScore: number;
  financialDisciplineScore: number;
  behaviorConsistency: number;
  alternativeDataScore: number;
}

// ============= RISK ANALYSIS =============
export interface RiskAnalysis {
  riskScore: number;
  riskLevel: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK';
  recommendation: 'APPROVED' | 'APPROVED_LOWER_LIMIT' | 'MANUAL_REVIEW' | 'NEED_MORE_DOCUMENTS' | 'REJECTED';
  confidence: number;
  features: EngineeredFeatures;
  modelVersion: string;
  timestamp: string;
}

// ============= FRAUD DETECTION =============
export interface FraudAnalysis {
  fraudScore: number;
  fraudRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  anomaliesDetected: string[];
  checks: {
    name: string;
    passed: boolean;
    details?: string;
  }[];
  suspiciousPatterns: {
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
  }[];
  timestamp: string;
}

// ============= EXPLAINABILITY (SHAP-based) =============
export interface ExplainabilityData {
  positiveFactors: {
    feature: string;
    impact: number;
    explanation: string;
  }[];
  negativeFactors: {
    feature: string;
    impact: number;
    explanation: string;
  }[];
  featureImportance: {
    name: string;
    value: number;
    shapValue: number;
  }[];
  plainLanguageExplanation: string;
}

// ============= FAIRNESS AUDIT =============
export interface FairnessReport {
  overallScore: number;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  metrics: {
    disparateImpact: number;
    equalOpportunity: number;
    demographicParity: number;
  };
  protectedAttributes: {
    attribute: string;
    biasDetected: boolean;
    impact: number;
  }[];
  recommendations: string[];
  timestamp: string;
}

// ============= DECISION ENGINE =============
export interface UnderwritingDecision {
  decision: 'APPROVED' | 'APPROVED_LOWER_LIMIT' | 'MANUAL_REVIEW' | 'NEED_MORE_DOCUMENTS' | 'REJECTED';
  approvedAmount?: number;
  conditions?: string[];
  reason: string;
  confidence: number;
  riskScore: number;
  fraudScore: number;
  fairnessStatus: 'PASSED' | 'WARNING' | 'FAILED';
  requiredDocuments?: string[];
  nextSteps: string[];
  timestamp: string;
}

// ============= CONTINUOUS MONITORING =============
export interface MonitoringEvent {
  id: string;
  customerId: string;
  eventType: 'INCOME_CHANGE' | 'EMPLOYMENT_CHANGE' | 'PAYMENT_CHANGE' | 'BEHAVIOR_CHANGE' | 'PROFILE_UPDATE';
  previousValue: any;
  newValue: any;
  impactOnRisk: number;
  newRiskScore: number;
  timestamp: string;
  triggeredReview: boolean;
}

// ============= ANALYTICS =============
export interface Customer {
  id: string;
  name: string;
  email: string;
  riskScore: number;
  fraudScore: number;
  decision: string;
  date: string;
  status: string;
  loanAmount: number;
  approvedAmount?: number;
  fairnessStatus: string;
}

export interface DashboardStats {
  totalApplications: number;
  approvedLoans: number;
  rejectedLoans: number;
  manualReviews: number;
  highRiskCustomers: number;
  avgRiskScore: number;
  approvalRate: number;
  fraudDetectionRate: number;
  fairnessPassRate: number;
  avgProcessingTime: number;
}

// ============= REPORTS =============
export interface UnderwritingReport {
  applicationId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  loanDetails: {
    requestedAmount: number;
    approvedAmount?: number;
    purpose: string;
  };
  riskAssessment: RiskAnalysis;
  fraudAssessment: FraudAnalysis;
  fairnessAudit: FairnessReport;
  explainability: ExplainabilityData;
  decision: UnderwritingDecision;
  timestamp: string;
  auditTrail: {
    action: string;
    timestamp: string;
    actor: string;
  }[];
}

// ============= API RESPONSES =============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// ============= POLICY & RAG =============
export interface PolicyDocument {
  id: string;
  title: string;
  content: string;
  category: 'LOAN_POLICY' | 'UNDERWRITING_RULE' | 'RBI_GUIDELINE' | 'COMPLIANCE' | 'FAQ';
  relevanceScore?: number;
}
