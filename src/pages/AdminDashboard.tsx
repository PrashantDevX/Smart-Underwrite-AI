import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { api } from '../services/api';

interface HistoryApplication {
  id: string;
  applicantName: string;
  date: string;
  riskScore: number;
  decision: string;
  status: string;
  loanAmount?: number;
  fraudScore?: number;
  fairnessStatus?: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [applications, setApplications] = useState<HistoryApplication[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load analytics from backend
        const analyticsData = await api.getAnalytics();
        setAnalytics(analyticsData);

        // Load application history from localStorage
        const history = JSON.parse(localStorage.getItem('underwriting_history') || '[]');
        setApplications(history.slice(0, 10)); // Show last 10 applications
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = analytics?.overview || {
    total_applications: 0,
    approved_applications: 0,
    rejected_applications: 0,
    manual_review_applications: 0,
    average_risk_score: 0,
    average_fraud_score: 0,
    approval_rate: 0,
    fairness_pass_rate: 0,
  };

  const getBadgeVariant = (decision: string) => {
    if (decision === 'APPROVED' || decision === 'APPROVED_LOWER_LIMIT') {
      return 'success';
    }
    if (decision === 'MANUAL_REVIEW' || decision === 'NEED_MORE_DOCUMENTS') {
      return 'warning';
    }
    if (decision === 'REJECTED') {
      return 'danger';
    }
    return 'default';
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Real-time overview of underwriting operations</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Applications"
              value={stats.total_applications.toLocaleString()}
              icon={FileText}
              color="blue"
            />
            <StatCard
              title="Approved"
              value={stats.approved_applications.toLocaleString()}
              icon={CheckCircle}
              color="emerald"
            />
            <StatCard
              title="Rejected"
              value={stats.rejected_applications.toLocaleString()}
              icon={XCircle}
              color="red"
            />
            <StatCard
              title="Manual Review"
              value={stats.manual_review_applications.toLocaleString()}
              icon={AlertTriangle}
              color="amber"
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card glass>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Avg Risk Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.average_risk_score.toFixed(1)}
                </p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2 rounded-full"
                    style={{ width: `${100 - stats.average_risk_score}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            <Card glass>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Avg Fraud Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.average_fraud_score.toFixed(1)}
                </p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-green-400 h-2 rounded-full"
                    style={{ width: `${100 - stats.average_fraud_score}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            <Card glass>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Approval Rate</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {stats.approval_rate.toFixed(1)}%
                </p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${stats.approval_rate}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            <Card glass>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Fairness Pass Rate</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.fairness_pass_rate.toFixed(1)}%
                </p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stats.fairness_pass_rate}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Applications Table */}
          <Card glass>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Applications</h3>
              <button
                onClick={() => navigate('/history')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </button>
            </div>
            
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No applications yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Applications will appear here after underwriting assessments
                </p>
                <button
                  onClick={() => navigate('/consent')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start First Assessment
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Application ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Applicant</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Risk Score</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Decision</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, index) => (
                      <motion.tr
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/results/${app.id}`)}
                      >
                        <td className="py-4 px-4">
                          <p className="font-mono text-sm text-gray-600">{app.id}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">{app.applicantName}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-semibold ${
                            app.riskScore < 30 ? 'text-emerald-600' :
                            app.riskScore < 60 ? 'text-amber-600' :
                            'text-red-600'
                          }`}>
                            {app.riskScore}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={getBadgeVariant(app.decision)}>
                            {app.decision.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm">
                          {new Date(app.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/results/${app.id}`);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
