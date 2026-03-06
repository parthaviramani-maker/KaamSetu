import { Link } from 'react-router-dom';
import {
  MdBusiness, MdGroup, MdSupervisorAccount, MdAttachMoney,
  MdArrowForward, MdTrendingUp, MdStar, MdVerified, MdPersonAdd, MdAdminPanelSettings,
} from 'react-icons/md';
import Avatar from '../../../components/Avatar';
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { adminStats, adminMonthlyData, topAgents, allUsers } from '../data/dummyData';

const AdminOverview = () => {
  const recentSignups = allUsers.slice(0, 5);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      {/* Greeting Banner */}
      <div className="dash-greeting">
        <div className="greeting-left">
          <p className="greeting-tag" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MdAdminPanelSettings /> Admin Panel</p>
          <h2>Platform Overview</h2>
          <p>Monitor all platform activity, users, and performance metrics.</p>
        </div>
        <div className="greeting-right">
          <p className="greeting-date">{today}</p>
          <span className="greeting-role">Super Admin</span>
        </div>
      </div>

      {/* Big Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card--teal">
          <div className="stat-icon"><MdBusiness /></div>
          <div className="stat-body">
            <p className="stat-label">Total Employers</p>
            <p className="stat-value">{adminStats.totalEmployers.toLocaleString('en-IN')}</p>
            <p className="stat-sub">{adminStats.newSignupsToday} new today</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> +124 this month</span>
        </div>

        <div className="stat-card stat-card--blue">
          <div className="stat-icon" style={{ background: 'rgba(49,130,206,0.12)', color: '#3182CE' }}><MdGroup /></div>
          <div className="stat-body">
            <p className="stat-label">Total Workers</p>
            <p className="stat-value">{adminStats.totalWorkers.toLocaleString('en-IN')}</p>
            <p className="stat-sub">Across all areas</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> +892 this month</span>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon" style={{ background: 'rgba(39,174,96,0.12)', color: '#27AE60' }}><MdSupervisorAccount /></div>
          <div className="stat-body">
            <p className="stat-label">Total Agents</p>
            <p className="stat-value">{adminStats.totalAgents}</p>
            <p className="stat-sub">{adminStats.pendingVerifications} pending verification</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> +18 this month</span>
        </div>

        <div className="stat-card stat-card--amber">
          <div className="stat-icon" style={{ background: 'rgba(246,173,85,0.12)', color: '#C68A00' }}><MdAttachMoney /></div>
          <div className="stat-body">
            <p className="stat-label">Platform Revenue</p>
            <p className="stat-value">{adminStats.platformRevenue}</p>
            <p className="stat-sub">{adminStats.completedPlacements.toLocaleString('en-IN')} placements</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> +22% this month</span>
        </div>
      </div>

      {/* Bar Chart + Top Agents */}
      <div className="dash-grid-2">
        {/* Monthly Placements Bar Chart */}
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

        {/* Top Agents */}
        <div className="section-card">
          <div className="section-card-header">
            <div><h3>Top Agents</h3><p>By placements this month</p></div>
            <Link to="/dashboard/admin/agents" className="view-all-link">View All <MdArrowForward /></Link>
          </div>
          <div className="section-card-body">
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr><th>Agent</th><th>Area</th><th>Placed</th><th>Rating</th></tr>
                </thead>
                <tbody>
                  {topAgents.map(a => (
                    <tr key={a.id}>
                      <td>
                        <div className="td-user">
                        <Avatar src={a.avatar} alt={a.name} />
                          <div className="td-user-info"><div className="name">{a.name}</div></div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{a.area}</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{a.placements}</td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', color: '#C68A00', fontWeight: 600 }}>
                          <MdStar size={13} />{a.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Signups + Pending Verifications */}
      <div className="dash-grid-2" style={{ marginTop: '1.5rem' }}>
        <div className="section-card">
          <div className="section-card-header">
            <div><h3>Recent Signups</h3><p>{adminStats.newSignupsToday} new today</p></div>
            <Link to="/dashboard/admin/users" className="view-all-link">View All <MdArrowForward /></Link>
          </div>
          <div className="section-card-body">
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr><th>User</th><th>Role</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {recentSignups.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="td-user">
                          <Avatar src={u.avatar} alt={u.name} />
                          <div className="td-user-info">
                            <div className="name">{u.name}</div>
                            <div className="meta">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className={`badge badge-${u.role === 'employer' ? 'teal' : u.role === 'worker' ? 'active' : u.role === 'agent' ? 'reviewing' : 'hired'}`}>{u.role}</span></td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <div><h3>Pending Verifications</h3><p>{adminStats.pendingVerifications} awaiting review</p></div>
          </div>
          <div className="section-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'Nilesh Kothari',  type: 'Agent',    area: 'Vadodara', icon: <MdVerified style={{ color: '#3182CE' }} /> },
                { name: 'Priya Sharma',   type: 'Employer', area: 'Surat',    icon: <MdPersonAdd style={{ color: '#27AE60' }} /> },
                { name: 'Harish Trivedi', type: 'Agent',    area: 'Anand',    icon: <MdVerified style={{ color: '#3182CE' }} /> },
              ].map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                    {v.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem' }}>{v.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{v.type} · {v.area}</p>
                  </div>
                  <span className="badge badge-reviewing">Pending</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
