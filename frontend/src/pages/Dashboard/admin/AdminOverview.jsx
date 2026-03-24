import { Link } from 'react-router-dom';
import {
  MdBusiness, MdGroup, MdSupervisorAccount, MdAttachMoney,
  MdArrowForward, MdSwapHoriz, MdMonetizationOn, MdAdminPanelSettings,
} from 'react-icons/md';
import { useGetAdminStatsQuery, useGetAllUsersQuery, useGetAllAgentsQuery } from '../../../services/adminApi';

const EmptyState = ({ message }) => (
  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
    {message}
  </div>
);

const AdminOverview = () => {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const { data: statsRes } = useGetAdminStatsQuery();
  const { data: usersRes  } = useGetAllUsersQuery({});
  const { data: agentsRes } = useGetAllAgentsQuery();
  const s       = statsRes?.data || {};
  const users   = usersRes?.data  || [];
  const agents  = agentsRes?.data || [];

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
            <EmptyState message="No placement data yet." />
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[...agents].sort((a, b) => (b.totalPlacements || 0) - (a.totalPlacements || 0)).slice(0, 4).map(a => (
                  <div key={a._id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem', borderRadius: '8px', background: 'var(--bg-hover)',
                  }}>
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(a.name || 'A')}&background=00ABB3&color=fff&size=40`}
                      alt={a.name}
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{a.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{a.email}</p>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700, color: 'var(--color-accent)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4).map(u => (
                  <div key={u._id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem', borderRadius: '8px', background: 'var(--bg-hover)',
                  }}>
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=00ABB3&color=fff&size=40`}
                      alt={u.name}
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{u.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</p>
                    </div>
                    <span style={{
                      fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 600,
                      background: 'rgba(0,171,179,0.1)', color: 'var(--color-accent)', whiteSpace: 'nowrap',
                    }}>{u.role}</span>
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
