import { MdMonetizationOn, MdTrendingUp, MdSwapHoriz, MdStar } from 'react-icons/md';
import { agentStats, placements } from '../data/dummyData';

const monthlyCommission = [
  { month: 'Jul', amount: 5800 },
  { month: 'Aug', amount: 6400 },
  { month: 'Sep', amount: 7100 },
  { month: 'Oct', amount: 7600 },
  { month: 'Nov', amount: 8000 },
  { month: 'Dec', amount: 8200 },
];
const maxAmount = Math.max(...monthlyCommission.map(m => m.amount));

const Commission = () => (
  <div>
    {/* Stats */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'This Month',      val: agentStats.monthlyCommission, color: 'teal',  icon: <MdMonetizationOn /> },
        { label: 'Total Earned',    val: agentStats.totalCommission,   color: 'blue',  icon: <MdTrendingUp /> },
        { label: 'Placements',      val: agentStats.activePlacements,  color: 'green', icon: <MdSwapHoriz /> },
        { label: 'Success Rate',    val: `${agentStats.successRate}%`, color: 'amber', icon: <MdStar /> },
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

    <div className="dash-grid-2">
      {/* Bar Chart */}
      <div className="section-card">
        <div className="section-card-header">
          <div><h3>Monthly Commission</h3><p>Last 6 months</p></div>
        </div>
        <div className="section-card-body">
          <div className="bar-chart">
            {monthlyCommission.map(m => (
              <div key={m.month} className="bar-group">
                <div className="bar-wrap">
                  <div
                    className="bar-fill"
                    style={{ height: `${(m.amount / maxAmount) * 100}%` }}
                    title={`₹${m.amount.toLocaleString('en-IN')}`}
                  />
                </div>
                <span className="bar-label">{m.month}</span>
                <span className="bar-value">₹{(m.amount / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commission Breakdown Table */}
      <div className="section-card">
        <div className="section-card-header">
          <div><h3>Commission Breakdown</h3><p>Per placement</p></div>
        </div>
        <div className="section-card-body">
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Employer</th>
                  <th>Date</th>
                  <th>Commission</th>
                </tr>
              </thead>
              <tbody>
                {placements.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.worker}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.employer}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.date}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{p.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Commission;
