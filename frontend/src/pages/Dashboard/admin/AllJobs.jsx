import { useState } from 'react';
import { MdSearch, MdWork, MdLocationOn, MdBusiness, MdCheckCircle } from 'react-icons/md';
import { useGetAllAdminJobsQuery } from '../../../services/adminApi';

const AllJobs = () => {
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: res, isLoading, isError } = useGetAllAdminJobsQuery();
  const jobs = res?.data || [];

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
        <div className="stat-card stat-card--teal">
          <div className="stat-icon stat-icon--teal"><MdWork /></div>
          <div className="stat-body">
            <p className="stat-label">Total Jobs</p>
            <p className="stat-value">{jobs.length}</p>
            <p className="stat-sub">all postings</p>
          </div>
        </div>
        <div className="stat-card stat-card--green">
          <div className="stat-icon stat-icon--green"><MdCheckCircle /></div>
          <div className="stat-body">
            <p className="stat-label">Open</p>
            <p className="stat-value">{jobs.filter(j => j.status === 'open').length}</p>
            <p className="stat-sub">active listings</p>
          </div>
        </div>
        <div className="stat-card stat-card--amber">
          <div className="stat-icon stat-icon--amber"><MdBusiness /></div>
          <div className="stat-body">
            <p className="stat-label">Closed</p>
            <p className="stat-value">{jobs.filter(j => j.status === 'closed').length}</p>
            <p className="stat-sub">completed jobs</p>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <div className="filter-inner">
            <div className="fi-search">
              <MdSearch className="fi-icon" size={18} />
              <input
                placeholder="Search jobs…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="dash-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="section-card-body">
          {isLoading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</p>}
          {isError   && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-error)' }}>Failed to load jobs.</p>}
          {!isLoading && !isError && (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Employer</th>
                  <th>Location</th>
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
                  <tr key={j._id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{j.title}</span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{j.company}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><MdLocationOn size={13} />{j.city}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>₹{j.pay}/{j.payType === 'monthly' ? 'mo' : 'day'}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {new Date(j.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td><span className={`badge badge-${j.status}`}>{j.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllJobs;
