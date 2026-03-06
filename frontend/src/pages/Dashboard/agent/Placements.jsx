import { placements, agentStats } from '../data/dummyData';
import { MdSwapHoriz, MdCheckCircle, MdPending, MdMonetizationOn } from 'react-icons/md';

const Placements = () => (
  <div>
    {/* Summary */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Total Placements', val: placements.length,                                   color: 'teal',  icon: <MdSwapHoriz /> },
        { label: 'Placed',           val: placements.filter(p => p.status === 'placed').length,  color: 'green', icon: <MdCheckCircle /> },
        { label: 'Pending',          val: placements.filter(p => p.status === 'pending').length, color: 'blue',  icon: <MdPending /> },
        { label: 'Total Commission', val: agentStats.totalCommission,                           color: 'amber', icon: <MdMonetizationOn /> },
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
              {placements.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{String(i + 1).padStart(2, '0')}</td>
                  <td style={{ fontWeight: 600 }}>{p.worker}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{p.employer}</td>
                  <td style={{ fontSize: '0.82rem' }}>{p.job}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.date}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{p.commission}</td>
                  <td>
                    <span className={`badge badge-${p.status === 'placed' ? 'hired' : 'reviewing'}`}>{p.status}</span>
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

export default Placements;
