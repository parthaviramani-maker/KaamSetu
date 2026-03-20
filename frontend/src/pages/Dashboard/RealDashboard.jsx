import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, selectRole, selectIsLogin, logout } from '../../store/authSlice';
import { persistor } from '../../store/store';
import {
  useGetAuthorizedEmailsQuery,
  useUpdateAuthorizedEmailsMutation,
} from '../../services/userApi';
import {
  MdLogout, MdDeleteForever, MdEmail, MdPhone,
  MdVerifiedUser, MdCalendarToday, MdAdd, MdClose, MdSave, MdSecurity,
} from 'react-icons/md';

const ROLE_LABELS = {
  employer: 'Kaam Saheb',
  worker:   'Kaam Saathi',
  agent:    'Kaam Setu',
  admin:    'Super Admin',
};

const ROLE_SUB = {
  employer: 'Employer',
  worker:   'Worker',
  agent:    'Agent',
  admin:    'Admin',
};

function RealDashboard() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const reduxUser = useSelector(selectUser);
  const token     = useSelector((s) => s.auth.token);
  const role      = useSelector(selectRole);

  const [profile,   setProfile]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [deleting,  setDeleting]  = useState(false);
  const [confirmDel,setConfirmDel]= useState(false);
  const [error,     setError]     = useState('');

  // Admin 2FA emails
  const isAdmin = role === 'admin';
  const { data: emailsData, isLoading: emailsLoading } = useGetAuthorizedEmailsQuery(undefined, { skip: !isAdmin });
  const [updateAuthorizedEmails, { isLoading: saving }] = useUpdateAuthorizedEmailsMutation();
  const [emailList,    setEmailList]    = useState([]);
  const [newEmail,     setNewEmail]     = useState('');
  const [emailError,   setEmailError]   = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const emailsInitialized = useRef(false);

  // Initialize email list from server ONCE on first load only
  useEffect(() => {
    if (!emailsInitialized.current && emailsData !== undefined) {
      setEmailList(emailsData?.data?.emails || []);
      emailsInitialized.current = true;
    }
  }, [emailsData]);

  const handleAddEmail = () => {
    const val = newEmail.trim().toLowerCase();
    if (!val) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) { setEmailError('Invalid email address'); return; }
    if (emailList.includes(val)) { setEmailError('Email already added'); return; }
    if (emailList.length >= 5) { setEmailError('Maximum 5 emails allowed'); return; }
    setEmailList(prev => [...prev, val]);
    setNewEmail('');
    setEmailError('');
  };

  const handleRemoveEmail = (email) => {
    setEmailList(prev => prev.filter(e => e !== email));
    setEmailSuccess('');
  };

  const handleSaveEmails = async () => {
    setEmailError('');
    setEmailSuccess('');

    // Auto-add whatever is still typed in the input field
    let listToSave = emailList;
    const pending = newEmail.trim().toLowerCase();
    if (pending) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(pending)) {
        setEmailError('Invalid email address in input field');
        return;
      }
      if (!listToSave.includes(pending) && listToSave.length < 5) {
        listToSave = [...listToSave, pending];
        setEmailList(listToSave);
        setNewEmail('');
      }
    }

    try {
      const res = await updateAuthorizedEmails(listToSave).unwrap();
      if (res.success) {
        // Update list directly from server's confirmed response
        const saved = res.data?.emails;
        if (saved) setEmailList(saved);
        setEmailSuccess('Saved successfully!');
        setTimeout(() => setEmailSuccess(''), 3000);
      }
    } catch (err) {
      setEmailError(err?.data?.message || 'Failed to save emails');
    }
  };

  // Fetch fresh profile from API
  // If token is expired / account deleted → auto-logout and go home
  useEffect(() => {
    if (!token) {
      // No token at all — clear and redirect immediately
      dispatch(logout());
      persistor.purge();
      navigate('/', { replace: true });
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (r.status === 401 || r.status === 403) {
          // Token invalid or account gone — wipe everything and go home
          dispatch(logout());
          persistor.purge();
          navigate('/', { replace: true });
          return;
        }
        const data = await r.json();
        if (data.success) {
          setProfile(data.data);
        } else {
          // Account not found / deactivated
          dispatch(logout());
          persistor.purge();
          navigate('/', { replace: true });
        }
      })
      .catch(() => {
        // Network error — still allow dashboard to show cached data
      })
      .finally(() => setLoading(false));
  }, [token, dispatch, navigate]);

  const user = profile || reduxUser;

  const avatarUrl = user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=00ABB3&color=fff&size=200`;

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null;

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();                        // clear persisted auth from localStorage
    navigate('/auth', { replace: true });     // replace /dashboard in history → back button won't return here
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError('');
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Failed to delete account');
        setDeleting(false);
        return;
      }
      // Account deleted — wipe all local state & go to landing page
      dispatch(logout());
      persistor.purge();                    // clear localStorage / redux-persist
      sessionStorage.clear();               // clear session storage
      navigate('/', { replace: true });     // replace history: back button cannot return to dashboard
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setDeleting(false);
      setConfirmDel(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6f8' }}>
        <p style={{ color: '#888', fontSize: '0.95rem' }}>Loading profile…</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f4f6f8',
      padding: '1.5rem',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        width: '100%',
        maxWidth: '420px',
        overflow: 'hidden',
      }}>

        {/* ── Top colour strip + Avatar ── */}
        <div style={{
          background: 'linear-gradient(135deg, #00ABB3 0%, #007d83 100%)',
          height: '110px',
          position: 'relative',
        }}>
          <img
            src={avatarUrl}
            alt={user?.name || 'User'}
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #fff',
              position: 'absolute',
              bottom: '-48px',
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              background: '#e0f7f8',
            }}
            onError={e => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=00ABB3&color=fff&size=200`;
            }}
          />
        </div>

        {/* ── Card body ── */}
        <div style={{ padding: '3.5rem 1.75rem 1.75rem', textAlign: 'center' }}>

          {/* Name */}
          <h2 style={{ margin: '0 0 4px', fontSize: '1.35rem', fontWeight: 700, color: '#252830' }}>
            {user?.name || 'User'}
          </h2>

          {/* Role badge */}
          <span style={{
            display: 'inline-block',
            background: 'rgba(0,171,179,0.12)',
            color: '#00ABB3',
            fontWeight: 700,
            fontSize: '0.75rem',
            padding: '3px 14px',
            borderRadius: '999px',
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}>
            {ROLE_LABELS[role] || role} · {ROLE_SUB[role] || ''}
          </span>

          {/* Info rows */}
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>

            {user?.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#555' }}>
                <MdEmail size={17} color="#00ABB3" style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-all' }}>{user.email}</span>
              </div>
            )}

            {user?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#555' }}>
                <MdPhone size={17} color="#00ABB3" style={{ flexShrink: 0 }} />
                <span>{user.phone}</span>
              </div>
            )}

            {joinedDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#555' }}>
                <MdCalendarToday size={16} color="#00ABB3" style={{ flexShrink: 0 }} />
                <span>Joined {joinedDate}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#555' }}>
              <MdVerifiedUser size={17} color="#27AE60" style={{ flexShrink: 0 }} />
              <span style={{ color: '#27AE60', fontWeight: 600 }}>Active Account</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#f0f0f0', margin: '0 0 1.25rem' }} />

          {/* ── Admin 2FA: Authorized Emails ── */}
          {isAdmin && (
            <div style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
                <MdSecurity size={18} color="#00ABB3" />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#252830' }}>
                  2FA Security Emails
                </span>
                <span style={{ fontSize: '0.75rem', color: '#999', marginLeft: 'auto' }}>
                  {emailList.length}/5
                </span>
              </div>

              {emailsLoading ? (
                <p style={{ fontSize: '0.8rem', color: '#999', margin: '0 0 8px' }}>Loading…</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                  {emailList.length === 0 && (
                    <p style={{ fontSize: '0.8rem', color: '#bbb', margin: 0 }}>No authorized emails added yet.</p>
                  )}
                  {emailList.map((em) => (
                    <div key={em} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: '#f0fbfc', border: '1px solid #d0eff1',
                      borderRadius: '8px', padding: '6px 10px',
                      fontSize: '0.82rem', color: '#333',
                    }}>
                      <span style={{ wordBreak: 'break-all', flex: 1 }}>{em}</span>
                      <button
                        onClick={() => handleRemoveEmail(em)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#e74c3c', padding: '0 0 0 8px', display: 'flex',
                        }}
                        title="Remove"
                      >
                        <MdClose size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add email input */}
              {emailList.length < 5 && (
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Add email…"
                    value={newEmail}
                    onChange={(e) => { setNewEmail(e.target.value); setEmailError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddEmail(); } }}
                    style={{
                      flex: 1, padding: '7px 10px', borderRadius: '8px',
                      border: '1.5px solid #ddd', fontSize: '0.83rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    style={{
                      background: '#00ABB3', border: 'none', borderRadius: '8px',
                      color: '#fff', padding: '7px 10px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                    }}
                    title="Add"
                  >
                    <MdAdd size={18} />
                  </button>
                </div>
              )}

              {emailError   && <p style={{ color: '#e74c3c', fontSize: '0.78rem', margin: '0 0 6px' }}>{emailError}</p>}
              {emailSuccess && <p style={{ color: '#27AE60', fontSize: '0.78rem', margin: '0 0 6px' }}>{emailSuccess}</p>}

              <button
                type="button"
                onClick={handleSaveEmails}
                disabled={saving}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  background: saving ? '#b2e0e2' : '#00ABB3',
                  border: 'none', borderRadius: '10px',
                  color: '#fff', padding: '9px 0',
                  fontSize: '0.85rem', fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <MdSave size={16} /> {saving ? 'Saving…' : 'Save Emails'}
              </button>

              <div style={{ height: '1px', background: '#f0f0f0', margin: '1.25rem 0' }} />
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleLogout}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                background: 'none',
                border: '1.5px solid #ccc',
                color: '#555',
                borderRadius: '10px',
                padding: '9px 0',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#252830'; e.currentTarget.style.color='#252830'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#ccc';    e.currentTarget.style.color='#555'; }}
            >
              <MdLogout size={16} /> Logout
            </button>

            <button
              onClick={() => setConfirmDel(true)}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                background: 'rgba(231,76,60,0.07)',
                border: '1.5px solid #e74c3c',
                color: '#e74c3c',
                borderRadius: '10px',
                padding: '9px 0',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(231,76,60,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(231,76,60,0.07)'; }}
            >
              <MdDeleteForever size={17} /> Delete Account
            </button>
          </div>

          {error && (
            <p style={{ color: '#e74c3c', fontSize: '0.82rem', marginTop: '0.75rem' }}>{error}</p>
          )}
        </div>
      </div>

      {/* ── Delete Confirm Modal ── */}
      {confirmDel && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999, padding: '1rem',
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px',
            padding: '2rem 1.75rem', maxWidth: '340px', width: '100%',
            textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            <MdDeleteForever size={44} color="#e74c3c" />
            <h3 style={{ margin: '0.5rem 0 0.4rem', color: '#252830' }}>Delete Account?</h3>
            <p style={{ fontSize: '0.88rem', color: '#666', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
              This will <strong>permanently delete</strong> your account and all your data.
              This action <strong>cannot be undone</strong>.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setConfirmDel(false); setError(''); }}
                disabled={deleting}
                style={{
                  flex: 1, padding: '9px', borderRadius: '9px',
                  border: '1.5px solid #ccc', background: 'none',
                  color: '#555', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                style={{
                  flex: 1, padding: '9px', borderRadius: '9px',
                  border: 'none',
                  background: '#e74c3c', color: '#fff',
                  fontSize: '0.88rem', fontWeight: 600,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RealDashboard;
