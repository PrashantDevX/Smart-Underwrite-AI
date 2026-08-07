import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  Shield, 
  FileBarChart, 
  Settings,
  Brain
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/applications', icon: FileText, label: 'Applications' },
    { path: '/admin/risk-analysis', icon: TrendingUp, label: 'Risk Analysis' },
    { path: '/admin/explainability', icon: MessageSquare, label: 'Explainability' },
    { path: '/admin/fraud', icon: Shield, label: 'Fraud Detection' },
    { path: '/admin/analytics', icon: FileBarChart, label: 'Analytics' },
    { path: '/admin/reports', icon: FileBarChart, label: 'Reports' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-2 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-50 to-emerald-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
