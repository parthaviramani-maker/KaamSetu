import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight, FiArrowLeft, FiLock, FiEye, FiEyeOff, FiCheck,
} from 'react-icons/fi';
import workerImg   from '../../assets/vector/Worker_vector.png';
import employerImg from '../../assets/vector/Employee_vector.png';
import agentImg    from '../../assets/vector/Agent_vector.png';
import { loginSuccess } from '../../store/authSlice';
import { selectIsDark } from '../../store/themeSlice';
import slide1 from '../../assets/illustrations/slide1.webp';
import slide2 from '../../assets/illustrations/slide2.webp';
import slide3 from '../../assets/illustrations/slide3.webp';
import slide4 from '../../assets/illustrations/slide4.webp';
import './Auth.scss';

const SLIDES = [slide1, slide2, slide3, slide4];
const INTERVAL = 3800;

const imgVariants = {
  enter:  { opacity: 0, scale: 1.06 },
  center: { opacity: 1, scale: 1,    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
  exit:   { opacity: 0, scale: 0.97, transition: { duration: 0.4 } },
};

const ROLES = [
  {
    value: 'worker',
    label: 'Worker',
    img: workerImg,
    color: '#00ABB3',
    bg: 'rgba(0,171,179,0.1)',
    iconBg:         '#1a1d24',               // dark/black
    iconBgSelected: '#111317',               // deeper black when selected
  },
  {
    value: 'employer',
    label: 'Employer',
    img: employerImg,
    color: '#00ABB3',
    bg: 'rgba(0,171,179,0.1)',
    iconBg:         'rgba(0,171,179,0.15)',   // teal tint
    iconBgSelected: '#00ABB3',               // full teal when selected
  },
  {
    value: 'agent',
    label: 'Agent',
    img: agentImg,
    color: '#00ABB3',
    bg: 'rgba(0,171,179,0.1)',
    iconBg:         '#1a1d24',               // dark/black
    iconBgSelected: '#111317',               // deeper black when selected
  },
];

const stepVariants = {
  enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.24, ease: 'easeOut' } },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -32 : 32, transition: { duration: 0.18 } }),
};

function Onboarding() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDark   = useSelector(selectIsDark);
  const user     = useSelector((s) => s.auth.user);
  const token    = useSelector((s) => s.auth.token);

  const [step,     setStep]    = useState(1);
  const [dir,      setDir]     = useState(1);
  const [role,     setRole]    = useState('');
  const [password, setPassword]= useState('');
  const [showPw,   setShowPw]  = useState(false);
  const [errors,   setErrors]  = useState({});
  const [loading,  setLoading] = useState(false);
  const [apiError, setApiError]= useState('');
  const [current,  setCurrent] = useState(0);

  // Auto-cycle slides
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(t);
  }, []);

  const goStep2 = () => {
    if (!role) { setErrors({ role: 'Please select your role to continue' }); return; }
    setErrors({});
    setDir(1);
    setStep(2);
  };

  const submit = async (skipPassword = false) => {
    if (!skipPassword && password && password.length < 6) {
      setErrors({ password: 'Minimum 6 characters' });
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      const body = { role };
      if (!skipPassword && password) body.password = password;

      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/onboarding`, {
        method: 'PATCH',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.success) { setApiError(data.message || 'Something went wrong'); return; }

      dispatch(loginSuccess({
        user:  data.data.user,
        token: data.data.token,
        role:  data.data.user.role,
      }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT — image slideshow */}
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

      {/* RIGHT — form panel */}
      <div className="auth-page__scroll">

        {/* Logo */}
        <div className="auth-page__panel-logo">
          <Link to="/">
            <img src={isDark ? '/logo-dark.png' : '/logo-light.png'} alt="KaamSetu" />
          </Link>
        </div>

        <div className="auth-page__card">

          {/* Header */}
          <div className="auth-page__header">
            <span className="onboarding-greeting__badge">Welcome aboard 👋</span>
            <h1 className="auth-page__title" style={{ marginTop: '0.5rem' }}>
              Hey, {user?.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="auth-page__description">Let&apos;s finish setting up your account</p>
          </div>

          {/* Step progress bars */}
          <div className="auth-page__steps">
            {['Choose role', 'Set password'].map((label, i) => (
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

          {/* Animated step content */}
          <div className="auth-page__single-field">
            <AnimatePresence mode="wait" custom={dir}>

              {/* ── Step 1: Role selection ── */}
              {step === 1 && (
                <motion.div key="s1" custom={dir} variants={stepVariants} initial="enter" animate="center" exit="exit">
                  <p className="onboarding-section-label">I am joining as…</p>

                  <div className="role-cards role-cards--row">
                    {ROLES.map(({ value, label, img, color, bg, iconBg, iconBgSelected }) => (
                      <button
                        key={value}
                        type="button"
                        className={`role-card role-card--tile${role === value ? ' selected' : ''}`}
                        style={role === value ? { borderColor: color, background: bg } : {}}
                        onClick={() => { setRole(value); setErrors({}); }}
                      >
                        <img src={img} alt={label} className="role-card__vector-img" />
                        <strong className="role-card__tile-label">{label}</strong>
                      </button>
                    ))}
                  </div>

                  {errors.role && <p className="form-error" style={{ marginTop: '0.5rem' }}>{errors.role}</p>}

                  <button className="btn-primary btn-full" style={{ marginTop: '1.25rem' }} onClick={goStep2}>
                    Continue <FiArrowRight size={15} />
                  </button>
                </motion.div>
              )}

              {/* ── Step 2: Password ── */}
              {step === 2 && (
                <motion.div key="s2" custom={dir} variants={stepVariants} initial="enter" animate="center" exit="exit">
                  <div className="auth-page__nav-row" style={{ marginBottom: '1rem' }}>
                    <button type="button" onClick={() => { setDir(-1); setStep(1); }}>
                      <FiArrowLeft size={16} /> Back
                    </button>
                  </div>

                  <p className="onboarding-section-label">Set a password (optional)</p>

                  <div className={`form-group${errors.password ? ' form-group--error' : ''}`}>
                    <label htmlFor="ob-password"><FiLock size={14} /> Password</label>
                    <div className="auth-page__pw-wrap">
                      <input
                        type={showPw ? 'text' : 'password'}
                        id="ob-password"
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

                  {apiError && (
                    <div className="alert alert--error" style={{ marginTop: '0.75rem' }}>
                      <strong>✗ Error</strong><p>{apiError}</p>
                    </div>
                  )}

                  <button className="btn-primary btn-full" style={{ marginTop: '1rem' }} onClick={() => submit(false)} disabled={loading}>
                    <FiCheck size={15} />
                    {loading ? 'Setting up…' : 'Finish Setup'}
                  </button>

                  <button
                    type="button"
                    className="btn-link"
                    style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '0.9rem', fontSize: '0.83rem' }}
                    onClick={() => submit(true)}
                    disabled={loading}
                  >
                    Skip — I&apos;ll use Google to sign in
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Onboarding;
