import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { loginSuccess } from '../../store/authSlice';

const stepVariants = {
  enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
};

const TOTAL_STEPS = 4;

function Signup({ onGoLogin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step,     setStep]    = useState(1);
  const [dir,      setDir]     = useState(1);
  const [formData, setFormData]= useState({ full_name: '', email: '', password: '', phone: '' });
  const [errors,   setErrors]  = useState({});
  const [response, setResponse]= useState(null);
  const [loading,  setLoading] = useState(false);
  const [showPw,   setShowPw]  = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = (field) => {
    if (field === 'full_name') {
      if (!formData.full_name.trim()) return 'Full name is required';
      if (formData.full_name.trim().length < 2) return 'At least 2 characters required';
    }
    if (field === 'email') {
      if (!formData.email.trim()) return 'Email is required';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) return 'Enter a valid email';
    }
    if (field === 'password') {
      if (!formData.password.trim()) return 'Password is required';
      if (formData.password.length < 6) return 'Minimum 6 characters';
    }
    return null;
  };

  const goNext = (e, field) => {
    e.preventDefault();
    const err = validate(field);
    if (err) { setErrors({ [field]: err }); return; }
    setErrors({});
    setDir(1);
    setStep(s => s + 1);
  };

  const goBack = () => {
    setDir(-1);
    setStep(s => s - 1);
    setErrors({});
  };

  const handleGoogleSignup = () => {
    // TODO: integrate Google OAuth
    alert('Google OAuth — coming soon!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      // TODO: call register API
      dispatch(loginSuccess({ user: { email: formData.email, name: formData.full_name }, token: 'stub-token', role: null }));
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
        <h1 className="auth-page__title">Create account</h1>
        <p className="auth-page__description">Get started in just a few steps</p>
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
          <button className="btn-google btn-full" onClick={handleGoogleSignup} type="button">
            <FcGoogle size={20} />
            Sign up with Google
          </button>
          <div className="divider"><span>or</span></div>
        </>
      )}

      {/* Back button for step > 1 */}
      {step > 1 && (
        <div className="auth-page__nav-row">
          <button type="button" onClick={goBack}>
            <FiArrowLeft size={16} /> Back
          </button>
        </div>
      )}

      <div className="auth-page__single-field">
        <AnimatePresence mode="wait" custom={dir}>

          {/* Step 1: Full Name */}
          {step === 1 && (
            <motion.form
              key="s1"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onSubmit={(e) => goNext(e, 'full_name')}
              noValidate
            >
              <div className={`form-group${errors.full_name ? ' form-group--error' : ''}`}>
                <label htmlFor="signup-name"><FiUser size={14} /> Full Name</label>
                <input
                  type="text"
                  id="signup-name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Ramesh Patel"
                  autoComplete="name"
                  autoFocus
                />
                {errors.full_name && <span className="form-error">{errors.full_name}</span>}
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

          {/* Step 2: Email */}
          {step === 2 && (
            <motion.form
              key="s2"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onSubmit={(e) => goNext(e, 'email')}
              noValidate
            >
              <div className={`form-group${errors.email ? ' form-group--error' : ''}`}>
                <label htmlFor="signup-email"><FiMail size={14} /> Email</label>
                <input
                  type="email"
                  id="signup-email"
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

          {/* Step 3: Password */}
          {step === 3 && (
            <motion.form
              key="s3"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onSubmit={(e) => goNext(e, 'password')}
              noValidate
            >
              <div className={`form-group${errors.password ? ' form-group--error' : ''}`}>
                <label htmlFor="signup-password"><FiLock size={14} /> Password</label>
                <div className="auth-page__pw-wrap">
                  <input
                    type={showPw ? 'text' : 'password'}
                    id="signup-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    autoComplete="new-password"
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

          {/* Step 4: Phone (optional) + submit */}
          {step === 4 && (
            <motion.form
              key="s4"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="form-group">
                <label htmlFor="signup-phone">
                  <FiPhone size={14} /> Phone{' '}
                  <span style={{ opacity: 0.55, fontWeight: 400, fontSize: '0.85em' }}>(optional)</span>
                </label>
                <input
                  type="tel"
                  id="signup-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  autoComplete="tel"
                  autoFocus
                />
              </div>
              <motion.button
                type="submit"
                className="btn-primary btn-full"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Creating account…' : 'Create Account'}
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
        Already have an account?{' '}
        <button className="btn-link" onClick={onGoLogin} type="button">
          Sign in
        </button>
      </div>
    </>
  );
}

export default Signup;
