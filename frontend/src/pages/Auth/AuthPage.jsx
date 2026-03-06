import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiUsers, FiArrowLeft } from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { selectIsDark } from '../../store/themeSlice';
import Login  from './Login';
import Signup from './Signup';
import './Auth.scss';

// Brand panel role chips data
const BRAND_ROLES = [
  {
    icon: <FiBriefcase size={18} />,
    label: 'Kaam Saheb',
    sub: 'Employer — post & manage jobs',
  },
  {
    icon: <FiUsers size={18} />,
    label: 'Kaam Saathi',
    sub: 'Worker — find work & get paid',
  },
  {
    icon: <HiOutlineUserGroup size={18} />,
    label: 'Kaam Setu',
    sub: 'Agent — connect & earn commission',
  },
];

// Animation variants for Login ↔ Signup slide
const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
  exit: (dir) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  }),
};

function AuthPage() {
  const isDark   = useSelector(selectIsDark);

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [dir,  setDir]  = useState(1);       // slide direction

  const goLogin = () => {
    setDir(-1);
    setMode('login');
  };

  const goSignup = () => {
    setDir(1);
    setMode('signup');
  };

  return (
    <div className="auth-page">

      {/* ── LEFT BRAND PANEL ──────────────────────────────────────── */}
      <aside className="auth-page__brand">
        {/* Logo */}
        <div className="auth-page__brand-logo">
          {/* Dark bg panel → always use dark logo (white text) */}
          <img src="/logo-dark.png" alt="KaamSetu" />
        </div>

        {/* Tagline */}
        <h2 className="auth-page__brand-tagline">
          Where Work<br />Meets <span>Workers</span>
        </h2>

        <p className="auth-page__brand-sub">
          Connecting employers, workers and local agents
          into a trusted labor ecosystem across India.
        </p>

        {/* Role chips */}
        <div className="auth-page__brand-roles">
          {BRAND_ROLES.map((r) => (
            <div key={r.label} className="auth-page__brand-role">
              <div className="auth-page__brand-role-icon">{r.icon}</div>
              <div className="auth-page__brand-role-info">
                <strong>{r.label}</strong>
                <span>{r.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="auth-page__brand-footer">
          © 2025 KaamSetu · Smart Village Identity
        </p>
      </aside>

      {/* ── RIGHT FORM PANEL ──────────────────────────────────────── */}
      <div className="auth-page__form-panel">

        {/* Mobile top bar — visible only below lg breakpoint */}
        <div className="auth-page__mobile-top">
          <Link to="/" className="auth-page__mobile-brand">
            <img
              src={isDark ? '/logo-dark.png' : '/logo-light.png'}
              alt="KaamSetu"
            />
          </Link>

        </div>


        {/* Animated Login / Signup card */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={mode}
            className="auth-page__card"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {mode === 'login'
              ? <Login  onGoSignup={goSignup} isDark={isDark} />
              : <Signup onGoLogin={goLogin}   isDark={isDark} />
            }
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}

export default AuthPage;
