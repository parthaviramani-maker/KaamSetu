import { MdMonetizationOn, MdTrendingUp, MdSwapHoriz, MdStar } from 'react-icons/md';
import { useGetAgentCommissionQuery, useGetAgentPlacementsQuery } from '../../../services/agentApi';
import WalletCard from '../../../components/WalletCard/WalletCard';

const Commission = () => {
  const { data: summaryRes, isLoading, isError } = useGetAgentCommissionQuery();
  const { data: placementsRes } = useGetAgentPlacementsQuery();

  const summary    = summaryRes?.data || {};
  const placements = placementsRes?.data || [];

  const totalEarned    = summary.totalCommission || 0;
  const totalPlaced    = summary.totalPlacements || 0;
  const activePlaced   = summary.activePlacements || 0;
  const completedPlaced = summary.completedPlacements || 0;
  const successRate    = totalPlaced > 0 ? Math.round((completedPlaced / totalPlaced) * 100) : '—';

  return (
  <div>
    {/* Wallet Card */}
    <WalletCard showTransactions={false} />

    {/* Stats */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Total Earned',  val: `₹${totalEarned.toLocaleString('en-IN')}`, color: 'teal',  icon: <MdMonetizationOn /> },
        { label: 'Active',        val: activePlaced,  color: 'blue',  icon: <MdTrendingUp /> },
        { label: 'Placements',    val: totalPlaced,   color: 'green', icon: <MdSwapHoriz /> },
        { label: 'Success Rate',  val: successRate === '—' ? '—' : `${successRate}%`, color: 'amber', icon: <MdStar /> },
      ].map(c => (
        <div key={c.label} className={`stat-card stat-card--${c.color}`}>
          <div className="stat-icon">{c.icon}</div>
          <div className="stat-body">
            <p className="stat-label">{c.label}</p>
            <p className="stat-value">{isLoading ? '…' : c.val}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="section-card">
      <div className="section-card-header">
        <div><h3>Commission Breakdown</h3><p>Per placement</p></div>
      </div>
      <div className="section-card-body">
        {isLoading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</p>}
        {isError   && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-error)' }}>Failed to load data.</p>}
        {!isLoading && !isError && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Worker</th>
                <th>Employer</th>
                <th>Job</th>
                <th>Date</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {placements.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No placements yet.</td></tr>
              )}
              {placements.map(p => (
                <tr key={p._id}>
                  <td>{p.workerId?.name || '—'}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{p.employerId?.name || '—'}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{p.jobId?.title || '—'}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {new Date(p.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ fontWeight: 700, color: '#27AE60' }}>₹{(p.commission || 0).toLocaleString('en-IN')}</td>
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

export default Commission;
