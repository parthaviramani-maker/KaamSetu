import { useState } from 'react';
import { MdSearch, MdWork, MdLocationOn } from 'react-icons/md';
import { jobs } from '../data/dummyData';

const AllJobs = () => {
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Jobs', val: jobs.length,                                  color: 'teal' },
          { label: 'Active',     val: jobs.filter(j => j.status === 'active').length, color: 'green' },
          { label: 'Closed',     val: jobs.filter(j => j.status === 'closed').length, color: 'amber' },
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
        <div className="section-card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 200px' }}>
            <MdSearch size={18} style={{ color: 'var(--text-secondary)' }} />
            <input
              className="dash-search-input"
              placeholder="Search jobs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="dash-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="section-card-body">
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Employer</th>
                  <th>Area</th>
                  <th>Pay</th>
                  <th>Posted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No jobs found</td></tr>
                )}
                {filtered.map(j => (
                  <tr key={j.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{j.icon}</span>
                        <span style={{ fontWeight: 600 }}>{j.title}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{j.company}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><MdLocationOn size={13} />{j.area.split(',')[0]}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{j.pay}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{j.posted}</td>
                    <td><span className={`badge badge-${j.status}`}>{j.status}</span></td>
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

export default AllJobs;
