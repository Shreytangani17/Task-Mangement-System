import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LayoutDashboard, ListTodo, Users, BarChart3, LogOut, CheckSquare, Moon, Sun, Settings, Package, FileText, UserCheck, Wrench, PackageOpen, PackageCheck, StickyNote, FolderOpen, CreditCard, UserPlus, Calendar, UserCog, Menu, X } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/task-entry', icon: FileText, label: 'Task Entry' },
    { path: '/admin/task-allotment', icon: UserCheck, label: 'Task Allotment' },
    { path: '/admin/courier-inward', icon: PackageOpen, label: 'Courier Inward' },
    { path: '/admin/courier-outward', icon: PackageCheck, label: 'Courier Outward' },
    { path: '/admin/notes', icon: StickyNote, label: 'Notes' },
    { path: '/admin/reports', icon: FolderOpen, label: 'Reports' },
    { path: '/admin/cheque-payments', icon: CreditCard, label: 'Cheque Payments' },
    { path: '/admin/employee-master', icon: UserCog, label: 'Employee Master' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  const employeeLinks = [
    { path: '/employee', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/employee/tasks', icon: CheckSquare, label: 'My Tasks' },
    { path: '/employee/daily-task-entry', icon: Calendar, label: 'Daily Task Entry' },
    { path: '/employee/settings', icon: Settings, label: 'Settings' }
  ];

  const links = user?.role === 'admin' ? adminLinks : employeeLinks;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 w-64 min-h-screen p-4 flex flex-col
        fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="mb-6 p-3 mt-12 lg:mt-0">
          <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">TaskFlow</h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{user?.role === 'admin' ? 'Admin Panel' : 'Employee Panel'}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive 
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{link.label}</span>
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
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user?.name}</p>
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
    </>
  );
};

export default Sidebar;
