// =============================================================================
// KAAMSETU — ROUTE GUARDS
// Import from here in routes/index.jsx
// =============================================================================

import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectIsLogin, selectRole } from '../store/authSlice';

// Valid roles & their dashboard paths
const VALID_ROLES = ['employer', 'worker', 'agent', 'admin'];

const getRoleDashboard = (role) =>
    VALID_ROLES.includes(role) ? `/dashboard/${role}` : '/dashboard/worker';

// ── PrivateRoute ─────────────────────────────────────────────────────────────
// Only logged-in users can access. Others → /auth
export function PrivateRoute({ children }) {
    const isLogin = useAppSelector(selectIsLogin);
    return isLogin ? children : <Navigate to="/auth" replace />;
}

// ── PublicRoute ──────────────────────────────────────────────────────────────
// Only guests can access (login/register). Logged-in → /dashboard
export function PublicRoute({ children }) {
    const isLogin = useAppSelector(selectIsLogin);
    return !isLogin ? children : <Navigate to="/dashboard" replace />;
}

// ── RoleRoute ────────────────────────────────────────────────────────────────
// Restricts page to a specific role. Wrong role → their own dashboard
export function RoleRoute({ allowedRole, children }) {
    const role = useAppSelector(selectRole);
    if (role === allowedRole) return children;
    return <Navigate to={getRoleDashboard(role)} replace />;
}

// ── DashboardRedirect ────────────────────────────────────────────────────────
// /dashboard → /dashboard/:role (auto-redirect based on role)
export function DashboardRedirect() {
    const role = useAppSelector(selectRole);
    return <Navigate to={getRoleDashboard(role)} replace />;
}
