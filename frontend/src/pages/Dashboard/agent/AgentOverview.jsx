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
  <div className="empty-state">{message}</div>
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
          <p className="greeting-tag"><span className="greeting-tag-inner"><MdWbSunny size={13} /> {getGreeting()}</span></p>
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
          <div className="stat-icon"><MdSwapHoriz /></div>
          <div className="stat-body">
            <p className="stat-label">Active Placements</p>
            <p className="stat-value">{activePlaced}</p>
            <p className="stat-sub">{activePlaced === 0 ? 'No active placements' : `${activePlaced} active`}</p>
          </div>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon"><MdPending /></div>
          <div className="stat-body">
            <p className="stat-label">Total Placements</p>
            <p className="stat-value">{summary.totalPlacements || 0}</p>
            <p className="stat-sub">{!summary.totalPlacements ? 'No placements yet' : 'all time'}</p>
          </div>
        </div>

        <div className="stat-card stat-card--amber">
          <div className="stat-icon"><MdMonetizationOn /></div>
          <div className="stat-body">
            <p className="stat-label">Total Commission</p>
            <p className="stat-value">₹{totalComm.toLocaleString('en-IN')}</p>
            <p className="stat-sub">{totalComm === 0 ? 'No earnings yet' : 'all time'}</p>
          </div>
        </div>
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
              <div className="item-list--tight">
                {workersList.slice(0, 4).map(w => (
                  <div key={w._id} className="item-row--user">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(w.name || 'W')}&background=00ABB3&color=fff&size=40`}
                      alt={w.name}
                      className="item-avatar"
                    />
                    <div className="item-user-info">
                      <p className="item-name">{w.name}</p>
                      <p className="item-email">{w.email}</p>
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
