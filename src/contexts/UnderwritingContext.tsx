import { createContext, useContext, useState, ReactNode } from 'react';
import type { 
  LoanApplication, 
  RiskAnalysis, 
  FraudAnalysis, 
  ExplainabilityData,
  FairnessReport,
  UnderwritingDecision 
} from '../types';

interface UnderwritingState {
  applicationId: string | null;
  application: Partial<LoanApplication>;
  consentGiven: {
    employmentVerification: boolean;
    professionalProfile: boolean;
    utilityPayments: boolean;
    digitalBehaviour: boolean;
    publicInformation: boolean;
    deviceAnalysis: boolean;
  };
  risk: RiskAnalysis | null;
  fraud: FraudAnalysis | null;
  explainability: ExplainabilityData | null;
  fairness: FairnessReport | null;
  decision: UnderwritingDecision | null;
  processingStage: 'idle' | 'feature-engineering' | 'fraud-detection' | 'risk-prediction' | 'explainability' | 'fairness-audit' | 'decision-engine' | 'completed' | 'error';
}

interface UnderwritingContextType extends UnderwritingState {
  setApplication: (app: Partial<LoanApplication>) => void;
  setConsent: (consent: UnderwritingState['consentGiven']) => void;
  setApplicationId: (id: string) => void;
  setProcessingStage: (stage: UnderwritingState['processingStage']) => void;
  setResults: (results: {
    risk: RiskAnalysis;
    fraud: FraudAnalysis;
    explainability: ExplainabilityData;
    fairness: FairnessReport;
    decision: UnderwritingDecision;
  }) => void;
  resetState: () => void;
}

const initialConsent = {
  employmentVerification: false,
  professionalProfile: false,
  utilityPayments: false,
  digitalBehaviour: false,
  publicInformation: false,
  deviceAnalysis: false,
};

const UnderwritingContext = createContext<UnderwritingContextType | undefined>(undefined);

export function UnderwritingProvider({ children }: { children: ReactNode }) {
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [application, setApplication] = useState<Partial<LoanApplication>>({});
  const [consentGiven, setConsent] = useState(initialConsent);
  const [risk, setRisk] = useState<RiskAnalysis | null>(null);
  const [fraud, setFraud] = useState<FraudAnalysis | null>(null);
  const [explainability, setExplainability] = useState<ExplainabilityData | null>(null);
  const [fairness, setFairness] = useState<FairnessReport | null>(null);
  const [decision, setDecision] = useState<UnderwritingDecision | null>(null);
  const [processingStage, setProcessingStage] = useState<UnderwritingState['processingStage']>('idle');

  const setResults = (results: {
    risk: RiskAnalysis;
    fraud: FraudAnalysis;
    explainability: ExplainabilityData;
    fairness: FairnessReport;
    decision: UnderwritingDecision;
  }) => {
    setRisk(results.risk);
    setFraud(results.fraud);
    setExplainability(results.explainability);
    setFairness(results.fairness);
    setDecision(results.decision);
  };

  const resetState = () => {
    setApplicationId(null);
    setApplication({});
    setConsent(initialConsent);
    setRisk(null);
    setFraud(null);
    setExplainability(null);
    setFairness(null);
    setDecision(null);
    setProcessingStage('idle');
  };

  return (
    <UnderwritingContext.Provider
      value={{
        applicationId,
        application,
        consentGiven,
        risk,
        fraud,
        explainability,
        fairness,
        decision,
        processingStage,
        setApplication,
        setConsent,
        setApplicationId,
        setProcessingStage,
        setResults,
        resetState,
      }}
    >
      {children}
    </UnderwritingContext.Provider>
  );
}

export function useUnderwriting() {
  const context = useContext(UnderwritingContext);
  if (context === undefined) {
    throw new Error('useUnderwriting must be used within UnderwritingProvider');
  }
  return context;
}
