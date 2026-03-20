<<<<<<< HEAD
import { useEffect, useState } from 'react';
=======
import { useEffect } from 'react';
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
import { useSelector, useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { selectIsDark, toggleTheme } from './store/themeSlice';
<<<<<<< HEAD
import ToastContainer  from './components/Toast/ToastContainer';
import OfflineBanner   from './components/OfflineBanner/OfflineBanner';
import PageLoader      from './components/PageLoader/PageLoader';
import router from './routes';

// Minimum ms the splash loader is visible on every page load / refresh
const SPLASH_MS = 1000;

=======
import router from './routes';

>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
function App() {
  const dispatch = useDispatch();
  const isDark   = useSelector(selectIsDark);

<<<<<<< HEAD
  // Splash state — true = loader visible, 'out' = fading out, false = gone
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    // Start fade-out at SPLASH_MS, fully remove 300 ms later
    const fadeTimer = setTimeout(() => setSplash('out'),          SPLASH_MS);
    const doneTimer = setTimeout(() => setSplash(false),          SPLASH_MS + 300);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, []);

=======
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
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
<<<<<<< HEAD
      {/* ── Splash / page-refresh loader ─────────────────────────────── */}
      {splash && (
        <div
          style={{
            position:   'fixed',
            inset:      0,
            zIndex:     99999,
            opacity:    splash === 'out' ? 0 : 1,
            transition: splash === 'out' ? 'opacity 0.3s ease-out' : 'none',
            pointerEvents: splash === 'out' ? 'none' : 'all',
          }}
        >
          <PageLoader />
        </div>
      )}

      <RouterProvider router={router} />
      <ToastContainer />
      <OfflineBanner />
=======
      <RouterProvider router={router} />
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442

      {/* ── Global Theme FAB ─────────────────────────────────────────── */}
      <button
        className={`theme-fab${isDark ? ' theme-fab--dark' : ''}`}
        onClick={() => dispatch(toggleTheme())}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
    </>
  );
}

export default App;
