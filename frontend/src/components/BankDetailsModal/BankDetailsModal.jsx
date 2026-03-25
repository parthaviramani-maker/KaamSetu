import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdAccountBalance, MdCheckCircle, MdWarning } from 'react-icons/md';
import { useUpdateBankDetailsMutation } from '../../services/userApi';
import toast from '../Toast/toast';

const BankDetailsModal = ({ existingDetails = null, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    accountHolderName: existingDetails?.accountHolderName || '',
    accountNumber:     existingDetails?.accountNumber     || '',
    ifscCode:          existingDetails?.ifscCode          || '',
    bankName:          existingDetails?.bankName          || '',
    upiId:             existingDetails?.upiId             || '',
  });
  const [step, setStep] = useState('form'); // 'form' | 'success'

  const [updateBankDetails, { isLoading }] = useUpdateBankDetailsMutation();

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.accountHolderName.trim()) { toast.error('Account holder name required'); return; }
    if (!form.accountNumber.trim())     { toast.error('Account number required'); return; }
    if (!/^\d{9,18}$/.test(form.accountNumber.trim())) { toast.error('Enter a valid account number (9–18 digits)'); return; }
    if (!form.ifscCode.trim())          { toast.error('IFSC code required'); return; }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifscCode.trim().toUpperCase())) { toast.error('Enter a valid IFSC code (e.g. SBIN0001234)'); return; }
    if (!form.bankName.trim())          { toast.error('Bank name required'); return; }

    try {
      await updateBankDetails({
        accountHolderName: form.accountHolderName.trim(),
        accountNumber:     form.accountNumber.trim(),
        ifscCode:          form.ifscCode.trim().toUpperCase(),
        bankName:          form.bankName.trim(),
        upiId:             form.upiId.trim() || null,
      }).unwrap();

      setStep('success');
      toast.success('Bank account linked successfully! 🏦');
      setTimeout(() => { onSuccess?.(); }, 1500);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save bank details. Try again.');
    }
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const isEditing = !!(existingDetails?.accountNumber);

  return (
    <motion.div
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
        }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #7b2d8b, #a855f7)',
          padding: '1.2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff' }}>
            <MdAccountBalance size={22} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                {isEditing ? 'Update Bank Account' : 'Link Bank Account'}
              </div>
              <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>
                Required for wallet transactions
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

            {/* ── FORM STEP ── */}
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {!isEditing && (
                  <div style={{
                    background: 'rgba(168,85,247,0.08)',
                    border: '1px solid rgba(168,85,247,0.25)',
                    borderRadius: '0.6rem',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.2rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}>
                    <MdWarning size={16} style={{ color: '#a855f7', flexShrink: 0, marginTop: 1 }} />
                    A linked bank account is required to add money or withdraw from your wallet.
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Account Holder Name */}
                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                      Account Holder Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.accountHolderName}
                      onChange={set('accountHolderName')}
                      placeholder="e.g. Ramesh Kumar"
                      style={{ width: '100%' }}
                      autoFocus
                    />
                  </div>

                  {/* Bank Name */}
                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                      Bank Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.bankName}
                      onChange={set('bankName')}
                      placeholder="e.g. State Bank of India"
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* Account Number */}
                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                      Account Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.accountNumber}
                      onChange={set('accountNumber')}
                      placeholder="9 to 18 digit account number"
                      style={{ width: '100%', letterSpacing: '0.05em' }}
                      inputMode="numeric"
                    />
                  </div>

                  {/* IFSC Code */}
                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                      IFSC Code <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.ifscCode}
                      onChange={(e) => setForm(f => ({ ...f, ifscCode: e.target.value.toUpperCase() }))}
                      placeholder="e.g. SBIN0001234"
                      style={{ width: '100%', fontFamily: 'monospace', letterSpacing: '0.08em' }}
                      maxLength={11}
                    />
                  </div>

                  {/* UPI ID (optional) */}
                  <div className="form-group" style={{ marginBottom: '1.3rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                      UPI ID <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.upiId}
                      onChange={set('upiId')}
                      placeholder="e.g. ramesh@upi"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '0.75rem', background: 'linear-gradient(135deg, #7b2d8b, #a855f7)', border: 'none' }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving…' : `🏦 ${isEditing ? 'Update' : 'Link'} Bank Account`}
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
                  🏦
                </motion.div>
                <h2 style={{ color: '#a855f7', marginBottom: '0.4rem' }}>Bank Account Linked!</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  {form.bankName} — ****{form.accountNumber.slice(-4)}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '1rem' }}>
                  Continuing…
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer note */}
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
            Demo project — bank details are stored only for wallet transaction purposes.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BankDetailsModal;
