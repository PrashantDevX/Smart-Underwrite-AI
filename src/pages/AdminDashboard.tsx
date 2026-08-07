import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { mockDashboardStats, mockCustomers } from '../data/mockData';

export default function AdminDashboard() {
  const stats = mockDashboardStats;
  const customers = mockCustomers;

  const getBadgeVariant = (decision: string) => {
    switch (decision) {
      case 'APPROVED':
        return 'success';
      case 'REVIEW':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Overview of loan applications and risk assessments</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Applications"
              value={stats.totalApplications.toLocaleString()}
              icon={FileText}
              color="blue"
              trend="+12% from last month"
              trendUp={true}
            />
            <StatCard
              title="Approved Loans"
              value={stats.approvedLoans.toLocaleString()}
              icon={CheckCircle}
              color="emerald"
              trend="+8% from last month"
              trendUp={true}
            />
            <StatCard
              title="Rejected Loans"
              value={stats.rejectedLoans.toLocaleString()}
              icon={XCircle}
              color="red"
              trend="-3% from last month"
              trendUp={true}
            />
            <StatCard
              title="High Risk Customers"
              value={stats.highRiskCustomers.toLocaleString()}
              icon={AlertTriangle}
              color="amber"
              trend="-5% from last month"
              trendUp={true}
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card glass>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Average Risk Score</span>
                    <span className="font-semibold text-gray-900">{stats.avgRiskScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2 rounded-full"
                      style={{ width: `${100 - stats.avgRiskScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Approval Rate</span>
                    <span className="font-semibold text-gray-900">{stats.approvalRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full"
                      style={{ width: `${stats.approvalRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card glass>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.totalApplications - stats.approvedLoans - stats.rejectedLoans}
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {stats.approvalRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Applications Table */}
          <Card glass>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Applications</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Loan Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Risk Score</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Decision</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{customer.name}</p>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        ${customer.loanAmount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${
                          customer.riskScore < 30 ? 'text-emerald-600' :
                          customer.riskScore < 60 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {customer.riskScore}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getBadgeVariant(customer.decision)}>
                          {customer.decision}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {new Date(customer.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={customer.status === 'Active' ? 'success' : customer.status === 'Pending' ? 'warning' : 'danger'}>
                          {customer.status}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
