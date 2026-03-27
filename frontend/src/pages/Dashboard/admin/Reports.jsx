import { MdTrendingUp, MdGroup, MdAttachMoney, MdSwapHoriz } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useGetAdminStatsQuery } from '../../../services/adminApi';
import { useGetAdminReportsQuery } from '../../../services/adminApi';

const Reports = () => {
  const { data: statsRes, isLoading: statsLoading } = useGetAdminStatsQuery();
  const { data: reportsRes, isLoading: reportsLoading } = useGetAdminReportsQuery();

  const s       = statsRes?.data  || {};
  const monthly = reportsRes?.data?.monthly || [];

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  // Growth column: compare with previous month
  const withGrowth = monthly.map((row, i) => {
    if (i === 0) return { ...row, growth: null };
    const prev = monthly[i - 1].placements;
    if (prev === 0) return { ...row, growth: row.placements > 0 ? '+∞' : '—' };
    const pct = Math.round(((row.placements - prev) / prev) * 100);
    return { ...row, growth: pct >= 0 ? `+${pct}%` : `${pct}%`, growthNum: pct };
  });

  return (
  <div>
    {/* Summary Stats */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Active Jobs',      val: statsLoading ? '…' : (s.openJobs         ?? 0),                          color: 'teal',  icon: <MdTrendingUp /> },
        { label: 'Total Users',      val: statsLoading ? '…' : (s.totalUsers        ?? 0),                          color: 'blue',  icon: <MdGroup /> },
        { label: 'Platform Revenue', val: statsLoading ? '…' : fmt(s.platformEarnings ?? 0),                        color: 'green', icon: <MdAttachMoney /> },
        { label: 'Total Placements', val: statsLoading ? '…' : (s.totalPlacements   ?? 0),                          color: 'amber', icon: <MdSwapHoriz /> },
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
      {/* Monthly Placements Chart */}
      <div className="section-card">
        <div className="section-card-header"><div><h3>Monthly Placements</h3><p>Last 6 months</p></div></div>
        <div className="section-card-body">
          {reportsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Loading…</div>
          ) : monthly.every(m => m.placements === 0) ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No placement data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} allowDecimals={false} />
                <Tooltip formatter={(v) => [v, 'Placements']} />
                <Bar dataKey="placements" fill="var(--color-accent, #00ABB3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="section-card">
        <div className="section-card-header"><div><h3>Monthly Revenue</h3><p>Last 6 months (₹)</p></div></div>
        <div className="section-card-body">
          {reportsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Loading…</div>
          ) : monthly.every(m => m.revenue === 0) ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No revenue data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={v => `₹${v}`} />
                <Tooltip formatter={(v) => [fmt(v), 'Revenue']} />
                <Bar dataKey="revenue" fill="#27ae60" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>

    {/* Platform Growth Table */}
    <div className="section-card" style={{ marginTop: '1.5rem' }}>
      <div className="section-card-header">
        <div><h3>Monthly Growth Report</h3><p>Placements &amp; revenue breakdown</p></div>
      </div>
      <div className="section-card-body">
        {reportsLoading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</p>
        ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Placements</th>
                <th>Revenue (10% fee)</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {withGrowth.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No data yet.</td></tr>
              )}
              {withGrowth.map((row) => (
                <tr key={`${row.month}-${row.year}`}>
                  <td style={{ fontWeight: 600 }}>{row.month} {row.year}</td>
                  <td>{row.placements}</td>
                  <td style={{ fontWeight: 700, color: '#27AE60' }}>{fmt(row.revenue)}</td>
                  <td>
                    {row.growth === null ? (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                    ) : (
                      <span style={{
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        color: (row.growthNum ?? 0) >= 0 ? '#27ae60' : '#e74c3c',
                      }}>
                        {row.growth}
                      </span>
                    )}
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

export default Reports;
