import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import { mockAnalyticsData } from '../data/mockData';

export default function AnalyticsPage() {
  const data = mockAnalyticsData;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights and trends</p>
          </div>

          {/* Approval Rate Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card glass>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Loan Approval Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.approvalRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="approved" fill="#10b981" name="Approved" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="rejected" fill="#ef4444" name="Rejected" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Risk Distribution */}
            <Card glass>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Risk Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.riskDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Income vs Risk Scatter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card glass>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Income vs Risk Score</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="income"
                    name="Income"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    label={{ value: 'Monthly Income ($)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    dataKey="risk"
                    name="Risk"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Applications" data={data.incomeVsRisk} fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </Card>

            {/* Monthly Applications */}
            <Card glass>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Applications</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.monthlyApplications}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    name="Applications"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Fraud Trends */}
          <Card glass>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Fraud Detection Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.fraudTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="detected"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Detected"
                />
                <Line
                  type="monotone"
                  dataKey="prevented"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Prevented"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
