import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdHome, MdArrowBack } from 'react-icons/md';
import { selectIsDark } from '../store/themeSlice';

export default function NotFound() {
  const navigate = useNavigate();
  const isDark   = useSelector(selectIsDark);
  const logo     = isDark ? '/logo-dark.png' : '/logo-light.png';

  return (
    <div
      style={{
        minHeight:      '100dvh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '2rem',
        background:     'var(--bg-primary)',
        color:          'var(--text-primary)',
        textAlign:      'center',
        gap:            '0.75rem',
        animation:      'ks-fade-in 0.25s ease-out',
      }}
    >
      {/* Logo */}
      <img
        src={logo}
        alt="KaamSetu"
        style={{ width: '130px', marginBottom: '1rem' }}
      />

      {/* 404 */}
      <h1
        style={{
          margin:     0,
          fontSize:   'clamp(5rem, 15vw, 7.5rem)',
          fontWeight: 800,
          lineHeight: 1,
          color:      '#00ABB3',
          letterSpacing: '-2px',
        }}
      >
        404
      </h1>

      <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>
        Page Not Found
      </h2>

      <p
        style={{
          margin:     0,
          color:      'var(--text-secondary)',
          fontSize:   '0.9rem',
          maxWidth:   '340px',
          lineHeight: 1.65,
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '6px',
            padding:      '0.6rem 1.35rem',
            background:   'transparent',
            color:        'var(--text-primary)',
            border:       '1.5px solid var(--border-color)',
            borderRadius: '8px',
            fontWeight:   600,
            fontSize:     '0.9rem',
            cursor:       'pointer',
          }}
        >
          <MdArrowBack size={17} /> Go Back
        </button>

        <button
          onClick={() => navigate('/', { replace: true })}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '6px',
            padding:      '0.6rem 1.5rem',
            background:   '#00ABB3',
            color:        '#fff',
            border:       'none',
            borderRadius: '8px',
            fontWeight:   600,
            fontSize:     '0.9rem',
            cursor:       'pointer',
          }}
        >
          <MdHome size={17} /> Home
        </button>
      </div>
    </div>
  );
}
