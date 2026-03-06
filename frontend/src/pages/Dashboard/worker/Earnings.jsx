import { MdAttachMoney, MdTrendingUp, MdStar, MdWork } from 'react-icons/md';
import { workerStats, adminMonthlyData } from '../data/dummyData';

const earningsHistory = [
  { id: 1, job: 'Construction Worker — Shah Constructions', days: 5,  amount: '₹3,000', date: 'Dec 15, 2024', status: 'paid' },
  { id: 2, job: 'Plumber — Joshi Developers',              days: 3,  amount: '₹2,100', date: 'Dec 8, 2024',  status: 'paid' },
  { id: 3, job: 'Helper — Gujarat Roads Ltd',              days: 4,  amount: '₹1,600', date: 'Nov 28, 2024', status: 'paid' },
  { id: 4, job: 'Mason — Mehta Infra',                     days: 6,  amount: '₹3,900', date: 'Nov 15, 2024', status: 'paid' },
  { id: 5, job: 'Construction — Color Homes',              days: 2,  amount: '₹1,200', date: 'Oct 30, 2024', status: 'paid' },
];

const monthlyBreakdown = [
  { month: 'Jul', earned: 5200 },
  { month: 'Aug', earned: 6100 },
  { month: 'Sep', earned: 5800 },
  { month: 'Oct', earned: 7200 },
  { month: 'Nov', earned: 8700 },
  { month: 'Dec', earned: 7800 },
];
const maxEarned = Math.max(...monthlyBreakdown.map(m => m.earned));

const Earnings = () => (
  <div>
    {/* Stats */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Total Earned',   val: workerStats.totalEarned,     color: 'teal',  icon: <MdAttachMoney /> },
        { label: 'This Month',     val: workerStats.thisMonthEarned, color: 'blue',  icon: <MdTrendingUp /> },
        { label: 'Jobs Completed', val: workerStats.jobsCompleted,   color: 'green', icon: <MdWork /> },
        { label: 'Avg Rating',     val: workerStats.rating,          color: 'amber', icon: <MdStar /> },
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
          <div className="bar-chart">
            {monthlyBreakdown.map(m => (
              <div key={m.month} className="bar-group">
                <div className="bar-wrap">
                  <div
                    className="bar-fill"
                    style={{ height: `${(m.earned / maxEarned) * 100}%` }}
                    title={`₹${m.earned.toLocaleString('en-IN')}`}
                  />
                </div>
                <span className="bar-label">{m.month}</span>
                <span className="bar-value">₹{(m.earned / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="section-card">
        <div className="section-card-header">
          <div><h3>Payment History</h3><p>{earningsHistory.length} transactions</p></div>
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
                {earningsHistory.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontSize: '0.82rem', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {e.job}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{e.days}d</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{e.date}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{e.amount}</td>
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

export default Earnings;
