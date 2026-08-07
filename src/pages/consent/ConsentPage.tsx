import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Mail, Zap, Globe, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import type { ConsentData } from '../../types';

export default function ConsentPage() {
  const navigate = useNavigate();
  const [consent, setConsent] = useState<ConsentData>({
    professionalProfile: false,
    employmentVerification: false,
    digitalBehaviour: false,
    emailMetadata: false,
    utilityPayments: false,
    publicInformation: false,
    timestamp: new Date().toISOString(),
  });

  const [allAgreed, setAllAgreed] = useState(false);

  const dataCategories = [
    {
      id: 'professionalProfile' as keyof ConsentData,
      icon: Globe,
      title: 'Professional Profile',
      description: 'Access your LinkedIn, professional network, and work history to verify employment.',
      dataPoints: ['Job title verification', 'Company verification', 'Skills endorsements', 'Professional connections'],
      color: 'blue',
      required: true,
    },
    {
      id: 'employmentVerification' as keyof ConsentData,
      icon: CheckCircle,
      title: 'Employment Verification',
      description: 'Verify your current employment status and income through official channels.',
      dataPoints: ['Employment status', 'Income verification', 'Job stability', 'Industry type'],
      color: 'emerald',
      required: true,
    },
    {
      id: 'digitalBehaviour' as keyof ConsentData,
      icon: Zap,
      title: 'Digital Behaviour Analysis',
      description: 'Analyze your digital engagement patterns to assess financial responsibility.',
      dataPoints: ['App usage patterns', 'Digital payment history', 'Online transaction behavior', 'Device stability'],
      color: 'purple',
      required: false,
    },
    {
      id: 'emailMetadata' as keyof ConsentData,
      icon: Mail,
      title: 'Email Metadata',
      description: 'Review email account age and history (content is never accessed).',
      dataPoints: ['Account age', 'Email provider', 'Account activity', 'Verification status'],
      color: 'amber',
      required: false,
    },
    {
      id: 'utilityPayments' as keyof ConsentData,
      icon: Zap,
      title: 'Utility Payment History',
      description: 'Access utility bill payment records to assess payment discipline.',
      dataPoints: ['Electricity bills', 'Water bills', 'Internet bills', 'On-time payment rate'],
      color: 'cyan',
      required: false,
    },
    {
      id: 'publicInformation' as keyof ConsentData,
      icon: Eye,
      title: 'Public Information',
      description: 'Access publicly available information from social media and professional networks.',
      dataPoints: ['Public social profiles', 'Professional achievements', 'Public records', 'Location stability'],
      color: 'indigo',
      required: false,
    },
  ];

  const handleToggle = (key: keyof ConsentData) => {
    if (typeof consent[key] === 'boolean') {
      setConsent(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleContinue = () => {
    // Check if all required consents are given
    const requiredCategories = dataCategories.filter(cat => cat.required);
    const allRequiredGiven = requiredCategories.every(cat => consent[cat.id]);

    if (!allRequiredGiven || !allAgreed) {
      alert('Please provide consent for all required categories and agree to the terms.');
      return;
    }

    // Store consent data
    localStorage.setItem('consentData', JSON.stringify(consent));
    navigate('/apply');
  };

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-4 rounded-2xl">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Consent Management</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We need your permission to access alternative data sources. This helps us provide a faster, fairer loan decision. 
              Your data is encrypted, never sold, and used only for underwriting.
            </p>
          </div>

          {/* Privacy Notice */}
          <Card glass className="mb-8 border-l-4 border-blue-500">
            <div className="flex items-start space-x-4">
              <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Your Privacy is Protected</h3>
                <p className="text-gray-600 mb-2">
                  We comply with the Digital Personal Data Protection (DPDP) Act and international privacy standards. 
                  You can withdraw consent at any time.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Data is encrypted end-to-end</li>
                  <li>• Access is logged and auditable</li>
                  <li>• Used only for loan underwriting</li>
                  <li>• Automatically deleted after decision (or as per policy)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Consent Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {dataCategories.map((category, index) => {
              const Icon = category.icon;
              const isEnabled = Boolean(consent[category.id]);

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full transition-all duration-300 ${isEnabled ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.title}</h3>
                          {category.required && (
                            <span className="text-xs text-red-600 font-medium">Required</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Toggle Switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isEnabled}
                          onChange={() => handleToggle(category.id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">Data Points Accessed:</p>
                      {category.dataPoints.map((point, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs text-gray-600">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Terms Agreement */}
          <Card glass className="mb-8">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={allAgreed}
                onChange={(e) => setAllAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                I understand and agree that my data will be used for loan underwriting purposes. I have read and accept the{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>,{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>, and{' '}
                <a href="#" className="text-blue-600 hover:underline">Data Processing Agreement</a>.
              </label>
            </div>
          </Card>

          {/* Summary */}
          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-emerald-50">
            <h3 className="font-semibold text-gray-900 mb-4">Consent Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {dataCategories.map(cat => (
                <div key={cat.id} className="flex items-center space-x-2">
                  {consent[cat.id] ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={`text-sm ${consent[cat.id] ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {cat.title}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              className="group"
            >
              Continue to Application
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
