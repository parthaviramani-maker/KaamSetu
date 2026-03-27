import { Link } from 'react-router-dom';
import {
  MdBusiness, MdGroup, MdSupervisorAccount, MdAttachMoney,
  MdArrowForward, MdSwapHoriz, MdMonetizationOn, MdAdminPanelSettings,
} from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useGetAdminStatsQuery, useGetAllUsersQuery, useGetAllAgentsQuery, useGetAdminReportsQuery } from '../../../services/adminApi';

const EmptyState = ({ message }) => (
  <div className="empty-state">
    <p>{message}</p>
  </div>
);

const AdminOverview = () => {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const { data: statsRes   } = useGetAdminStatsQuery();
  const { data: usersRes    } = useGetAllUsersQuery({});
  const { data: agentsRes   } = useGetAllAgentsQuery();
  const { data: reportsRes  } = useGetAdminReportsQuery();
  const s       = statsRes?.data  || {};
  const users   = usersRes?.data  || [];
  const agents  = agentsRes?.data || [];
  const monthly = reportsRes?.data?.monthly || [];

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
            <p className="stat-value">{s.byRole?.employers ?? 0}</p>
            <p className="stat-sub">{s.byRole?.employers ? 'registered' : 'No employers yet'}</p>
          </div>
        </div>

        <div className="stat-card stat-card--blue">
          <div className="stat-icon" style={{ background: 'rgba(49,130,206,0.12)', color: '#3182CE' }}><MdGroup /></div>
          <div className="stat-body">
            <p className="stat-label">Total Workers</p>
            <p className="stat-value">{s.byRole?.workers ?? 0}</p>
            <p className="stat-sub">{s.byRole?.workers ? 'registered' : 'No workers yet'}</p>
          </div>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon" style={{ background: 'rgba(39,174,96,0.12)', color: '#27AE60' }}><MdSupervisorAccount /></div>
          <div className="stat-body">
            <p className="stat-label">Total Agents</p>
            <p className="stat-value">{s.byRole?.agents ?? 0}</p>
            <p className="stat-sub">{s.byRole?.agents ? 'registered' : 'No agents yet'}</p>
          </div>
        </div>

        <div className="stat-card stat-card--amber">
          <div className="stat-icon" style={{ background: 'rgba(246,173,85,0.12)', color: '#C68A00' }}><MdAttachMoney /></div>
          <div className="stat-body">
            <p className="stat-label">Total Placements</p>
            <p className="stat-value">{s.totalPlacements ?? 0}</p>
            <p className="stat-sub">{s.totalPlacements ? 'all time' : 'No placements yet'}</p>
          </div>
        </div>
      </div>

      {/* Platform Earnings Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: '1rem' }}>
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #1a6b3c, #27ae60)',
          color: '#fff',
          boxShadow: '0 6px 24px rgba(39,174,96,0.3)',
        }}>
          <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
            <MdMonetizationOn />
          </div>
          <div className="stat-body">
            <p className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Platform Earnings (10% fee)</p>
            <p className="stat-value" style={{ color: '#fff' }}>₹{(s.platformEarnings || 0).toLocaleString('en-IN')}</p>
            <p className="stat-sub" style={{ color: 'rgba(255,255,255,0.65)' }}>Total collected from placements</p>
          </div>
        </div>
        <div className="stat-card stat-card--teal">
          <div className="stat-icon"><MdAttachMoney /></div>
          <div className="stat-body">
            <p className="stat-label">Wallet Circulation</p>
            <p className="stat-value">₹{(s.totalWalletBalance || 0).toLocaleString('en-IN')}</p>
            <p className="stat-sub">Total across all user wallets</p>
          </div>
        </div>
      </div>

      {/* Bar Chart + Top Agents */}
      <div className="dash-grid-2">
        <div className="section-card">
          <div className="section-card-header">
            <div><h3>Monthly Placements</h3><p>Last 6 months</p></div>
          </div>
          <div className="section-card-body">
            {monthly.every(m => m.placements === 0) ? (
              <EmptyState message="No placement data yet." />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthly} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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

        <div className="section-card">
          <div className="section-card-header">
            <div><h3>Top Agents</h3><p>By total placements</p></div>
            <Link to="/dashboard/admin/agents" className="view-all-link">View All <MdArrowForward /></Link>
          </div>
          <div className="section-card-body">
            {agents.length === 0 ? (
              <EmptyState message="No agents registered yet." />
            ) : (
              <div className="list-rows">
                {[...agents].sort((a, b) => (b.totalPlacements || 0) - (a.totalPlacements || 0)).slice(0, 4).map(a => (
                  <div key={a._id} className="list-row">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(a.name || 'A')}&background=00ABB3&color=fff&size=40`}
                      alt={a.name}
                      className="list-row__avatar"
                    />
                    <div className="list-row__info">
                      <p className="name">{a.name}</p>
                      <p className="meta">{a.email}</p>
                    </div>
                    <span className="list-row__value">
                      <MdSwapHoriz size={14} />{a.totalPlacements || 0} placements
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Signups + Pending Verifications */}
      <div className="dash-grid-2" style={{ marginTop: '1.5rem' }}>
        <div className="section-card">
          <div className="section-card-header">
            <div><h3>Recent Signups</h3><p>New platform users</p></div>
            <Link to="/dashboard/admin/users" className="view-all-link">View All <MdArrowForward /></Link>
          </div>
          <div className="section-card-body">
            {users.length === 0 ? (
              <EmptyState message="No signups yet." />
            ) : (
              <div className="list-rows">
                {[...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4).map(u => (
                  <div key={u._id} className="list-row">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=00ABB3&color=fff&size=40`}
                      alt={u.name}
                      className="list-row__avatar"
                    />
                    <div className="list-row__info">
                      <p className="name">{u.name}</p>
                      <p className="meta">{u.email}</p>
                    </div>
                    <span className="list-row__badge">{u.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <div><h3>Pending Verifications</h3><p>Awaiting review</p></div>
          </div>
          <div className="section-card-body">
            <EmptyState message="No pending verifications." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
