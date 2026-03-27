import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdLock, MdSend, MdWarning, MdSearch, MdPerson, MdCheckCircle } from 'react-icons/md';
import { useTransferWalletMutation } from '../../services/walletApi';
import { useSetPasswordMutation, useGetUsersListQuery } from '../../services/userApi';
import toast from '../Toast/toast';
import DashboardModal from '../DashboardModal/DashboardModal';
import './TransferModal.scss';

const PRESETS = [100, 250, 500, 1000];

const StepDots = ({ current, total = 2 }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
    {Array.from({ length: total }, (_, i) => i + 1).map(n => (
      <div key={n} style={{
        height: 7, width: n === current ? 22 : 7, borderRadius: 9999,
        background: n === current ? 'var(--color-primary)' : n < current ? 'rgba(0,171,179,0.35)' : 'var(--border-color)',
        transition: 'all 0.25s',
      }} />
    ))}
  </div>
);

const TransferModal = ({ currentBalance, onClose, onSuccess }) => {
  const [selectedUser,  setSelectedUser]  = useState(null);
  const [search,        setSearch]        = useState('');
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [amount,        setAmount]        = useState('');
  const [password,      setPassword]      = useState('');
  const [showPass,      setShowPass]      = useState(false);
  const [step,          setStep]          = useState('select');
  const [result,        setResult]        = useState(null);
  const dropdownRef = useRef(null);

  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);

  const [transferWallet, { isLoading }]               = useTransferWalletMutation();
  const [setPasswordFn,  { isLoading: isPwLoading }]  = useSetPasswordMutation();
  const { data: usersData, isLoading: usersLoading }  = useGetUsersListQuery();

  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const allUsers      = usersData?.data ?? [];
  const filtered      = useMemo(() => allUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  ), [allUsers, search]);

  const updateDropdownPosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!dropdownOpen) updateDropdownPosition();
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (dropdownOpen) {
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
    }
    return () => {
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [dropdownOpen]);

  const amt           = Number(amount);
  const isOverBalance = amt > currentBalance;
  const isValid       = amt >= 1 && !isOverBalance && !!selectedUser;

  const handlePreset = (val) => setAmount(String(val));

  const goToConfirm = () => {
    if (!selectedUser)   { toast.error('Please select a user to send money to'); return; }
    if (!amt || amt < 1) { toast.error('Minimum amount is ₹1'); return; }
    if (isOverBalance)   { toast.error('Amount exceeds your balance'); return; }
    if (amt > 100000)    { toast.error('Maximum ₹1,00,000 per transaction'); return; }
    setStep('confirm');
  };

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) { toast.error('Please enter your password'); return; }
    try {
      const res = await transferWallet({ receiverEmail: selectedUser.email, amount: amt, password }).unwrap();
      setResult({ transferred: res.data.transferred, receiverName: res.data.receiverName, balance: res.data.balance });
      setStep('success');
      toast.success(`₹${amt.toLocaleString('en-IN')} sent to ${res.data.receiverName}!`);
      setTimeout(() => { onSuccess?.(); }, 2500);
    } catch (err) {
      const errCode = err?.data?.error?.code;
      if (errCode === 'NO_PASSWORD_SET') { setStep('set-password'); }
      else { toast.error(err?.data?.message || 'Transfer failed. Try again.'); }
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
      title="Send Money"
      subtitle={`Available Balance: ₹${currentBalance.toLocaleString('en-IN')}`}
      icon={MdSend}
      footerNode={
        (step === 'select' || step === 'confirm') ? (
          <>
            <MdWarning size={14} style={{ color: 'var(--color-primary)' }} />
            Password verified securely. Transfers are instant and irreversible.
          </>
        ) : null
      }
    >
      <AnimatePresence mode="wait">
        {/* SET PASSWORD (OAuth users) */}
        {step === 'set-password' && (
          <motion.div key="set-password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="modal-set-password" style={{ color: 'var(--color-primary)' }}>
              <div className="modal-set-password__icon"><MdLock size={48} /></div>
              <h3 className="modal-set-password__title" style={{ color: 'var(--text-primary)' }}>Set Your Password</h3>
              <p className="modal-set-password__desc">Your account doesn't have a password yet. Set one to verify transfers.</p>
            </div>
            <form className="modal-form" onSubmit={handleSetPassword} noValidate>
              <div className="form-group">
                <label><MdLock size={14} /> New Password <span className="required">*</span></label>
                <div className="pass-field-wrap">
                  <input type={showNewPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min 6 characters" autoFocus />
                  <button type="button" className="pass-toggle-btn" onClick={() => setShowNewPw(v => !v)}>{showNewPw ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password <span className="required">*</span></label>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat your password" />
              </div>
              <button type="submit" className="btn btn-primary btn--full" disabled={isPwLoading}>
                {isPwLoading ? 'Saving…' : <><MdLock size={18} /> Set Password &amp; Continue</>}
              </button>
              <button type="button" className="btn-back" onClick={() => setStep('select')}>← Back</button>
            </form>
          </motion.div>
        )}

        {/* STEP 1 — Select user + amount */}
        {step === 'select' && (
          <motion.div key="select" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <StepDots current={1} />
            <div className="modal-form">
              {/* User Dropdown */}
              <div className="form-group transfer-dropdown" ref={dropdownRef}>
                <label><MdPerson size={14} /> Send To <span className="required">*</span></label>
                <div 
                  className={`transfer-dropdown__trigger${dropdownOpen ? ' transfer-dropdown__trigger--open' : ''}${selectedUser ? ' transfer-dropdown__trigger--has-val' : ''}`} 
                  onClick={toggleDropdown}
                >
                  {selectedUser ? (
                    <>
                      <span className={`role-badge role-badge--${selectedUser.role}`}>{selectedUser.role}</span>
                      <div className="selected-user-content">
                        <span className="transfer-dropdown__selected-name">{selectedUser.name}</span>
                        <span className="transfer-dropdown__selected-email">{selectedUser.email}</span>
                      </div>
                      <button type="button" className="transfer-dropdown__clear-btn" onClick={e => { e.stopPropagation(); setSelectedUser(null); setSearch(''); setDropdownOpen(false); }}>✕</button>
                    </>
                  ) : (
                    <span className="transfer-dropdown__placeholder"><MdSearch size={18} /> Search recipient…</span>
                  )}
                </div>
                
                {dropdownOpen && createPortal(
                  <div 
                    className="transfer-dropdown-portal"
                    style={{ 
                      top: dropdownPos.top, 
                      left: dropdownPos.left, 
                      width: dropdownPos.width,
                      position: 'absolute',
                      zIndex: 99999
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="transfer-dropdown__panel">
                      <div className="transfer-dropdown__search-wrap">
                        <MdSearch size={16} />
                        <input 
                          autoFocus 
                          type="text" 
                          value={search} 
                          onChange={e => setSearch(e.target.value)} 
                          placeholder="Type name, email or role…" 
                        />
                      </div>
                      <div className="transfer-dropdown__list">
                        {usersLoading && <div className="transfer-dropdown__loading">Searching users…</div>}
                        {!usersLoading && filtered.length === 0 && <div className="transfer-dropdown__empty">No users found for "{search}"</div>}
                        {filtered.map(u => (
                          <div 
                            key={u._id} 
                            className={`transfer-dropdown__item${selectedUser?._id === u._id ? ' transfer-dropdown__item--selected' : ''}`} 
                            onClick={() => { setSelectedUser(u); setDropdownOpen(false); setSearch(''); }}
                          >
                            <span className={`role-badge role-badge--${u.role}`}>{u.role}</span>
                            <div className="transfer-dropdown__item-info">
                              <div className="transfer-dropdown__item-name">{u.name}</div>
                              <div className="transfer-dropdown__item-email">{u.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              {/* Quick presets */}
              <div className="preset-section">
                <span className="preset-section__label">Quick Amount</span>
                <div className="preset-section__grid">
                  {PRESETS.map(p => (
                    <button key={p} type="button" className={`preset-btn${String(amount) === String(p) ? ' preset-btn--primary' : ''}`} onClick={() => handlePreset(p)} disabled={p > currentBalance}>
                      ₹{p.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount input */}
              <div className="form-group">
                <label>Amount (₹) <span className="required">*</span></label>
                <input type="number" min="1" max={currentBalance} value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 500" className={`input--amount${isOverBalance ? ' input--error' : ''}`} />
                {isOverBalance && (
                  <p className="field-error-inline"><MdWarning size={14} /> Exceeds balance of ₹{currentBalance.toLocaleString('en-IN')}</p>
                )}
              </div>

              <button type="button" className="btn btn-primary btn--full" onClick={goToConfirm}>
                Next → Confirm
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — Confirm + password */}
        {step === 'confirm' && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <StepDots current={2} />
            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              {/* Summary */}
              <div className="amount-preview amount-preview--primary" style={{ marginBottom: '1rem' }}>
                <div className="amount-preview__row">
                  <span className="amount-preview__label">Sending to:</span>
                  <strong className="amount-preview__value amount-preview__value--normal">{selectedUser.name} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.78rem' }}>({selectedUser.role})</span></strong>
                </div>
                <div className="amount-preview__row">
                  <span className="amount-preview__label">Amount:</span>
                  <strong className="amount-preview__value amount-preview__value--debit">-₹{amt.toLocaleString('en-IN')}</strong>
                </div>
                <div className="amount-preview__row">
                  <span className="amount-preview__label">Balance left:</span>
                  <strong className="amount-preview__value amount-preview__value--normal">₹{(currentBalance - amt).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label><MdLock size={14} /> Confirm with Login Password <span className="required">*</span></label>
                <div className="pass-field-wrap">
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoFocus />
                  <button type="button" className="pass-toggle-btn" onClick={() => setShowPass(v => !v)}>{showPass ? 'Hide' : 'Show'}</button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn--full" disabled={isLoading}>
                {isLoading ? 'Verifying…' : <><MdSend size={18} /> Send ₹{amt.toLocaleString('en-IN')}</>}
              </button>
              <button type="button" className="btn-back" onClick={() => setStep('select')}>← Back</button>
            </form>
          </motion.div>
        )}

        {/* SUCCESS */}
        {step === 'success' && result && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <div className="modal-success">
              <motion.div className="modal-success__icon modal-success__icon--primary" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5 }}>
                <MdCheckCircle size={64} style={{ color: 'var(--color-primary)' }} />
              </motion.div>
              <h2 className="modal-success__title modal-success__title--primary" style={{ color: 'var(--color-primary)' }}>₹{result.transferred.toLocaleString('en-IN')} Sent!</h2>
              <p className="modal-success__subtitle">To: <strong>{result.receiverName}</strong></p>
              <p className="modal-success__subtitle">Remaining Balance:</p>
              <p className="modal-success__amount">₹{result.balance.toLocaleString('en-IN')}</p>
              <p className="modal-success__closing">Closing automatically…</p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </DashboardModal>
  );
};

export default TransferModal;
