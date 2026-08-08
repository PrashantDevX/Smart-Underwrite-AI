import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  User, 
  DollarSign,
  Shield,
  Scale,
  Brain,
  CheckCircle,
  Loader2
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useUnderwriting } from '../contexts/UnderwritingContext';
import type { UnderwritingReport } from '../types';

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const { risk, decision, fraud, explainability, fairness } = useUnderwriting();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<UnderwritingReport | null>(null);

  useEffect(() => {
    // Simulate generating report
    const generateReport = async () => {
      setLoading(true);
      
      // Wait a bit to simulate backend processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Load application from history
      const history = JSON.parse(localStorage.getItem('underwriting_history') || '[]');
      const application = history.find((app: any) => app.id === id);

      if (application && risk && decision && fraud && explainability && fairness) {
        const generatedReport: UnderwritingReport = {
          applicationId: id || '',
          customerInfo: {
            name: application.applicantName,
            email: 'applicant@example.com',
            phone: '+1 234 567 8900',
          },
          loanDetails: {
            requestedAmount: application.loanAmount || 500000,
            approvedAmount: decision.approvedAmount,
            purpose: 'home',
          },
          riskAssessment: risk,
          fraudAssessment: fraud,
          fairnessAudit: fairness,
          explainability: explainability,
          decision: decision,
          timestamp: new Date().toISOString(),
          auditTrail: [
            { action: 'Application Submitted', timestamp: application.date, actor: 'Customer' },
            { action: 'Feature Engineering Completed', timestamp: new Date(Date.now() - 300000).toISOString(), actor: 'AI Engine' },
            { action: 'Risk Analysis Completed', timestamp: new Date(Date.now() - 240000).toISOString(), actor: 'Risk Engine' },
            { action: 'Fraud Check Completed', timestamp: new Date(Date.now() - 180000).toISOString(), actor: 'Fraud Engine' },
            { action: 'Fairness Audit Completed', timestamp: new Date(Date.now() - 120000).toISOString(), actor: 'Fairness Engine' },
            { action: 'Decision Generated', timestamp: new Date(Date.now() - 60000).toISOString(), actor: 'Decision Engine' },
            { action: 'Report Generated', timestamp: new Date().toISOString(), actor: 'System' },
          ],
        };
        setReport(generatedReport);
      }
      
      setLoading(false);
    };

    generateReport();
  }, [id, risk, decision, fraud, explainability, fairness]);

  const handleDownloadPDF = () => {
    alert('PDF generation feature coming soon. This would generate a comprehensive PDF report with all underwriting details.');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Report</h2>
          <p className="text-gray-600">Compiling comprehensive underwriting analysis...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to generate report. Please try again.</p>
          <Link to="/history">
            <Button>Back to History</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const getDecisionColor = () => {
    if (report.decision.decision === 'APPROVED' || report.decision.decision === 'APPROVED_LOWER_LIMIT') {
      return 'text-green-600 bg-green-50';
    }
    if (report.decision.decision === 'REJECTED') {
      return 'text-red-600 bg-red-50';
    }
    return 'text-amber-600 bg-amber-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                AI Underwriting Report
              </h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
            <p className="text-gray-600">Application ID: {report.applicationId}</p>
            <p className="text-sm text-gray-500">
              Generated on {new Date(report.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Report Content */}
          <div className="space-y-6 print:space-y-4">
            {/* Customer Information */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-gray-900">{report.customerInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{report.customerInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{report.customerInfo.phone}</p>
                </div>
              </div>
            </Card>

            {/* Loan Details */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                Loan Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Requested Amount</p>
                  <p className="font-semibold text-gray-900">
                    ₹{report.loanDetails.requestedAmount.toLocaleString()}
                  </p>
                </div>
                {report.loanDetails.approvedAmount && (
                  <div>
                    <p className="text-sm text-gray-600">Approved Amount</p>
                    <p className="font-semibold text-emerald-600">
                      ₹{report.loanDetails.approvedAmount.toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Purpose</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {report.loanDetails.purpose}
                  </p>
                </div>
              </div>
            </Card>

            {/* Final Decision */}
            <Card className={`p-6 border-2 ${getDecisionColor()}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Final Decision
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Decision:</span>
                  <Badge variant={
                    report.decision.decision === 'APPROVED' || report.decision.decision === 'APPROVED_LOWER_LIMIT' ? 'success' :
                    report.decision.decision === 'REJECTED' ? 'danger' : 'warning'
                  }>
                    {report.decision.decision.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Confidence:</span>
                  <span className="font-semibold">{report.decision.confidence}%</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-gray-700 mb-2">Reason:</p>
                  <p className="text-gray-900">{report.decision.reason}</p>
                </div>
              </div>
            </Card>

            {/* Risk Assessment */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                Risk Assessment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Risk Score</p>
                  <p className="text-3xl font-bold text-gray-900">{report.riskAssessment.riskScore}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <p className="text-2xl font-bold text-gray-900">{report.riskAssessment.riskLevel}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Debt Ratio</p>
                  <p className="text-lg font-bold">{report.riskAssessment.features.debtRatio}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Income Stability</p>
                  <p className="text-lg font-bold">{report.riskAssessment.features.incomeStability}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Employment</p>
                  <p className="text-lg font-bold">{report.riskAssessment.features.employmentStability}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Digital Trust</p>
                  <p className="text-lg font-bold">{report.riskAssessment.features.digitalTrustScore}%</p>
                </div>
              </div>
            </Card>

            {/* Fraud Assessment */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Fraud Assessment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Fraud Score</p>
                  <p className="text-3xl font-bold text-gray-900">{report.fraudAssessment.fraudScore}/100</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fraud Risk</p>
                  <Badge variant={report.fraudAssessment.fraudRisk === 'LOW' ? 'success' : 'warning'}>
                    {report.fraudAssessment.fraudRisk}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-900 mb-2">Security Checks:</p>
                {report.fraudAssessment.checks.map((check, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{check.name}</span>
                    <Badge variant={check.passed ? 'success' : 'danger'}>
                      {check.passed ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Fairness Audit */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Scale className="w-5 h-5 mr-2 text-blue-600" />
                Fairness Audit
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Overall Score</p>
                  <p className="text-3xl font-bold text-gray-900">{report.fairnessAudit.overallScore}/100</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={report.fairnessAudit.status === 'PASSED' ? 'success' : 'warning'}>
                    {report.fairnessAudit.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Disparate Impact</p>
                  <p className="text-lg font-bold">{report.fairnessAudit.metrics.disparateImpact.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Equal Opportunity</p>
                  <p className="text-lg font-bold">{report.fairnessAudit.metrics.equalOpportunity.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Demographic Parity</p>
                  <p className="text-lg font-bold">{report.fairnessAudit.metrics.demographicParity.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            {/* Audit Trail */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                Audit Trail
              </h2>
              <div className="space-y-3">
                {report.auditTrail.map((entry, idx) => (
                  <div key={idx} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{entry.action}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(entry.timestamp).toLocaleString()} • {entry.actor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
            <Link to={`/results/${id}`}>
              <Button variant="outline">Back to Results</Button>
            </Link>
            <Link to="/history">
              <Button variant="outline">View History</Button>
            </Link>
            <Link to="/consent">
              <Button>Start New Assessment</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
