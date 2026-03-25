import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdLock, MdSend, MdWarning, MdSearch, MdPerson } from 'react-icons/md';
import { useTransferWalletMutation } from '../../services/walletApi';
import { useSetPasswordMutation, useGetUsersListQuery } from '../../services/userApi';
import toast from '../Toast/toast';

const PRESETS = [100, 250, 500, 1000];

const ROLE_COLORS = {
  employer: { bg: 'rgba(41,128,185,0.1)',  color: '#2980b9' },
  worker:   { bg: 'rgba(39,174,96,0.1)',   color: '#27ae60' },
  agent:    { bg: 'rgba(155,89,182,0.1)',  color: '#9b59b6' },
  admin:    { bg: 'rgba(231,76,60,0.1)',   color: '#e74c3c' },
};

const TransferModal = ({ currentBalance, onClose, onSuccess }) => {
  const [selectedUser,  setSelectedUser]  = useState(null);  // { name, email, role }
  const [search,        setSearch]        = useState('');
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [amount,        setAmount]        = useState('');
  const [password,      setPassword]      = useState('');
  const [showPass,      setShowPass]      = useState(false);
  const [step,          setStep]          = useState('form'); // 'form' | 'set-password' | 'success'
  const [result,        setResult]        = useState(null);
  const dropdownRef = useRef(null);

  // Set-password step (Google OAuth users)
  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);

  const [transferWallet, { isLoading }]               = useTransferWalletMutation();
  const [setPasswordFn,  { isLoading: isPwLoading }]  = useSetPasswordMutation();
  const { data: usersData, isLoading: usersLoading }  = useGetUsersListQuery();

  const allUsers    = usersData?.data ?? [];
  const filtered    = allUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const amt           = Number(amount);
  const isOverBalance = amt > currentBalance;
  const isValid       = amt >= 1 && !isOverBalance && !!selectedUser;

  const handlePreset = (val) => setAmount(String(val));

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser)        { toast.error('Please select a user to send money to'); return; }
    if (!isValid)             { toast.error(isOverBalance ? 'Amount exceeds your balance' : 'Minimum amount is ₹1'); return; }
    if (amt > 100000)         { toast.error('Maximum ₹1,00,000 per transaction'); return; }
    if (!password.trim())     { toast.error('Please enter your password'); return; }

    try {
      const res = await transferWallet({ receiverEmail: selectedUser.email, amount: amt, password }).unwrap();
      setResult({
        transferred:  res.data.transferred,
        receiverName: res.data.receiverName,
        balance:      res.data.balance,
      });
      setStep('success');
      toast.success(`₹${amt.toLocaleString('en-IN')} sent to ${res.data.receiverName}! 🎉`);
      setTimeout(() => { onSuccess?.(); }, 2500);
    } catch (err) {
      const errCode = err?.data?.error?.code;
      if (errCode === 'NO_PASSWORD_SET') {
        setStep('set-password');
      } else {
        toast.error(err?.data?.message || 'Transfer failed. Try again.');
      }
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (!newPw.trim())       { toast.error('Please enter a password'); return; }
    if (newPw.length < 6)    { toast.error('Password must be at least 6 characters'); return; }
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    try {
      await setPasswordFn({ newPassword: newPw }).unwrap();
      toast.success('Password set! You can now transfer. 🎉');
      setPassword(newPw);
      setNewPw(''); setConfirmPw('');
      setStep('form');
    } catch (err) {
      const errCode = err?.data?.error?.code;
      if (errCode === 'ALREADY_HAS_PASSWORD') {
        toast.info('You already have a password. Enter it below to transfer.');
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
            background: 'linear-gradient(135deg, #1a6b3a, #27ae60)',
            padding: '1.2rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff' }}>
              <MdSend size={22} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>Send Money</div>
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

              {/* ── SET PASSWORD STEP ── */}
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
                      Your account doesn't have a password yet. Set one to verify transfers.
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
                      ← Back to transfer
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
                  <form onSubmit={handleSubmit} noValidate>
                    {/* User Dropdown */}
                    <div className="form-group" style={{ marginBottom: '0.9rem', position: 'relative' }} ref={dropdownRef}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                        <MdPerson size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                        Send To <span className="required">*</span>
                      </label>

                      {/* Selected user pill OR trigger */}
                      <div
                        onClick={() => setDropdownOpen(v => !v)}
                        style={{
                          width: '100%',
                          minHeight: '2.4rem',
                          border: `1.5px solid ${dropdownOpen ? '#27ae60' : 'var(--border-color)'}`,
                          borderRadius: '0.5rem',
                          padding: '0.4rem 0.6rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'var(--bg-input, var(--bg-card))',
                          transition: 'border-color 0.15s',
                        }}
                      >
                        {selectedUser ? (
                          <>
                            <span style={{
                              background: ROLE_COLORS[selectedUser.role]?.bg,
                              color: ROLE_COLORS[selectedUser.role]?.color,
                              borderRadius: '1rem',
                              padding: '0.15rem 0.55rem',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              textTransform: 'capitalize',
                              flexShrink: 0,
                            }}>{selectedUser.role}</span>
                            <span style={{ fontWeight: 600, fontSize: '0.88rem', flex: 1 }}>{selectedUser.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedUser.email}</span>
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); setSelectedUser(null); setSearch(''); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: 'auto', padding: 0, lineHeight: 1 }}
                            >✕</button>
                          </>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <MdSearch size={15} /> Search user by name or role…
                          </span>
                        )}
                      </div>

                      {/* Dropdown panel */}
                      {dropdownOpen && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          zIndex: 100,
                          background: 'var(--bg-card)',
                          border: '1.5px solid #27ae60',
                          borderTop: 'none',
                          borderRadius: '0 0 0.6rem 0.6rem',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                          maxHeight: '220px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                        }}>
                          {/* Search inside dropdown */}
                          <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                            <input
                              autoFocus
                              type="text"
                              value={search}
                              onChange={e => setSearch(e.target.value)}
                              placeholder="Search name, email or role…"
                              style={{ width: '100%', fontSize: '0.82rem', padding: '0.35rem 0.6rem' }}
                              onClick={e => e.stopPropagation()}
                            />
                          </div>

                          {/* User list */}
                          <div style={{ overflowY: 'auto', flex: 1 }}>
                            {usersLoading && (
                              <div style={{ padding: '0.8rem', color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center' }}>Loading…</div>
                            )}
                            {!usersLoading && filtered.length === 0 && (
                              <div style={{ padding: '0.8rem', color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center' }}>No users found</div>
                            )}
                            {filtered.map(u => (
                              <div
                                key={u._id}
                                onClick={() => { setSelectedUser(u); setDropdownOpen(false); setSearch(''); }}
                                style={{
                                  padding: '0.55rem 0.75rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.55rem',
                                  borderBottom: '1px solid var(--border-color)',
                                  background: selectedUser?._id === u._id ? 'rgba(39,174,96,0.08)' : 'transparent',
                                  transition: 'background 0.1s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(39,174,96,0.06)'}
                                onMouseLeave={e => e.currentTarget.style.background = selectedUser?._id === u._id ? 'rgba(39,174,96,0.08)' : 'transparent'}
                              >
                                <span style={{
                                  background: ROLE_COLORS[u.role]?.bg,
                                  color: ROLE_COLORS[u.role]?.color,
                                  borderRadius: '1rem',
                                  padding: '0.15rem 0.5rem',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  textTransform: 'capitalize',
                                  flexShrink: 0,
                                  minWidth: '3.5rem',
                                  textAlign: 'center',
                                }}>{u.role}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick amount presets */}
                    <div style={{ marginBottom: '0.75rem' }}>
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
                              border: `1.5px solid ${String(amount) === String(p) ? '#27ae60' : 'var(--border-color)'}`,
                              background: String(amount) === String(p) ? 'rgba(39,174,96,0.12)' : 'transparent',
                              color: p > currentBalance ? 'var(--text-muted)' : String(amount) === String(p) ? '#27ae60' : 'var(--text-secondary)',
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
                      </div>
                    </div>

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
                      />
                      {isOverBalance && (
                        <p style={{ fontSize: '0.72rem', color: '#e74c3c', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MdWarning size={13} /> Amount exceeds available balance of ₹{currentBalance.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="form-group" style={{ marginBottom: '1rem', position: 'relative' }}>
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

                    {/* Preview */}
                    {amt > 0 && !isOverBalance && selectedUser && (
                      <div style={{
                        background: 'rgba(39,174,96,0.08)',
                        border: '1px solid rgba(39,174,96,0.25)',
                        borderRadius: '0.6rem',
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        fontSize: '0.83rem',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', gap: '0.5rem' }}>
                          <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>Sending to:</span>
                          <strong style={{ color: 'var(--text-primary)', fontSize: '0.8rem', textAlign: 'right' }}>{selectedUser.name} ({selectedUser.role})</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Amount:</span>
                          <strong style={{ color: '#e74c3c' }}>-₹{amt.toLocaleString('en-IN')}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                      background: isOverBalance || !selectedUser ? 'var(--bg-hover)' : 'linear-gradient(135deg, #1a6b3a, #27ae60)',
                        opacity: (isOverBalance || !selectedUser) ? 0.6 : 1,
                      }}
                      disabled={isLoading || isOverBalance || currentBalance === 0}
                    >
                      {isLoading
                        ? 'Verifying…'
                        : currentBalance === 0
                          ? 'No balance to transfer'
                          : `💸 Send ₹${amt > 0 ? amt.toLocaleString('en-IN') : '—'}`}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ── SUCCESS STEP ── */}
              {step === 'success' && result && (
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
                    🎉
                  </motion.div>
                  <h2 style={{ color: '#27ae60', marginBottom: '0.3rem' }}>
                    ₹{result.transferred.toLocaleString('en-IN')} Sent!
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.3rem' }}>
                    To: <strong>{result.receiverName}</strong>
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    Remaining Balance:
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{result.balance.toLocaleString('en-IN')}
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
              Password verified securely with bcrypt. Transfers are instant and irreversible.
            </div>
          )}

        </motion.div>
      </motion.div>
    </>
  );
};

export default TransferModal;
