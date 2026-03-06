import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { selectIsDark, toggleTheme } from './store/themeSlice';
import router from './routes';

function App() {
  const dispatch = useDispatch();
  const isDark   = useSelector(selectIsDark);

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
      <RouterProvider router={router} />

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
