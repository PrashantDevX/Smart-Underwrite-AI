import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, MessageSquare, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI Risk Prediction',
      description: 'Predict borrower risk using advanced machine learning algorithms.',
      color: 'blue',
    },
    {
      icon: MessageSquare,
      title: 'Explainable AI',
      description: 'Understand why every decision was made with transparent AI explanations.',
      color: 'emerald',
    },
    {
      icon: Shield,
      title: 'Fraud Detection',
      description: 'Identify suspicious customer behaviour and prevent fraudulent applications.',
      color: 'red',
    },
    {
      icon: Zap,
      title: 'Dynamic Credit Assessment',
      description: 'Continuously update risk scores based on real-time data.',
      color: 'amber',
    },
  ];

  const stats = [
    { value: '95%', label: 'Prediction Accuracy' },
    { value: '50%', label: 'Faster Decisions' },
    { value: '24/7', label: 'AI Monitoring' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-4 rounded-2xl shadow-xl">
                <Brain className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered Dynamic{' '}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Underwriting System
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Make faster, fairer, and explainable lending decisions using artificial intelligence 
              and alternative customer data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/consent">
                <Button size="lg" className="group">
                  Start Risk Assessment
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card glass className="text-center">
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for intelligent loan underwriting
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600',
                emerald: 'bg-emerald-100 text-emerald-600',
                red: 'bg-red-100 text-red-600',
                amber: 'bg-amber-100 text-amber-600',
              };

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                    <div className={`inline-flex p-3 rounded-lg mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose SmartUnderwrite AI?
              </h2>
              <div className="space-y-4">
                {[
                  'Real-time risk assessment using AI',
                  'Transparent and explainable decisions',
                  'Advanced fraud detection algorithms',
                  'Reduced manual review time by 50%',
                  'Improved approval rates for qualified applicants',
                  'Compliance-ready reporting and audit trails',
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card gradient className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to get started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Transform your lending process with AI-powered underwriting.
                </p>
                <Link to="/apply">
                  <Button size="lg" className="w-full">
                    Apply Now
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
