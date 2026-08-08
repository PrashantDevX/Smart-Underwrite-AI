import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Main User Journey Pages
import LandingPage from './pages/LandingPage';
import ConsentPage from './pages/consent/ConsentPage';
import LoanApplicationPage from './pages/LoanApplicationPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';
import ExplainabilityPage from './pages/ExplainabilityPage';
import FraudDetectionPage from './pages/FraudDetectionPage';
import FairnessPage from './pages/FairnessPage';
import ReportPage from './pages/ReportPage';

// Secondary Pages
import HistoryPage from './pages/HistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Main Underwriting Journey */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/apply" element={<LoanApplicationPage />} />
            <Route path="/processing" element={<ProcessingPage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
            <Route path="/explainability/:id" element={<ExplainabilityPage />} />
            <Route path="/fraud/:id" element={<FraudDetectionPage />} />
            <Route path="/fairness/:id" element={<FairnessPage />} />
            <Route path="/report/:id" element={<ReportPage />} />
            
            {/* Secondary Pages */}
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
