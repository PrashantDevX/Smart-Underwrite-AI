/**
 * Mock Data - Fallback Only
 * 
 * This file contains fallback data used ONLY when:
 * 1. Backend API is unavailable
 * 2. No real application history exists yet
 * 
 * The application prioritizes:
 * - Real backend API responses
 * - localStorage for application history
 * - These mocks as last resort
 */

import type { Customer, DashboardStats, RiskAnalysis, ExplainabilityData, FraudAnalysis } from '../types';

export const mockRiskAnalysis: RiskAnalysis = {
  riskScore: 18,
  riskLevel: 'LOW RISK',
  recommendation: 'APPROVED',
  confidence: 96,
  features: {
    debtRatio: 18,
    savingsRatio: 30,
    incomeStability: 88,
    employmentStability: 92,
    financialDisciplineScore: 85,
    digitalTrustScore: 91,
    behaviorConsistency: 87,
    alternativeDataScore: 89,
  },
  modelVersion: 'v2.5.1-lightgbm',
  timestamp: new Date().toISOString(),
};

export const mockExplainability: ExplainabilityData = {
  positiveFactors: [
    { feature: 'Stable employment history', impact: 0.85, explanation: '5+ years with current employer shows job security and reliability' },
    { feature: 'High income consistency', impact: 0.78, explanation: 'Consistent monthly income demonstrates strong financial stability' },
    { feature: 'Low debt ratio', impact: 0.72, explanation: 'Debt-to-income ratio of 18% is well below the 40% threshold' },
    { feature: 'Good payment behaviour', impact: 0.70, explanation: '100% on-time payment history' },
    { feature: 'Long email account age', impact: 0.68, explanation: '8+ years email account age indicates stability' },
    { feature: 'Professional profile verified', impact: 0.65, explanation: 'LinkedIn profile verified and active' }
  ],
  negativeFactors: [
    { feature: 'Existing loans present', impact: -0.35, explanation: 'Multiple existing loans increase financial burden' },
    { feature: 'Recent device change', impact: -0.28, explanation: 'Device stability score affected by recent change' },
  ],
  featureImportance: [
    { name: 'Income Stability', value: 85, shapValue: 0.85 },
    { name: 'Employment History', value: 78, shapValue: 0.78 },
    { name: 'Payment History', value: 70, shapValue: 0.70 },
    { name: 'Digital Behaviour', value: 65, shapValue: 0.65 },
    { name: 'Debt Ratio', value: 55, shapValue: 0.55 },
    { name: 'Credit Utilization', value: 48, shapValue: 0.48 },
  ],
  plainLanguageExplanation: 'Based on LightGBM model v2.5.1, this application shows a low risk profile with 96% confidence. Primary positive factors include stable employment, strong income consistency, and healthy debt-to-income ratio.',
};

export const mockFraudAnalysis: FraudAnalysis = {
  fraudScore: 5,
  fraudRisk: 'LOW',
  anomaliesDetected: [],
  checks: [
    { name: 'Identity verification', passed: true },
    { name: 'Device analysis', passed: true },
    { name: 'Transaction pattern', passed: true },
    { name: 'Behaviour analysis', passed: true },
  ],
  suspiciousPatterns: [],
  timestamp: new Date().toISOString(),
};

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    riskScore: 18,
    fraudScore: 3,
    decision: 'APPROVED',
    date: '2026-08-07',
    status: 'Active',
    loanAmount: 50000,
    approvedAmount: 50000,
    fairnessStatus: 'PASSED',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    riskScore: 45,
    fraudScore: 8,
    decision: 'MANUAL_REVIEW',
    date: '2026-08-06',
    status: 'Pending',
    loanAmount: 75000,
    fairnessStatus: 'PASSED',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    riskScore: 12,
    fraudScore: 2,
    decision: 'APPROVED',
    date: '2026-08-05',
    status: 'Active',
    loanAmount: 35000,
    approvedAmount: 35000,
    fairnessStatus: 'PASSED',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    riskScore: 78,
    fraudScore: 15,
    decision: 'REJECTED',
    date: '2026-08-04',
    status: 'Rejected',
    loanAmount: 100000,
    fairnessStatus: 'PASSED',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.w@example.com',
    riskScore: 23,
    fraudScore: 5,
    decision: 'APPROVED',
    date: '2026-08-03',
    status: 'Active',
    loanAmount: 60000,
    approvedAmount: 60000,
    fairnessStatus: 'PASSED',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalApplications: 1243,
  approvedLoans: 892,
  rejectedLoans: 186,
  manualReviews: 165,
  highRiskCustomers: 165,
  avgRiskScore: 32.5,
  approvalRate: 71.8,
  fraudDetectionRate: 2.3,
  fairnessPassRate: 98.5,
  avgProcessingTime: 45, // seconds
};

export const mockAnalyticsData = {
  approvalRate: [
    { month: 'Jan', approved: 85, rejected: 15 },
    { month: 'Feb', approved: 78, rejected: 22 },
    { month: 'Mar', approved: 82, rejected: 18 },
    { month: 'Apr', approved: 88, rejected: 12 },
    { month: 'May', approved: 75, rejected: 25 },
    { month: 'Jun', approved: 90, rejected: 10 },
  ],
  riskDistribution: [
    { name: 'Low Risk', value: 892, color: '#10b981' },
    { name: 'Medium Risk', value: 165, color: '#f59e0b' },
    { name: 'High Risk', value: 186, color: '#ef4444' },
  ],
  incomeVsRisk: [
    { income: 30000, risk: 65 },
    { income: 45000, risk: 48 },
    { income: 60000, risk: 35 },
    { income: 75000, risk: 25 },
    { income: 90000, risk: 18 },
    { income: 105000, risk: 12 },
  ],
  monthlyApplications: [
    { month: 'Jan', count: 180 },
    { month: 'Feb', count: 195 },
    { month: 'Mar', count: 210 },
    { month: 'Apr', count: 225 },
    { month: 'May', count: 198 },
    { month: 'Jun', count: 235 },
  ],
  fraudTrends: [
    { month: 'Jan', detected: 8, prevented: 7 },
    { month: 'Feb', detected: 12, prevented: 11 },
    { month: 'Mar', detected: 6, prevented: 6 },
    { month: 'Apr', detected: 15, prevented: 14 },
    { month: 'May', detected: 9, prevented: 8 },
    { month: 'Jun', detected: 11, prevented: 10 },
  ],
};
