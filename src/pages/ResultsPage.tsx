import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown,
  FileText,
  Shield,
  Scale,
  Sparkles
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useUnderwriting } from '../contexts/UnderwritingContext';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { risk, decision, fraud, fairness } = useUnderwriting();

  useEffect(() => {
    if (!risk || !decision) {
      // Try to load from history
      const history = JSON.parse(localStorage.getItem('underwriting_history') || '[]');
      const application = history.find((app: any) => app.id === id);
      
      if (!application) {
        navigate('/apply');
      }
    }
  }, [id, risk, decision, navigate]);

  if (!risk || !decision) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const getRiskColor = () => {
    if (risk.riskLevel === 'LOW RISK') return 'emerald';
    if (risk.riskLevel === 'MEDIUM RISK') return 'amber';
    return 'red';
  };

  const getDecisionIcon = () => {
    if (decision.decision === 'APPROVED' || decision.decision === 'APPROVED_LOWER_LIMIT') {
      return CheckCircle;
    }
    if (decision.decision === 'MANUAL_REVIEW' || decision.decision === 'NEED_MORE_DOCUMENTS') {
      return AlertCircle;
    }
    return XCircle;
  };

  const getDecisionColor = () => {
    if (decision.decision === 'APPROVED' || decision.decision === 'APPROVED_LOWER_LIMIT') {
      return 'success';
    }
    if (decision.decision === 'MANUAL_REVIEW' || decision.decision === 'NEED_MORE_DOCUMENTS') {
      return 'warning';
    }
    return 'danger';
  };

  const DecisionIcon = getDecisionIcon();
  const riskColor = getRiskColor();
  const scorePercentage = 100 - risk.riskScore;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Underwriting Results
            </h1>
            <p className="text-gray-600">Application ID: {id}</p>
          </div>

          {/* Main Decision Card */}
          <Card className="mb-8 p-8 bg-gradient-to-br from-white to-gray-50">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  ${decision.decision === 'APPROVED' || decision.decision === 'APPROVED_LOWER_LIMIT' ? 'bg-green-100' : 
                    decision.decision === 'REJECTED' ? 'bg-red-100' : 'bg-amber-100'}
                `}>
                  <DecisionIcon className={`
                    w-8 h-8
                    ${decision.decision === 'APPROVED' || decision.decision === 'APPROVED_LOWER_LIMIT' ? 'text-green-600' : 
                      decision.decision === 'REJECTED' ? 'text-red-600' : 'text-amber-600'}
                  `} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {decision.decision.replace(/_/g, ' ')}
                  </h2>
                  <p className="text-gray-600">Confidence: {decision.confidence}%</p>
                </div>
              </div>
              <Badge variant={getDecisionColor()} className="text-lg px-4 py-2">
                {decision.decision.replace(/_/g, ' ')}
              </Badge>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Decision Summary</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{decision.reason}</p>
              
              {decision.approvedAmount && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-blue-900">Approved Loan Amount</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ₹{decision.approvedAmount.toLocaleString()}
                  </p>
                </div>
              )}

              {decision.nextSteps && decision.nextSteps.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Next Steps:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {decision.nextSteps.map((step, idx) => (
                      <li key={idx} className="text-sm text-gray-700">{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>

          {/* Risk Score Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Assessment</h3>
              
              <div className="flex items-center justify-center mb-6">
                {/* Circular Progress */}
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="84"
                      stroke={`url(#gradient-${riskColor})`}
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 84}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 84 }}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 84 * (1 - scorePercentage / 100),
                      }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="gradient-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.p
                      className="text-5xl font-bold text-gray-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                    >
                      {risk.riskScore}
                    </motion.p>
                    <p className="text-gray-600">Risk Score</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                  <p className={`text-lg font-bold text-${riskColor}-600`}>
                    {risk.riskLevel}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Model Confidence</p>
                  <p className="text-lg font-bold text-gray-900">{risk.confidence}%</p>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Fraud Score</span>
                    <span className="text-sm font-semibold text-gray-900">{fraud?.fraudScore || 0}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${100 - (fraud?.fraudScore || 0)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Fairness Score</span>
                    <span className="text-sm font-semibold text-gray-900">{fairness?.overallScore || 0}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${fairness?.overallScore || 0}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Fraud Status</span>
                    <Badge variant={fraud?.fraudRisk === 'LOW' ? 'success' : 'warning'}>
                      {fraud?.fraudRisk || 'LOW'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fairness Status</span>
                    <Badge variant={fairness?.status === 'PASSED' ? 'success' : 'warning'}>
                      {fairness?.status || 'PASSED'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Feature Scores */}
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Engineered Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Income Stability', value: risk.features.incomeStability, icon: TrendingUp },
                { label: 'Employment Stability', value: risk.features.employmentStability, icon: TrendingUp },
                { label: 'Financial Discipline', value: risk.features.financialDisciplineScore, icon: TrendingUp },
                { label: 'Digital Trust Score', value: risk.features.digitalTrustScore, icon: TrendingUp },
              ].map((feature) => {
                const Icon = feature.icon;
                const isPositive = feature.value >= 70;
                
                return (
                  <div key={feature.label} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{feature.label}</span>
                      <Icon className={`w-5 h-5 ${isPositive ? 'text-green-500' : 'text-amber-500'}`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{feature.value}%</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${isPositive ? 'bg-green-500' : 'bg-amber-500'}`}
                        style={{ width: `${feature.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Navigation Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to={`/explainability/${id}`} className="block">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer">
                <Sparkles className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">View Explainability</h3>
                <p className="text-sm text-gray-600 mb-3">See top factors and SHAP analysis</p>
                <div className="flex items-center text-sm text-blue-600 font-medium">
                  View Details <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </Link>

            <Link to={`/fraud/${id}`} className="block">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer">
                <Shield className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Fraud Detection</h3>
                <p className="text-sm text-gray-600 mb-3">Review security checks and anomalies</p>
                <div className="flex items-center text-sm text-purple-600 font-medium">
                  View Details <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </Link>

            <Link to={`/fairness/${id}`} className="block">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer">
                <Scale className="w-8 h-8 text-emerald-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Fairness Audit</h3>
                <p className="text-sm text-gray-600 mb-3">Check bias and fairness metrics</p>
                <div className="flex items-center text-sm text-emerald-600 font-medium">
                  View Details <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </Link>

            <Link to={`/report/${id}`} className="block">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer">
                <FileText className="w-8 h-8 text-amber-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">AI Report</h3>
                <p className="text-sm text-gray-600 mb-3">Generate comprehensive report</p>
                <div className="flex items-center text-sm text-amber-600 font-medium">
                  Generate <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </Link>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/history">
              <Button variant="outline">View Application History</Button>
            </Link>
            <Link to="/apply">
              <Button>Start New Assessment</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
