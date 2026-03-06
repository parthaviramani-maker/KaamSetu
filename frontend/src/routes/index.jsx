import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLogin } from '../store/authSlice';
import LandingPage from '../pages/LandingPage';
import AuthPage    from '../pages/Auth/AuthPage';

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
  // TODO: Add dashboard, employer, worker, agent pages
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
