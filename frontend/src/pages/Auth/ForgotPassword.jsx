import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';
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

function ForgotPassword() {
  const isDark        = useSelector(selectIsDark);
  const [searchParams] = useSearchParams();

  const [email,   setEmail]   = useState(() => searchParams.get('email') || '');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setError('Enter a valid email'); return; }

    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.message);
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

        <div className="auth-page__panel-logo">
          <Link to="/">
            <img src={isDark ? '/logo-dark.png' : '/logo-light.png'} alt="KaamSetu" />
          </Link>
        </div>

        <div className="auth-page__card">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="auth-page__header">
                <h1 className="auth-page__title">Check your inbox</h1>
                <p className="auth-page__description">
                  A reset link has been sent to <strong>{email}</strong>. It expires in 1 hour.
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
                <h1 className="auth-page__title">Forgot password?</h1>
                <p className="auth-page__description">Enter your registered email to receive a reset link</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className={`form-group${error ? ' form-group--error' : ''}`}>
                  <label htmlFor="fp-email"><FiMail size={14} /> Email</label>
                  <input
                    type="email"
                    id="fp-email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                  />
                  {error && <span className="form-error">{error}</span>}
                </div>

                <button
                  type="submit"
                  className="btn-primary btn-full"
                  disabled={loading}
                  style={{ marginTop: '0.25rem' }}
                >
                  {loading ? 'Sending…' : <><FiSend size={14} /> Send Reset Link</>}
                </button>
              </form>

              <div className="auth-page__footer">
                <Link
                  to="/auth"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                           color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}
                >
                  <FiArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
