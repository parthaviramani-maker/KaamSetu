import { useState } from 'react';
import { MdFilterList, MdSearch, MdCheckCircle, MdCancel, MdStar } from 'react-icons/md';
import { applicants, jobs } from '../data/dummyData';
import Avatar from '../../../components/Avatar';

const STATUS_COLORS = {
  applied:   'badge-applied',
  reviewing: 'badge-reviewing',
  interview: 'badge-interview',
  hired:     'badge-hired',
  rejected:  'badge-rejected',
};

const Applicants = () => {
  const [search,    setSearch]    = useState('');
  const [jobFilter, setJobFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [list, setList] = useState(applicants);

  const jobTitles = [...new Set(jobs.map(j => j.title))];

  const filtered = list.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
                        a.skill.toLowerCase().includes(search.toLowerCase());
    const matchJob    = jobFilter === 'all' || a.job === jobFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchJob && matchStatus;
  });

  const handleApprove = (id) => {
    setList(prev => prev.map(a => a.id === id ? { ...a, status: 'hired' } : a));
  };
  const handleReject = (id) => {
    setList(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
  };

  const counts = {
    total:     list.length,
    reviewing: list.filter(a => a.status === 'reviewing').length,
    hired:     list.filter(a => a.status === 'hired').length,
    rejected:  list.filter(a => a.status === 'rejected').length,
  };

  return (
    <div>
      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total',     val: counts.total,     color: 'teal' },
          { label: 'Reviewing', val: counts.reviewing, color: 'blue' },
          { label: 'Hired',     val: counts.hired,     color: 'green' },
          { label: 'Rejected',  val: counts.rejected,  color: 'amber' },
        ].map(c => (
          <div key={c.label} className={`stat-card stat-card--${c.color}`}>
            <div className="stat-body">
              <p className="stat-label">{c.label}</p>
              <p className="stat-value">{c.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card">
        {/* Filters */}
        <div className="section-card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 200px' }}>
            <MdSearch size={18} style={{ color: 'var(--text-secondary)' }} />
            <input
              className="dash-search-input"
              placeholder="Search applicants…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select className="dash-filter-select" value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
              <option value="all">All Jobs</option>
              {jobTitles.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="dash-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              {['applied','reviewing','interview','hired','rejected'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="section-card-body">
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Job Applied</th>
                  <th>Rating</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No applicants found</td></tr>
                )}
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="td-user">
                        <Avatar src={a.avatar} alt={a.name} />
                        <div className="td-user-info">
                          <div className="name">{a.name}</div>
                          <div className="meta">{a.skill}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {a.job}
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', color: '#C68A00', fontWeight: 600 }}>
                        <MdStar size={14} /> {a.rating}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{a.applied}</td>
                    <td><span className={`badge ${STATUS_COLORS[a.status] || 'badge-applied'}`}>{a.status}</span></td>
                    <td>
                      {(a.status !== 'hired' && a.status !== 'rejected') && (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            className="btn-icon-action btn-icon-action--green"
                            title="Approve"
                            onClick={() => handleApprove(a.id)}
                          >
                            <MdCheckCircle size={18} />
                          </button>
                          <button
                            className="btn-icon-action btn-icon-action--red"
                            title="Reject"
                            onClick={() => handleReject(a.id)}
                          >
                            <MdCancel size={18} />
                          </button>
                        </div>
                      )}
                      {a.status === 'hired'    && <span style={{ fontSize: '0.78rem', color: '#27AE60', fontWeight: 600 }}>✓ Hired</span>}
                      {a.status === 'rejected' && <span style={{ fontSize: '0.78rem', color: 'var(--color-error)', fontWeight: 600 }}>✗ Rejected</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
