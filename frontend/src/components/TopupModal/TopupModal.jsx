import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { MdLock, MdQrCode, MdCheckCircle, MdWarning } from 'react-icons/md';
import { useTopupWalletMutation } from '../../services/walletApi';
import { useSetPasswordMutation } from '../../services/userApi';
import toast from '../Toast/toast';
import DashboardModal from '../DashboardModal/DashboardModal';

const PRESETS = [100, 250, 500, 1000, 2000, 5000];

const StepDots = ({ current, total = 2 }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
    {Array.from({ length: total }, (_, i) => i + 1).map(n => (
      <div key={n} style={{
        height: 7,
        width: n === current ? 22 : 7,
        borderRadius: 9999,
        background: n === current ? 'var(--color-primary)' : n < current ? 'rgba(0,171,179,0.35)' : 'var(--border-color)',
        transition: 'all 0.25s',
      }} />
    ))}
  </div>
);

const TopupModal = ({ currentBalance, onClose, onSuccess }) => {
  const [amount,      setAmount]      = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [step,        setStep]        = useState('amount');
  const [addedAmount, setAddedAmount] = useState(0);

  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);

  const [topupWallet,   { isLoading }]               = useTopupWalletMutation();
  const [setPasswordFn, { isLoading: isPwLoading }]  = useSetPasswordMutation();

  const qrValue = `upi://pay?pa=kaamsetu@upi&pn=KaamSetu&am=${amount || '0'}&cu=INR&tn=KaamSetu+Wallet+Topup`;
  const amt = Number(amount);

  const goToConfirm = () => {
    if (!amt || amt < 1)  { toast.error('Minimum amount is ₹1'); return; }
    if (amt > 100000)     { toast.error('Maximum ₹1,00,000 per transaction'); return; }
    setStep('confirm');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) { toast.error('Please enter your password'); return; }
    try {
      await topupWallet({ amount: amt, password }).unwrap();
      setAddedAmount(amt);
      setStep('success');
      toast.success(`₹${amt.toLocaleString('en-IN')} added to your wallet!`);
      setTimeout(() => { onSuccess?.(); }, 2000);
    } catch (err) {
      const errCode = err?.data?.error?.code;
      if (errCode === 'NO_PASSWORD_SET')  { setStep('set-password'); }
      else if (errCode === 'NO_BANK_ACCOUNT') { toast.error('Please link your bank account first.'); }
      else { toast.error(err?.data?.message || 'Top-up failed. Try again.'); }
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (!newPw.trim())       { toast.error('Please enter a password'); return; }
    if (newPw.length < 6)    { toast.error('Password must be at least 6 characters'); return; }
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    try {
      await setPasswordFn({ newPassword: newPw }).unwrap();
      toast.success('Password set successfully!');
      setPassword(newPw);
      setNewPw(''); 
      setConfirmPw('');
      setStep('confirm');
    } catch (err) {
      const errCode = err?.data?.error?.code;
      if (errCode === 'ALREADY_HAS_PASSWORD') {
        toast.info('You already have a password. Enter it below.');
        setStep('confirm');
      } else {
        toast.error(err?.data?.message || 'Failed to set password. Try again.');
      }
    }
  };

  return (
    <DashboardModal
      onClose={onClose}
      title="Add Money to Wallet"
      subtitle={`Balance: ₹${currentBalance.toLocaleString('en-IN')}`}
      icon={MdQrCode}
      footerNode={
        (step === 'amount' || step === 'confirm') ? (
          <>
            <MdWarning size={13} style={{ color: 'var(--color-primary)' }} />
            Demo — QR is display only. Password verified securely.
          </>
        ) : null
      }
    >
      <AnimatePresence mode="wait">
        {/* STEP 1 — Amount */}
        {step === 'amount' && (
          <motion.div key="amount" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <StepDots current={1} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ background: '#fff', padding: '10px', borderRadius: '0.8rem', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', marginBottom: '0.5rem' }}>
                <QRCodeSVG value={qrValue} size={110} fgColor="#00ABB3" bgColor="#ffffff" level="M" includeMargin={false} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Scan with any UPI app &nbsp;•&nbsp;
                <strong style={{ color: 'var(--color-primary)' }}>kaamsetu@upi</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>or enter amount below</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
              {PRESETS.map(p => (
                <button 
                  key={p} 
                  type="button" 
                  onClick={() => setAmount(String(p))} 
                  style={{ 
                    padding: '0.3rem 0.65rem', 
                    borderRadius: '2rem', 
                    border: `1.5px solid ${String(amount) === String(p) ? 'var(--color-primary)' : 'var(--border-color)'}`, 
                    background: String(amount) === String(p) ? 'rgba(0,171,179,0.12)' : 'transparent', 
                    color: String(amount) === String(p) ? 'var(--color-primary)' : 'var(--text-secondary)', 
                    fontSize: '0.78rem', 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    transition: 'all 0.15s' 
                  }}
                >
                  ₹{p.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                Amount (₹) <span className="required">*</span>
              </label>
              <input type="number" min="1" max="100000" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 500" style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700, boxSizing: 'border-box' }} autoFocus />
            </div>

            <button type="button" className="btn btn-primary" onClick={goToConfirm} style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '0.75rem', boxSizing: 'border-box' }}>
              Continue →
            </button>
          </motion.div>
        )}

        {/* STEP 2 — Confirm + Password */}
        {step === 'confirm' && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <StepDots current={2} />

            <div style={{ background: 'rgba(0,171,179,0.08)', border: '1px solid rgba(0,171,179,0.25)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Adding to wallet:</span>
                <strong style={{ color: 'var(--color-primary)', fontSize: '1.15rem' }}>+₹{amt.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>New balance:</span>
                <strong style={{ fontSize: '0.9rem' }}>₹{(currentBalance + amt).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                  <MdLock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Confirm with your Login Password <span className="required">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={{ width: '100%', paddingRight: '2.5rem', boxSizing: 'border-box' }} autoFocus />
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Password verified securely. Never stored in this flow.</p>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '0.75rem', marginBottom: '0.5rem', boxSizing: 'border-box' }} disabled={isLoading}>
                {isLoading ? 'Verifying…' : `Add ₹${amt.toLocaleString('en-IN')}`}
              </button>
              <button type="button" onClick={() => setStep('amount')} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '0.35rem', boxSizing: 'border-box' }}>
                ← Back
              </button>
            </form>
          </motion.div>
        )}

        {/* SET PASSWORD (OAuth users) */}
        {step === 'set-password' && (
          <motion.div key="set-password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div style={{ textAlign: 'center', marginBottom: '1.2rem', color: 'var(--color-primary)' }}>
              <MdLock size={48} />
              <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Set Your Password</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Your account doesn't have a password yet.</p>
            </div>
            <form onSubmit={handleSetPassword} noValidate>
              <div className="form-group" style={{ marginBottom: '0.9rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                  New Password <span className="required">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input type={showNewPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min 6 characters" style={{ width: '100%', paddingRight: '2.5rem', boxSizing: 'border-box' }} autoFocus />
                  <button type="button" onClick={() => setShowNewPw(v => !v)} style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {showNewPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>Confirm Password <span className="required">*</span></label>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat your password" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '0.75rem', marginBottom: '0.5rem', boxSizing: 'border-box' }} disabled={isPwLoading}>
                {isPwLoading ? 'Saving…' : 'Set Password & Continue'}
              </button>
              <button type="button" onClick={() => setStep('amount')} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '0.35rem', boxSizing: 'border-box' }}>
                ← Back to top-up
              </button>
            </form>
          </motion.div>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5 }} style={{ fontSize: '4rem', marginBottom: '0.8rem', color: 'var(--color-primary)' }}>
              <MdCheckCircle />
            </motion.div>
            <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.4rem' }}>₹{addedAmount.toLocaleString('en-IN')} Added!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.5rem' }}>New Balance:</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{(currentBalance + addedAmount).toLocaleString('en-IN')}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '1rem' }}>Closing automatically…</p>
          </motion.div>
        )}

      </AnimatePresence>
    </DashboardModal>
  );
};

export default TopupModal;
