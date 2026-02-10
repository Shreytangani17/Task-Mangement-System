import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AdminTasks from './pages/AdminTasks';
import AdminUsers from './pages/AdminUsers';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeTasks from './pages/EmployeeTasks';
import EmployeeSettings from './pages/EmployeeSettings';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/employee'} />;
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/tasks" element={<PrivateRoute role="admin"><AdminTasks /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute role="admin"><AdminUsers /></PrivateRoute>} />
            <Route path="/admin/reports" element={<PrivateRoute role="admin"><AdminReports /></PrivateRoute>} />
            <Route path="/admin/settings" element={<PrivateRoute role="admin"><AdminSettings /></PrivateRoute>} />
            
            <Route path="/employee" element={<PrivateRoute role="employee"><EmployeeDashboard /></PrivateRoute>} />
            <Route path="/employee/tasks" element={<PrivateRoute role="employee"><EmployeeTasks /></PrivateRoute>} />
            <Route path="/employee/settings" element={<PrivateRoute role="employee"><EmployeeSettings /></PrivateRoute>} />
            
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
