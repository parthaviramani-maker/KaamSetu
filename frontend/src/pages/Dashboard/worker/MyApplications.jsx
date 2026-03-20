import { useGetMyApplicationsQuery } from '../../../services/applicationApi';

// Backend statuses: pending / approved / rejected
const STATUS_CLASS = {
  pending:  'badge-reviewing',
  approved: 'badge-hired',
  rejected: 'badge-rejected',
};
const STATUS_LABEL = {
  pending:  'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const MyApplications = () => {
  const { data: res, isLoading, isError } = useGetMyApplicationsQuery();
  const myApps = res?.data || [];

  const counts = {
    total:    myApps.length,
    pending:  myApps.filter(a => a.status === 'pending').length,
    approved: myApps.filter(a => a.status === 'approved').length,
    rejected: myApps.filter(a => a.status === 'rejected').length,
  };

  return (
  <div>
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Total Applied', val: counts.total,    color: 'teal' },
        { label: 'Pending',       val: counts.pending,  color: 'blue' },
        { label: 'Approved',      val: counts.approved, color: 'green' },
        { label: 'Rejected',      val: counts.rejected, color: 'amber' },
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
      <div className="section-card-header">
        <div>
          <h3>My Applications</h3>
          <p>Track the status of all your job applications</p>
        </div>
      </div>
      <div className="section-card-body">
        {isLoading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</p>}
        {isError   && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-error)' }}>Failed to load applications.</p>}
        {!isLoading && !isError && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Pay</th>
                <th>Applied On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myApps.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No applications yet. Start applying to jobs to track them here.</td></tr>
              )}
              {myApps.map(app => {
                const job = app.jobId || {};
                return (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 600 }}>{job.title || '—'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{job.company || '—'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{job.city || '—'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '0.85rem' }}>
                      {job.pay ? `₹${job.pay}/${job.payType === 'monthly' ? 'mo' : 'day'}` : '—'}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {new Date(app.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <span className={`badge ${STATUS_CLASS[app.status] || 'badge-applied'}`}>
                        {STATUS_LABEL[app.status] || app.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default MyApplications;
