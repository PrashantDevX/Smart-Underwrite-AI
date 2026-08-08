import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, User, Briefcase, DollarSign, Smartphone } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import type { LoanApplication } from '../types';
import { api } from '../services/api';

export default function LoanApplicationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<LoanApplication>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const steps = [
    { number: 1, title: 'Personal Information', icon: User },
    { number: 2, title: 'Employment Information', icon: Briefcase },
    { number: 3, title: 'Financial Information', icon: DollarSign },
    { number: 4, title: 'Alternative Data', icon: Smartphone },
  ];

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Basic client-side validation to prevent missing/NaN fields
    setFormError(null);
    const requiredNumbers = ['age', 'monthlyIncome', 'loanAmount', 'monthlyDebt'];
    for (const key of requiredNumbers) {
      const val = (formData as any)[key];
      if (val === undefined || val === null || Number.isNaN(Number(val)) || !isFinite(Number(val))) {
        setFormError('Please complete all required numeric fields before submitting.');
        return;
      }
    }
    if (!formData.fullName || String(formData.fullName).trim().length === 0) {
      setFormError('Please provide your full name.');
      return;
    }
    if (!formData.email || !String(formData.email).includes('@')) {
      setFormError('Please provide a valid email address.');
      return;
    }

    // Navigate to processing page with validated application data
    navigate('/processing', { state: { application: formData as LoanApplication } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Loan Application</h1>
            <p className="text-gray-600">Complete the form to get instant AI-powered risk assessment</p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isActive || isCompleted
                            ? 'bg-gradient-to-r from-blue-600 to-emerald-500 border-transparent text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <p className={`mt-2 text-xs font-medium hidden sm:block ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-2 ${
                        isCompleted ? 'bg-gradient-to-r from-blue-600 to-emerald-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <Card glass className="p-8">
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">{formError}</p>
              </div>
            )}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.fullName ?? ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                  <Input
                    label="Age"
                    type="number"
                    placeholder="30"
                    value={formData.age ?? ''}
                    onChange={(e) => handleInputChange('age', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email ?? ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+1 234 567 8900"
                    value={formData.phone ?? ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  <Input
                    label="Location"
                    placeholder="New York, USA"
                    value={formData.location ?? ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Employment Information</h2>
                  <Select
                    label="Employment Type"
                    value={formData.employmentType ?? ''}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                    options={[
                      { value: 'full-time', label: 'Full Time' },
                      { value: 'part-time', label: 'Part Time' },
                      { value: 'self-employed', label: 'Self Employed' },
                      { value: 'contract', label: 'Contract' },
                    ]}
                  />
                  <Input
                    label="Company Name"
                    placeholder="Acme Corporation"
                    value={formData.companyName ?? ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                  <Input
                    label="Job Role"
                    placeholder="Software Engineer"
                    value={formData.jobRole ?? ''}
                    onChange={(e) => handleInputChange('jobRole', e.target.value)}
                  />
                  <Input
                    label="Years of Employment"
                    type="number"
                    placeholder="5"
                    value={formData.yearsOfEmployment ?? ''}
                    onChange={(e) => handleInputChange('yearsOfEmployment', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  <Input
                    label="Monthly Income ($)"
                    type="number"
                    placeholder="5000"
                    value={formData.monthlyIncome ?? ''}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Information</h2>
                  <Input
                    label="Loan Amount Requested ($)"
                    type="number"
                    placeholder="50000"
                    value={formData.loanAmount ?? ''}
                    onChange={(e) => handleInputChange('loanAmount', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  <Select
                    label="Loan Purpose"
                    value={formData.loanPurpose ?? ''}
                    onChange={(e) => handleInputChange('loanPurpose', e.target.value)}
                    options={[
                      { value: 'home', label: 'Home Purchase' },
                      { value: 'business', label: 'Business' },
                      { value: 'education', label: 'Education' },
                      { value: 'personal', label: 'Personal' },
                      { value: 'car', label: 'Car Purchase' },
                    ]}
                  />
                  <Input
                    label="Monthly Expenses ($)"
                    type="number"
                    placeholder="2000"
                    value={formData.monthlyExpenses ?? ''}
                    onChange={(e) => handleInputChange('monthlyExpenses', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  <Input
                    label="Savings ($)"
                    type="number"
                    placeholder="10000"
                    value={formData.savings ?? ''}
                    onChange={(e) => handleInputChange('savings', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  <Input
                    label="Existing Loans ($)"
                    type="number"
                    placeholder="5000"
                    value={formData.existingLoans ?? ''}
                    onChange={(e) => handleInputChange('existingLoans', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  <Input
                    label="Monthly Debt Payment ($)"
                    type="number"
                    placeholder="500"
                    value={formData.monthlyDebt ?? ''}
                    onChange={(e) => handleInputChange('monthlyDebt', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Alternative Data</h2>
                  <Input
                    label="Email Account Age (years)"
                    type="number"
                    placeholder="8"
                    value={formData.emailAccountAge ?? ''}
                    onChange={(e) => handleInputChange('emailAccountAge', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  <Select
                    label="Utility Payment History"
                    value={formData.utilityPaymentHistory ?? ''}
                    onChange={(e) => handleInputChange('utilityPaymentHistory', e.target.value)}
                    options={[
                      { value: 'excellent', label: 'Excellent (100% on-time)' },
                      { value: 'good', label: 'Good (90-99% on-time)' },
                      { value: 'fair', label: 'Fair (70-89% on-time)' },
                      { value: 'poor', label: 'Poor (<70% on-time)' },
                    ]}
                  />
                  <Input
                    label="Number of Failed Transactions (last year)"
                    type="number"
                    placeholder="2"
                    value={formData.failedTransactions ?? ''}
                    onChange={(e) => handleInputChange('failedTransactions', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  <Input
                    label="Device Stability Score (0-100)"
                    type="number"
                    placeholder="85"
                    value={formData.deviceStabilityScore ?? ''}
                    onChange={(e) => handleInputChange('deviceStabilityScore', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  <Select
                    label="Professional Profile Available"
                    value={formData.professionalProfile ? 'yes' : 'no'}
                    onChange={(e) => handleInputChange('professionalProfile', e.target.value === 'yes')}
                    options={[
                      { value: 'yes', label: 'Yes (LinkedIn, etc.)' },
                      { value: 'no', label: 'No' },
                    ]}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Submit Application
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
