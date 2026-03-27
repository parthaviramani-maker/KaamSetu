import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  MdPerson, MdEmail, MdPhone, MdLocationOn, MdWork,
  MdSave, MdEdit, MdDeleteForever, MdWarning,
  MdAccountBalance, MdCreditCard, MdLock, MdCameraAlt,
} from 'react-icons/md';
import { selectUser, selectRole, logout, updateAvatar } from '../../../store/authSlice';
import AvatarCropModal from '../../../components/AvatarCropModal/AvatarCropModal';
import Avatar from '../../../components/Avatar';
import {
  useGetMeQuery, useUpdateMeMutation, useDeleteMeMutation,
  useGetBankDetailsQuery, useUpdateBankDetailsMutation,
  useUploadAvatarMutation, useRemoveAvatarMutation,
} from '../../../services/userApi';
import toast from '../../../components/Toast/toast';
import './ProfilePage.scss';

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

  const fileInputRef = useRef(null);
  const [cropSrc,      setCropSrc]      = useState(null);
  const [cropFileName, setCropFileName] = useState('');

  const [editing,           setEditing]           = useState(false);
  const [errors,            setErrors]            = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMe,     { isLoading: isDeleting }]  = useDeleteMeMutation();
  const [updateMe,     { isLoading: isSaving }]    = useUpdateMeMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const [removeAvatar, { isLoading: isRemoving }]  = useRemoveAvatarMutation();

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

  // ── Avatar handlers ─────────────────────────────────────────────────────

  // Step 1: file selected → open crop modal
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropFileName(file.name);
    setCropSrc(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Step 2: crop confirmed → compress → upload
  const handleCropConfirm = async (croppedFile) => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    try {
      const formData = new FormData();
      formData.append('avatar', croppedFile);
      const result = await uploadAvatar(formData).unwrap();
      dispatch(updateAvatar({ avatar: result.data?.avatar ?? null }));
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(err?.data?.message || 'Avatar upload failed');
    }
  };

  // Cancel crop
  const handleCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const handleRemoveAvatar = async () => {
    try {
      await removeAvatar().unwrap();
      dispatch(updateAvatar({ avatar: null }));
      toast.success('Avatar removed!');
    } catch (err) {
      toast.error(err?.data?.message || 'Avatar removal failed');
    }
  };

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
  const hasAvatar  = !!(meUser?.avatar);
  const completion = [form.name, form.email, form.phone, form.city, form.skill, form.bio].filter(Boolean).length;
  const completionPct = Math.round((completion / 6) * 100);

  return (
    <div className="profile-page">

      {/* ─── HERO CARD ──────────────────────────────────────────────────────── */}
      <div className="profile-hero">

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="avatar-file-input"
          onChange={handleFileChange}
        />

        {/* Gradient banner */}
        <div className="profile-hero__banner" />

        {/* Body row: avatar (left) + identity (right) */}
        <div className="profile-hero__body">
          <div className="profile-hero__left">
            <div className="profile-hero__avatar-wrap">
              <button
                type="button"
                className="profile-hero__avatar-trigger"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                aria-label="Change photo"
              >
                <Avatar src={avatarUrl} alt={form.name} className="profile-hero__avatar" />
                <span className="profile-hero__avatar-overlay" aria-hidden="true">
                  {isUploading
                    ? <span className="profile-hero__spinner" />
                    : <><MdCameraAlt size={20} /><span>Change</span></>}
                </span>
              </button>
            </div>
          </div>

          {/* Identity */}
          <div className="profile-hero__identity">
            <h2 className="profile-hero__name">{form.name || 'Your Name'}</h2>
            <span className="profile-hero__role-pill">{ROLE_LABELS[role] || 'Platform Member'}</span>
            {form.email && (
              <p className="profile-hero__email">
                <MdEmail size={13} />{form.email}
              </p>
            )}
          </div>
        </div>

        {/* Profile completion */}
        <div className="profile-hero__completion">
          <div className="profile-hero__completion-bar-row">
            <div className="profile-hero__completion-track">
              <div className="profile-hero__completion-fill" style={{ width: `${completionPct}%` }} />
            </div>
            <span className="profile-hero__completion-pct">{completionPct}%</span>
          </div>
          <p className="profile-hero__completion-label">Profile Complete</p>
        </div>

      </div>

      {/* ─── PROFILE INFO CARD ──────────────────────────────────────────────── */}
      <div className="section-card pinfo-card">
        <div className="pinfo-card__header">
          <div className="pinfo-card__title-group">
            <MdPerson size={18} color="var(--color-accent)" />
            <div>
              <h3>About Me</h3>
              <p>Personal details &amp; contact info</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditing(v => !v)}
            className={`pinfo-card__edit-btn ${
              editing ? 'pinfo-card__edit-btn--cancel' : ''
            }`}
          >
            {editing ? <><MdEdit size={15} /> Cancel</> : <><MdEdit size={15} /> Edit Profile</>}
          </button>
        </div>

        <div className="section-card-body">

          {/* ── VIEW MODE ───────────────────────────────────────────────────── */}
          {!editing && (
            <div className="pinfo-view">
              <div className="pinfo-view__grid">
                {[
                  { icon: <MdPerson  size={18} />, label: 'Full Name',   value: form.name  },
                  { icon: <MdEmail   size={18} />, label: 'Email',       value: form.email },
                  { icon: <MdPhone   size={18} />, label: 'Phone',       value: form.phone },
                  { icon: <MdLocationOn size={18} />, label: 'City / Area', value: form.city },
                  {
                    icon: <MdWork size={18} />,
                    label: role === 'worker' ? 'Primary Skill' : role === 'employer' ? 'Company' : role === 'agent' ? 'Coverage Area' : 'Department',
                    value: form.skill,
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="pinfo-view__item">
                    <div className="pinfo-view__item-icon">{icon}</div>
                    <div className="pinfo-view__item-body">
                      <span className="pinfo-view__item-label">{label}</span>
                      <span className={`pinfo-view__item-value${!value ? ' pinfo-view__item-value--empty' : ''}`}>
                        {value || 'Not set'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {form.bio && (
                <div className="pinfo-view__bio">
                  <span className="pinfo-view__bio-label">Bio</span>
                  <p className="pinfo-view__bio-text">{form.bio}</p>
                </div>
              )}
            </div>
          )}

          {/* ── EDIT MODE ───────────────────────────────────────────────────── */}
          {editing && (
            <form onSubmit={handleSave} className="dash-form profile-form" noValidate>
              <div className="profile-fields-grid">
                {[
                  { label: 'Full Name',   name: 'name',  type: 'text',  icon: <MdPerson size={14} />,     placeholder: 'Your full name',      required: true  },
                  { label: 'Email',       name: 'email', type: 'email', icon: <MdEmail size={14} />,      placeholder: 'you@example.com',     required: true  },
                  { label: 'Phone',       name: 'phone', type: 'tel',   icon: <MdPhone size={14} />,      placeholder: '10-digit mobile',     required: false },
                  { label: 'City / Area', name: 'city',  type: 'text',  icon: <MdLocationOn size={14} />, placeholder: 'e.g. Surat, Gujarat', required: false },
                  {
                    label: role === 'worker' ? 'Primary Skill' : role === 'employer' ? 'Company Name' : role === 'agent' ? 'Coverage Area' : 'Department',
                    name: 'skill', type: 'text', icon: <MdWork size={14} />, placeholder: '', required: false,
                  },
                ].map(f => (
                  <div key={f.name} className="form-group">
                    <label>
                      {f.icon} {f.label}
                      {f.required && <span className="required">*</span>}
                    </label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={form[f.name]}
                      onChange={handle}
                      placeholder={f.placeholder}
                      autoFocus={f.name === 'name'}
                      className={errors[f.name] ? 'input--error' : ''}
                    />
                    {errors[f.name] && <span className="field-error">{errors[f.name]}</span>}
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label>Bio / About</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handle}
                  rows={3}
                  placeholder="Tell employers / workers a little about yourself…"
                />
              </div>
              <div className="profile-form-actions">
                <button type="submit" disabled={isSaving} className="btn btn-primary">
                  <MdSave size={16} />
                  {isSaving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
      {/* ── Bank Details Section ──────────────────────────────────────────────── */}
      <div className="section-card">
        <div className="section-card-header">
          <div className="bank-section-header">
            <MdAccountBalance size={18} color="var(--color-accent)" />
            <div>
              <h3>Bank Details</h3>
              <p>Used for wallet withdrawals — save once, withdraw anytime</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setBankEditing(v => !v)}
            className={`profile-edit-btn profile-edit-btn--no-margin ${bankEditing ? 'profile-edit-btn--inactive' : 'profile-edit-btn--active'}`}
          >
            <MdEdit size={18} />
            {bankEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div className="section-card-body">

          {/* Read-only summary */}
          {!bankEditing && (
            <div className="bank-read-grid">
              {[
                { label: 'Account Holder', value: bankForm.accountHolderName },
                { label: 'Account Number', value: bankForm.accountNumber ? maskedAccNo : null },
                { label: 'IFSC Code',      value: bankForm.ifscCode },
                { label: 'Bank Name',      value: bankForm.bankName },
                { label: 'UPI ID',         value: bankForm.upiId },
              ].map(({ label, value }) => (
                <div key={label} className="bank-read-item">
                  <span className="bank-read-item__label">{label}</span>
                  <span className={`bank-read-item__value${!value ? ' bank-read-item__value--empty' : ''}`}>
                    {value || 'Not set'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Edit form */}
          {bankEditing && (
            <form onSubmit={handleBankSave} className="dash-form bank-form" noValidate>
              <div className="bank-form-grid">

                <div className="form-group">
                  <label><MdPerson size={14} /> Account Holder Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={bankForm.accountHolderName}
                    onChange={handleBank}
                    placeholder="As per bank records"
                    className={bankErrors.accountHolderName ? 'input--error' : ''}
                  />
                  {bankErrors.accountHolderName && <span className="field-error">{bankErrors.accountHolderName}</span>}
                </div>

                <div className="form-group">
                  <label><MdCreditCard size={14} /> Account Number <span className="required">*</span></label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={bankForm.accountNumber}
                    onChange={handleBank}
                    placeholder="9–18 digit account number"
                    inputMode="numeric"
                    className={bankErrors.accountNumber ? 'input--error' : ''}
                  />
                  {bankErrors.accountNumber && <span className="field-error">{bankErrors.accountNumber}</span>}
                </div>

                <div className="form-group">
                  <label><MdAccountBalance size={14} /> IFSC Code <span className="required">*</span></label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={bankForm.ifscCode}
                    onChange={handleBank}
                    placeholder="e.g. SBIN0001234"
                    maxLength={11}
                    className={`input--ifsc${bankErrors.ifscCode ? ' input--error' : ''}`}
                  />
                  {bankErrors.ifscCode && <span className="field-error">{bankErrors.ifscCode}</span>}
                </div>

                <div className="form-group">
                  <label><MdAccountBalance size={14} /> Bank Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="bankName"
                    value={bankForm.bankName}
                    onChange={handleBank}
                    placeholder="e.g. State Bank of India"
                    className={bankErrors.bankName ? 'input--error' : ''}
                  />
                  {bankErrors.bankName && <span className="field-error">{bankErrors.bankName}</span>}
                </div>

                <div className="form-group">
                  <label><MdLock size={14} /> UPI ID <span className="optional">(optional)</span></label>
                  <input
                    type="text"
                    name="upiId"
                    value={bankForm.upiId}
                    onChange={handleBank}
                    placeholder="yourname@bank"
                  />
                </div>

              </div>

              <div className="bank-info-note">
                <MdLock size={14} color="var(--color-accent)" />
                Withdrawal amount will be transferred to this bank account. Account number is stored securely.
              </div>

              <div className="bank-form-actions">
                <button type="submit" disabled={isBankSaving} className="btn btn-primary">
                  <MdSave size={18} />
                  {isBankSaving ? 'Saving…' : 'Save Bank Details'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* ── Danger Zone ────────────────────────────────────────────────────── */}
      <div className="section-card section-card--danger">
        <div className="section-card-header">
          <div className="danger-header-left">
            <MdWarning size={18} color="var(--color-danger)" />
            <div>
              <h3 className="danger-header-title">Danger Zone</h3>
              <p className="danger-header-sub">Permanent and irreversible actions</p>
            </div>
          </div>
        </div>
        <div className="section-card-body">
          <div className="danger-zone-row">
            <div className="danger-zone-info">
              <p className="danger-title">Delete My Account</p>
              <p className="danger-desc">Once deleted, your account and all data will be permanently removed.</p>
            </div>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn--danger-outline"
              >
                <MdDeleteForever size={18} /> Delete Account
              </button>
            ) : (
              <div className="danger-confirm-row">
                <span className="danger-confirm-text">Are you sure? This cannot be undone.</span>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="btn btn--danger-solid"
                >
                  <MdDeleteForever size={18} />
                  {isDeleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Avatar Crop Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {cropSrc && (
          <AvatarCropModal
            imageSrc={cropSrc}
            fileName={cropFileName}
            onConfirm={handleCropConfirm}
            onCancel={handleCropCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
