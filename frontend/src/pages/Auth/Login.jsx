import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { loginSuccess } from '../../store/authSlice';

const stepVariants = {
  enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
};

const TOTAL_STEPS = 2;

function Login({ onGoSignup }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step,     setStep]    = useState(1);
  const [dir,      setDir]     = useState(1);
  const [formData, setFormData]= useState({ email: '', password: '' });
  const [errors,   setErrors]  = useState({});
  const [response, setResponse]= useState(null);
  const [loading,  setLoading] = useState(false);
  const [showPw,   setShowPw]  = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateEmail = () => {
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) return 'Enter a valid email';
    return null;
  };

  const goNext = (e) => {
    e.preventDefault();
    const err = validateEmail();
    if (err) { setErrors({ email: err }); return; }
    setErrors({});
    setDir(1);
    setStep(2);
  };

  const goBack = () => {
    setDir(-1);
    setStep(1);
    setErrors({});
    setResponse(null);
  };

  const handleGoogleLogin = () => {
    // TODO: integrate Google OAuth
    alert('Google OAuth — coming soon!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) { setErrors({ password: 'Password is required' }); return; }
    setLoading(true);
    setResponse(null);
    try {
      // TODO: call login API
      dispatch(loginSuccess({ user: { email: formData.email }, token: 'stub-token', role: null }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setResponse({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="auth-page__header">
        <h1 className="auth-page__title">Welcome back</h1>
        <p className="auth-page__description">Sign in to continue to KaamSetu</p>
      </div>

      {/* Step progress bars */}
      <div className="auth-page__steps" aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={
              'auth-page__step-dot' +
              (step === i + 1 ? ' auth-page__step-dot--active' : '') +
              (step > i + 1   ? ' auth-page__step-dot--done'   : '')
            }
          />
        ))}
      </div>

      {/* Google — only on step 1 */}
      {step === 1 && (
        <>
          <button className="btn-google btn-full" onClick={handleGoogleLogin} type="button">
            <FcGoogle size={20} />
            Continue with Google
          </button>
          <div className="divider"><span>or</span></div>
        </>
      )}

      {/* Back button for step 2 */}
      {step === 2 && (
        <div className="auth-page__nav-row">
          <button type="button" onClick={goBack}>
            <FiArrowLeft size={16} /> Back
          </button>
        </div>
      )}

      <div className="auth-page__single-field">
        <AnimatePresence mode="wait" custom={dir}>

          {/* Step 1: Email */}
          {step === 1 && (
            <motion.form
              key="s1"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onSubmit={goNext}
              noValidate
            >
              <div className={`form-group${errors.email ? ' form-group--error' : ''}`}>
                <label htmlFor="login-email"><FiMail size={14} /> Email</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <motion.button
                type="submit"
                className="btn-primary btn-full"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue <FiArrowRight size={15} />
              </motion.button>
            </motion.form>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <motion.form
              key="s2"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className={`form-group${errors.password ? ' form-group--error' : ''}`}>
                <label htmlFor="login-password"><FiLock size={14} /> Password</label>
                <div className="auth-page__pw-wrap">
                  <input
                    type={showPw ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="auth-page__pw-wrap-eye"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPw ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="auth-page__forgot">
                <a href="#">Forgot password?</a>
              </div>

              <motion.button
                type="submit"
                className="btn-primary btn-full"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </motion.button>

              {response && (
                <motion.div
                  className={`alert alert--${response.success ? 'success' : 'error'}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: '1rem' }}
                >
                  <strong>{response.success ? '✓ Success' : '✗ Error'}</strong>
                  <p>{response.message}</p>
                </motion.div>
              )}
            </motion.form>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="auth-page__footer">
        Don&apos;t have an account?{' '}
        <button className="btn-link" onClick={onGoSignup} type="button">
          Sign up free
        </button>
      </div>

    </>
  );
}

export default Login;
