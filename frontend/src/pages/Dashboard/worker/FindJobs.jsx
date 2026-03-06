import { useState } from 'react';
import { MdSearch, MdLocationOn, MdAccessTime, MdWork, MdExpandMore, MdExpandLess, MdSend } from 'react-icons/md';
import { JobIcon } from '../data/jobIcons';
import { jobs } from '../data/dummyData';

const FindJobs = () => {
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expanded,   setExpanded]   = useState(null);
  const [applied,    setApplied]    = useState(new Set());

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.area.toLowerCase().includes(search.toLowerCase()) ||
                        j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'all' || j.type === typeFilter;
    return matchSearch && matchType && j.status !== 'closed';
  });

  const handleApply = (id) => {
    setApplied(prev => new Set([...prev, id]));
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="section-card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-card-body" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 200px' }}>
              <MdSearch size={20} style={{ color: 'var(--text-secondary)' }} />
              <input
                className="dash-search-input"
                placeholder="Search by title, area, or skill…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="dash-filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              {['Full-time', 'Part-time', 'Contract'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        {filtered.length} jobs found
      </p>

      {/* Job Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.length === 0 && (
          <div className="section-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No jobs found matching your search.
          </div>
        )}
        {filtered.map(job => (
          <div key={job.id} className="section-card">
            <div style={{ padding: '1.25rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div className="job-icon" style={{ minWidth: '44px' }}><JobIcon iconKey={job.icon} size={24} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{job.title}</h3>
                    <span className={`badge badge-${job.status}`}>{job.status}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>{job.company}</p>
                  <div className="job-meta" style={{ flexWrap: 'wrap' }}>
                    <span><MdLocationOn />{job.area}</span>
                    <span><MdWork style={{ fontSize: '0.8rem' }} />{job.type}</span>
                    <span><MdAccessTime />{job.posted}</span>
                  </div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {job.skills.map(s => (
                      <span key={s} style={{
                        fontSize: '0.72rem', padding: '2px 8px',
                        background: 'rgba(0,171,179,0.1)', color: 'var(--color-accent)',
                        borderRadius: '12px', fontWeight: 600,
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: '90px' }}>
                  <p style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '1rem', margin: 0 }}>{job.pay}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0' }}>
                    {job.workers} workers needed
                  </p>
                </div>
              </div>

              {/* Expand / Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <button
                  onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-secondary)', fontSize: '0.82rem',
                    display: 'flex', alignItems: 'center', gap: '4px', padding: 0,
                  }}
                >
                  {expanded === job.id ? <><MdExpandLess /> Hide details</> : <><MdExpandMore /> View details</>}
                </button>
                <button
                  className={`btn-icon-action ${applied.has(job.id) ? 'btn-icon-action--green' : 'btn-icon-action--teal'}`}
                  style={{ padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                  onClick={() => handleApply(job.id)}
                  disabled={applied.has(job.id)}
                >
                  <MdSend size={15} />
                  {applied.has(job.id) ? 'Applied ✓' : 'Apply Now'}
                </button>
              </div>

              {/* Expanded Details */}
              {expanded === job.id && (
                <div style={{
                  marginTop: '1rem', paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6,
                }}>
                  <p style={{ marginBottom: '0.5rem' }}>{job.description}</p>
                  <p><strong>Deadline:</strong> {job.deadline}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindJobs;
