import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBriefcase, FiUsers, FiPhone, FiArrowRight, FiArrowLeft,
} from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi2';

// ── Role options ──────────────────────────────────────────────────────────────
const ROLES = [
  {
    key: 'employer',
    icon: <FiBriefcase size={22} />,
    label: 'Kaam Saheb',
    sub: 'Employer',
  },
  {
    key: 'worker',
    icon: <FiUsers size={22} />,
    label: 'Kaam Saathi',
    sub: 'Worker',
  },
  {
    key: 'agent',
    icon: <HiOutlineUserGroup size={22} />,
    label: 'Kaam Setu',
    sub: 'Agent',
  },
];

// Google logo SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.09-6.09C34.47 3.18 29.55 1 24 1 14.82 1 7.06 6.4 3.48 14.08l7.12 5.53C12.39 13.45 17.72 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.55 24.5c0-1.55-.14-3.06-.4-4.5H24v8.52h12.67C35.8 32.34 32.2 35 27.73 36.44l7 5.44C39.37 38.04 46.55 32.06 46.55 24.5z"/>
    <path fill="#FBBC05" d="M10.6 28.38A14.57 14.57 0 0 1 9.5 24c0-1.52.26-3 .72-4.38L3.1 14.08A23.93 23.93 0 0 0 0 24c0 3.81.92 7.42 2.55 10.58l8.05-6.2z"/>
    <path fill="#34A853" d="M24 47c5.59 0 10.28-1.85 13.7-5.02l-7-5.44C28.95 38.04 26.61 39 24 39c-6.27 0-11.6-3.94-13.4-9.42l-8.05 6.2C6.06 41.6 14.43 47 24 47z"/>
  </svg>
);

