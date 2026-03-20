import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MdWifiOff, MdWifi } from 'react-icons/md';
import useOnline from '../../hooks/useOnline';

/**
 * OfflineBanner
 * - Shows a full-screen overlay when the browser goes offline.
 * - Shows a small "back online" pill toast for 3 s when connectivity returns.
 * Rendered via portal so it appears above everything else.
 */
export default function OfflineBanner() {
  const online            = useOnline();
  const [showBack, setShowBack] = useState(false);
  const wasOfflineRef     = useRef(false);
  const timerRef          = useRef(null);

  useEffect(() => {
    if (!online) {
      // Went offline — clear any "back" timer
      wasOfflineRef.current = true;
      setShowBack(false);
      clearTimeout(timerRef.current);
    } else if (wasOfflineRef.current) {
      // Came back online
      wasOfflineRef.current = false;
      setShowBack(true);
      timerRef.current = setTimeout(() => setShowBack(false), 3200);
    }
    return () => clearTimeout(timerRef.current);
  }, [online]);

  if (online && !showBack) return null;

  /* ── Offline overlay ───────────────────────────────────────────────── */
  if (!online) {
    return createPortal(
      <div
        role="alert"
        aria-live="assertive"
        style={{
          position:       'fixed',
          inset:          0,
          background:     'rgba(20, 22, 28, 0.97)',
          backdropFilter: 'blur(4px)',
          zIndex:         99998,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '1rem',
          color:          '#fff',
          textAlign:      'center',
          padding:        '2rem',
          animation:      'ks-fade-in 0.2s ease-out',
        }}
      >
        <div
          style={{
            width:        '80px',
            height:       '80px',
            borderRadius: '50%',
            background:   'rgba(0, 171, 179, 0.12)',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
          }}
        >
          <MdWifiOff size={40} color="#00ABB3" />
        </div>

        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
          No Internet Connection
        </h2>

        <p
          style={{
            margin:     0,
            opacity:    0.65,
            fontSize:   '0.9rem',
            maxWidth:   '300px',
            lineHeight: 1.65,
          }}
        >
          Please check your Wi-Fi or mobile data. We&apos;ll reconnect automatically.
        </p>

        {/* Pulsing dot indicator */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '0.5rem' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width:        '8px',
                height:       '8px',
                borderRadius: '50%',
                background:   '#00ABB3',
                opacity:      0.4,
                animation:    `ks-pulse 1.2s ease-in-out ${i * 0.22}s infinite`,
              }}
            />
          ))}
        </div>
      </div>,
      document.body
    );
  }

  /* ── Back-online pill ──────────────────────────────────────────────── */
  return createPortal(
    <div
      style={{
        position:      'fixed',
        bottom:        '1.75rem',
        left:          '50%',
        transform:     'translateX(-50%)',
        background:    '#27AE60',
        color:         '#fff',
        padding:       '0.55rem 1.4rem',
        borderRadius:  '999px',
        display:       'flex',
        alignItems:    'center',
        gap:           '7px',
        fontWeight:    600,
        fontSize:      '0.87rem',
        boxShadow:     '0 4px 20px rgba(0,0,0,0.25)',
        zIndex:        99998,
        whiteSpace:    'nowrap',
        animation:     'ks-fade-in 0.28s ease-out',
      }}
    >
      <MdWifi size={17} /> You&apos;re back online!
    </div>,
    document.body
  );
}
