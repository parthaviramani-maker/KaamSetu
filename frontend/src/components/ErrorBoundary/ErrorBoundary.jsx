import { Component } from 'react';
import { MdErrorOutline, MdRefresh, MdHome } from 'react-icons/md';

/**
 * ErrorBoundary — wraps the whole app.
 * Catches any unhandled JS error during render and shows a friendly error screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[KaamSetu ErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight:      '100dvh',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '2rem',
          background:     'var(--bg-primary, #EAEAEA)',
          color:          'var(--text-primary, #252830)',
          textAlign:      'center',
          gap:            '0.9rem',
        }}
      >
        {/* Logo */}
        <img
          src="/logo-light.png"
          alt="KaamSetu"
          style={{ width: '120px', marginBottom: '0.5rem' }}
        />

        <MdErrorOutline size={56} color="#E53E3E" />

        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
          Something went wrong
        </h1>

        <p
          style={{
            margin:     0,
            color:      'var(--text-secondary, #B2B2B2)',
            fontSize:   '0.9rem',
            maxWidth:   '360px',
            lineHeight: 1.6,
          }}
        >
          An unexpected error occurred. You can try again or go back to the home page.
        </p>

        {/* Error detail (collapsed) */}
        {this.state.error?.message && (
          <code
            style={{
              background:   'rgba(229,62,62,0.08)',
              border:       '1px solid rgba(229,62,62,0.2)',
              borderRadius: '8px',
              padding:      '0.5rem 1rem',
              fontSize:     '0.76rem',
              color:        '#E53E3E',
              maxWidth:     '420px',
              overflowX:    'auto',
              display:      'block',
              wordBreak:    'break-all',
            }}
          >
            {this.state.error.message}
          </code>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={this.handleRetry}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '6px',
              padding:      '0.55rem 1.35rem',
              background:   '#00ABB3',
              color:        '#fff',
              border:       'none',
              borderRadius: '8px',
              fontWeight:   600,
              fontSize:     '0.88rem',
              cursor:       'pointer',
            }}
          >
            <MdRefresh size={16} /> Try Again
          </button>

          <button
            onClick={() => { window.location.href = '/'; }}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '6px',
              padding:      '0.55rem 1.35rem',
              background:   'transparent',
              color:        'var(--text-primary, #252830)',
              border:       '1.5px solid var(--border-color, rgba(178,178,178,0.35))',
              borderRadius: '8px',
              fontWeight:   600,
              fontSize:     '0.88rem',
              cursor:       'pointer',
            }}
          >
            <MdHome size={16} /> Go Home
          </button>
        </div>
      </div>
    );
  }
}
