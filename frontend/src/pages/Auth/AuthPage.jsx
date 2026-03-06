import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { selectIsDark } from '../../store/themeSlice';
import slide1 from '../../assets/illustrations/slide1.webp';
import slide2 from '../../assets/illustrations/slide2.webp';
import slide3 from '../../assets/illustrations/slide3.webp';
import slide4 from '../../assets/illustrations/slide4.webp';
import Login  from './Login';
import Signup from './Signup';
import './Auth.scss';

const SLIDES = [slide1, slide2, slide3, slide4];
const INTERVAL = 3800;

const imgVariants = {
  enter:  { opacity: 0, scale: 1.06 },
  center: { opacity: 1, scale: 1,    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
  exit:   { opacity: 0, scale: 0.97, transition: { duration: 0.4 } },
};

const formVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } },
  exit:   (dir) => ({ x: dir > 0 ? -48 : 48, opacity: 0, transition: { duration: 0.22 } }),
};

function AuthPage() {
  const isDark = useSelector(selectIsDark);

  const [isLogin, setIsLogin] = useState(true);
  const [dir,     setDir]     = useState(1);
  const [current, setCurrent] = useState(0);

  // Auto-cycle slides
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(t);
  }, []);

  const goLogin  = () => { setDir(-1); setIsLogin(true);  };
  const goSignup = () => { setDir(1);  setIsLogin(false); };

  return (
    <div className="auth-page">

      {/* LEFT — pure image slideshow, no overlay/dots */}
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

      {/* RIGHT — logo + form */}
      <div className="auth-page__scroll">

        {/* Logo at top of form panel */}
        <div className="auth-page__panel-logo">
          <Link to="/">
            <img src={isDark ? '/logo-dark.png' : '/logo-light.png'} alt="KaamSetu" />
          </Link>
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            className="auth-page__card"
            custom={dir}
            variants={formVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {isLogin
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
