import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { selectIsDark } from '../../store/themeSlice';
import slide1 from '../../assets/illustrations/slide1.webp';
import slide2 from '../../assets/illustrations/slide2.webp';
import slide3 from '../../assets/illustrations/slide3.webp';
import slide4 from '../../assets/illustrations/slide4.webp';
import './Auth.scss';

const SLIDES   = [slide1, slide2, slide3, slide4];
const INTERVAL = 3800;

const imgVariants = {
  enter:  { opacity: 0, scale: 1.06 },
  center: { opacity: 1, scale: 1,    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
  exit:   { opacity: 0, scale: 0.97, transition: { duration: 0.4 } },
};

function ResetPassword() {
  const navigate = useNavigate();
  const isDark   = useSelector(selectIsDark);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(t);
  }, []);

  const [password,   setPassword]  = useState('');
  const [confirm,    setConfirm]   = useState('');
  const [showPw,     setShowPw]    = useState(false);
  const [loading,    setLoading]   = useState(false);
  const [success,    setSuccess]   = useState(false);
  const [errors,     setErrors]    = useState({});
  const [apiError,   setApiError]  = useState('');

  if (!token) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', gap:'1rem' }}>
        <p style={{ color:'var(--color-danger,#e74c3c)' }}>✗ Invalid reset link. Please request a new one.</p>
        <Link to="/auth/forgot-password" className="btn-primary" style={{ textDecoration:'none', padding:'0.5rem 1.5rem', borderRadius:'8px' }}>
          Request Reset Link
        </Link>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!password)          errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Minimum 6 characters';
    if (password !== confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/auth', { replace: true }), 2500);
      } else {
        setApiError(data.message || 'Reset failed. Link may have expired.');
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left — image slideshow */}
      <div className="auth-page__brand">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={SLIDES[current]}
            alt="KaamSetu"
            className="auth-page__brand-img"
            variants={imgVariants}
            initial="enter"
            animate="center"
            exit="exit"
          />
        </AnimatePresence>
      </div>

      {/* Right form panel */}
      <div className="auth-page__scroll">
        <div className="auth-page__panel-logo">
          <Link to="/">
            <img src={isDark ? '/logo-dark.png' : '/logo-light.png'} alt="KaamSetu" />
          </Link>
        </div>

        <div className="auth-page__card">
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="auth-page__header">
                <h1 className="auth-page__title">Password reset!</h1>
                <p className="auth-page__description">
                  Your password has been updated. Redirecting you to sign in…
                </p>
              </div>
              <div className="auth-page__footer">
                <Link
                  to="/auth"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                           color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}
                >
                  <FiArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="auth-page__header">
                <h1 className="auth-page__title">New Password</h1>
                <p className="auth-page__description">Enter and confirm your new password</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* New password */}
                <div className={`form-group${errors.password ? ' form-group--error' : ''}`}>
                  <label htmlFor="rp-pw"><FiLock size={14} /> New Password</label>
                  <div className="auth-page__pw-wrap">
                    <input
                      type={showPw ? 'text' : 'password'}
                      id="rp-pw"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                      placeholder="Min 6 characters"
                      autoComplete="new-password"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="auth-page__pw-wrap-eye"
                      onClick={() => setShowPw((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPw ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                    </button>
                  </div>
                  {errors.password && <span className="form-error">{errors.password}</span>}
                </div>

                {/* Confirm password */}
                <div className={`form-group${errors.confirm ? ' form-group--error' : ''}`} style={{ marginTop:'0.75rem' }}>
                  <label htmlFor="rp-confirm"><FiLock size={14} /> Confirm Password</label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    id="rp-confirm"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setErrors({}); }}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                  />
                  {errors.confirm && <span className="form-error">{errors.confirm}</span>}
                </div>

                {apiError && (
                  <div className="alert alert--error" style={{ marginTop:'0.8rem' }}>
                    <strong>✗ Error</strong>
                    <p>{apiError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary btn-full"
                  disabled={loading}
                  style={{ marginTop:'1rem' }}
                >
                  {loading ? 'Saving…' : <><FiCheck size={15} /> Reset Password</>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
