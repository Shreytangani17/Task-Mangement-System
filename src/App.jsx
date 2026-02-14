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
import CourierManagement from './pages/CourierManagement';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeTasks from './pages/EmployeeTasks';
import EmployeeSettings from './pages/EmployeeSettings';
import TaskEntry from './pages/TaskEntry';
import TaskAllotment from './pages/TaskAllotment';
import TaskDevelopment from './pages/TaskDevelopment';
import CourierInward from './pages/CourierInward';
import CourierOutward from './pages/CourierOutward';
import Notes from './pages/Notes';
import ClientDocuments from './pages/ClientDocuments';
import ChequePayments from './pages/ChequePayments';
import VisitorEntry from './pages/VisitorEntry';
import EmployeeLeaves from './pages/EmployeeLeaves';
import EmployeeMaster from './pages/EmployeeMaster';

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
            <Route path="/admin/task-entry" element={<PrivateRoute role="admin"><TaskEntry /></PrivateRoute>} />
            <Route path="/admin/task-allotment" element={<PrivateRoute role="admin"><TaskAllotment /></PrivateRoute>} />
            <Route path="/admin/task-development" element={<PrivateRoute role="admin"><TaskDevelopment /></PrivateRoute>} />
            <Route path="/admin/courier-inward" element={<PrivateRoute role="admin"><CourierInward /></PrivateRoute>} />
            <Route path="/admin/courier-outward" element={<PrivateRoute role="admin"><CourierOutward /></PrivateRoute>} />
            <Route path="/admin/notes" element={<PrivateRoute role="admin"><Notes /></PrivateRoute>} />
            <Route path="/admin/client-documents" element={<PrivateRoute role="admin"><ClientDocuments /></PrivateRoute>} />
            <Route path="/admin/cheque-payments" element={<PrivateRoute role="admin"><ChequePayments /></PrivateRoute>} />
            <Route path="/admin/visitor-entry" element={<PrivateRoute role="admin"><VisitorEntry /></PrivateRoute>} />
            <Route path="/admin/employee-leaves" element={<PrivateRoute role="admin"><EmployeeLeaves /></PrivateRoute>} />
            <Route path="/admin/employee-master" element={<PrivateRoute role="admin"><EmployeeMaster /></PrivateRoute>} />
            <Route path="/admin/tasks" element={<PrivateRoute role="admin"><AdminTasks /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute role="admin"><AdminUsers /></PrivateRoute>} />
            <Route path="/admin/reports" element={<PrivateRoute role="admin"><AdminReports /></PrivateRoute>} />
            <Route path="/admin/couriers" element={<PrivateRoute role="admin"><CourierManagement /></PrivateRoute>} />
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
