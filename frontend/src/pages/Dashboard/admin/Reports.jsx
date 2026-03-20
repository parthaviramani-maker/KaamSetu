import { MdTrendingUp, MdGroup, MdAttachMoney, MdSwapHoriz } from 'react-icons/md';

const adminMonthlyData = [];

const Reports = () => (
  <div>
    {/* Summary Stats */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Active Jobs',      val: 0,    color: 'teal',  icon: <MdTrendingUp /> },
        { label: 'Total Users',      val: 0,    color: 'blue',  icon: <MdGroup /> },
        { label: 'Platform Revenue', val: '₹0', color: 'green', icon: <MdAttachMoney /> },
        { label: 'Total Placements', val: 0,    color: 'amber', icon: <MdSwapHoriz /> },
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
        <div className="section-card">
          <div className="section-card-header"><div><h3>Monthly Placements</h3><p>Last 6 months</p></div></div>
          <div className="section-card-body">
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No placement data yet.</div>
          </div>
        </div>
        <div className="section-card">
          <div className="section-card-header"><div><h3>Monthly Revenue</h3><p>Last 6 months (₹)</p></div></div>
          <div className="section-card-body">
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No revenue data yet.</div>
          </div>
        </div>
      </div>

    {/* Platform Growth Table */}
    <div className="section-card" style={{ marginTop: '1.5rem' }}>
      <div className="section-card-header">
        <div><h3>Monthly Growth Report</h3><p>Placements &amp; revenue breakdown</p></div>
      </div>
      <div className="section-card-body">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Placements</th>
                <th>Revenue</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No data yet.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default Reports;
