import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail, MdPhone, MdLocationOn, MdWork, MdSave, MdCheck, MdEdit, MdDeleteForever, MdWarning, MdAccountBalance, MdCreditCard, MdLock } from 'react-icons/md';
import { selectUser, selectRole, logout } from '../../../store/authSlice';
import Avatar from '../../../components/Avatar';
import { useGetMeQuery, useUpdateMeMutation, useDeleteMeMutation, useGetBankDetailsQuery, useUpdateBankDetailsMutation } from '../../../services/userApi';
import toast from '../../../components/Toast/toast';

const ROLE_LABELS = {
  employer: 'Kaam Saheb · Employer',
  worker:   'Kaam Saathi · Worker',
  agent:    'Kaam Setu · Agent',
  admin:    'Super Admin',
};

const ProfilePage = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const { data: meRes } = useGetMeQuery();
  const meUser = meRes?.data || user || {};

  const [editing,           setEditing]           = useState(false);
  const [errors,            setErrors]            = useState({});
  const [saved,             setSaved]             = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMe, { isLoading: isDeleting }] = useDeleteMeMutation();
  const [updateMe, { isLoading: isSaving }]   = useUpdateMeMutation();

  // ── Bank Details ──────────────────────────────────────────────────────────
  const { data: bankRes }                             = useGetBankDetailsQuery();
  const [updateBankDetails, { isLoading: isBankSaving }] = useUpdateBankDetailsMutation();
  const [bankEditing, setBankEditing]                 = useState(false);
  const [bankErrors,  setBankErrors]                  = useState({});
  const [bankForm, setBankForm] = useState({
    accountHolderName: '',
    accountNumber:     '',
    ifscCode:          '',
    bankName:          '',
    upiId:             '',
  });

  // Sync bank form from API
  useEffect(() => {
    const bd = bankRes?.data;
    if (bd?.accountNumber) {
      setBankForm({
        accountHolderName: bd.accountHolderName || '',
        accountNumber:     bd.accountNumber     || '',
        ifscCode:          bd.ifscCode          || '',
        bankName:          bd.bankName          || '',
        upiId:             bd.upiId             || '',
      });
    }
  }, [bankRes?.data?.accountNumber]);

  const handleBank = (e) => {
    const val = e.target.name === 'ifscCode' ? e.target.value.toUpperCase() : e.target.value;
    setBankForm(p => ({ ...p, [e.target.name]: val }));
    if (bankErrors[e.target.name]) setBankErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const validateBank = () => {
    const errs = {};
    if (!bankForm.accountHolderName.trim())  errs.accountHolderName = 'Account holder name is required';
    if (!bankForm.accountNumber.trim())      errs.accountNumber     = 'Account number is required';
    else if (!/^\d{9,18}$/.test(bankForm.accountNumber.trim())) errs.accountNumber = 'Enter a valid account number (9–18 digits)';
    if (!bankForm.ifscCode.trim())           errs.ifscCode          = 'IFSC code is required';
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankForm.ifscCode.trim())) errs.ifscCode = 'Enter a valid IFSC code (e.g. SBIN0001234)';
    if (!bankForm.bankName.trim())           errs.bankName          = 'Bank name is required';
    return errs;
  };

  const handleBankSave = async (e) => {
    e.preventDefault();
    const errs = validateBank();
    if (Object.keys(errs).length > 0) { setBankErrors(errs); return; }
    try {
      await updateBankDetails({
        accountHolderName: bankForm.accountHolderName.trim(),
        accountNumber:     bankForm.accountNumber.trim(),
        ifscCode:          bankForm.ifscCode.trim().toUpperCase(),
        bankName:          bankForm.bankName.trim(),
        upiId:             bankForm.upiId.trim() || undefined,
      }).unwrap();
      toast.success('Bank details saved!');
      setBankEditing(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save bank details');
    }
  };

  // Masked account number for display (show last 4 digits only)
  const maskedAccNo = bankForm.accountNumber
    ? 'XXXX XXXX ' + bankForm.accountNumber.slice(-4)
    : '—';

  const [form, setForm] = useState({
    name:     '',
    email:    '',
    phone:    '',
    city:     '',
    skill:    '',
    bio:      '',
  });

  // Sync form once API profile is loaded
  useEffect(() => {
    if (meUser?.name) {
      setForm(f => ({
        ...f,
        name:  meUser.name  || '',
        email: meUser.email || '',
        phone: meUser.phone || '',
      }));
    }
  }, [meUser?.name]);

  const handle = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
    setSaved(false);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())  errs.name  = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid 10-digit number';
    return errs;
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteMe().unwrap();
      toast.success('Account deleted successfully');
      dispatch(logout());
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete account');
      setShowDeleteConfirm(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      await updateMe({
        name:  form.name.trim(),
        phone: form.phone.trim() || undefined,
      }).unwrap();
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update profile');
    }
  };

  const avatarUrl = meUser?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'User')}&background=00ABB3&color=fff&size=128`;
  const completion = [form.name, form.email, form.phone, form.city, form.skill, form.bio].filter(Boolean).length;
  const completionPct = Math.round((completion / 6) * 100);

  return (
    <div>
      <div className="dash-grid-2" style={{ alignItems: 'start' }}>
        {/* Left: Avatar + Role */}
        <div className="section-card">
          <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1.5rem', textAlign: 'center' }}>
            <Avatar
              src={avatarUrl}
              alt={form.name}
              style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-accent)', marginBottom: '1rem' }}
            />
            <h2 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700 }}>{form.name || 'Your Name'}</h2>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', color: 'var(--color-accent)', fontWeight: 600 }}>
              {ROLE_LABELS[role] || 'Platform Member'}
            </p>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{form.email}</p>

            {/* Profile Completion */}
            <div style={{ width: '100%', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Profile Completion</span>
                <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{completionPct}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${completionPct}%` }} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditing(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '0.55rem 1.25rem', borderRadius: '8px',
                background: editing ? 'var(--bg-hover)' : 'var(--color-accent)',
                color: editing ? 'var(--text-primary)' : '#fff',
                border: editing ? '1.5px solid var(--border-color)' : 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit',
              }}
            >
              <MdEdit size={16} /> {editing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Right: Form */}
        <div className="section-card">
          <div className="section-card-header">
            <div><h3>Profile Information</h3><p>Update your account details</p></div>
          </div>
          <div className="section-card-body">
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
              {[
                { label: 'Full Name',    name: 'name',  type: 'text',  icon: <MdPerson size={14} />,   placeholder: 'Your full name',     required: true },
                { label: 'Email',        name: 'email', type: 'email', icon: <MdEmail size={14} />,    placeholder: 'you@example.com',    required: true },
                { label: 'Phone',        name: 'phone', type: 'tel',   icon: <MdPhone size={14} />,    placeholder: '10-digit number',    required: false },
                { label: 'City / Area',  name: 'city',  type: 'text',  icon: <MdLocationOn size={14} />,placeholder: 'e.g. Surat, Gujarat',required: false },
                { label: role === 'worker' ? 'Primary Skill' : role === 'employer' ? 'Company Name' : role === 'agent' ? 'Coverage Area' : 'Department',
                  name: 'skill', type: 'text', icon: <MdWork size={14} />, placeholder: '', required: false },
              ].map(f => (
                <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {f.icon} {f.label} {f.required && <span style={{ color: 'var(--color-accent)' }}>*</span>}
                  </label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handle}
                    placeholder={f.placeholder}
                    disabled={!editing}
                    style={{
                      padding: '0.6rem 0.85rem',
                      background: editing ? 'var(--input-bg)' : 'var(--bg-hover)',
                      border: `1.5px solid ${errors[f.name] ? '#E53E3E' : 'var(--input-border)'}`,
                      borderRadius: '8px', color: 'var(--text-primary)',
                      fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                      cursor: editing ? 'text' : 'default',
                    }}
                  />
                  {errors[f.name] && <span style={{ fontSize: '0.75rem', color: '#E53E3E' }}>{errors[f.name]}</span>}
                </div>
              ))}

              {/* Bio */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Bio / About</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handle}
                  disabled={!editing}
                  rows={3}
                  placeholder="Tell employers / workers a little about yourself…"
                  style={{
                    padding: '0.6rem 0.85rem',
                    background: editing ? 'var(--input-bg)' : 'var(--bg-hover)',
                    border: '1.5px solid var(--input-border)',
                    borderRadius: '8px', color: 'var(--text-primary)',
                    fontSize: '0.85rem', fontFamily: 'inherit',
                    resize: 'vertical', outline: 'none',
                    cursor: editing ? 'text' : 'default',
                  }}
                />
              </div>

              {editing && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '0.55rem 1.25rem', borderRadius: '8px',
                      background: 'var(--color-accent)', color: '#fff',
                      border: 'none', cursor: 'pointer', fontWeight: 700,
                      fontSize: '0.85rem', fontFamily: 'inherit',
                    }}
                  >
                    <MdSave size={16} /> {isSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      {/* ── Bank Details Section ────────────────────────────────────────────────────── */}
      <div className="section-card" style={{ marginTop: '1.5rem' }}>
        <div className="section-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdAccountBalance size={18} color="var(--color-accent)" />
            <div>
              <h3 style={{ margin: 0 }}>Bank Details</h3>
              <p style={{ margin: 0 }}>Used for wallet withdrawals — save once, withdraw anytime</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setBankEditing(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '0.45rem 1rem', borderRadius: '8px',
              background: bankEditing ? 'var(--bg-hover)' : 'var(--color-accent)',
              color: bankEditing ? 'var(--text-primary)' : '#fff',
              border: bankEditing ? '1.5px solid var(--border-color)' : 'none',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit',
            }}
          >
            <MdEdit size={15} /> {bankEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div className="section-card-body">

          {/* Read-only summary when not editing */}
          {!bankEditing && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '1rem' }}>
              {[
                { label: 'Account Holder', value: bankForm.accountHolderName },
                { label: 'Account Number', value: bankForm.accountNumber ? maskedAccNo : null },
                { label: 'IFSC Code',      value: bankForm.ifscCode },
                { label: 'Bank Name',      value: bankForm.bankName },
                { label: 'UPI ID',         value: bankForm.upiId },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {value || <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Not set</span>}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Edit form */}
          {bankEditing && (
            <form onSubmit={handleBankSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '1rem' }}>

                {/* Account Holder Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MdPerson size={13} /> Account Holder Name <span style={{ color: 'var(--color-accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={bankForm.accountHolderName}
                    onChange={handleBank}
                    placeholder="As per bank records"
                    style={{
                      padding: '0.6rem 0.85rem',
                      background: 'var(--input-bg)',
                      border: `1.5px solid ${bankErrors.accountHolderName ? '#E53E3E' : 'var(--input-border)'}`,
                      borderRadius: '8px', color: 'var(--text-primary)',
                      fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                    }}
                  />
                  {bankErrors.accountHolderName && <span style={{ fontSize: '0.75rem', color: '#E53E3E' }}>{bankErrors.accountHolderName}</span>}
                </div>

                {/* Account Number */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MdCreditCard size={13} /> Account Number <span style={{ color: 'var(--color-accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={bankForm.accountNumber}
                    onChange={handleBank}
                    placeholder="9–18 digit account number"
                    inputMode="numeric"
                    style={{
                      padding: '0.6rem 0.85rem',
                      background: 'var(--input-bg)',
                      border: `1.5px solid ${bankErrors.accountNumber ? '#E53E3E' : 'var(--input-border)'}`,
                      borderRadius: '8px', color: 'var(--text-primary)',
                      fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                    }}
                  />
                  {bankErrors.accountNumber && <span style={{ fontSize: '0.75rem', color: '#E53E3E' }}>{bankErrors.accountNumber}</span>}
                </div>

                {/* IFSC Code */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MdAccountBalance size={13} /> IFSC Code <span style={{ color: 'var(--color-accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={bankForm.ifscCode}
                    onChange={handleBank}
                    placeholder="e.g. SBIN0001234"
                    maxLength={11}
                    style={{
                      padding: '0.6rem 0.85rem',
                      background: 'var(--input-bg)',
                      border: `1.5px solid ${bankErrors.ifscCode ? '#E53E3E' : 'var(--input-border)'}`,
                      borderRadius: '8px', color: 'var(--text-primary)',
                      fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                      textTransform: 'uppercase', letterSpacing: '1px',
                    }}
                  />
                  {bankErrors.ifscCode && <span style={{ fontSize: '0.75rem', color: '#E53E3E' }}>{bankErrors.ifscCode}</span>}
                </div>

                {/* Bank Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MdAccountBalance size={13} /> Bank Name <span style={{ color: 'var(--color-accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={bankForm.bankName}
                    onChange={handleBank}
                    placeholder="e.g. State Bank of India"
                    style={{
                      padding: '0.6rem 0.85rem',
                      background: 'var(--input-bg)',
                      border: `1.5px solid ${bankErrors.bankName ? '#E53E3E' : 'var(--input-border)'}`,
                      borderRadius: '8px', color: 'var(--text-primary)',
                      fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                    }}
                  />
                  {bankErrors.bankName && <span style={{ fontSize: '0.75rem', color: '#E53E3E' }}>{bankErrors.bankName}</span>}
                </div>

                {/* UPI ID (optional) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MdLock size={13} /> UPI ID <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={bankForm.upiId}
                    onChange={handleBank}
                    placeholder="yourname@bank"
                    style={{
                      padding: '0.6rem 0.85rem',
                      background: 'var(--input-bg)',
                      border: '1.5px solid var(--input-border)',
                      borderRadius: '8px', color: 'var(--text-primary)',
                      fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                    }}
                  />
                </div>

              </div>

              {/* Info note */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,171,179,0.07)', border: '1px solid rgba(0,171,179,0.2)', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <MdLock size={13} color="var(--color-accent)" />
                Withdrawal amount will be transferred to this bank account. Account number is stored securely.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isBankSaving}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '0.55rem 1.25rem', borderRadius: '8px',
                    background: 'var(--color-accent)', color: '#fff',
                    border: 'none', cursor: 'pointer', fontWeight: 700,
                    fontSize: '0.85rem', fontFamily: 'inherit',
                  }}
                >
                  <MdSave size={16} /> {isBankSaving ? 'Saving…' : 'Save Bank Details'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* ── Danger Zone ─────────────────────────────────────────────────────────────────────────── */}
      <div className="section-card" style={{ marginTop: '1.5rem', border: '1.5px solid #E53E3E22' }}>
        <div className="section-card-header" style={{ borderBottom: '1px solid #E53E3E22' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdWarning size={18} color="#E53E3E" />
            <div>
              <h3 style={{ color: '#E53E3E', margin: 0 }}>Danger Zone</h3>
              <p style={{ margin: 0 }}>Permanent and irreversible actions</p>
            </div>
          </div>
        </div>
        <div className="section-card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontWeight: 600, margin: '0 0 2px', fontSize: '0.9rem' }}>Delete My Account</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Once deleted, your account and all data will be permanently removed.
              </p>
            </div>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '0.55rem 1.25rem', borderRadius: '8px',
                  background: 'transparent', color: '#E53E3E',
                  border: '1.5px solid #E53E3E', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                <MdDeleteForever size={18} /> Delete Account
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', color: '#E53E3E', fontWeight: 600 }}>
                  Are you sure? This cannot be undone.
                </span>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '0.5rem 1.1rem', borderRadius: '8px',
                    background: '#E53E3E', color: '#fff',
                    border: 'none', cursor: isDeleting ? 'not-allowed' : 'pointer',
                    fontWeight: 700, fontSize: '0.85rem', fontFamily: 'inherit',
                    opacity: isDeleting ? 0.7 : 1,
                  }}
                >
                  <MdDeleteForever size={16} />
                  {isDeleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  style={{
                    padding: '0.5rem 1.1rem', borderRadius: '8px',
                    background: 'var(--bg-hover)', color: 'var(--text-primary)',
                    border: '1.5px solid var(--border-color)', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
