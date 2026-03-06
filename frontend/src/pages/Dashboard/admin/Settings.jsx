import { useState } from 'react';
import { MdSave, MdCheck } from 'react-icons/md';

const Settings = () => {
  const [saved, setSaved] = useState(false);
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