// Step animation
const stepAnim = {
  initial:    { opacity: 0, x: 30 },
  animate:    { opacity: 1, x: 0,  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit:       { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

const TOTAL_STEPS = 3;

function Login({ onGoSignup, isDark }) {
  const [step,   setStep]   = useState(1);
  const [role,   setRole]   = useState('');
  const [mobile, setMobile] = useState('');
  const [otp,    setOtp]    = useState(['', '', '', '', '', '']);
  const [timer,  setTimer]  = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error,  setError]  = useState('');

  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  // OTP countdown
  useEffect(() => {
    if (step === 3) {
      setTimer(30);
      setCanResend(false);
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setCanResend(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  // ── Step 1: Role select ──────────────────────────────────────────
  const handleRoleSelect = (r) => {
    setRole(r);
    setError('');
  };

  const handleStep1Next = () => {
    if (!role) { setError('Please select your role to continue.'); return; }
    setError('');
    setStep(2);
  };

  const handleGoogleLogin = () => {
    // TODO: integrate Google OAuth
    alert('Google OAuth — coming soon!');
  };

  // ── Step 2: Mobile number ────────────────────────────────────────
  const handleStep2Next = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setError('');
    setStep(3);
  };

  // ── Step 3: OTP ──────────────────────────────────────────────────
  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join('').length < 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    // TODO: call auth API
    alert(`Login stub — OTP: ${otp.join('')} | Role: ${role} | Mobile: +91${mobile}`);
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    otpRefs.current[0]?.focus();
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setCanResend(true); return 0; }
        return t - 1;
      });
    }, 1000);
    // TODO: resend OTP API call
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <>
      {/* Logo */}
      <div className="auth-page__form-logo">
        <img src={isDark ? '/logo-dark.png' : '/logo-light.png'} alt="KaamSetu" />
      </div>

      {/* Step dots */}
      <div className="auth-page__steps">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={
              'auth-page__step-dot' +
              (i + 1 === step ? ' auth-page__step-dot--active' : '') +
              (i + 1 < step  ? ' auth-page__step-dot--done'   : '')
            }
          />
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── STEP 1 — Role + Google ── */}
        {step === 1 && (
          <motion.div key="s1" {...stepAnim}>
            <h2 className="auth-page__title">Welcome back</h2>
            <p className="auth-page__subtitle">Select your role to log in</p>

            {/* Role grid */}
            <div className="auth-page__role-grid">
              {ROLES.map((r) => (
                <button
                  key={r.key}
                  className={`auth-page__role-btn${role === r.key ? ' auth-page__role-btn--selected' : ''}`}
                  onClick={() => handleRoleSelect(r.key)}
                  type="button"
                >
                  <span className="auth-page__role-btn-icon">{r.icon}</span>
                  <span className="auth-page__role-btn-label">{r.label}</span>
                  <span className="auth-page__role-btn-sublabel">{r.sub}</span>
                </button>
              ))}
            </div>

            {error && <p className="auth-page__error">{error}</p>}

            {/* Continue with mobile */}
            <button className="auth-page__submit" onClick={handleStep1Next}>
              Continue <FiArrowRight size={16} />
            </button>

            <div className="auth-page__divider">or</div>

            {/* Google OAuth */}
            <button className="auth-page__google-btn" onClick={handleGoogleLogin} type="button">
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Toggle to Signup */}
            <p className="auth-page__toggle">
              Don&apos;t have an account?{' '}
              <button type="button" onClick={onGoSignup}>Sign up free</button>
            </p>
          </motion.div>
        )}

        {/* ── STEP 2 — Mobile number ── */}
        {step === 2 && (
          <motion.div key="s2" {...stepAnim}>
            <button className="auth-page__form-back" onClick={() => { setStep(1); setError(''); }} type="button">
              <FiArrowLeft size={15} /> Back
            </button>

            <h2 className="auth-page__title">Enter mobile</h2>
            <p className="auth-page__subtitle">
              We'll send a 6-digit OTP to your number
            </p>

            <div className="auth-page__field">
              <label htmlFor="login-mobile">Mobile number</label>
              <div className="auth-page__mobile-row">
                <span className="auth-page__prefix">+91</span>
                <div className="auth-page__input-wrap">
                  <span className="auth-page__input-wrap-icon"><FiPhone size={16} /></span>
                  <input
                    id="login-mobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={mobile}
                    onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); setError(''); }}
                    autoFocus
                  />
                </div>
              </div>
              {error && <p className="auth-page__error">{error}</p>}
            </div>

            <button
              className="auth-page__submit"
              onClick={handleStep2Next}
              disabled={mobile.length < 10}
            >
              Send OTP <FiArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {/* ── STEP 3 — OTP ── */}
        {step === 3 && (
          <motion.div key="s3" {...stepAnim}>
            <button className="auth-page__form-back" onClick={() => { setStep(2); setError(''); setOtp(['','','','','','']); }} type="button">
              <FiArrowLeft size={15} /> Back
            </button>

            <h2 className="auth-page__title">Verify OTP</h2>
            <p className="auth-page__subtitle">
              Enter the 6-digit code sent to <strong>+91 {mobile}</strong>
            </p>

            {/* OTP inputs */}
            <div className="auth-page__otp-row" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  className={`auth-page__otp-input${digit ? ' auth-page__otp-input--filled' : ''}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {/* Resend */}
            <div className="auth-page__resend">
              {canResend ? (
                <>Didn&apos;t receive it?{' '}
                  <button type="button" onClick={handleResend}>Resend OTP</button>
                </>
              ) : (
                <>Resend in <strong>{timer}s</strong></>
              )}
            </div>

            {error && <p className="auth-page__error">{error}</p>}

            <button
              className="auth-page__submit"
              onClick={handleVerify}
              disabled={otp.join('').length < 6}
            >
              Verify & Log In <FiArrowRight size={16} />
            </button>

            <p className="auth-page__hint">
              By continuing, you agree to KaamSetu's Terms & Privacy Policy.
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}

export default Login;
