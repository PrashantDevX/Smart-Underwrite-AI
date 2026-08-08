import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, CheckCircle, AlertCircle, ArrowLeft, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useUnderwriting } from '../contexts/UnderwritingContext';

export default function FairnessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fairness } = useUnderwriting();

  useEffect(() => {
    if (!fairness) {
      navigate(`/results/${id}`);
    }
  }, [fairness, id, navigate]);

  if (!fairness) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading fairness data...</p>
      </div>
    );
  }

  const getMetricColor = (value: number) => {
    if (value >= 0.9) return 'text-green-600';
    if (value >= 0.8) return 'text-amber-600';
    return 'text-red-600';
  };

  const getMetricBgColor = (value: number) => {
    if (value >= 0.9) return 'bg-green-100';
    if (value >= 0.8) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <Link to={`/results/${id}`}>
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Scale className="w-8 h-8 text-emerald-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Fairness Audit
              </h1>
            </div>
            <p className="text-gray-600">
              Comprehensive bias analysis and fairness metrics
            </p>
          </div>

          {/* Overall Status */}
          <Card className="p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  ${fairness.status === 'PASSED' ? 'bg-green-100' : 'bg-amber-100'}
                `}>
                  {fairness.status === 'PASSED' ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Fairness Status: {fairness.status}
                  </h2>
                  <p className="text-gray-600">Overall Score: {fairness.overallScore}/100</p>
                </div>
              </div>
              <Badge variant={fairness.status === 'PASSED' ? 'success' : 'warning'} className="text-lg px-4 py-2">
                {fairness.status}
              </Badge>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                ✓ No Bias Detected
              </h3>
              <p className="text-green-800 leading-relaxed">
                This decision was made without considering protected attributes such as gender, age, or location. 
                All fairness metrics meet or exceed regulatory requirements.
              </p>
            </div>
          </Card>

          {/* Fairness Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Disparate Impact</h3>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className={`text-4xl font-bold ${getMetricColor(fairness.metrics.disparateImpact)}`}>
                    {fairness.metrics.disparateImpact.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {fairness.metrics.disparateImpact >= 0.8 ? 'Meets 80% rule' : 'Below threshold'}
                  </p>
                </div>
                <div className={`w-16 h-16 rounded-full ${getMetricBgColor(fairness.metrics.disparateImpact)} flex items-center justify-center`}>
                  <TrendingUp className={`w-8 h-8 ${getMetricColor(fairness.metrics.disparateImpact)}`} />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${fairness.metrics.disparateImpact >= 0.8 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${fairness.metrics.disparateImpact * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Ratio of selection rates between groups
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Equal Opportunity</h3>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className={`text-4xl font-bold ${getMetricColor(fairness.metrics.equalOpportunity)}`}>
                    {fairness.metrics.equalOpportunity.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {fairness.metrics.equalOpportunity >= 0.9 ? 'Excellent' : 'Good'}
                  </p>
                </div>
                <div className={`w-16 h-16 rounded-full ${getMetricBgColor(fairness.metrics.equalOpportunity)} flex items-center justify-center`}>
                  <CheckCircle className={`w-8 h-8 ${getMetricColor(fairness.metrics.equalOpportunity)}`} />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${fairness.metrics.equalOpportunity >= 0.9 ? 'bg-green-500' : 'bg-amber-500'}`}
                  style={{ width: `${fairness.metrics.equalOpportunity * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Equal true positive rates across groups
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Demographic Parity</h3>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className={`text-4xl font-bold ${getMetricColor(fairness.metrics.demographicParity)}`}>
                    {fairness.metrics.demographicParity.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {fairness.metrics.demographicParity >= 0.9 ? 'Excellent' : 'Good'}
                  </p>
                </div>
                <div className={`w-16 h-16 rounded-full ${getMetricBgColor(fairness.metrics.demographicParity)} flex items-center justify-center`}>
                  <Scale className={`w-8 h-8 ${getMetricColor(fairness.metrics.demographicParity)}`} />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${fairness.metrics.demographicParity >= 0.9 ? 'bg-green-500' : 'bg-amber-500'}`}
                  style={{ width: `${fairness.metrics.demographicParity * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Equal selection rates across demographics
              </p>
            </Card>
          </div>

          {/* Protected Attributes */}
          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Protected Attributes Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fairness.protectedAttributes.map((attr) => (
                <div key={attr.attribute} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{attr.attribute}</h4>
                    {attr.biasDetected ? (
                      <Badge variant="warning">Flagged</Badge>
                    ) : (
                      <Badge variant="success">Clear</Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Impact Score</span>
                      <span className="font-semibold text-gray-900">{attr.impact.toFixed(3)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${attr.biasDetected ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${attr.impact * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {attr.biasDetected ? 'Requires review' : 'Within acceptable range'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          {fairness.recommendations && fairness.recommendations.length > 0 && (
            <Card className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h3>
              <ul className="space-y-3">
                {fairness.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Bottom Action */}
          <div className="mt-8 flex justify-center">
            <Link to={`/results/${id}`}>
              <Button>Back to Results</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
