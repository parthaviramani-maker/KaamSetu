import { adminStats, adminMonthlyData, topAgents } from '../data/dummyData';
import { MdTrendingUp, MdGroup, MdAttachMoney, MdSwapHoriz } from 'react-icons/md';
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

const Reports = () => (
  <div>
    {/* Summary Stats */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Active Jobs',           val: adminStats.activeJobs,                             color: 'teal',  icon: <MdTrendingUp /> },
        { label: 'Total Users',           val: (adminStats.totalEmployers + adminStats.totalWorkers + adminStats.totalAgents).toLocaleString('en-IN'), color: 'blue',  icon: <MdGroup /> },
        { label: 'Platform Revenue',      val: adminStats.platformRevenue,                        color: 'green', icon: <MdAttachMoney /> },
        { label: 'Total Placements',      val: adminStats.completedPlacements.toLocaleString('en-IN'), color: 'amber', icon: <MdSwapHoriz /> },
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

    {/* Two Charts Side by Side */}
    <div className="dash-grid-2">
      {/* Placements Chart */}
      <div className="section-card">
        <div className="section-card-header">
          <div><h3>Monthly Placements</h3><p>Last 6 months</p></div>
        </div>
        <div className="section-card-body">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminMonthlyData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                />
                <Bar dataKey="placements" name="Placements" fill="#00ABB3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="section-card">
        <div className="section-card-header">
          <div><h3>Monthly Revenue</h3><p>Last 6 months (₹)</p></div>
        </div>
        <div className="section-card-body">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminMonthlyData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                  formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#27AE60" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
              {adminMonthlyData.map((d, i) => {
                const prev = adminMonthlyData[i - 1];
                const growth = prev ? (((d.placements - prev.placements) / prev.placements) * 100).toFixed(1) : null;
                return (
                  <tr key={d.month}>
                    <td style={{ fontWeight: 600 }}>{d.month} 2024</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{d.placements}</td>
                    <td style={{ fontWeight: 700, color: '#27AE60' }}>₹{d.revenue.toLocaleString('en-IN')}</td>
                    <td>
                      {growth !== null ? (
                        <span style={{ color: growth >= 0 ? '#27AE60' : '#E53E3E', fontWeight: 600, fontSize: '0.82rem' }}>
                          {growth >= 0 ? '▲' : '▼'} {Math.abs(growth)}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default Reports;
