import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import ConsentPage from './pages/consent/ConsentPage';
import LoanApplicationPage from './pages/LoanApplicationPage';
import RiskDashboardPage from './pages/RiskDashboardPage';
import ExplainabilityPage from './pages/ExplainabilityPage';
import FraudDetectionPage from './pages/FraudDetectionPage';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/apply" element={<LoanApplicationPage />} />
            <Route path="/risk-dashboard" element={<RiskDashboardPage />} />
            <Route path="/explainability" element={<ExplainabilityPage />} />
            <Route path="/fraud-detection" element={<FraudDetectionPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<AdminDashboard />} />
            <Route path="/admin/risk-analysis" element={<RiskDashboardPage />} />
            <Route path="/admin/explainability" element={<ExplainabilityPage />} />
            <Route path="/admin/fraud" element={<FraudDetectionPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
