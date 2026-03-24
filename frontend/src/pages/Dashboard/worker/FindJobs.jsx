import { useState } from 'react';
import {
  MdSearch, MdLocationOn, MdAccessTime, MdWork,
  MdExpandMore, MdExpandLess, MdSend, MdCheckCircle,
  MdPeople, MdCalendarToday, MdPhone, MdBusiness,
} from 'react-icons/md';
import { JobIcon } from '../data/jobIcons';
import { useGetAllJobsQuery } from '../../../services/jobApi';
import { useApplyJobMutation, useGetMyApplicationsQuery } from '../../../services/applicationApi';
import toast from '../../../components/Toast/toast';

const FindJobs = () => {
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expanded,   setExpanded]   = useState(null);
  const [applying,   setApplying]   = useState(new Set());
  // Local set tracks newly applied this session (merged with DB data below)
  const [newlyApplied, setNewlyApplied] = useState(new Set());

  const { data: jobsRes, isLoading, isError } = useGetAllJobsQuery();
  const { data: myAppsRes } = useGetMyApplicationsQuery();
  const [applyJob] = useApplyJobMutation();

  // Build applied set from DB + this session
  const dbAppliedIds = new Set(
    (myAppsRes?.data || []).map(app => app.jobId?._id || app.jobId)
  );
  const appliedSet = new Set([...dbAppliedIds, ...newlyApplied]);

  const jobs = jobsRes?.data || [];

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.area.toLowerCase().includes(search.toLowerCase()) ||
                        j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'all' || j.workType === typeFilter;
    return matchSearch && matchType;
  });

  const handleApply = async (jobId) => {
    setApplying(prev => new Set([...prev, jobId]));
    try {
      const res = await applyJob({ jobId }).unwrap();
      setNewlyApplied(prev => new Set([...prev, jobId]));
      toast.success(res?.message || 'Application submitted!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to apply');
    } finally {
      setApplying(prev => { const s = new Set(prev); s.delete(jobId); return s; });
    }
  };

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
      Loading jobs…
    </div>
  );
  if (isError) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-error)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
      Failed to load jobs. Please try again.
    </div>
  );

  return (
    <div>
      {/* ── Search + Filter Bar ───────────────────────────────────────── */}
      <div className="section-card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-card-body" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              flex: '1 1 220px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px', padding: '0 0.75rem',
            }}>
              <MdSearch size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              <input
                className="dash-search-input"
                placeholder="Search by title, area, or skill…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', padding: '0.65rem 0' }}
              />
            </div>
            <select
              className="dash-filter-select"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {['Full-time', 'Part-time', 'Daily-wage', 'Contract'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result count */}
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 500 }}>
        {filtered.length} job{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* ── Job Cards ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {filtered.length === 0 && (
          <div className="section-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔎</div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No jobs found</p>
            <p style={{ fontSize: '0.85rem' }}>Try different keywords or remove filters</p>
          </div>
        )}

        {filtered.map(job => {
          const jobId      = job._id;
          const isApplied  = appliedSet.has(jobId);
          const isApplying = applying.has(jobId);
          const isOpen     = expanded === jobId;
          const daysLeft   = job.deadline
            ? Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24))
            : null;

          return (
            <div
              key={jobId}
              className="section-card"
              style={{
                transition: 'box-shadow 0.2s',
                ...(isApplied ? { borderLeft: '3px solid #27AE60' } : {}),
              }}
            >
              <div style={{ padding: '1.25rem 1.5rem' }}>

                {/* ── Top Row ─────────────────────────────────────── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>

                  {/* Job Icon */}
                  <div className="job-icon" style={{ minWidth: 48, height: 48, borderRadius: 14, fontSize: 26 }}>
                    <JobIcon iconKey={job.workType} size={26} />
                  </div>

                  {/* Main Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                      <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{job.title}</h3>
                      <span className={`badge badge-${job.status}`}>{job.status}</span>
                      {isApplied && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3,
                          fontSize: '0.72rem', fontWeight: 700,
                          color: '#27AE60', background: 'rgba(39,174,96,0.1)',
                          borderRadius: 20, padding: '2px 8px',
                        }}>
                          <MdCheckCircle size={12} /> Applied
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      <MdBusiness size={13} style={{ color: 'var(--text-secondary)' }} />
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{job.company}</span>
                    </div>

                    {/* Meta pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
                      <span style={pillStyle}><MdLocationOn size={12} /> {job.city}{job.area ? `, ${job.area}` : ''}</span>
                      <span style={pillStyle}><MdWork size={12} /> {job.workType}</span>
                      <span style={pillStyle}><MdPeople size={12} /> {job.workersNeeded} needed</span>
                      {daysLeft !== null && (
                        <span style={{ ...pillStyle, ...(daysLeft <= 3 ? urgentPill : {}) }}>
                          <MdCalendarToday size={12} />
                          {daysLeft > 0 ? `${daysLeft}d left` : 'Last day!'}
                        </span>
                      )}
                    </div>

                    {/* Skill tags */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {(job.skills || []).map(s => (
                        <span key={s} style={skillTag}>{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Pay block */}
                  <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 80 }}>
                    <p style={{ fontWeight: 800, color: 'var(--color-accent)', fontSize: '1.15rem', margin: 0, lineHeight: 1 }}>
                      ₹{job.pay.toLocaleString('en-IN')}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                      per {job.payType === 'monthly' ? 'month' : 'day'}
                    </p>
                  </div>
                </div>

                {/* ── Divider ─────────────────────────────────────── */}
                <div style={{ height: 1, background: 'var(--border-color)', margin: '1rem 0' }} />

                {/* ── Bottom Row: expand + apply ───────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : jobId)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-secondary)', fontSize: '0.82rem',
                      display: 'flex', alignItems: 'center', gap: '4px', padding: 0,
                      fontFamily: 'inherit', fontWeight: 500,
                    }}
                  >
                    {isOpen ? <><MdExpandLess size={18} /> Hide details</> : <><MdExpandMore size={18} /> View details</>}
                  </button>

                  {/* Apply Button */}
                  {isApplied ? (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.55rem 1.25rem', borderRadius: 10,
                      background: 'rgba(39,174,96,0.1)', color: '#27AE60',
                      fontWeight: 700, fontSize: '0.85rem',
                      border: '1.5px solid rgba(39,174,96,0.3)',
                    }}>
                      <MdCheckCircle size={17} /> Application Sent
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.4rem', fontSize: '0.88rem' }}
                      onClick={() => handleApply(jobId)}
                      disabled={isApplying}
                    >
                      <MdSend size={16} />
                      {isApplying ? 'Applying…' : 'Apply Now'}
                    </button>
                  )}
                </div>

                {/* ── Expanded Details ─────────────────────────────── */}
                {isOpen && (
                  <div style={{
                    marginTop: '1rem', padding: '1rem 1.25rem',
                    background: 'var(--bg-primary)', borderRadius: 12,
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7,
                  }}>
                    {job.description && (
                      <p style={{ marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{job.description}</p>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                      {job.deadline && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <MdCalendarToday size={14} style={{ color: 'var(--color-accent)' }} />
                          <strong>Deadline:</strong>&nbsp;{new Date(job.deadline).toLocaleDateString('en-IN')}
                        </span>
                      )}
                      {job.contactInfo && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <MdPhone size={14} style={{ color: 'var(--color-accent)' }} />
                          <strong>Contact:</strong>&nbsp;{job.contactInfo}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MdAccessTime size={14} style={{ color: 'var(--color-accent)' }} />
                        <strong>Posted:</strong>&nbsp;{new Date(job.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Shared micro-styles ───────────────────────────────────────────────────────
const pillStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  fontSize: '0.75rem', fontWeight: 500,
  color: 'var(--text-secondary)',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-color)',
  borderRadius: 20, padding: '2px 9px',
};

const urgentPill = {
  color: '#E53E3E',
  background: 'rgba(229,62,62,0.08)',
  borderColor: 'rgba(229,62,62,0.25)',
  fontWeight: 700,
};

const skillTag = {
  fontSize: '0.72rem', padding: '3px 10px',
  background: 'rgba(0,171,179,0.1)', color: 'var(--color-accent)',
  borderRadius: 20, fontWeight: 600,
  border: '1px solid rgba(0,171,179,0.2)',
};

export default FindJobs;
