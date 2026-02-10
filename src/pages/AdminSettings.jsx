import { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { Settings, Moon, Sun, User, Bell } from 'lucide-react';

const AdminSettings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Settings</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your preferences</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {theme === 'light' ? <Sun className="w-5 h-5 text-purple-600" /> : <Moon className="w-5 h-5 text-purple-400" />}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Theme</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Current: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition"
                >
                  Switch to {theme === 'light' ? 'Dark' : 'Light'}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Profile Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Role:</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">{user?.role}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Email notifications enabled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
