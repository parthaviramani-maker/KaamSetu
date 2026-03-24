import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdLock, MdOutlineArrowCircleDown, MdCheckCircle, MdWarning } from 'react-icons/md';
import { useWithdrawWalletMutation } from '../../services/walletApi';
import { useSetPasswordMutation } from '../../services/userApi';
import toast from '../Toast/toast';

// Quick amount presets
const PRESETS = [100, 250, 500, 1000, 2000, 5000];

const WithdrawModal = ({ currentBalance, onClose, onSuccess }) => {
  const [amount,      setAmount]      = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [step,        setStep]        = useState('form'); // 'form' | 'set-password' | 'success'
  const [withdrawn,   setWithdrawn]   = useState(0);

  // Set-password step state (Google OAuth users)
  const [newPw,       setNewPw]       = useState('');
  const [confirmPw,   setConfirmPw]   = useState('');
  const [showNewPw,   setShowNewPw]   = useState(false);

  const [withdrawWallet, { isLoading }]                    = useWithdrawWalletMutation();
  const [setPasswordFn,  { isLoading: isPwLoading }]       = useSetPasswordMutation();

  const amt            = Number(amount);
  const isOverBalance  = amt > currentBalance;
  const isValid        = amt >= 1 && !isOverBalance;

  const handlePreset = (val) => setAmount(String(val));
  const handleAll    = () => setAmount(String(currentBalance));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid)             { toast.error(isOverBalance ? 'Amount exceeds your balance' : 'Minimum ₹1 enter karo'); return; }
    if (amt > 100000)         { toast.error('Maximum ₹1,00,000 ek vakhte'); return; }
    if (!password.trim())     { toast.error('Password enter karo'); return; }

    try {
      await withdrawWallet({ amount: amt, password }).unwrap();
      setWithdrawn(amt);
      setStep('success');
      toast.success(`₹${amt.toLocaleString('en-IN')} withdrawn successfully! 💸`);
      setTimeout(() => { onSuccess?.(); }, 2000);
    } catch (err) {
      const errCode = err?.data?.error?.code;
      if (errCode === 'NO_PASSWORD_SET') {
        setStep('set-password');
      } else {
        toast.error(err?.data?.message || 'Withdrawal failed. Try again.');
      }
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (!newPw.trim())         { toast.error('Password enter karo'); return; }
    if (newPw.length < 6)      { toast.error('Password must be at least 6 characters'); return; }
    if (newPw !== confirmPw)   { toast.error('Passwords do not match'); return; }
    try {
      await setPasswordFn({ newPassword: newPw }).unwrap();
      toast.success('Password set! Ab withdraw karo 🎉');
      setPassword(newPw);
      setNewPw('');
      setConfirmPw('');
      setStep('form');
    } catch (err) {
      const errCode = err?.data?.error?.code;
      if (errCode === 'ALREADY_HAS_PASSWORD') {
        toast.info('You already have a password. Enter it below to withdraw.');
        setStep('form');
      } else {
        toast.error(err?.data?.message || 'Failed to set password. Try again.');
      }
    }
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="modal-backdrop"
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '1.2rem',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            position: 'relative',
          }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1a3a6b, #2980b9)',
            padding: '1.2rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff' }}>
              <MdOutlineArrowCircleDown size={22} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>Withdraw from Wallet</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>
                  Available Balance: ₹{currentBalance.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
            >
              <MdClose size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '1.5rem' }}>
            <AnimatePresence mode="wait">

              {/* ── SET PASSWORD STEP (Google OAuth users) ── */}
              {step === 'set-password' && (
                <motion.div
                  key="set-password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
                    <div style={{ fontSize: '2.8rem', marginBottom: '0.4rem' }}>🔐</div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Set Your Password</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                      Your account doesn't have a password yet. Set one to verify withdrawals.
                    </p>
                  </div>

                  <form onSubmit={handleSetPassword} noValidate>
                    <div className="form-group" style={{ marginBottom: '0.9rem', position: 'relative' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                        <MdLock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                        New Password <span className="required">*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showNewPw ? 'text' : 'password'}
                          value={newPw}
                          onChange={e => setNewPw(e.target.value)}
                          placeholder="Min 6 characters"
                          style={{ width: '100%', paddingRight: '2.5rem' }}
                          autoFocus
                        />
                        <button type="button" onClick={() => setShowNewPw(v => !v)}
                          style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {showNewPw ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                        Confirm Password <span className="required">*</span>
                      </label>
                      <input
                        type="password"
                        value={confirmPw}
                        onChange={e => setConfirmPw(e.target.value)}
                        placeholder="Repeat your password"
                        style={{ width: '100%' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '0.75rem' }}
                      disabled={isPwLoading}
                    >
                      {isPwLoading ? 'Saving…' : '🔐 Set Password & Continue'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep('form')}
                      style={{ width: '100%', marginTop: '0.6rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.4rem' }}
                    >
                      ← Back to withdraw
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ── FORM STEP ── */}
              {step === 'form' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Quick presets */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      Quick Amount
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {PRESETS.map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePreset(p)}
                          disabled={p > currentBalance}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '2rem',
                            border: `1.5px solid ${String(amount) === String(p) ? '#2980b9' : 'var(--border-color)'}`,
                            background: String(amount) === String(p) ? 'rgba(41,128,185,0.12)' : 'transparent',
                            color: p > currentBalance ? 'var(--text-muted)' : String(amount) === String(p) ? '#2980b9' : 'var(--text-secondary)',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: p > currentBalance ? 'not-allowed' : 'pointer',
                            opacity: p > currentBalance ? 0.4 : 1,
                            transition: 'all 0.15s',
                          }}
                        >
                          ₹{p.toLocaleString('en-IN')}
                        </button>
                      ))}
                      {/* Withdraw All */}
                      {currentBalance > 0 && (
                        <button
                          type="button"
                          onClick={handleAll}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '2rem',
                            border: `1.5px solid ${String(amount) === String(currentBalance) ? '#e74c3c' : 'var(--border-color)'}`,
                            background: String(amount) === String(currentBalance) ? 'rgba(231,76,60,0.1)' : 'transparent',
                            color: String(amount) === String(currentBalance) ? '#e74c3c' : 'var(--text-secondary)',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          All ₹{currentBalance.toLocaleString('en-IN')}
                        </button>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    {/* Amount */}
                    <div className="form-group" style={{ marginBottom: '0.9rem' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                        Amount (₹) <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={currentBalance}
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="e.g. 500"
                        style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700, borderColor: isOverBalance ? '#e74c3c' : undefined }}
                        autoFocus
                      />
                      {isOverBalance && (
                        <p style={{ fontSize: '0.72rem', color: '#e74c3c', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MdWarning size={13} /> Amount exceeds available balance of ₹{currentBalance.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="form-group" style={{ marginBottom: '1.2rem', position: 'relative' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                        <MdLock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                        Confirm with your Login Password <span className="required">*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          style={{ width: '100%', paddingRight: '2.5rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(v => !v)}
                          style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem' }}
                        >
                          {showPass ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>

                    {/* Amount preview */}
                    {amt > 0 && !isOverBalance && (
                      <div style={{
                        background: 'rgba(41,128,185,0.08)',
                        border: '1px solid rgba(41,128,185,0.25)',
                        borderRadius: '0.6rem',
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        fontSize: '0.83rem',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Withdrawing:</span>
                          <strong style={{ color: '#e74c3c' }}>-₹{amt.toLocaleString('en-IN')}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Balance left:</span>
                          <strong>₹{(currentBalance - amt).toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        fontSize: '0.95rem',
                        padding: '0.75rem',
                        background: isOverBalance ? 'var(--bg-hover)' : undefined,
                        opacity: isOverBalance ? 0.6 : 1,
                      }}
                      disabled={isLoading || isOverBalance || currentBalance === 0}
                    >
                      {isLoading
                        ? 'Verifying…'
                        : currentBalance === 0
                          ? 'No balance to withdraw'
                          : `💸 Withdraw ₹${amt > 0 ? amt.toLocaleString('en-IN') : '—'}`}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ── SUCCESS STEP ── */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ textAlign: 'center', padding: '1.5rem 0' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ duration: 0.5 }}
                    style={{ fontSize: '4rem', marginBottom: '0.8rem' }}
                  >
                    💸
                  </motion.div>
                  <h2 style={{ color: '#2980b9', marginBottom: '0.4rem' }}>
                    ₹{withdrawn.toLocaleString('en-IN')} Withdrawn!
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                    Remaining Balance:
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{(currentBalance - withdrawn).toLocaleString('en-IN')}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '1rem' }}>
                    Closing automatically…
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Security note */}
          {step === 'form' && (
            <div style={{
              background: 'rgba(255,193,7,0.08)',
              borderTop: '1px solid var(--border-color)',
              padding: '0.7rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}>
              <MdWarning size={14} style={{ color: '#f39c12', flexShrink: 0 }} />
              Demo project — Password verified securely with bcrypt. No real money involved.
            </div>
          )}

        </motion.div>
      </motion.div>
    </>
  );
};

export default WithdrawModal;
