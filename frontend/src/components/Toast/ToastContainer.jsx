import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdClose, MdCheckCircle, MdError, MdInfo } from 'react-icons/md';
import toast from './toast';

const AUTO_DISMISS = 4000; // ms

const STYLES = {
  success: {
    bg:     '#f0fdf4',
    border: '#22c55e',
    icon:   <MdCheckCircle size={18} color="#16a34a" />,
    bar:    '#16a34a',
  },
  error: {
    bg:     '#fff1f2',
    border: '#f87171',
    icon:   <MdError size={18} color="#dc2626" />,
    bar:    '#dc2626',
  },
  info: {
    bg:     '#f0fdfe',
    border: '#00ABB3',
    icon:   <MdInfo size={18} color="#00ABB3" />,
    bar:    '#00ABB3',
  },
};

// Dark-mode overrides
const STYLES_DARK = {
  success: { bg: '#052e16', border: '#16a34a' },
  error:   { bg: '#450a0a', border: '#dc2626' },
  info:    { bg: '#082f30', border: '#00ABB3' },
};

function ToastItem({ item, onRemove, isDark }) {
  const [visible, setVisible] = useState(false);   // slide in
  const [leaving, setLeaving] = useState(false);   // slide out

  const s      = STYLES[item.type] || STYLES.info;
  const sDark  = STYLES_DARK[item.type] || STYLES_DARK.info;
  const bg     = isDark ? sDark.bg     : s.bg;
  const border = isDark ? sDark.border : s.border;
  const text   = isDark ? '#f0f2f5'   : '#1a1a1a';

  // Mount → slide in
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(handleClose, AUTO_DISMISS);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  return (
    <div
      style={{
        position:      'relative',
        display:       'flex',
        alignItems:    'flex-start',
        gap:           '10px',
        background:    bg,
        border:        `1.5px solid ${border}`,
        borderLeft:    `4px solid ${border}`,
        borderRadius:  '10px',
        padding:       '11px 14px 11px 12px',
        minWidth:      '260px',
        maxWidth:      '340px',
        boxShadow:     '0 4px 18px rgba(0,0,0,0.13)',
        pointerEvents: 'all',
        transform:     leaving ? 'translateX(110%)' : visible ? 'translateX(0)' : 'translateX(110%)',
        opacity:       leaving ? 0 : visible ? 1 : 0,
        transition:    'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease',
        cursor:        'default',
        overflow:      'hidden',
      }}
    >
      {/* Icon */}
      <span style={{ flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>

      {/* Message */}
      <p style={{
        flex:       1,
        margin:     0,
        fontSize:   '0.84rem',
        fontWeight: 500,
        color:      text,
        lineHeight: 1.45,
        wordBreak:  'break-word',
      }}>
        {item.message}
      </p>

      {/* Close */}
      <button
        onClick={handleClose}
        aria-label="Dismiss"
        style={{
          flexShrink:   0,
          background:   'none',
          border:       'none',
          padding:      '2px',
          cursor:       'pointer',
          color:        text,
          opacity:      0.45,
          display:      'flex',
          alignItems:   'center',
          marginTop:    '1px',
          borderRadius: '4px',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.45'}
      >
        <MdClose size={15} />
      </button>

      {/* Progress bar */}
      <div style={{
        position:   'absolute',
        bottom:     0,
        left:       0,
        height:     '3px',
        background: border,
        borderRadius: '0 0 0 6px',
        animation:  `ks-toast-bar ${AUTO_DISMISS}ms linear forwards`,
      }} />
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const isDark = document.documentElement.classList.contains('dark-mode');

  useEffect(() => {
    const unsub = toast._subscribe((item) => {
      setToasts(prev => [...prev, item]);
    });
    return unsub;
  }, []);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return createPortal(
    <>
      {/* Keyframe for progress bar — injected once */}
      <style>{`
        @keyframes ks-toast-bar {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      <div
        aria-live="polite"
        style={{
          position:       'fixed',
          top:            '1.25rem',
          right:          '1.25rem',
          zIndex:         99999,
          display:        'flex',
          flexDirection:  'column',
          gap:            '10px',
          pointerEvents:  'none',
        }}
      >
        {toasts.map(item => (
          <ToastItem
            key={item.id}
            item={item}
            onRemove={remove}
            isDark={isDark}
          />
        ))}
      </div>
    </>,
    document.body
  );
}
