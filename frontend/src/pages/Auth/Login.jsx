import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiArrowRight, FiMail as FiMailIcon } from 'react-icons/fi';
import { loginSuccess } from '../../store/authSlice';
import toast from '../../components/Toast/toast';

const stepVariants = {
  enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
};

const TOTAL_STEPS = 3;

function Login({ onGoSignup }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step,      setStep]      = useState(1);
  const [dir,        setDir]       = useState(1);
  const [formData,   setFormData]  = useState({ email: '', password: '' });
  const [errors,     setErrors]    = useState({});
  // response state removed — using toast instead
  const [loading,    setLoading]   = useState(false);
  const [showPw,     setShowPw]    = useState(false);
  const [verifyData,      setVerifyData]      = useState(null); // { sessionId, numbers, sentTo? }
  const [emailSelectData, setEmailSelectData] = useState(null); // { sessionId, emails: string[] } — admin only

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
    if (step === 3) {
      setStep(2);
      setVerifyData(null);
      setEmailSelectData(null);
    } else {
      setStep(1);
    }
    setErrors({});
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) { setErrors({ password: 'Password is required' }); return; }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrors({ password: data.message || 'Invalid email or password' });
        return;
      }
      // Admin: choose which email to send code to
      if (data.data.requiresEmailSelection) {
        setEmailSelectData({ sessionId: data.data.sessionId, emails: data.data.emails });
        setDir(1);
        setStep(3);
        return;
      }
      // 2FA required — go to step 3
      if (data.data.requiresVerification) {
        setVerifyData({ sessionId: data.data.sessionId, numbers: data.data.numbers });
        setDir(1);
        setStep(3);
        return;
      }

      const userRole = data.data.user.role;
      dispatch(loginSuccess({
        user:  data.data.user,
        token: data.data.token,
        role:  userRole,
      }));
      navigate(`/dashboard/${userRole}`, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmail = async (emailIndex) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/admin-select-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: emailSelectData.sessionId, emailIndex }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || 'Failed to send code');
        return;
      }
      setEmailSelectData(null);
      setVerifyData({ sessionId: data.data.sessionId, numbers: data.data.numbers, sentTo: data.data.sentTo });
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (selectedNumber) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: verifyData.sessionId, selectedNumber }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || 'Verification failed');
        return;
      }
      const userRole = data.data.user.role;
      dispatch(loginSuccess({
        user:  data.data.user,
        token: data.data.token,
        role:  userRole,
      }));
      navigate(`/dashboard/${userRole}`, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header — always visible, content changes per step */}
      <div className="auth-page__header">
        <h1 className="auth-page__title">
          {step === 3 && emailSelectData ? 'Choose verification email'
            : step === 3 ? 'Check your email'
            : 'Welcome back'}
        </h1>
        <p className="auth-page__description">
          {step === 3 && emailSelectData ? 'Select where to send your login code'
            : step === 3 ? 'Tap the number that matches your verification code'
            : 'Sign in to continue to KaamSetu'}
        </p>
      </div>

      {/* Step progress bars — always visible */}
      <div className="auth-page__steps" aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
        {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
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
          <motion.button className="btn-google btn-full" onClick={handleGoogleLogin} type="button"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <FcGoogle size={20} />
            Continue with Google
          </motion.button>
          <div className="divider"><span>or</span></div>
        </>
      )}

      {/* Back button — step 2 & 3 */}
      {(step === 2 || step === 3) && (
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
              <motion.button type="submit" className="btn-primary btn-full"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
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
                <a href={`/auth/forgot-password${formData.email ? `?email=${encodeURIComponent(formData.email)}` : ''}`}>
                  Forgot password?
                </a>
              </div>

              <motion.button type="submit" className="btn-primary btn-full" disabled={loading}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {loading ? 'Sending code…' : 'Sign In'}
              </motion.button>
            </motion.form>
          )}

          {/* Step 3a: Admin email selection */}
          {step === 3 && emailSelectData && (
            <motion.div
              key="s3a"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="login-verify">
                <p className="login-verify__sub" style={{ marginBottom: '1rem' }}>
                  A verification code will be sent to the email you select.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {emailSelectData.emails.map((email, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectEmail(idx)}
                      disabled={loading}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '0.75rem 1rem', borderRadius: '10px',
                        border: '1.5px solid var(--color-accent)',
                        background: 'var(--bg-hover)', color: 'var(--text-primary)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem', fontFamily: 'inherit', fontWeight: 500,
                        opacity: loading ? 0.6 : 1, textAlign: 'left',
                      }}
                    >
                      <FiMailIcon size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                      {email}
                    </button>
                  ))}
                </div>
                {loading && <p className="login-verify__loading">Sending code…</p>}
              </div>
            </motion.div>
          )}

          {/* Step 3b: Number verification */}
          {step === 3 && verifyData && (
            <motion.div
              key="s3"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="login-verify">
                {/* Email badge */}
                <div className="login-verify__email-badge">
                  <FiMailIcon size={15} />
                  <span>{verifyData.sentTo || formData.email}</span>
                </div>

                <p className="login-verify__sub">
                  We sent a number to this address. Select the matching one below.
                </p>

                <div className="login-verify__numbers">
                  {verifyData.numbers.map((num) => (
                    <button
                      key={num}
                      type="button"
                      className="login-verify__num-btn"
                      onClick={() => handleVerify(num)}
                      disabled={loading}
                    >
                      <span className="login-verify__num-val">{num}</span>
                    </button>
                  ))}
                </div>

                {loading && (
                  <p className="login-verify__loading">Verifying…</p>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer — hidden on verification step */}
      {step !== 3 && (
        <div className="auth-page__footer">
          Don&apos;t have an account?{' '}
          <button className="btn-link" onClick={onGoSignup} type="button">
            Sign up free
          </button>
        </div>
      )}


    </>
  );
}

export default Login;
