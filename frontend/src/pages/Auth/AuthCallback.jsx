import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../store/authSlice';

/**
 * /auth/callback
 * Backend redirects here after Google OAuth with ?token=...&role=...
 * (or ?error=... on failure)
 */
function AuthCallback() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');
    const role   = params.get('role');
    const error  = params.get('error');

    if (error || !token) {
      const messages = {
        no_code:              'Google sign-in was cancelled.',
        token_exchange_failed:'Could not connect to Google. Please try again.',
        profile_fetch_failed: 'Could not retrieve your Google profile.',
        account_deactivated:  'Your account has been deactivated.',
        google_failed:        'Google sign-in failed. Please try again.',
      };
      setErrMsg(messages[error] || 'Something went wrong. Please try again.');
      return;
    }

    // Decode user info from JWT payload (no library needed — just parse base64)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      dispatch(
        loginSuccess({
          user: {
            id:     payload.id,
            name:   payload.name,
            email:  payload.email,
            role:   payload.role,
            avatar: payload.avatar || null,
          },
          token,
          role: role || payload.role,
        })
      );
      // If first-time Google user, send to onboarding
      const isNew = params.get('isNewUser') === 'true';
      const resolvedRole = role || payload.role;
      navigate(isNew ? '/auth/onboarding' : `/dashboard/${resolvedRole}`, { replace: true });
    } catch {
      setErrMsg('Invalid token received. Please sign in again.');
    }
  }, [dispatch, navigate]);

  if (errMsg) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem' }}>
        <p style={{ color: 'var(--color-danger, #e74c3c)', fontSize: '1rem' }}>
          ✗ {errMsg}
        </p>
        <button
          onClick={() => navigate('/auth', { replace: true })}
          style={{ padding: '0.5rem 1.5rem', cursor: 'pointer' }}
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ fontSize: '1rem', opacity: 0.7 }}>Signing you in…</p>
    </div>
  );
}

export default AuthCallback;
