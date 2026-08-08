import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye, FileText, TrendingUp, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface HistoryItem {
  id: string;
  applicantName: string;
  date: string;
  riskScore: number;
  decision: string;
  status: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>('all');

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('underwriting_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const getDecisionIcon = (decision: string) => {
    if (decision === 'APPROVED' || decision === 'APPROVED_LOWER_LIMIT') return CheckCircle;
    if (decision === 'REJECTED') return XCircle;
    return AlertCircle;
  };

  const getDecisionVariant = (decision: string): 'success' | 'danger' | 'warning' => {
    if (decision === 'APPROVED' || decision === 'APPROVED_LOWER_LIMIT') return 'success';
    if (decision === 'REJECTED') return 'danger';
    return 'warning';
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'approved') return item.decision === 'APPROVED' || item.decision === 'APPROVED_LOWER_LIMIT';
    if (filter === 'rejected') return item.decision === 'REJECTED';
    if (filter === 'pending') return item.decision === 'MANUAL_REVIEW' || item.decision === 'NEED_MORE_DOCUMENTS';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Application History
            </h1>
            <p className="text-gray-600">
              View and manage your past underwriting assessments
            </p>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="flex flex-wrap gap-3">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All Applications
              </Button>
              <Button
                variant={filter === 'approved' ? 'primary' : 'outline'}
                onClick={() => setFilter('approved')}
              >
                Approved
              </Button>
              <Button
                variant={filter === 'pending' ? 'primary' : 'outline'}
                onClick={() => setFilter('pending')}
              >
                Pending Review
              </Button>
              <Button
                variant={filter === 'rejected' ? 'primary' : 'outline'}
                onClick={() => setFilter('rejected')}
              >
                Rejected
              </Button>
            </div>
          </Card>

          {/* Applications List */}
          {filteredHistory.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Applications Found
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'You haven\'t submitted any applications yet.'
                  : `No ${filter} applications found.`}
              </p>
              <Link to="/apply">
                <Button>Start New Assessment</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item, index) => {
                const DecisionIcon = getDecisionIcon(item.decision);
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Main Info */}
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`
                            flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                            ${item.decision === 'APPROVED' || item.decision === 'APPROVED_LOWER_LIMIT' ? 'bg-green-100' : 
                              item.decision === 'REJECTED' ? 'bg-red-100' : 'bg-amber-100'}
                          `}>
                            <DecisionIcon className={`
                              w-6 h-6
                              ${item.decision === 'APPROVED' || item.decision === 'APPROVED_LOWER_LIMIT' ? 'text-green-600' : 
                                item.decision === 'REJECTED' ? 'text-red-600' : 'text-amber-600'}
                            `} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.applicantName}
                              </h3>
                              <Badge variant={getDecisionVariant(item.decision)}>
                                {item.decision.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(item.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                              
                              <div className="flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span>Risk Score: </span>
                                <span className={`font-semibold ml-1 ${getRiskColor(item.riskScore)}`}>
                                  {item.riskScore}
                                </span>
                              </div>
                              
                              <div className="text-gray-500">
                                ID: {item.id}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Link to={`/results/${item.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </Link>
                          <Link to={`/report/${item.id}`}>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-1" />
                              Report
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom Action */}
          {filteredHistory.length > 0 && (
            <div className="mt-8 text-center">
              <Link to="/apply">
                <Button size="lg">Start New Assessment</Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
