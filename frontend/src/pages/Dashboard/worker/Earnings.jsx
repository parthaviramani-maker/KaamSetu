import { MdAttachMoney, MdTrendingUp, MdStar, MdWork } from 'react-icons/md';

const earningsHistory   = [];
const monthlyBreakdown  = [];
const maxEarned         = 0;

const Earnings = () => (
  <div>
    {/* Stats */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Total Earned',   val: '₹0', color: 'teal',  icon: <MdAttachMoney /> },
        { label: 'This Month',     val: '₹0', color: 'blue',  icon: <MdTrendingUp /> },
        { label: 'Jobs Completed', val: 0,    color: 'green', icon: <MdWork /> },
        { label: 'Avg Rating',     val: '—',  color: 'amber', icon: <MdStar /> },
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
      {/* Monthly Bar Chart */}
      <div className="section-card">
        <div className="section-card-header">
          <div><h3>Monthly Earnings</h3><p>Last 6 months</p></div>
        </div>
        <div className="section-card-body">
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            No earnings data yet.
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="section-card">
        <div className="section-card-header">
            <div><h3>Payment History</h3><p>0 transactions</p></div>
        </div>
        <div className="section-card-body">
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Days</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No payment history yet.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Earnings;
