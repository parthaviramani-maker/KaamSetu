import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLogin, selectRole } from '../store/authSlice';

// ── Public pages ──────────────────────────────────────────────────────────────
import NotFound       from '../pages/NotFound';
import LandingPage    from '../pages/LandingPage';
import DemoLayout     from '../pages/Demo/DemoLayout';

// ── Auth pages ────────────────────────────────────────────────────────────────
import AuthPage       from '../pages/Auth/AuthPage';
import AuthCallback   from '../pages/Auth/AuthCallback';
import Onboarding     from '../pages/Auth/Onboarding';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword  from '../pages/Auth/ResetPassword';

// ── Dashboard layout ─────────────────────────────────────────────────────────
import DashboardLayout from '../pages/Dashboard/DashboardLayout';

// ── Employer pages ────────────────────────────────────────────────────────────
import EmployerOverview from '../pages/Dashboard/employer/EmployerOverview';
import PostJob          from '../pages/Dashboard/employer/PostJob';
import MyJobs           from '../pages/Dashboard/employer/MyJobs';
import Applicants       from '../pages/Dashboard/employer/Applicants';
import Payments         from '../pages/Dashboard/employer/Payments';

// ── Worker pages ──────────────────────────────────────────────────────────────
import WorkerOverview   from '../pages/Dashboard/worker/WorkerOverview';
import FindJobs         from '../pages/Dashboard/worker/FindJobs';
import MyApplications   from '../pages/Dashboard/worker/MyApplications';
import Earnings         from '../pages/Dashboard/worker/Earnings';

// ── Agent pages ───────────────────────────────────────────────────────────────
import AgentOverview  from '../pages/Dashboard/agent/AgentOverview';
import ManageWorkers  from '../pages/Dashboard/agent/ManageWorkers';
import Placements     from '../pages/Dashboard/agent/Placements';
import Commission     from '../pages/Dashboard/agent/Commission';
import Area           from '../pages/Dashboard/agent/Area';

// ── Admin pages ───────────────────────────────────────────────────────────────
import AdminOverview from '../pages/Dashboard/admin/AdminOverview';
import AllUsers      from '../pages/Dashboard/admin/AllUsers';
import AllJobs       from '../pages/Dashboard/admin/AllJobs';
import AllAgents     from '../pages/Dashboard/admin/AllAgents';
import Reports       from '../pages/Dashboard/admin/Reports';
import Settings      from '../pages/Dashboard/admin/Settings';

// ── Profile ───────────────────────────────────────────────────────────────────
import ProfilePage from '../pages/Dashboard/profile/ProfilePage';

// ── Route guards ─────────────────────────────────────────────────────────────
function PrivateRoute({ children }) {
  const isLogin = useSelector(selectIsLogin);
  return isLogin ? children : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }) {
  const isLogin = useSelector(selectIsLogin);
  return !isLogin ? children : <Navigate to="/dashboard" replace />;
}

// Redirects to correct role dashboard if user tries to access a different role's page
function RoleRoute({ allowedRole, children }) {
  const role = useSelector(selectRole);
  if (role === allowedRole) return children;
  const validRoles = ['employer', 'worker', 'agent', 'admin'];
  const target = validRoles.includes(role) ? `/dashboard/${role}` : '/dashboard/worker';
  return <Navigate to={target} replace />;
}

function DashboardRedirect() {
  const role = useSelector(selectRole);
  const validRoles = ['employer', 'worker', 'agent', 'admin'];
  const target = validRoles.includes(role) ? `/dashboard/${role}` : '/dashboard/worker';
  return <Navigate to={target} replace />;
}

const router = createBrowserRouter([
  // ── Landing ─────────────────────────────────────────────────────────────────
  {
    path: '/',
    element: <LandingPage />,
  },

  // ── Auth ────────────────────────────────────────────────────────────────────
  {
    path: '/auth',
    element: <PublicRoute><AuthPage /></PublicRoute>,
  },
  {
    path: '/auth/callback',   // Google OAuth callback — must be public
    element: <AuthCallback />,
  },
  {
    path: '/auth/onboarding', // First-time Google users
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

  // ── Dashboard (real — nested under DashboardLayout) ─────────────────────────
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      // Index — redirect to role-based dashboard
      { index: true, element: <DashboardRedirect /> },

      // Employer
      { path: 'employer',             element: <RoleRoute allowedRole="employer"><EmployerOverview /></RoleRoute> },
      { path: 'employer/post-job',    element: <RoleRoute allowedRole="employer"><PostJob /></RoleRoute> },
      { path: 'employer/my-jobs',     element: <RoleRoute allowedRole="employer"><MyJobs /></RoleRoute> },
      { path: 'employer/applicants',  element: <RoleRoute allowedRole="employer"><Applicants /></RoleRoute> },
      { path: 'employer/payments',    element: <RoleRoute allowedRole="employer"><Payments /></RoleRoute> },

      // Worker
      { path: 'worker',               element: <RoleRoute allowedRole="worker"><WorkerOverview /></RoleRoute> },
      { path: 'worker/find-jobs',     element: <RoleRoute allowedRole="worker"><FindJobs /></RoleRoute> },
      { path: 'worker/applications',  element: <RoleRoute allowedRole="worker"><MyApplications /></RoleRoute> },
      { path: 'worker/earnings',      element: <RoleRoute allowedRole="worker"><Earnings /></RoleRoute> },

      // Agent
      { path: 'agent',                element: <RoleRoute allowedRole="agent"><AgentOverview /></RoleRoute> },
      { path: 'agent/workers',        element: <RoleRoute allowedRole="agent"><ManageWorkers /></RoleRoute> },
      { path: 'agent/placements',     element: <RoleRoute allowedRole="agent"><Placements /></RoleRoute> },
      { path: 'agent/commission',     element: <RoleRoute allowedRole="agent"><Commission /></RoleRoute> },
      { path: 'agent/area',           element: <RoleRoute allowedRole="agent"><Area /></RoleRoute> },

      // Admin
      { path: 'admin',                element: <RoleRoute allowedRole="admin"><AdminOverview /></RoleRoute> },
      { path: 'admin/users',          element: <RoleRoute allowedRole="admin"><AllUsers /></RoleRoute> },
      { path: 'admin/jobs',           element: <RoleRoute allowedRole="admin"><AllJobs /></RoleRoute> },
      { path: 'admin/agents',         element: <RoleRoute allowedRole="admin"><AllAgents /></RoleRoute> },
      { path: 'admin/reports',        element: <RoleRoute allowedRole="admin"><Reports /></RoleRoute> },
      { path: 'admin/settings',       element: <RoleRoute allowedRole="admin"><Settings /></RoleRoute> },

      // Profile (shared across all roles)
      { path: 'profile',              element: <ProfilePage /> },
    ],
  },

  // ── Demo routes (public, no auth — leave untouched) ─────────────────────────
  {
    path: '/demo',
    element: <Navigate to="/demo/employer" replace />,
  },
  {
    path: '/demo/:role',
    element: <DemoLayout />,
  },

  // ── 404 ─────────────────────────────────────────────────────────────────────
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
