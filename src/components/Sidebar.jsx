import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LayoutDashboard, ListTodo, Users, BarChart3, LogOut, CheckSquare, Moon, Sun, Settings } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/tasks', icon: ListTodo, label: 'Tasks' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  const employeeLinks = [
    { path: '/employee', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/employee/tasks', icon: CheckSquare, label: 'My Tasks' },
    { path: '/employee/settings', icon: Settings, label: 'Settings' }
  ];

  const links = user?.role === 'admin' ? adminLinks : employeeLinks;

  return (
    <div className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 min-h-screen p-4 flex flex-col">
      <div className="mb-6 p-3">
        <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">TaskFlow</h1>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{user?.role === 'admin' ? 'Admin Panel' : 'Employee Panel'}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive 
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 space-y-2">
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition w-full"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        
        <div className="px-3 py-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Logged in as</p>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.name}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 transition w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
