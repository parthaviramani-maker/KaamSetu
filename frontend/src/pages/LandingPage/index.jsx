import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import slide1 from '../../assets/illustrations/slide1.webp';
import slide2 from '../../assets/illustrations/slide2.webp';
import slide3 from '../../assets/illustrations/slide3.webp';
import slide4 from '../../assets/illustrations/slide4.webp';
import {
  FiArrowRight, FiMenu, FiX,
  FiCheckCircle, FiBriefcase, FiUsers, FiMapPin,
  FiShield, FiBell, FiDollarSign, FiZap,
  FiSmartphone, FiWifi, FiDownload, FiPlay,
} from 'react-icons/fi';
import {
  HiOutlineUserGroup, HiOutlineShieldCheck,
  HiOutlineCurrencyRupee, HiOutlineMapPin,
} from 'react-icons/hi2';
import { MdAdminPanelSettings } from 'react-icons/md';
import { selectIsDark } from '../../store/themeSlice';
import { selectIsLogin, selectRole } from '../../store/authSlice';
import './LandingPage.scss';

// ── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '25K+',  label: 'Workers Placed'   },
  { value: '8K+',   label: 'Employers Joined'  },
  { value: '1.2K+', label: 'Local Agents'      },
  { value: '50+',   label: 'Cities Covered'    },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <FiBriefcase size={24} />,
    title: 'Employer Posts Job',
    desc: 'Kaam Saheb posts a job with requirements — location, skill, pay rate and number of workers needed.',
    role: 'employer',
  },
  {
    step: '02',
    icon: <FiUsers size={24} />,
    title: 'Agent Connects Workers',
    desc: 'Kaam Setu (Local Agent) reviews the job, assigns verified Kaam Saathi workers from their area.',
    role: 'agent',
  },
  {
    step: '03',
    icon: <FiDollarSign size={24} />,
    title: 'Work Done & Payment Secured',
    desc: 'Job is completed, payment flows Employer → Agent → Workers with automatic commission split.',
    role: 'worker',
  },
];

const ROLES = [
  {
    key: 'employer',
    icon: <FiBriefcase size={28} />,
    title: 'Kaam Saheb',
    subtitle: 'Employer',
    desc: 'Post jobs, manage workers, track progress and make secure payments — all from one dashboard.',
    features: ['Post & manage jobs', 'Worker allocation', 'Secure payments', 'Real-time tracking'],
    cta: 'Post a Job',
    color: 'teal',
  },
  {
    key: 'worker',
    icon: <FiUsers size={28} />,
    title: 'Kaam Saathi',
    subtitle: 'Worker',
    desc: 'Receive nearby job alerts, accept work with one tap, complete jobs and get paid securely.',
    features: ['Nearby job alerts', 'Easy onboarding', 'Secure payments', 'Work history & reviews'],
    cta: 'Find Work',
    color: 'charcoal',
  },
  {
    key: 'agent',
    icon: <HiOutlineUserGroup size={28} />,
    title: 'Kaam Setu',
    subtitle: 'Local Agent',
    desc: 'Bridge employers and workers in your area. Earn commission for every successful job placement.',
    features: ['Manage worker pool', 'Job assignments', 'Commission earnings', 'Area management'],
    cta: 'Become an Agent',
    color: 'teal',
  },
];

const FEATURES = [
  {
    icon: <FiShield size={22} />,
    title: 'Verified & Trusted',
    desc: 'All users are KYC-verified. JWT + OTP ensures secure access across all roles.',
  },
  {
    icon: <HiOutlineCurrencyRupee size={22} />,
    title: 'Smart Payment Split',
    desc: 'Automatic commission calculation. Employer pays once — agent and workers get paid instantly.',
  },
  {
    icon: <FiMapPin size={22} />,
    title: 'Location-Smart Matching',
    desc: 'Workers see only nearby jobs. Agents manage their local territory efficiently.',
  },
  {
    icon: <FiBell size={22} />,
    title: 'Real-Time Notifications',
    desc: 'Push notifications via Firebase for job alerts, assignments, and payment updates.',
  },
  {
    icon: <FiZap size={22} />,
    title: 'Works Offline (PWA)',
    desc: 'Service Worker caching lets workers view jobs and schedules even without internet.',
  },
  {
    icon: <FiSmartphone size={22} />,
    title: 'Low-End Device Ready',
    desc: 'Optimised for entry-level Android phones common in rural India. Fast & lightweight.',
  },
];

