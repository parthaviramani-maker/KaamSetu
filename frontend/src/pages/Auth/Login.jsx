import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
<<<<<<< HEAD
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiArrowRight, FiMail as FiMailIcon } from 'react-icons/fi';
import { loginSuccess } from '../../store/authSlice';
import toast from '../../components/Toast/toast';
=======
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { loginSuccess } from '../../store/authSlice';
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442

const stepVariants = {
  enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
};

<<<<<<< HEAD
const TOTAL_STEPS = 3;
=======
const TOTAL_STEPS = 2;
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442

function Login({ onGoSignup }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

<<<<<<< HEAD
  const [step,      setStep]      = useState(1);
  const [dir,        setDir]       = useState(1);
  const [formData,   setFormData]  = useState({ email: '', password: '' });
  const [errors,     setErrors]    = useState({});
  // response state removed — using toast instead
  const [loading,    setLoading]   = useState(false);
  const [showPw,     setShowPw]    = useState(false);
  const [verifyData, setVerifyData]= useState(null); // { sessionId, numbers }
=======
  const [step,     setStep]    = useState(1);
  const [dir,      setDir]     = useState(1);
  const [formData, setFormData]= useState({ email: '', password: '' });
  const [errors,   setErrors]  = useState({});
  const [response, setResponse]= useState(null);
  const [loading,  setLoading] = useState(false);
  const [showPw,   setShowPw]  = useState(false);
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442

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
<<<<<<< HEAD
    setStep(step === 3 ? 2 : 1);
    setErrors({});
    if (step === 3) setVerifyData(null);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`;
=======
    setStep(1);
    setErrors({});
    setResponse(null);
  };

  const handleGoogleLogin = () => {
    // TODO: integrate Google OAuth
    alert('Google OAuth — coming soon!');
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) { setErrors({ password: 'Password is required' }); return; }
    setLoading(true);
<<<<<<< HEAD
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
      // 2FA required — go to step 3
      if (data.data.requiresVerification) {
        setVerifyData({ sessionId: data.data.sessionId, numbers: data.data.numbers });
        setDir(1);
        setStep(3);
        return;
      }

      dispatch(loginSuccess({
        user:  data.data.user,
        token: data.data.token,
        role:  data.data.user.role,
      }));
      navigate('/dashboard', { replace: true });
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
      dispatch(loginSuccess({
        user:  data.data.user,
        token: data.data.token,
        role:  data.data.user.role,
      }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
=======
    setResponse(null);
    try {
      // TODO: call login API
      dispatch(loginSuccess({ user: { email: formData.email }, token: 'stub-token', role: null }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setResponse({ success: false, message: err.message });
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
<<<<<<< HEAD
      {/* Header — always visible, content changes per step */}
      <div className="auth-page__header">
        <h1 className="auth-page__title">
          {step === 3 ? 'Check your email' : 'Welcome back'}
        </h1>
        <p className="auth-page__description">
          {step === 3
            ? 'Tap the number that matches your verification code'
            : 'Sign in to continue to KaamSetu'}
        </p>
      </div>

      {/* Step progress bars — always visible */}
      <div className="auth-page__steps" aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
        {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
=======
      {/* Header */}
      <div className="auth-page__header">
        <h1 className="auth-page__title">Welcome back</h1>
        <p className="auth-page__description">Sign in to continue to KaamSetu</p>
      </div>

      {/* Step progress bars */}
      <div className="auth-page__steps" aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
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
<<<<<<< HEAD
          <motion.button className="btn-google btn-full" onClick={handleGoogleLogin} type="button"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <FcGoogle size={20} />
            Continue with Google
          </motion.button>
=======
          <button className="btn-google btn-full" onClick={handleGoogleLogin} type="button">
            <FcGoogle size={20} />
            Continue with Google
          </button>
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
          <div className="divider"><span>or</span></div>
        </>
      )}

<<<<<<< HEAD
      {/* Back button — step 2 & 3 */}
      {(step === 2 || step === 3) && (
=======
      {/* Back button for step 2 */}
      {step === 2 && (
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
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
<<<<<<< HEAD
              <motion.button type="submit" className="btn-primary btn-full"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
=======
              <motion.button
                type="submit"
                className="btn-primary btn-full"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
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
<<<<<<< HEAD
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

          {/* Step 3: Number verification */}
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
                  <span>{formData.email}</span>
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

=======
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
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442

    </>
  );
}

export default Login;
