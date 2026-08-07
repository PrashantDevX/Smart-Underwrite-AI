import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>

          <div className="space-y-6 max-w-4xl">
            {/* Profile Settings */}
            <Card glass>
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="John Doe" defaultValue="John Doe" />
                <Input label="Email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
                <Input label="Phone" placeholder="+1 234 567 8900" defaultValue="+1 234 567 8900" />
                <Input label="Organization" placeholder="Acme Corp" defaultValue="Acme Corp" />
              </div>
              <div className="mt-6">
                <Button>Save Changes</Button>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card glass>
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive email updates for new applications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">High Risk Alerts</p>
                    <p className="text-sm text-gray-600">Get notified for high-risk applications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Fraud Alerts</p>
                    <p className="text-sm text-gray-600">Receive alerts for suspicious activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </Card>

            {/* Security Settings */}
            <Card glass>
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
              </div>
              <div className="space-y-4">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="••••••••" />
                <Input label="Confirm Password" type="password" placeholder="••••••••" />
              </div>
              <div className="mt-6">
                <Button>Update Password</Button>
              </div>
            </Card>

            {/* Theme Settings */}
            <Card glass>
              <div className="flex items-center space-x-3 mb-6">
                <Palette className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Theme Settings</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Theme Mode"
                  defaultValue="light"
                  options={[
                    { value: 'light', label: 'Light Mode' },
                    { value: 'dark', label: 'Dark Mode' },
                    { value: 'auto', label: 'Auto (System)' },
                  ]}
                />
                <Select
                  label="Language"
                  defaultValue="en"
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                  ]}
                />
              </div>
              <div className="mt-6">
                <Button>Save Preferences</Button>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
