import { useState, useEffect } from 'react';
import { MdSave, MdCheck, MdAdd, MdClose, MdShield } from 'react-icons/md';
import { FiMail } from 'react-icons/fi';
import { useGetAuthorizedEmailsQuery, useUpdateAuthorizedEmailsMutation } from '../../../services/userApi';
import toast from '../../../components/Toast/toast';

const Settings = () => {
  const [saved, setSaved] = useState(false);

  // ── Authorized Emails (Admin 2FA) ────────────────────────────────────────────
  const { data: emailsRes } = useGetAuthorizedEmailsQuery();
  const [updateAuthorizedEmails, { isLoading: isSavingEmails }] = useUpdateAuthorizedEmailsMutation();
  const [emailList,  setEmailList]  = useState([]);
  const [newEmail,   setNewEmail]   = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (emailsRes?.data?.emails) setEmailList(emailsRes.data.emails);
  }, [emailsRes]);

  const addEmail = () => {
    const val = newEmail.trim().toLowerCase();
    if (!val) { setEmailError('Enter an email'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setEmailError('Enter a valid email'); return; }
    if (emailList.includes(val)) { setEmailError('Already added'); return; }
    if (emailList.length >= 5)   { setEmailError('Maximum 5 emails allowed'); return; }
    setEmailList(p => [...p, val]);
    setNewEmail('');
    setEmailError('');
  };

  const removeEmail = (email) => setEmailList(p => p.filter(e => e !== email));

  const handleSaveEmails = async () => {
    try {
      await updateAuthorizedEmails(emailList).unwrap();
      toast.success('Authorized emails saved!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save emails');
    }
  };
  const [form, setForm] = useState({
    platformName:         'KaamSetu',
    supportEmail:         'support@kaamsetu.in',
    commissionRate:       '8',
    maxJobsPerEmployer:   '20',
    maxWorkersPerAgent:   '50',
    allowGoogleLogin:     true,
    requirePhoneVerify:   true,
    autoApproveWorkers:   false,
    maintenanceMode:      false,
    announcementBanner:   '',
  });

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave}>
      <div className="dash-grid-2">
        {/* General Settings */}
        <div className="section-card">
          <div className="section-card-header">
            <div><h3>General Settings</h3><p>Platform configuration</p></div>
          </div>
          <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Platform Name',        name: 'platformName',       type: 'text' },
              { label: 'Support Email',         name: 'supportEmail',       type: 'email' },
              { label: 'Commission Rate (%)',   name: 'commissionRate',     type: 'number' },
              { label: 'Max Jobs / Employer',  name: 'maxJobsPerEmployer', type: 'number' },
              { label: 'Max Workers / Agent',  name: 'maxWorkersPerAgent', type: 'number' },
            ].map(f => (
              <div key={f.name} className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handle}
                  style={{
                    width: '100%', padding: '0.55rem 0.75rem',
                    background: 'var(--input-bg)', border: '1.5px solid var(--input-border)',
                    borderRadius: '8px', color: 'var(--text-primary)',
                    fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="section-card">
          <div className="section-card-header">
            <div><h3>Feature Toggles</h3><p>Enable / disable platform features</p></div>
          </div>
          <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Allow Google Login',      name: 'allowGoogleLogin' },
              { label: 'Require Phone Verification', name: 'requirePhoneVerify' },
              { label: 'Auto-approve Workers',    name: 'autoApproveWorkers' },
              { label: 'Maintenance Mode',         name: 'maintenanceMode' },
            ].map(t => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{t.label}</span>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name={t.name}
                    checked={form[t.name]}
                    onChange={handle}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', inset: 0, borderRadius: '12px',
                    background: form[t.name] ? 'var(--color-accent)' : 'var(--border-color-strong)',
                    transition: 'background 0.2s',
                  }}>
                    <span style={{
                      position: 'absolute', top: '3px',
                      left: form[t.name] ? '23px' : '3px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: '#fff', transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </span>
                </label>
              </div>
            ))}

            {/* Announcement Banner */}
            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                Announcement Banner (optional)
              </label>
              <textarea
                name="announcementBanner"
                value={form.announcementBanner}
                onChange={handle}
                rows={3}
                placeholder="Leave empty to hide banner…"
                style={{
                  width: '100%', padding: '0.55rem 0.75rem',
                  background: 'var(--input-bg)', border: '1.5px solid var(--input-border)',
                  borderRadius: '8px', color: 'var(--text-primary)',
                  fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Admin 2FA: Authorized Emails ─────────────────────────────────────── */}
      <div className="section-card" style={{ marginTop: '1.5rem' }}>
        <div className="section-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdShield size={18} color="var(--color-accent)" />
            <div>
              <h3 style={{ margin: 0 }}>Admin 2FA — Authorized Emails</h3>
              <p style={{ margin: 0 }}>When you login with password, the system will ask you to choose one of these emails to receive the verification code.</p>
            </div>
          </div>
        </div>
        <div className="section-card-body">
          {/* Existing list */}
          {emailList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {emailList.map((email) => (
                <div key={email} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.55rem 0.85rem', borderRadius: '8px',
                  background: 'var(--bg-hover)', border: '1px solid var(--border-color)',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                    <FiMail size={14} color="var(--color-accent)" /> {email}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E53E3E', padding: '2px', display: 'flex' }}
                    title="Remove"
                  >
                    <MdClose size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              No authorized emails added yet. Add at least one to enable email selection on login.
            </p>
          )}

          {/* Add new email */}
          {emailList.length < 5 && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => { setNewEmail(e.target.value); setEmailError(''); }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                  placeholder="Add email address"
                  style={{
                    width: '100%', padding: '0.55rem 0.75rem',
                    background: 'var(--input-bg)', border: `1.5px solid ${emailError ? '#E53E3E' : 'var(--input-border)'}`,
                    borderRadius: '8px', color: 'var(--text-primary)',
                    fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                {emailError && <span style={{ fontSize: '0.75rem', color: '#E53E3E' }}>{emailError}</span>}
              </div>
              <button
                type="button"
                onClick={addEmail}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '0.55rem 1rem', borderRadius: '8px',
                  background: 'var(--color-accent)', color: '#fff',
                  border: 'none', cursor: 'pointer', fontWeight: 600,
                  fontSize: '0.85rem', fontFamily: 'inherit', whiteSpace: 'nowrap',
                }}
              >
                <MdAdd size={18} /> Add
              </button>
            </div>
          )}

          {/* Save emails */}
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleSaveEmails}
              disabled={isSavingEmails}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '0.55rem 1.25rem', borderRadius: '8px',
                background: 'var(--color-accent)', color: '#fff',
                border: 'none', cursor: isSavingEmails ? 'not-allowed' : 'pointer',
                fontWeight: 700, fontSize: '0.85rem', fontFamily: 'inherit',
                opacity: isSavingEmails ? 0.7 : 1,
              }}
            >
              <MdSave size={16} /> {isSavingEmails ? 'Saving…' : 'Save Emails'}
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
        {saved && (
          <span style={{ fontSize: '0.85rem', color: '#27AE60', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <MdCheck size={16} /> Settings saved
          </span>
        )}
        <button
          type="submit"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.6rem 1.5rem', borderRadius: '8px',
            background: 'var(--color-accent)', color: '#fff',
            border: 'none', cursor: 'pointer', fontWeight: 700,
            fontSize: '0.88rem', fontFamily: 'inherit',
          }}
        >
          <MdSave size={17} /> Save Settings
        </button>
      </div>
    </form>
  );
};

export default Settings;
