import { MdSwapHoriz, MdCheckCircle, MdPending, MdMonetizationOn } from 'react-icons/md';
import { useGetAgentPlacementsQuery } from '../../../services/agentApi';

const Placements = () => {
  const { data: res, isLoading, isError } = useGetAgentPlacementsQuery();
  const placements = res?.data || [];

  const total      = placements.length;
  const active     = placements.filter(p => p.status === 'active').length;
  const completed  = placements.filter(p => p.status === 'completed').length;
  const totalComm  = placements.reduce((s, p) => s + (p.commission || 0), 0);

  return (
  <div>
    {/* Summary */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Total Placements', val: total,     color: 'teal',  icon: <MdSwapHoriz /> },
        { label: 'Active',           val: active,    color: 'blue',  icon: <MdPending /> },
        { label: 'Completed',        val: completed, color: 'green', icon: <MdCheckCircle /> },
        { label: 'Total Commission', val: `₹${totalComm.toLocaleString('en-IN')}`, color: 'amber', icon: <MdMonetizationOn /> },
      ].map(c => (
        <div key={c.label} className={`stat-card stat-card--${c.color}`}>
          <div className="stat-icon">{c.icon}</div>
          <div className="stat-body">
            <p className="stat-label">{c.label}</p>
            <p className="stat-value">{c.val}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="section-card">
      <div className="section-card-header">
        <div><h3>All Placements</h3><p>Workers placed at employer sites</p></div>
      </div>
      <div className="section-card-body">
        {isLoading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</p>}
        {isError   && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-error)' }}>Failed to load placements.</p>}
        {!isLoading && !isError && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Worker</th>
                <th>Employer</th>
                <th>Job Role</th>
                <th>Date</th>
                <th>Commission</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {placements.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No placements yet.</td></tr>
              )}
              {placements.map((p, i) => (
                <tr key={p._id}>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{i + 1}</td>
                  <td>{p.workerId?.name || '—'}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{p.employerId?.name || '—'}</td>
                  <td style={{ fontSize: '0.82rem' }}>{p.jobId?.title || '—'}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {new Date(p.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ fontWeight: 700, color: '#27AE60' }}>₹{(p.commission || 0).toLocaleString('en-IN')}</td>
                  <td><span className={`badge badge-${p.status === 'active' ? 'reviewing' : p.status === 'completed' ? 'hired' : 'applied'}`}>{p.status}</span></td>
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

export default Placements;
