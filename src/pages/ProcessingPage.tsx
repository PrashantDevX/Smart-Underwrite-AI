import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Loader2, 
  Clock,
  Sparkles,
  Shield,
  Scale,
  Brain,
  FileCheck,
  Activity
} from 'lucide-react';
import Card from '../components/ui/Card';
import { useUnderwriting } from '../contexts/UnderwritingContext';
import { api } from '../services/api';
import type { LoanApplication } from '../types';

interface ProcessingStage {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'pending' | 'processing' | 'completed' | 'error';
  duration: number;
}

export default function ProcessingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setResults, setApplicationId, setProcessingStage } = useUnderwriting();
  
  const [stages, setStages] = useState<ProcessingStage[]>([
    {
      id: 'feature-engineering',
      title: 'Feature Engineering',
      description: 'Calculating 8 engineered features from application data',
      icon: Activity,
      status: 'pending',
      duration: 800,
    },
    {
      id: 'fraud-detection',
      title: 'Fraud Detection',
      description: 'Running Isolation Forest anomaly detection',
      icon: Shield,
      status: 'pending',
      duration: 1200,
    },
    {
      id: 'risk-prediction',
      title: 'Risk Prediction',
      description: 'Analyzing 26 features with LightGBM model',
      icon: Brain,
      status: 'pending',
      duration: 1500,
    },
    {
      id: 'explainability',
      title: 'Explainability Analysis',
      description: 'Generating SHAP feature importance',
      icon: Sparkles,
      status: 'pending',
      duration: 1000,
    },
    {
      id: 'fairness-audit',
      title: 'Fairness Audit',
      description: 'Checking bias on protected attributes',
      icon: Scale,
      status: 'pending',
      duration: 900,
    },
    {
      id: 'decision-engine',
      title: 'Decision Engine',
      description: 'Generating final underwriting decision',
      icon: FileCheck,
      status: 'pending',
      duration: 700,
    },
  ]);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const application = location.state?.application as LoanApplication | undefined;

    if (!application) {
      navigate('/apply');
      return;
    }

    // Simulate the actual AI pipeline
    const processStages = async () => {
      try {
        // Process each stage sequentially
        for (let i = 0; i < stages.length; i++) {
          setCurrentStageIndex(i);
          setProcessingStage(stages[i].id as any);

          // Update stage to processing
          setStages(prev => prev.map((stage, idx) => 
            idx === i ? { ...stage, status: 'processing' as const } : stage
          ));

          // Wait for stage duration
          await new Promise(resolve => setTimeout(resolve, stages[i].duration));

          // Update stage to completed
          setStages(prev => prev.map((stage, idx) => 
            idx === i ? { ...stage, status: 'completed' as const } : stage
          ));
        }

        // Call actual backend API
        setProcessingStage('completed');
        const response = await api.underwrite(application);

        if (response.success && response.data) {
          // Generate application ID
          const appId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          setApplicationId(appId);
          setResults(response.data);

          // Store results in localStorage for persistence
          localStorage.setItem(`results_${appId}`, JSON.stringify(response.data));

          // Store in localStorage for history
          const history = JSON.parse(localStorage.getItem('underwriting_history') || '[]');
          history.unshift({
            id: appId,
            applicantName: application.fullName,
            date: new Date().toISOString(),
            riskScore: response.data.risk.riskScore,
            decision: response.data.decision.decision,
            status: 'completed',
          });
          localStorage.setItem('underwriting_history', JSON.stringify(history.slice(0, 50)));

          // Navigate to results
          setTimeout(() => {
            navigate(`/results/${appId}`);
          }, 1000);
        } else {
          // Surface backend validation errors to the user
          const errMsg = response.error || 'Failed to process application';
          setError(errMsg);
          setProcessingStage('error');
          setStages(prev => prev.map((stage, idx) =>
            idx === currentStageIndex ? { ...stage, status: 'error' as const } : stage
          ));
          return;
        }
      } catch (err) {
        console.error('Processing error:', err);
        setError('An error occurred during processing. Please try again.');
        setProcessingStage('error');
        
        // Mark current stage as error
        setStages(prev => prev.map((stage, idx) => 
          idx === currentStageIndex ? { ...stage, status: 'error' as const } : stage
        ));
      }
    };

    processStages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              AI Processing in Progress
            </h1>
            <p className="text-gray-600">
              Our multi-agent system is analyzing your application
            </p>
          </div>

          {/* Processing Stages */}
          <Card className="p-8">
            <div className="space-y-6">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = index === currentStageIndex;
                const isCompleted = stage.status === 'completed';
                const isError = stage.status === 'error';

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className={`
                        flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                        ${isCompleted ? 'bg-green-100' : isActive ? 'bg-blue-100' : isError ? 'bg-red-100' : 'bg-gray-100'}
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : isActive ? (
                          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        ) : isError ? (
                          <Clock className="w-6 h-6 text-red-600" />
                        ) : (
                          <Icon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`
                          text-lg font-semibold mb-1
                          ${isCompleted ? 'text-green-900' : isActive ? 'text-blue-900' : isError ? 'text-red-900' : 'text-gray-500'}
                        `}>
                          {stage.title}
                        </h3>
                        <p className={`
                          text-sm
                          ${isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : isError ? 'text-red-600' : 'text-gray-500'}
                        `}>
                          {stage.description}
                        </p>

                        {/* Progress bar for active stage */}
                        {isActive && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: stage.duration / 1000, ease: 'linear' }}
                            className="h-1 bg-blue-600 rounded-full mt-2"
                          />
                        )}
                      </div>

                      {/* Status badge */}
                      <div className="flex-shrink-0">
                        {isCompleted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        )}
                        {isActive && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Processing...
                          </span>
                        )}
                        {stage.status === 'pending' && !isActive && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Waiting
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Connecting line */}
                    {index < stages.length - 1 && (
                      <div className={`
                        ml-6 h-6 w-0.5
                        ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}
                      `} />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-sm text-red-800">{error}</p>
                  <button
                    onClick={() => navigate('/apply')}
                    className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Return to Application
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Info Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            <p>
              This typically takes 5-10 seconds. Please do not refresh the page.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
