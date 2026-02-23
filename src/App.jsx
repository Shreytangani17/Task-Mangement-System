import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, lazy, Suspense } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Eagerly load Login/Signup — they are the entry point, must be instant
import Login from './pages/Login';
import Signup from './pages/Signup';

// Lazy load all other pages — loaded only when navigated to
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminTasks = lazy(() => import('./pages/AdminTasks'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminReports = lazy(() => import('./pages/AdminReports'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const CourierManagement = lazy(() => import('./pages/CourierManagement'));
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));
const EmployeeTasks = lazy(() => import('./pages/EmployeeTasks'));
const EmployeeSettings = lazy(() => import('./pages/EmployeeSettings'));
const TaskEntry = lazy(() => import('./pages/TaskEntry'));
const TaskAllotment = lazy(() => import('./pages/TaskAllotment'));
const TaskDevelopment = lazy(() => import('./pages/TaskDevelopment'));
const DailyTaskEntry = lazy(() => import('./pages/DailyTaskEntry'));
const CourierInward = lazy(() => import('./pages/CourierInward'));
const CourierOutward = lazy(() => import('./pages/CourierOutward'));
const Notes = lazy(() => import('./pages/Notes'));
const ClientDocuments = lazy(() => import('./pages/ClientDocuments'));
const ChequePayments = lazy(() => import('./pages/ChequePayments'));
const VisitorEntry = lazy(() => import('./pages/VisitorEntry'));
const EmployeeLeaves = lazy(() => import('./pages/EmployeeLeaves'));
const EmployeeMaster = lazy(() => import('./pages/EmployeeMaster'));

// Full-screen loading spinner shown while a lazy page chunk is being fetched
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/employee'} />;

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/task-entry" element={<PrivateRoute role="admin"><TaskEntry /></PrivateRoute>} />
              <Route path="/admin/task-allotment" element={<PrivateRoute role="admin"><TaskAllotment /></PrivateRoute>} />
              <Route path="/admin/courier-inward" element={<PrivateRoute role="admin"><CourierInward /></PrivateRoute>} />
              <Route path="/admin/courier-outward" element={<PrivateRoute role="admin"><CourierOutward /></PrivateRoute>} />
              <Route path="/admin/notes" element={<PrivateRoute role="admin"><Notes /></PrivateRoute>} />
              <Route path="/admin/client-documents" element={<PrivateRoute role="admin"><ClientDocuments /></PrivateRoute>} />
              <Route path="/admin/cheque-payments" element={<PrivateRoute role="admin"><ChequePayments /></PrivateRoute>} />
              <Route path="/admin/employee-master" element={<PrivateRoute role="admin"><EmployeeMaster /></PrivateRoute>} />
              <Route path="/admin/tasks" element={<PrivateRoute role="admin"><AdminTasks /></PrivateRoute>} />
              <Route path="/admin/users" element={<PrivateRoute role="admin"><AdminUsers /></PrivateRoute>} />
              <Route path="/admin/reports" element={<PrivateRoute role="admin"><AdminReports /></PrivateRoute>} />
              <Route path="/admin/couriers" element={<PrivateRoute role="admin"><CourierManagement /></PrivateRoute>} />
              <Route path="/admin/settings" element={<PrivateRoute role="admin"><AdminSettings /></PrivateRoute>} />

              <Route path="/employee" element={<PrivateRoute role="employee"><EmployeeDashboard /></PrivateRoute>} />
              <Route path="/employee/tasks" element={<PrivateRoute role="employee"><EmployeeTasks /></PrivateRoute>} />
              <Route path="/employee/daily-task-entry" element={<PrivateRoute role="employee"><DailyTaskEntry /></PrivateRoute>} />
              <Route path="/employee/settings" element={<PrivateRoute role="employee"><EmployeeSettings /></PrivateRoute>} />

              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
