import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import { mockExplainability } from '../data/mockData';

export default function ExplainabilityPage() {
  const data = mockExplainability;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Explainable AI</h1>
            <p className="text-gray-600">Understanding the AI decision-making process</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Positive Factors */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card glass className="h-full">
                <div className="flex items-center space-x-2 mb-6">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Positive Factors</h2>
                </div>
                <div className="space-y-3">
                  {data.positiveFactors.map((factor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-gray-900 font-medium">{factor.feature}</span>
                        <p className="text-sm text-gray-600">{factor.explanation}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Negative Factors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card glass className="h-full">
                <div className="flex items-center space-x-2 mb-6">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Risk Factors</h2>
                </div>
                <div className="space-y-3">
                  {data.negativeFactors.map((factor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-gray-900 font-medium">{factor.feature}</span>
                        <p className="text-sm text-gray-600">{factor.explanation}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Feature Importance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card glass>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Importance</h2>
              <p className="text-gray-600 mb-6">
                These factors had the most significant impact on the risk assessment decision
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.featureImportance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="url(#colorGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