const PWA_FEATURES = [
  { icon: <FiDownload size={18} />, label: 'Install like an app' },
  { icon: <FiWifi     size={18} />, label: 'Works offline' },
  { icon: <FiBell     size={18} />, label: 'Push notifications' },
  { icon: <FiZap      size={18} />, label: 'Fast on slow networks' },
];

// ── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-50px' },
  transition:  { duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] },
});

const fadeIn = (delay = 0) => ({
  initial:     { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport:    { once: true },
  transition:  { duration: 0.5, delay },
});

// ── Component ─────────────────────────────────────────────────────────────────

const DEMO_ROLES = [
  {
    role:    'employer',
    label:   'Kaam Saheb',
    sub:     'Employer',
    name:    'Rajesh Shah',
    icon:    <FiBriefcase size={28} />,
    color:   '#00ABB3',
    bg:      'rgba(0,171,179,0.10)',
  },
  {
    role:    'worker',
    label:   'Kaam Saathi',
    sub:     'Worker',
    name:    'Ramesh Patel',
    icon:    <FiUsers size={28} />,
    color:   '#27AE60',
    bg:      'rgba(39,174,96,0.10)',
  },
  {
    role:    'agent',
    label:   'Kaam Setu',
    sub:     'Local Agent',
    name:    'Bhavesh Patel',
    icon:    <HiOutlineUserGroup size={28} />,
    color:   '#3182CE',
    bg:      'rgba(49,130,206,0.10)',
  },
  {
    role:    'admin',
    label:   'Super Admin',
    sub:     'Platform Admin',
    name:    'Admin User',
    icon:    <MdAdminPanelSettings size={28} />,
    color:   '#805AD5',
    bg:      'rgba(128,90,213,0.10)',
  },
];

function LandingPage() {
  const navigate   = useNavigate();
  const isDark     = useSelector(selectIsDark);
  const isLogin    = useSelector(selectIsLogin);
  const userRole   = useSelector(selectRole);

  const handleRoleCta = (roleKey) => {
    if (isLogin) {
      navigate(`/dashboard/${userRole}`);
    } else {
      navigate('/auth', { state: { mode: 'signup', preRole: roleKey } });
    }
  };

  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoOpen,   setDemoOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const handleDemoLogin = (r) => {
    setDemoOpen(false);
    navigate(`/demo/${r.role}`);
  };

  return (
    <div className="lp">

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header className={`lp__nav${scrolled ? ' lp__nav--scrolled' : ''}`}>
        <div className="lp__nav-inner">

          {/* Brand — use real logo on desktop, text on mobile */}
          <a href="#" className="lp__brand">
            <img
              src={isDark ? '/logo-dark.png' : '/logo-light.png'}
              alt="KaamSetu"
              className="lp__brand-logo-img"
            />
            {/* Fallback text brand shown when logo fails */}
            <span className="lp__brand-text-fallback">
              <span className="lp__brand-k">K</span>
              <span className="lp__brand-rest">aam<span className="lp__brand-accent">Setu</span></span>
            </span>
          </a>

          {/* Desktop links */}
          <nav className="lp__nav-links">
            <a href="#how">How it works</a>
            <a href="#roles">User roles</a>
            <a href="#features">Features</a>
            <a href="#pwa">PWA</a>
          </nav>

          {/* Actions */}
          <div className="lp__nav-actions">
            <motion.button
              className="lp__nav-login"
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/auth')}
            >
              Login
            </motion.button>
            <motion.button
              className="btn-primary btn-sm lp__nav-cta"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth')}
            >
              Get started <FiArrowRight size={14} />
            </motion.button>


            {/* Hamburger */}
            <button
              className="lp__nav-hamburger"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile overlay ──────────────────────────────────────────────── */}
      {mobileOpen && (
        <motion.div
          className="lp__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22 }}
          onClick={closeMobile}
        />
      )}

      {/* ── Mobile sidebar ──────────────────────────────────────────────── */}
      <motion.aside
        className="lp__sidebar"
        initial={false}
        animate={{ x: mobileOpen ? 0 : '100%' }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        aria-hidden={!mobileOpen}
      >
        <div className="lp__sidebar-head">
          <a href="#" className="lp__brand" onClick={closeMobile}>
            <img
              src={isDark ? '/logo-dark.png' : '/logo-light.png'}
              alt="KaamSetu"
              className="lp__brand-logo-img lp__brand-logo-img--sidebar"
            />
            <span className="lp__brand-text-fallback">
              <span className="lp__brand-k">K</span>
              <span className="lp__brand-rest">aam<span className="lp__brand-accent">Setu</span></span>
            </span>
          </a>
          <button className="lp__sidebar-close" onClick={closeMobile} aria-label="Close menu">
            <FiX size={20} />
          </button>
        </div>
        <nav className="lp__sidebar-nav">
          <a href="#how"      onClick={closeMobile}>How it works</a>
          <a href="#roles"    onClick={closeMobile}>User roles</a>
          <a href="#features" onClick={closeMobile}>Features</a>
          <a href="#pwa"      onClick={closeMobile}>PWA</a>
        </nav>
        <div className="lp__sidebar-ctas">
          <motion.button className="btn-secondary btn-full lp__sidebar-btn"
            onClick={() => { closeMobile(); navigate('/auth'); }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Login
          </motion.button>
          <motion.button className="btn-primary btn-full lp__sidebar-btn"
            onClick={() => { closeMobile(); navigate('/auth'); }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Get started free
          </motion.button>
        </div>
      </motion.aside>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="lp__hero">
        {/* Decorative blobs */}
        <div className="lp__hero-blob lp__hero-blob--1" aria-hidden="true" />
        <div className="lp__hero-blob lp__hero-blob--2" aria-hidden="true" />

        <div className="lp__container lp__hero-inner">
          {/* Left — text */}
          <div className="lp__hero-content">
            <motion.span className="lp__badge" {...fadeUp(0)}>
              <HiOutlineMapPin size={13} /> Smart Village Identity · India
            </motion.span>

            <motion.h1 className="lp__hero-title" {...fadeUp(0.08)}>
              Where Work<br />
              Meets <span className="lp__accent">Workers</span>
            </motion.h1>

            <motion.p className="lp__hero-sub" {...fadeUp(0.16)}>
              KaamSetu connects <strong>Employers</strong>, <strong>Workers</strong> and{' '}
              <strong>Local Agents</strong> into a trusted labor ecosystem — ensuring
              transparency, secure payments and efficient job allocation across
              villages and cities.
            </motion.p>

            <motion.div className="lp__hero-ctas" {...fadeUp(0.24)}>
              <motion.button
                className="btn-primary btn-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                I'm an Employer <FiArrowRight size={18} />
              </motion.button>
              <motion.button
                className="btn-secondary btn-lg"
                whileTap={{ scale: 0.97 }}
              >
                I'm a Worker
              </motion.button>
            </motion.div>

            <motion.p className="lp__hero-trust" {...fadeUp(0.32)}>
              <FiCheckCircle size={14} /> Trusted by <strong>25,000+</strong> workers across India
            </motion.p>
          </div>

          {/* Right — staggered image grid */}
          <motion.div
            className="lp__hero-grid"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <img src={slide1} alt="Workers at job" className="lp__hero-img lp__hero-img--1" />
            <img src={slide2} alt="Agent connecting" className="lp__hero-img lp__hero-img--2" />
            <img src={slide3} alt="Job completed" className="lp__hero-img lp__hero-img--3" />
            <img src={slide4} alt="Payment secured" className="lp__hero-img lp__hero-img--4" />
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="lp__stats">
        <div className="lp__container lp__stats-inner">
          {STATS.map((s, i) => (
            <motion.div key={s.label} className="lp__stat" {...fadeUp(i * 0.08)}>
              <span className="lp__stat-value">{s.value}</span>
              <span className="lp__stat-label">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="lp__section" id="how">
        <div className="lp__container">
          <motion.div className="lp__section-header" {...fadeUp(0)}>
            <span className="lp__badge">Simple process</span>
            <h2>How KaamSetu works</h2>
            <p>From job posting to payment — everything handled in 3 simple steps</p>
          </motion.div>

          <div className="lp__steps">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div key={i} className="lp__step" {...fadeUp(i * 0.12)}>
                <span className="lp__step-num">{item.step}</span>
                <div className="lp__step-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── User Roles ───────────────────────────────────────────────────── */}
      <section className="lp__section lp__section--alt" id="roles">
        <div className="lp__container">
          <motion.div className="lp__section-header" {...fadeUp(0)}>
            <span className="lp__badge">Who uses KaamSetu</span>
            <h2>Built for every role</h2>
            <p>Separate dashboards and features designed for Employers, Workers and Agents</p>
          </motion.div>

          <div className="lp__roles-grid">
            {ROLES.map((role, i) => (
              <motion.div
                key={role.key}
                className={`lp__role-card lp__role-card--${role.color}`}
                {...fadeUp(i * 0.1)}
                whileHover={{ y: -8 }}
              >
                <div className="lp__role-icon">{role.icon}</div>
                <div className="lp__role-titles">
                  <h3>{role.title}</h3>
                  <span>{role.subtitle}</span>
                </div>
                <p className="lp__role-desc">{role.desc}</p>
                <ul className="lp__role-features">
                  {role.features.map((f) => (
                    <li key={f}>
                      <FiCheckCircle size={14} />
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.button
                  className={`lp__role-cta ${role.color === 'teal' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleRoleCta(role.key)}
                >
                  {role.cta} <FiArrowRight size={13} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="lp__section" id="features">
        <div className="lp__container">
          <motion.div className="lp__section-header" {...fadeUp(0)}>
            <span className="lp__badge">Why KaamSetu</span>
            <h2>Built for India's labour market</h2>
            <p>Security, transparency and simplicity at every step of the workflow</p>
          </motion.div>

          <div className="lp__feat-grid">
            {FEATURES.map((f, i) => (
              <motion.div key={i} className="lp__feat-card" {...fadeUp(i * 0.08)} whileHover={{ y: -6 }}>
                <div className="lp__feat-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment Flow ─────────────────────────────────────────────────── */}
      <section className="lp__section lp__section--alt lp__payment" id="payment">
        <div className="lp__container">
          <motion.div className="lp__section-header" {...fadeUp(0)}>
            <span className="lp__badge">Transparent payments</span>
            <h2>One payment, everyone gets paid</h2>
            <p>Commission is automatically calculated and distributed — no manual splits</p>
          </motion.div>

          <motion.div className="lp__pay-flow" {...fadeUp(0.1)}>
            <div className="lp__pay-node lp__pay-node--employer">
              <div className="lp__pay-node-icon"><FiBriefcase size={22} /></div>
              <strong>Employer</strong>
              <small>Kaam Saheb</small>
              <span className="lp__pay-node-amount">₹ Full Amount</span>
            </div>

            <div className="lp__pay-arrow">
              <FiArrowRight size={20} />
              <span>Secure<br/>Transfer</span>
            </div>

            <div className="lp__pay-node lp__pay-node--agent">
              <div className="lp__pay-node-icon"><HiOutlineUserGroup size={22} /></div>
              <strong>Agent</strong>
              <small>Kaam Setu</small>
              <span className="lp__pay-node-amount">Commission %</span>
            </div>

            <div className="lp__pay-arrow">
              <FiArrowRight size={20} />
              <span>Auto<br/>Split</span>
            </div>

            <div className="lp__pay-node lp__pay-node--workers">
              <div className="lp__pay-node-icon"><FiUsers size={22} /></div>
              <strong>Workers</strong>
              <small>Kaam Saathi</small>
              <span className="lp__pay-node-amount">Net Pay ✓</span>
            </div>
          </motion.div>

          <motion.p className="lp__pay-note" {...fadeIn(0.25)}>
            Future integration: <strong>Razorpay / UPI</strong> for instant bank transfers
          </motion.p>
        </div>
      </section>

      {/* ── PWA Section ──────────────────────────────────────────────────── */}
      <section className="lp__section lp__pwa" id="pwa">
        <div className="lp__container lp__pwa-inner">
          <motion.div className="lp__pwa-text" {...fadeUp(0)}>
            <span className="lp__badge">Progressive Web App</span>
            <h2>Install KaamSetu<br />like a native app</h2>
            <p>
              No Play Store needed. KaamSetu works on any smartphone browser —
              just tap "Add to Home Screen" and you're done.
            </p>
            <div className="lp__pwa-chips">
              {PWA_FEATURES.map((f) => (
                <span key={f.label} className="lp__pwa-chip">
                  {f.icon} {f.label}
                </span>
              ))}
            </div>
            <motion.button
              className="btn-primary btn-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiDownload size={18} /> Install App
            </motion.button>
          </motion.div>

          <motion.div
            className="lp__pwa-visual"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="lp__phone">
              <div className="lp__phone-screen">
                <div className="lp__phone-header">
                  <span className="lp__phone-brand">
                    <span style={{ color: 'var(--color-accent)' }}>K</span>aamSetu
                  </span>
                  <span className="lp__phone-add">+ Add</span>
                </div>
                <div className="lp__phone-body">
                  <div className="lp__phone-stat-row">
                    <div className="lp__phone-stat">
                      <strong>3</strong><span>Active Jobs</span>
                    </div>
                    <div className="lp__phone-stat">
                      <strong>₹4.2K</strong><span>Earned</span>
                    </div>
                  </div>
                  <div className="lp__phone-job">
                    <FiBriefcase size={14} />
                    <span>Construction work · Pune</span>
                    <span className="lp__phone-job-badge">New</span>
                  </div>
                  <div className="lp__phone-job">
                    <FiBriefcase size={14} />
                    <span>Domestic help · Nashik</span>
                    <span className="lp__phone-job-badge lp__phone-job-badge--grey">Open</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="lp__cta-banner">
        <div className="lp__container">
          <motion.div className="lp__cta-inner" {...fadeUp(0)}>
            <h2>Ready to connect work with workers?</h2>
            <p>Join thousands of employers, agents and workers already on KaamSetu.</p>
            <div className="lp__cta-btns">
              <motion.button
                className="btn-primary btn-lg"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Get started free <FiArrowRight size={18} />
              </motion.button>
              <motion.button
                className="btn-secondary btn-lg"
                whileTap={{ scale: 0.97 }}
                style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#fff' }}
              >
                View demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="lp__footer">
        <div className="lp__container lp__footer-inner">
          <div className="lp__footer-brand">
          <a href="#" className="lp__brand lp__brand--lg">
            <img
              src="/logo-dark.png"
              alt="KaamSetu"
              className="lp__brand-logo-img lp__brand-logo-img--footer"
            />
            <span className="lp__brand-text-fallback">
              <span className="lp__brand-k">K</span>
              <span className="lp__brand-rest">aam<span className="lp__brand-accent">Setu</span></span>
            </span>
          </a>
            <p>Where Work Meets Workers</p>
          </div>

          <nav className="lp__footer-links">
            <a href="#how">How it works</a>
            <a href="#roles">Roles</a>
            <a href="#features">Features</a>
            <a href="#pwa">PWA</a>
            <a href="#">Contact</a>
          </nav>

          <div className="lp__footer-roles">
            <button className="btn-link">Kaam Saheb</button>
            <button className="btn-link">Kaam Saathi</button>
            <button className="btn-link">Kaam Setu</button>
            <button className="btn-link">Super Admin</button>
          </div>
        </div>

        <div className="lp__container">
          <p className="lp__footer-copy">
            © 2025 KaamSetu. All rights reserved. · Smart Village Identity
          </p>
        </div>
      </footer>

      {/* ── Demo Floating Pill ───────────────────────────────────────────── */}
      <div className="lp__demo-pill" onClick={() => setDemoOpen(true)}>
        <FiPlay size={12} fill="currentColor" />
        <span>Demo</span>
      </div>

      {/* ── Demo Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {demoOpen && (
          <>
            {/* backdrop */}
            <motion.div
              className="lp__demo-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDemoOpen(false)}
            />

            {/* modal */}
            <motion.div
              className="lp__demo-modal"
              initial={{ opacity: 0, scale: 0.88, y: 32 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{    opacity: 0, scale: 0.92,  y: 16 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* header */}
              <div className="lp__demo-modal-head">
                <div>
                  <p className="lp__demo-modal-eyebrow">No login needed</p>
                  <h3>Try a Live Demo</h3>
                </div>
                <button
                  className="lp__demo-modal-close"
                  onClick={() => setDemoOpen(false)}
                  aria-label="Close"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* role cards */}
              <div className="lp__demo-grid">
                {DEMO_ROLES.map((r, i) => (
                  <motion.button
                    key={r.role}
                    className="lp__demo-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                    whileHover={{ y: -4, boxShadow: `0 8px 28px ${r.color}30` }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleDemoLogin(r)}
                    style={{ '--demo-color': r.color, '--demo-bg': r.bg }}
                  >
                    <div className="lp__demo-card-icon">
                      {r.icon}
                    </div>
                    <div className="lp__demo-card-text">
                      <strong>{r.label}</strong>
                      <span className="lp__demo-card-sub">{r.sub}</span>
                    </div>
                    <FiArrowRight size={16} className="lp__demo-card-arrow" />
                  </motion.button>
                ))}
              </div>

              <p className="lp__demo-modal-note">
                Demo uses pre-filled dummy data — no real account needed.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

export default LandingPage;
