/**
 * PageLoader — LinkedIn-style splash loader.
 * Shows the KaamSetu icon mark inside a rounded card with a pulsing teal shadow.
 * Reads theme from localStorage so the background matches the user's saved preference
 * even before Redux state is ready.
 */
function getInitialIsDark() {
  try {
    const raw = localStorage.getItem('kaamsetu-root');
    if (raw) {
      const s = JSON.parse(raw);
      if (typeof s?.theme?.isDark === 'boolean') return s.theme.isDark;
    }
  } catch {
    // ignore
  }
  return window?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export default function PageLoader() {
  const isDark = getInitialIsDark();
  const pageBg = isDark ? '#1a1d24' : '#EAEAEA';

  return (
    <div
      style={{
        position:       'fixed',
        inset:          0,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     pageBg,
        zIndex:         9999,
        animation:      'ks-fade-in 0.18s ease-out',
      }}
    >
      {/* Rounded icon card — icon image already has dark charcoal background built in */}
      <div
        style={{
          width:        '100px',
          height:       '100px',
          borderRadius: '26px',
          overflow:     'hidden',
          flexShrink:   0,
          animation:    'ks-shadow-pulse 1.6s ease-in-out infinite',
        }}
      >
        <img
          src="/apple-touch-icon.png"
          alt="KaamSetu"
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}
