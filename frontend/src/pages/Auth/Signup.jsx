import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowLeft, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { loginSuccess } from '../../store/authSlice';
import workerImg   from '../../assets/vector/Worker_vector.png';
import employerImg from '../../assets/vector/Employee_vector.png';
import agentImg    from '../../assets/vector/Agent_vector.png';

const stepVariants = {
  enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
};

const TOTAL_STEPS = 6;

const ROLES = [
  { value: 'worker',   label: 'Worker',   desc: 'I want to find jobs',     img: workerImg,   color: '#00ABB3', bg: 'rgba(0,171,179,0.1)' },
  { value: 'employer', label: 'Employer', desc: 'I want to hire workers',  img: employerImg, color: '#00ABB3', bg: 'rgba(0,171,179,0.1)' },
  { value: 'agent',    label: 'Agent',    desc: 'I help place workers',    img: agentImg,    color: '#00ABB3', bg: 'rgba(0,171,179,0.1)' },
];

function Signup({ onGoLogin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const btnMotion = {};

  const [step,         setStep]       = useState(1);
  const [dir,          setDir]        = useState(1);
  const [formData,     setFormData]   = useState({ full_name: '', email: '', password: '', phone: '', role: '' });
  const [errors,       setErrors]     = useState({});
  const [response,     setResponse]   = useState(null);
  const [loading,      setLoading]    = useState(false);
  const [checkingEmail,setCheckingEmail] = useState(false);
  const [showPw,       setShowPw]     = useState(false);
  const [otp,          setOtp]        = useState(['', '', '', '', '', '']);
  const [otpError,     setOtpError]   = useState('');
  const [resendTimer,  setResendTimer]= useState(0);
  const otpRefs = useRef([]);
  const resendInterval = useRef(null);

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
    if (field === 'role') {
      if (!formData.role) return 'Please select your role';
    }
    return null;
  };

  const goNext = async (e, field) => {
    e.preventDefault();
    const err = validate(field);
    if (err) { setErrors({ [field]: err }); return; }

    // Check email uniqueness before advancing from Step 2
    if (field === 'email') {
      setCheckingEmail(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/check-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await res.json();
        if (!data.success) {
          setErrors({ email: 'Email already exists' });
          setCheckingEmail(false);
          return;
        }
      } catch {
        setErrors({ email: 'Could not verify email, please try again' });
        setCheckingEmail(false);
        return;
      }
      setCheckingEmail(false);
    }

    setErrors({});
    setDir(1);
    setStep(s => s + 1);
  };

  const goBack = () => {
    setDir(-1);
    // Going back from OTP step resets otp state
    if (step === 6) { setOtp(['', '', '', '', '', '']); setOtpError(''); }
    setStep(s => s - 1);
    setErrors({});
  };

  // ── OTP digit input handlers ──────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setOtpError('');
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otp];
    text.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    const focusIdx = Math.min(text.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  // ── Start 60s resend countdown ────────────────────────────
  const startResendTimer = () => {
    setResendTimer(60);
    clearInterval(resendInterval.current);
    resendInterval.current = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(resendInterval.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // ── Send OTP (called on Step 5 submit) ────────────────────
  const sendOtp = async () => {
    setLoading(true);
    setOtpError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/send-signup-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: formData.full_name }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrors({ phone: data.message || 'Failed to send OTP' });
        return false;
      }
      setOtp(['', '', '', '', '', '']);
      startResendTimer();
      return true;
    } catch {
      setErrors({ phone: 'Could not send OTP. Please try again.' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`;
  };

  // ── Step 5 submit: send OTP then advance to step 6 ───────
  const handlePhoneNext = async (e) => {
    e.preventDefault();
    const sent = await sendOtp();
    if (sent) {
      setDir(1);
      setStep(6);
    }
  };

  // ── Step 6 submit: verify OTP + register ─────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) { setOtpError('Please enter the full 6-digit code'); return; }
    setLoading(true);
    setOtpError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     formData.full_name,
          email:    formData.email,
          password: formData.password,
          phone:    formData.phone || undefined,
          role:     formData.role,
          otp:      otpValue,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setOtpError(data.message || 'Verification failed');
        return;
      }
      dispatch(loginSuccess({
        user:  data.data.user,
        token: data.data.token,
        role:  data.data.user.role,
      }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setOtpError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="auth-page__header">
        <h1 className="auth-page__title">
          {step === 6 ? 'Verify your email' : 'Create account'}
        </h1>
        <p className="auth-page__description">
          {step === 6 ? 'Check your inbox for a 6-digit code' : 'Get started in just a few steps'}
        </p>
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
          <motion.button className="btn-google btn-full" onClick={handleGoogleSignup} type="button"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <FcGoogle size={20} />
            Sign up with Google
          </motion.button>
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
              <motion.button type="submit" className="btn-primary btn-full"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
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
              <motion.button type="submit" className="btn-primary btn-full" disabled={checkingEmail}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {checkingEmail ? 'Checking…' : <> Continue <FiArrowRight size={15} /> </>}
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
              <motion.button type="submit" className="btn-primary btn-full"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Continue <FiArrowRight size={15} />
              </motion.button>
            </motion.form>
          )}

          {/* Step 4: Role selection */}
          {step === 4 && (
            <motion.form
              key="s4"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onSubmit={(e) => goNext(e, 'role')}
              noValidate
            >
              <p className="onboarding-section-label">I am joining as…</p>
              <div className="role-cards role-cards--row">
                {ROLES.map(({ value, label, img, color, bg }) => (
                  <button
                    key={value}
                    type="button"
                    className={`role-card role-card--tile${formData.role === value ? ' selected' : ''}`}
                    style={formData.role === value ? { borderColor: color, background: bg } : {}}
                    onClick={() => {
                      setFormData(fd => ({ ...fd, role: value }));
                      setErrors({});
                    }}
                  >
                    <img src={img} alt={label} className="role-card__vector-img" />
                    <strong className="role-card__tile-label">{label}</strong>
                  </button>
                ))}
              </div>
              {errors.role && <span className="form-error" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.role}</span>}
              <motion.button type="submit" className="btn-primary btn-full" style={{ marginTop: '1.25rem' }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Continue <FiArrowRight size={15} />
              </motion.button>
            </motion.form>
          )}

          {/* Step 5: Phone (optional) + Send OTP */}
          {step === 5 && (
            <motion.form
              key="s5"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onSubmit={handlePhoneNext}
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
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
              <motion.button type="submit" className="btn-primary btn-full" disabled={loading}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {loading ? 'Sending OTP…' : <><FiMail size={15} /> Send Verification Code</>}
              </motion.button>
            </motion.form>
          )}

          {/* Step 6: OTP verification */}
          {step === 6 && (
            <motion.form
              key="s6"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Email badge */}
              <div className="login-verify__email-badge" style={{ marginBottom: '0.85rem' }}>
                <FiMail size={14} />
                <span>{formData.email}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                We sent a 6-digit code to your email. Enter it below to create your account.
              </p>

              {/* 6-box OTP input */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    autoFocus={i === 0}
                    style={{
                      width: '2.8rem', height: '3.2rem',
                      textAlign: 'center', fontSize: '1.4rem', fontWeight: 700,
                      border: `1.5px solid ${otpError ? 'var(--color-error, #e53e3e)' : digit ? 'var(--color-accent, #00ABB3)' : 'var(--input-border, #ddd)'}`,
                      borderRadius: '10px',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'border-color 0.15s',
                      boxSizing: 'border-box',
                    }}
                  />
                ))}
              </div>

              {otpError && (
                <span className="form-error" style={{ display: 'block', textAlign: 'center', marginBottom: '0.75rem' }}>
                  {otpError}
                </span>
              )}

              <motion.button type="submit" className="btn-primary btn-full" disabled={loading}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {loading ? 'Verifying…' : 'Create Account'}
              </motion.button>

              {/* Resend OTP */}
              <div style={{ textAlign: 'center', marginTop: '0.9rem' }}>
                {resendTimer > 0 ? (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Resend code in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn-link"
                    style={{ fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    onClick={async () => { await sendOtp(); }}
                    disabled={loading}
                  >
                    <FiRefreshCw size={13} /> Resend code
                  </button>
                )}
              </div>
            </motion.form>
          )}

        </AnimatePresence>
      </div>

      {/* Footer — hidden on OTP step */}
      {step !== 6 && (
        <div className="auth-page__footer">
          Already have an account?{' '}
          <button className="btn-link" onClick={onGoLogin} type="button">
            Sign in
          </button>
        </div>
      )}
    </>
  );
}

export default Signup;
