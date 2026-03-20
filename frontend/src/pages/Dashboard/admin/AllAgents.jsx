import { MdStar, MdLocationOn, MdMonetizationOn, MdSwapHoriz } from 'react-icons/md';
import Avatar from '../../../components/Avatar';
import { useGetAllAgentsQuery } from '../../../services/adminApi';

const AllAgents = () => {
  const { data: res, isLoading, isError } = useGetAllAgentsQuery();
  const agents = res?.data || [];

  const totalPlacements = agents.reduce((s, a) => s + (a.totalPlacements || 0), 0);

  return (
  <div>
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Total Agents',     val: agents.length,   color: 'teal' },
        { label: 'Total Placements', val: totalPlacements, color: 'blue' },
        { label: 'Total Commission', val: `₹${agents.reduce((s, a) => s + (a.totalCommission || 0), 0).toLocaleString('en-IN')}`, color: 'amber' },
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
        <div><h3>All Agents</h3><p>Platform agents and their performance</p></div>
      </div>
      <div className="section-card-body">
        {isLoading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</p>}
        {isError   && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-error)' }}>Failed to load agents.</p>}
        {!isLoading && !isError && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Placements</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {agents.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No agents found.</td></tr>
              )}
              {agents.map(a => (
                <tr key={a._id}>
                  <td>
                    <div className="td-user">
                      <Avatar
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(a.name || 'A')}&background=00ABB3&color=fff&size=80`}
                        alt={a.name}
                      />
                      <div className="td-user-info">
                        <div className="name">{a.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{a.email}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{a.phone || '—'}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: 'var(--color-accent)' }}>
                      <MdSwapHoriz size={15} />{a.totalPlacements || 0}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#27AE60' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MdMonetizationOn size={14} />₹{(a.totalCommission || 0).toLocaleString('en-IN')}
                    </span>
                  </td>
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

export default AllAgents;
