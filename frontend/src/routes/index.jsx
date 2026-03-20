import { createBrowserRouter, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import NotFound from '../pages/NotFound';
import { useSelector } from 'react-redux';
import { selectIsLogin, selectRole } from '../store/authSlice';
import LandingPage        from '../pages/LandingPage';
import AuthPage           from '../pages/Auth/AuthPage';
import AuthCallback       from '../pages/Auth/AuthCallback';
import Onboarding         from '../pages/Auth/Onboarding';
import ForgotPassword     from '../pages/Auth/ForgotPassword';
import ResetPassword      from '../pages/Auth/ResetPassword';
import DemoLayout         from '../pages/Demo/DemoLayout';
// ── Real Dashboard (step-by-step build) ───────────────────────────────────────
import RealDashboard      from '../pages/Dashboard/RealDashboard';
=======
import { useSelector } from 'react-redux';
import { selectIsLogin, selectRole } from '../store/authSlice';
import LandingPage from '../pages/LandingPage';
import AuthPage           from '../pages/Auth/AuthPage';
import DashboardLayout    from '../pages/Dashboard/DashboardLayout';
// Employer
import EmployerOverview   from '../pages/Dashboard/employer/EmployerOverview';
import PostJob            from '../pages/Dashboard/employer/PostJob';
import MyJobs             from '../pages/Dashboard/employer/MyJobs';
import Applicants         from '../pages/Dashboard/employer/Applicants';
import Payments           from '../pages/Dashboard/employer/Payments';
// Worker
import WorkerOverview     from '../pages/Dashboard/worker/WorkerOverview';
import FindJobs           from '../pages/Dashboard/worker/FindJobs';
import MyApplications     from '../pages/Dashboard/worker/MyApplications';
import Earnings           from '../pages/Dashboard/worker/Earnings';
// Agent
import AgentOverview      from '../pages/Dashboard/agent/AgentOverview';
import ManageWorkers      from '../pages/Dashboard/agent/ManageWorkers';
import Placements         from '../pages/Dashboard/agent/Placements';
import Commission         from '../pages/Dashboard/agent/Commission';
import Area               from '../pages/Dashboard/agent/Area';
// Admin
import AdminOverview      from '../pages/Dashboard/admin/AdminOverview';
import AllUsers           from '../pages/Dashboard/admin/AllUsers';
import AllJobs            from '../pages/Dashboard/admin/AllJobs';
import AllAgents          from '../pages/Dashboard/admin/AllAgents';
import Reports            from '../pages/Dashboard/admin/Reports';
import Settings           from '../pages/Dashboard/admin/Settings';
// Profile
import ProfilePage        from '../pages/Dashboard/profile/ProfilePage';
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442

function PrivateRoute({ children }) {
  const isLogin = useSelector(selectIsLogin);
  return isLogin ? children : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }) {
  const isLogin = useSelector(selectIsLogin);
  return !isLogin ? children : <Navigate to="/dashboard" replace />;
}

<<<<<<< HEAD
=======
function RoleRedirect() {
  const role = useSelector(selectRole);
  const map = {
    employer: '/dashboard/employer',
    worker:   '/dashboard/worker',
    agent:    '/dashboard/agent',
    admin:    '/dashboard/admin',
  };
  return <Navigate to={map[role] || '/auth'} replace />;
}

>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/auth',
    element: <PublicRoute><AuthPage /></PublicRoute>,
  },
  {
<<<<<<< HEAD
    // Google OAuth callback — must be public (not wrapped in PublicRoute)
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    // First-time Google users — set role + optional password (must be logged in)
    path: '/auth/onboarding',
    element: <PrivateRoute><Onboarding /></PrivateRoute>,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/auth/reset-password',
    element: <ResetPassword />,
  },
  {
    // ── Real Dashboard (step-by-step) ─────────────────────────────────────────
    path: '/dashboard',
    element: <PrivateRoute><RealDashboard /></PrivateRoute>,
  },
  // ── Demo routes (public, no auth) ─────────────────────────────────────────
  {
    path: '/demo',
    element: <Navigate to="/demo/employer" replace />,
  },
  {
    path: '/demo/:role',
    element: <DemoLayout />,
  },
  {
    path: '*',
    element: <NotFound />,
=======
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { index: true, element: <RoleRedirect /> },
      // Employer
      { path: 'employer',            element: <EmployerOverview /> },
      { path: 'employer/post-job',   element: <PostJob /> },
      { path: 'employer/my-jobs',    element: <MyJobs /> },
      { path: 'employer/applicants', element: <Applicants /> },
      { path: 'employer/payments',   element: <Payments /> },
      // Worker
      { path: 'worker',              element: <WorkerOverview /> },
      { path: 'worker/find-jobs',    element: <FindJobs /> },
      { path: 'worker/applications', element: <MyApplications /> },
      { path: 'worker/earnings',     element: <Earnings /> },
      // Agent
      { path: 'agent',               element: <AgentOverview /> },
      { path: 'agent/workers',       element: <ManageWorkers /> },
      { path: 'agent/placements',    element: <Placements /> },
      { path: 'agent/commission',    element: <Commission /> },
      { path: 'agent/area',          element: <Area /> },
      // Admin
      { path: 'admin',               element: <AdminOverview /> },
      { path: 'admin/users',         element: <AllUsers /> },
      { path: 'admin/jobs',          element: <AllJobs /> },
      { path: 'admin/agents',        element: <AllAgents /> },
      { path: 'admin/reports',       element: <Reports /> },
      { path: 'admin/settings',      element: <Settings /> },
      // Profile (shared)
      { path: 'profile',             element: <ProfilePage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
  },
]);

export default router;
