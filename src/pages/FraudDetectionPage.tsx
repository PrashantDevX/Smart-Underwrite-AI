import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { mockFraudAnalysis } from '../data/mockData';

export default function FraudDetectionPage() {
  const data = mockFraudAnalysis;
  const isLowRisk = data.fraudScore < 30;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Fraud Detection</h1>
            <p className="text-gray-600">Real-time fraud monitoring and analysis</p>
          </div>

          {/* Main Fraud Score Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card glass className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Fraud Risk Score</h2>
                    <p className="text-gray-600">AI-powered fraud assessment</p>
                  </div>
                  <Badge variant={isLowRisk ? 'success' : 'danger'}>
                    {isLowRisk ? 'Low Risk' : 'High Risk'}
                  </Badge>
                </div>

                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className={`w-48 h-48 rounded-full flex items-center justify-center ${
                      isLowRisk
                        ? 'bg-gradient-to-br from-emerald-100 to-emerald-50'
                        : 'bg-gradient-to-br from-red-100 to-red-50'
                    }`}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                      >
                        <p className={`text-6xl font-bold ${
                          isLowRisk ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {data.fraudScore}%
                        </p>
                      </motion.div>
                    </div>
                    <div className={`absolute -top-4 -right-4 p-3 rounded-full ${
                      isLowRisk ? 'bg-emerald-500' : 'bg-red-500'
                    }`}>
                      {isLowRisk ? (
                        <CheckCircle className="w-8 h-8 text-white" />
                      ) : (
                        <AlertCircle className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {data.fraudRisk === 'LOW' ? 'No suspicious activity detected' : 'Suspicious patterns found'}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Security Checks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card glass className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Security Checks</h3>
                </div>
                <div className="space-y-3">
                  {data.checks.map((check, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-700 text-sm">{check.name}</span>
                      {check.passed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Anomaly Detection Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card glass>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Anomaly Detection Timeline</h2>
              <p className="text-gray-600 mb-6">
                Historical anomaly detection over the past 6 months
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { month: 'Jan', detected: 2 },
                  { month: 'Feb', detected: 3 },
                  { month: 'Mar', detected: 1 },
                  { month: 'Apr', detected: 5 },
                  { month: 'May', detected: 2 },
                  { month: 'Jun', detected: 4 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="detected"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', r: 5 }}
                    name="Anomalies Detected"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
