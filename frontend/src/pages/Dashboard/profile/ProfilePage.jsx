import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MdPerson, MdEmail, MdPhone, MdLocationOn, MdWork, MdSave, MdCheck, MdEdit } from 'react-icons/md';
import { selectUser, selectRole } from '../../../store/authSlice';
<<<<<<< HEAD
import Avatar from '../../../components/Avatar';
=======
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442

const ROLE_LABELS = {
  employer: 'Kaam Saheb · Employer',
  worker:   'Kaam Saathi · Worker',
  agent:    'Kaam Setu · Agent',
  admin:    'Super Admin',
};

const ProfilePage = () => {
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [errors,  setErrors]  = useState({});

  const [form, setForm] = useState({
    name:     user?.name  || '',
    email:    user?.email || '',
    phone:    '',
    city:     '',
    skill:    '',
    bio:      '',
  });

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

  const handleSave = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

<<<<<<< HEAD
  const avatarUrl = user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'User')}&background=00ABB3&color=fff&size=128`;
=======
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'User')}&background=00ABB3&color=fff&size=128`;
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
  const completion = [form.name, form.email, form.phone, form.city, form.skill, form.bio].filter(Boolean).length;
  const completionPct = Math.round((completion / 6) * 100);

  return (
    <div>
      <div className="dash-grid-2" style={{ alignItems: 'start' }}>
        {/* Left: Avatar + Role */}
        <div className="section-card">
          <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1.5rem', textAlign: 'center' }}>
<<<<<<< HEAD
            <Avatar
=======
            <img
>>>>>>> ab1561c24907c7fecd4e655bc6f4490e6aa04442
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
                  {saved && (
                    <span style={{ fontSize: '0.82rem', color: '#27AE60', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <MdCheck size={15} /> Saved!
                    </span>
                  )}
                  <button
                    type="submit"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '0.55rem 1.25rem', borderRadius: '8px',
                      background: 'var(--color-accent)', color: '#fff',
                      border: 'none', cursor: 'pointer', fontWeight: 700,
                      fontSize: '0.85rem', fontFamily: 'inherit',
                    }}
                  >
                    <MdSave size={16} /> Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
