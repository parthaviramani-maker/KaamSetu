import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MdGroup, MdSwapHoriz, MdPending, MdMonetizationOn,
  MdArrowForward, MdTrendingUp, MdStar, MdLocationOn, MdWbSunny,
} from 'react-icons/md';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { selectUser } from '../../../store/authSlice';
import { useGetAgentCommissionQuery, useGetAgentWorkersQuery } from '../../../services/agentApi';

const EmptyState = ({ message }) => (
  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
    {message}
  </div>
);

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
};

const AgentOverview = () => {
  const user = useSelector(selectUser);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const { data: commRes }    = useGetAgentCommissionQuery();
  const { data: workersRes } = useGetAgentWorkersQuery();

  const summary        = commRes?.data || {};
  const workersList    = workersRes?.data?.workers || [];
  const registeredCnt  = workersRes?.data?.total || workersList.length || 0;
  const activePlaced   = summary.activePlacements || 0;
  const totalComm      = summary.totalCommission || 0;

  return (
    <div>
      {/* Greeting Banner */}
      <div className="dash-greeting">
        <div className="greeting-left">
          <p className="greeting-tag" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MdWbSunny size={13} /> {getGreeting()}</p>
          <h2>{user?.name || 'Bhavesh Patel'}</h2>
          <p>Manage your workers and grow your placement network.</p>
        </div>
        <div className="greeting-right">
          <p className="greeting-date">{today}</p>
          <span className="greeting-role">Kaam Setu · Agent</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-card--teal">
          <div className="stat-icon"><MdGroup /></div>
          <div className="stat-body">
            <p className="stat-label">Registered Workers</p>
            <p className="stat-value">{registeredCnt}</p>
            <p className="stat-sub">{registeredCnt === 0 ? 'No workers yet' : `${registeredCnt} placed`}</p>
          </div>
        </div>

        <div className="stat-card stat-card--blue">
          <div className="stat-icon" style={{ background: 'rgba(49,130,206,0.12)', color: '#3182CE' }}><MdSwapHoriz /></div>
          <div className="stat-body">
            <p className="stat-label">Active Placements</p>
            <p className="stat-value">{activePlaced}</p>
            <p className="stat-sub">{activePlaced === 0 ? 'No active placements' : `${activePlaced} active`}</p>
          </div>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon" style={{ background: 'rgba(39,174,96,0.12)', color: '#27AE60' }}><MdPending /></div>
          <div className="stat-body">
            <p className="stat-label">Total Placements</p>
            <p className="stat-value">{summary.totalPlacements || 0}</p>
            <p className="stat-sub">{!summary.totalPlacements ? 'No placements yet' : 'all time'}</p>
          </div>
        </div>

        <div className="stat-card stat-card--amber">
          <div className="stat-icon" style={{ background: 'rgba(246,173,85,0.12)', color: '#C68A00' }}><MdMonetizationOn /></div>
          <div className="stat-body">
            <p className="stat-label">Total Commission</p>
            <p className="stat-value">₹{totalComm.toLocaleString('en-IN')}</p>
            <p className="stat-sub">{totalComm === 0 ? 'No earnings yet' : 'all time'}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/dashboard/agent/workers" className="quick-action-btn">
          <div className="qa-icon teal"><MdGroup size={24} /></div>
          <span>My Workers</span>
        </Link>
        <Link to="/dashboard/agent/placements" className="quick-action-btn">
          <div className="qa-icon blue"><MdSwapHoriz size={24} /></div>
          <span>Placements</span>
        </Link>
        <Link to="/dashboard/agent/commission" className="quick-action-btn">
          <div className="qa-icon green"><MdMonetizationOn size={24} /></div>
          <span>Commission</span>
        </Link>
        <Link to="/dashboard/agent/area" className="quick-action-btn">
          <div className="qa-icon amber"><MdLocationOn size={24} /></div>
          <span>My Area</span>
        </Link>
      </div>

      {/* Worker Roster Preview + Activity */}
      <div className="dash-grid-2">
        <div className="section-card">
          <div className="section-card-header">
            <div><h3>Worker Roster</h3><p>Your registered workers</p></div>
            <Link to="/dashboard/agent/workers" className="view-all-link">View All <MdArrowForward /></Link>
          </div>
          <div className="section-card-body">
            {workersList.length === 0 ? (
              <EmptyState message="No workers registered yet. Add workers to your roster." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {workersList.slice(0, 4).map(w => (
                  <div key={w._id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem', borderRadius: '8px', background: 'var(--bg-hover)',
                  }}>
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(w.name || 'W')}&background=00ABB3&color=fff&size=40`}
                      alt={w.name}
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{w.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <div><h3>Recent Activity</h3><p>Your latest updates</p></div>
          </div>
          <div className="section-card-body">
            <EmptyState message="No activity yet." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentOverview;
