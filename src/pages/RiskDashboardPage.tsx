import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import type { RiskAnalysis } from '../types';

export default function RiskDashboardPage() {
  const location = useLocation();
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);

  useEffect(() => {
    if (location.state?.analysis) {
      setAnalysis(location.state.analysis);
    }
  }, [location]);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <p className="text-gray-600">No risk analysis data available.</p>
          <Link to="/apply">
            <Button className="mt-4">Start New Application</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW RISK':
        return 'emerald';
      case 'MEDIUM RISK':
        return 'amber';
      case 'HIGH RISK':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case 'APPROVED':
        return <Badge variant="success">✓ {recommendation}</Badge>;
      case 'REVIEW':
        return <Badge variant="warning">⚠ {recommendation}</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">✗ {recommendation}</Badge>;
      default:
        return <Badge>{recommendation}</Badge>;
    }
  };

  const riskColor = getRiskColor(analysis.riskLevel);
  const scorePercentage = (100 - analysis.riskScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Risk Assessment</h1>
            <p className="text-gray-600">Comprehensive risk analysis completed</p>
          </div>

          {/* Main Risk Score Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card glass className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Risk Score</h2>
                    <p className="text-gray-600">AI-powered assessment</p>
                  </div>
                  {getRecommendationBadge(analysis.recommendation)}
                </div>

                <div className="flex items-center justify-center mb-8">
                  {/* Circular Progress */}
                  <div className="relative w-64 h-64">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="128"
                        cy="128"
                        r="112"
                        stroke="#e5e7eb"
                        strokeWidth="16"
                        fill="none"
                      />
                      {/* Progress circle */}
                      <motion.circle
                        cx="128"
                        cy="128"
                        r="112"
                        stroke={`url(#gradient-${riskColor})`}
                        strokeWidth="16"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 112}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 112 }}
                        animate={{
                          strokeDashoffset: 2 * Math.PI * 112 * (1 - scorePercentage / 100),
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
                        className="text-6xl font-bold text-gray-900"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                      >
                        {analysis.riskScore}
                      </motion.p>
                      <p className="text-gray-600 text-lg">/100</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                    <p className={`text-lg font-bold text-${riskColor}-600`}>
                      {analysis.riskLevel}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Confidence</p>
                    <p className="text-lg font-bold text-gray-900">{analysis.confidence}%</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card glass className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/explainability" state={{ analysis }}>
                    <Button variant="outline" className="w-full justify-between">
                      View Explanation
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/fraud-detection" state={{ analysis }}>
                    <Button variant="outline" className="w-full justify-between">
                      Fraud Check
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/reports">
                    <Button variant="outline" className="w-full justify-between">
                      Generate Report
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/apply">
                    <Button className="w-full">New Application</Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: 'Income Stability',
                value: analysis.features.incomeStability,
                icon: analysis.features.incomeStability >= 70 ? CheckCircle : AlertCircle,
                trend: analysis.features.incomeStability >= 70,
              },
              {
                label: 'Employment Stability',
                value: analysis.features.employmentStability,
                icon: analysis.features.employmentStability >= 70 ? CheckCircle : AlertCircle,
                trend: analysis.features.employmentStability >= 70,
              },
              {
                label: 'Financial Discipline',
                value: analysis.features.financialDisciplineScore,
                icon: analysis.features.financialDisciplineScore >= 70 ? CheckCircle : AlertCircle,
                trend: analysis.features.financialDisciplineScore >= 70,
              },
              {
                label: 'Digital Trust Score',
                value: analysis.features.digitalTrustScore,
                icon: analysis.features.digitalTrustScore >= 70 ? CheckCircle : AlertCircle,
                trend: analysis.features.digitalTrustScore >= 70,
              },
            ].map((metric, index) => {
              const Icon = metric.icon;
              const TrendIcon = metric.trend ? TrendingUp : TrendingDown;

              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <Icon className={`w-8 h-8 ${metric.trend ? 'text-emerald-500' : 'text-amber-500'}`} />
                      <TrendIcon className={`w-5 h-5 ${metric.trend ? 'text-emerald-500' : 'text-red-500'}`} />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}%</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
