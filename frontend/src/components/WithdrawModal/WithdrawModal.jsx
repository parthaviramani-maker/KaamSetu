import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdLock, MdOutlineArrowCircleDown, MdCheckCircle, MdWarning } from 'react-icons/md';
import { useWithdrawWalletMutation } from '../../services/walletApi';
import { useSetPasswordMutation } from '../../services/userApi';
import toast from '../Toast/toast';
import DashboardModal from '../DashboardModal/DashboardModal';
import './WithdrawModal.scss';

const PRESETS = [100, 250, 500, 1000, 2000, 5000];

const WithdrawModal = ({ currentBalance, onClose, onSuccess }) => {
  const [amount,      setAmount]      = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [step,        setStep]        = useState('form');
  const [withdrawn,   setWithdrawn]   = useState(0);

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
    if (!isValid)             { toast.error(isOverBalance ? 'Amount exceeds your balance' : 'Minimum amount is ₹1'); return; }
    if (amt > 100000)         { toast.error('Maximum ₹1,00,000 per transaction'); return; }
    if (!password.trim())     { toast.error('Please enter your password'); return; }

    try {
      await withdrawWallet({ amount: amt, password }).unwrap();
      setWithdrawn(amt);
      setStep('success');
      toast.success(`₹${amt.toLocaleString('en-IN')} withdrawn successfully!`);
      setTimeout(() => { onSuccess?.(); }, 2000);
    } catch (err) {
      const errCode = err?.data?.error?.code;
      if (errCode === 'NO_PASSWORD_SET') {
        setStep('set-password');
      } else if (errCode === 'NO_BANK_ACCOUNT') {
        toast.error('Please link your bank account first.');
      } else {
        toast.error(err?.data?.message || 'Withdrawal failed. Try again.');
      }
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (!newPw.trim())         { toast.error('Please enter a password'); return; }
    if (newPw.length < 6)      { toast.error('Password must be at least 6 characters'); return; }
    if (newPw !== confirmPw)   { toast.error('Passwords do not match'); return; }
    try {
      await setPasswordFn({ newPassword: newPw }).unwrap();
      toast.success('Password set! You can now withdraw.');
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

  return (
    <DashboardModal
      onClose={onClose}
      title="Withdraw from Wallet"
      subtitle={`Available Balance: ₹${currentBalance.toLocaleString('en-IN')}`}
      icon={MdOutlineArrowCircleDown}
      footerNode={
        step === 'form' ? (
          <>
            <MdWarning size={14} style={{ color: 'var(--color-primary)' }} />
            Demo project — Password verified securely. No real money involved.
          </>
        ) : null
      }
    >
      <AnimatePresence mode="wait">
        {/* ── SET PASSWORD STEP (Google OAuth users) ── */}
        {step === 'set-password' && (
          <motion.div
            key="set-password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="modal-set-password">
              <div className="modal-set-password__icon" style={{ color: 'var(--color-primary)' }}>
                <MdLock size={48} />
              </div>
              <h3 className="modal-set-password__title">Set Your Password</h3>
              <p className="modal-set-password__desc">
                Your account doesn't have a password yet. Set one to verify withdrawals.
              </p>
            </div>

            <form className="modal-form" onSubmit={handleSetPassword} noValidate>
              <div className="form-group">
                <label>
                  <MdLock size={14} />
                  New Password <span className="required">*</span>
                </label>
                <div className="pass-field-wrap">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    placeholder="Min 6 characters"
                    autoFocus
                  />
                  <button type="button" className="pass-toggle-btn" onClick={() => setShowNewPw(v => !v)}>
                    {showNewPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Repeat your password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn--full"
                disabled={isPwLoading}
              >
                {isPwLoading ? 'Saving…' : <><MdLock size={18} /> Set Password &amp; Continue</>}
              </button>

              <button type="button" className="btn-back" onClick={() => setStep('form')}>
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
            <div className="preset-section">
              <span className="preset-section__label">Quick Amount</span>
              <div className="preset-section__grid">
                {PRESETS.map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`preset-btn${String(amount) === String(p) ? ' preset-btn--primary' : ''}`}
                    onClick={() => handlePreset(p)}
                    disabled={p > currentBalance}
                  >
                    ₹{p.toLocaleString('en-IN')}
                  </button>
                ))}
                {currentBalance > 0 && (
                  <button
                    type="button"
                    className={`preset-btn${String(amount) === String(currentBalance) ? ' preset-btn--red' : ''}`}
                    onClick={handleAll}
                  >
                    All ₹{currentBalance.toLocaleString('en-IN')}
                  </button>
                )}
              </div>
            </div>

            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>
                  Amount (₹) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={currentBalance}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className={`input--amount${isOverBalance ? ' input--error' : ''}`}
                  autoFocus
                />
                {isOverBalance && (
                  <p className="field-error-inline">
                    <MdWarning size={14} /> Amount exceeds available balance of ₹{currentBalance.toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>
                  <MdLock size={14} />
                  Confirm with your Login Password <span className="required">*</span>
                </label>
                <div className="pass-field-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <button type="button" className="pass-toggle-btn" onClick={() => setShowPass(v => !v)}>
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {amt > 0 && !isOverBalance && (
                <div className="amount-preview">
                  <div className="amount-preview__row">
                    <span className="amount-preview__label">Withdrawing:</span>
                    <strong className="amount-preview__value amount-preview__value--debit">-₹{amt.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="amount-preview__row">
                    <span className="amount-preview__label">Balance left:</span>
                    <strong className="amount-preview__value amount-preview__value--normal">₹{(currentBalance - amt).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn--full"
                disabled={isLoading || isOverBalance || currentBalance === 0}
              >
                {isLoading
                  ? 'Verifying…'
                  : currentBalance === 0
                    ? 'No balance to withdraw'
                    : <><MdOutlineArrowCircleDown size={18} /> Withdraw ₹{amt > 0 ? amt.toLocaleString('en-IN') : '—'}</>}
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
          >
            <div className="modal-success">
              <motion.div
                className="modal-success__icon modal-success__icon--primary"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.5 }}
                style={{ color: 'var(--color-primary)' }}
              >
                <MdCheckCircle size={64} />
              </motion.div>
              <h2 className="modal-success__title modal-success__title--primary" style={{ color: 'var(--color-primary)' }}>
                ₹{withdrawn.toLocaleString('en-IN')} Withdrawn!
              </h2>
              <p className="modal-success__subtitle">Remaining Balance:</p>
              <p className="modal-success__amount">₹{(currentBalance - withdrawn).toLocaleString('en-IN')}</p>
              <p className="modal-success__closing">Closing automatically…</p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </DashboardModal>
  );
};

export default WithdrawModal;
