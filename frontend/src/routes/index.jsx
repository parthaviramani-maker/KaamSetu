import { createBrowserRouter, Navigate } from 'react-router-dom';
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

function PrivateRoute({ children }) {
  const isLogin = useSelector(selectIsLogin);
  return isLogin ? children : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }) {
  const isLogin = useSelector(selectIsLogin);
  return !isLogin ? children : <Navigate to="/dashboard" replace />;
}

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
  },
]);

export default router;
