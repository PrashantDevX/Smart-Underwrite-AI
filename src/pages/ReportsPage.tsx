import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function ReportsPage() {
  const handleExportPDF = () => {
    // In production, this would generate and download a PDF
    alert('PDF report generation would be implemented here');
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports</h1>
            <p className="text-gray-600">Generate comprehensive underwriting reports</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Report Generator */}
            <div className="lg:col-span-2">
              <Card glass>
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">AI Underwriting Report</h2>
                </div>

                <div className="space-y-6">
                  {/* Customer Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Customer Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Name</p>
                        <p className="font-medium text-gray-900">John Smith</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Application ID</p>
                        <p className="font-medium text-gray-900">#LA-2026-001</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Loan Amount</p>
                        <p className="font-medium text-gray-900">$50,000</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Date</p>
                        <p className="font-medium text-gray-900">Aug 7, 2026</p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Summary */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Risk Assessment</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Risk Score</p>
                        <p className="text-3xl font-bold text-gray-900">18/100</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Recommendation</p>
                        <Badge variant="success" className="text-base">APPROVED</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Key Factors */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Decision Factors</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Income Stability</span>
                        <span className="font-semibold text-emerald-600">88%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Employment Stability</span>
                        <span className="font-semibold text-emerald-600">92%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Financial Behaviour</span>
                        <span className="font-semibold text-emerald-600">85%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Digital Trust</span>
                        <span className="font-semibold text-emerald-600">91%</span>
                      </div>
                    </div>
                  </div>

                  {/* Decision History */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Decision History</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">Application Submitted</p>
                          <p className="text-xs text-gray-500">Aug 7, 2026 10:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">AI Analysis Completed</p>
                          <p className="text-xs text-gray-500">Aug 7, 2026 10:02 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">Loan Approved</p>
                          <p className="text-xs text-gray-500">Aug 7, 2026 10:03 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Export Options */}
            <div>
              <Card glass className="sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Export Options</h3>
                <div className="space-y-4">
                  <Button className="w-full" onClick={handleExportPDF}>
                    <Download className="w-5 h-5 mr-2" />
                    Export as PDF
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-5 h-5 mr-2" />
                    Export as CSV
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-5 h-5 mr-2" />
                    Export as Excel
                  </Button>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Report Contents</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>Customer Information</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>Risk Assessment Details</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>AI Explainability</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>Fraud Analysis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>Decision History</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
