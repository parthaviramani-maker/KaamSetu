import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { selectIsDark, toggleTheme } from './store/themeSlice';
import ToastContainer  from './components/Toast/ToastContainer';
import OfflineBanner   from './components/OfflineBanner/OfflineBanner';
import PageLoader      from './components/PageLoader/PageLoader';
import router from './routes';

// Minimum ms the splash loader is visible on every page load / refresh
const SPLASH_MS = 1000;

function App() {
  const dispatch = useDispatch();
  const isDark   = useSelector(selectIsDark);

  // Splash state — true = loader visible, 'out' = fading out, false = gone
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    // Start fade-out at SPLASH_MS, fully remove 300 ms later
    const fadeTimer = setTimeout(() => setSplash('out'),          SPLASH_MS);
    const doneTimer = setTimeout(() => setSplash(false),          SPLASH_MS + 300);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, []);

  // Sync theme class on <html>
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark-mode');
      html.classList.remove('light-mode');
    } else {
      html.classList.add('light-mode');
      html.classList.remove('dark-mode');
    }
  }, [isDark]);

  return (
    <>
      {/* ── Splash / page-refresh loader ─────────────────────────────── */}
      {splash && (
        <div className={`splash-overlay${splash === 'out' ? ' splash-overlay--out' : ''}`}>
          <PageLoader />
        </div>
      )}

      <RouterProvider router={router} />
      <ToastContainer />
      <OfflineBanner />

      {/* ── Global Theme FAB ─────────────────────────────────────────── */}
      <button
        className={`theme-fab${isDark ? ' theme-fab--dark' : ''}`}
        onClick={() => dispatch(toggleTheme())}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        data-tooltip={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
    </>
  );
}

export default App;
