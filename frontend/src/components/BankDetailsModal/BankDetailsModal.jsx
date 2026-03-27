import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAccountBalance, MdWarning, MdAutoFixHigh } from 'react-icons/md';
import { useUpdateBankDetailsMutation } from '../../services/userApi';
import toast from '../Toast/toast';
import DashboardModal from '../DashboardModal/DashboardModal';

// Dummy data for demo
const DUMMY_DATA = {
  accountHolderName: 'Rajesh Kumar Singh',
  accountNumber: '123456789012345',
  ifscCode: 'SBIN0001234',
  bankName: 'State Bank of India',
  upiId: 'rajesh.kumar@upi',
};

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

  const fillDummy = () => {
    setForm({ ...DUMMY_DATA });
    toast.info('Demo data filled!');
  };

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
      toast.success('Bank account linked successfully!');
      setTimeout(() => { onSuccess?.(); }, 1500);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save bank details. Try again.');
    }
  };

  const isEditing = !!(existingDetails?.accountNumber);

  return (
    <DashboardModal
      onClose={onClose}
      title={isEditing ? 'Update Bank Account' : 'Link Bank Account'}
      subtitle="Required for wallet transactions"
      icon={MdAccountBalance}
    >
      <AnimatePresence mode="wait">
        {/* FORM STEP */}
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Info banner */}
            {!isEditing && (
              <div className="modal-info-banner">
                <MdWarning size={16} className="info-icon" />
                <p>A linked bank account is required for wallet top-ups and withdrawals.</p>
              </div>
            )}

            {/* Demo fill button (Luxury style) */}
            <button
              type="button"
              className="premium-fill-btn"
              onClick={fillDummy}
              title="Auto-fill Project Demo Data"
            >
              <MdAutoFixHigh size={16} />
              <span>Fill Project Demo Data</span>
            </button>

            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Account Holder Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={form.accountHolderName}
                  onChange={set('accountHolderName')}
                  placeholder="e.g. Rajesh Kumar"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Bank Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={form.bankName}
                  onChange={set('bankName')}
                  placeholder="e.g. State Bank of India"
                />
              </div>

              <div className="form-group">
                <label>Account Number <span className="required">*</span></label>
                <input
                  type="text"
                  value={form.accountNumber}
                  onChange={set('accountNumber')}
                  placeholder="Enter 9 to 18 digits"
                  className="input--amount"
                  inputMode="numeric"
                />
              </div>

              <div className="form-group">
                <label>IFSC Code <span className="required">*</span></label>
                <input
                  type="text"
                  value={form.ifscCode}
                  onChange={(e) => setForm(f => ({ ...f, ifscCode: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SBIN0001234"
                  className="input--mono"
                  maxLength={11}
                />
              </div>

              <div className="form-group">
                <label>UPI ID <span className="label-muted">(optional)</span></label>
                <input
                  type="text"
                  value={form.upiId}
                  onChange={set('upiId')}
                  placeholder="e.g. ramesh@upi"
                />
              </div>

              <button type="submit" className="btn btn-primary btn--full" disabled={isLoading}>
                {isLoading ? 'Verifying…' : <><MdAccountBalance size={18} /> {isEditing ? 'Update' : 'Link'} Bank Account</>}
              </button>
            </form>
          </motion.div>
        )}

        {/* SUCCESS STEP */}
        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <div className="modal-success">
              <motion.div className="modal-success__icon modal-success__icon--green" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5 }}>
                <MdAccountBalance size={64} />
              </motion.div>
              <h2 className="modal-success__title modal-success__title--green">Bank Account Linked!</h2>
              <p className="modal-success__subtitle">{form.bankName} — ****{form.accountNumber.slice(-4)}</p>
              <p className="modal-success__closing">Closing automatically…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardModal>
  );
};

export default BankDetailsModal;
