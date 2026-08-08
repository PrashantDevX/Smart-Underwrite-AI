import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Shield, CheckCircle, Scale, FileText, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function LandingPage() {
  const capabilities = [
    {
      icon: Activity,
      title: 'Alternative Data Analysis',
      description: 'Beyond credit scores - analyze employment, utility payments, and digital behavior',
    },
    {
      icon: Brain,
      title: 'Explainable AI',
      description: 'SHAP-based feature importance with plain language explanations',
    },
    {
      icon: Shield,
      title: 'Fraud Detection',
      description: 'Isolation Forest ML model with 6 security checks',
    },
    {
      icon: Scale,
      title: 'Fairness Auditing',
      description: 'Zero bias on protected attributes - disparate impact testing',
    },
    {
      icon: CheckCircle,
      title: 'Dynamic Risk Assessment',
      description: 'LightGBM model analyzing 26 features in real-time',
    },
    {
      icon: FileText,
      title: 'AI Generated Reports',
      description: 'Comprehensive underwriting reports with audit trails',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Hero Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 mb-6"
            >
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Enterprise AI Underwriting</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered Loan{' '}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Underwriting Platform
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Multi-agent AI system that analyzes alternative data, detects fraud, ensures fairness, 
              and provides explainable lending decisions in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/consent">
                <Button size="lg" className="group shadow-lg hover:shadow-xl transition-shadow">
                  Start Assessment
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline" className="shadow-sm">
                  View Admin Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Capabilities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              7 specialized AI agents working in coordination to provide comprehensive underwriting analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <motion.div
                  key={capability.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {capability.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {capability.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Underwriting Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the full AI-powered underwriting process from application to decision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Consent & Application', desc: 'Provide consent and submit loan application' },
              { step: '2', title: 'AI Processing', desc: '7 AI agents analyze your application' },
              { step: '3', title: 'Results & Analysis', desc: 'View risk score, fraud check, fairness audit' },
              { step: '4', title: 'AI Report', desc: 'Download comprehensive underwriting report' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link to="/consent">
              <Button size="lg" className="shadow-lg">
                Begin Underwriting Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
