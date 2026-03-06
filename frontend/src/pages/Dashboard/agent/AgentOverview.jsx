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
import Avatar from '../../../components/Avatar';
import { workers, placements, agentActivity, agentStats, agentMonthlyData } from '../data/dummyData';

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
  const rosterPreview = workers.slice(0, 4);

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
            <p className="stat-value">{agentStats.registeredWorkers}</p>
            <p className="stat-sub">In your roster</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> +4 this month</span>
        </div>

        <div className="stat-card stat-card--blue">
          <div className="stat-icon" style={{ background: 'rgba(49,130,206,0.12)', color: '#3182CE' }}><MdSwapHoriz /></div>
          <div className="stat-body">
            <p className="stat-label">Active Placements</p>
            <p className="stat-value">{agentStats.activePlacements}</p>
            <p className="stat-sub">Currently on jobs</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> +3 this week</span>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon" style={{ background: 'rgba(39,174,96,0.12)', color: '#27AE60' }}><MdPending /></div>
          <div className="stat-body">
            <p className="stat-label">Pending Matches</p>
            <p className="stat-value">{agentStats.pendingMatches}</p>
            <p className="stat-sub">Awaiting placement</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> {agentStats.successRate}% success rate</span>
        </div>

        <div className="stat-card stat-card--amber">
          <div className="stat-icon" style={{ background: 'rgba(246,173,85,0.12)', color: '#C68A00' }}><MdMonetizationOn /></div>
          <div className="stat-body">
            <p className="stat-label">Monthly Commission</p>
            <p className="stat-value">{agentStats.monthlyCommission}</p>
            <p className="stat-sub">Total: {agentStats.totalCommission}</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> +14% vs last</span>
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
            <div><h3>Worker Roster</h3><p>{workers.length} workers registered</p></div>
            <Link to="/dashboard/agent/workers" className="view-all-link">View All <MdArrowForward /></Link>
          </div>
          <div className="section-card-body">
            <div className="worker-cards-grid">
              {rosterPreview.map(w => (
                <div key={w.id} className="worker-card">
                  <Avatar src={w.avatar} alt={w.name} className="worker-card-avatar" />
                  <div className="worker-card-info">
                    <h4>{w.name}</h4>
                    <p>{w.skill}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <span className={`badge badge-${w.status === 'available' ? 'active' : w.status === 'on-job' ? 'hired' : 'closed'}`}>
                        {w.status}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#C68A00', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <MdStar size={11} />{w.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <div><h3>Recent Activity</h3><p>Your latest updates</p></div>
          </div>
          <div className="section-card-body">
            <div className="activity-list">
              {agentActivity.map(act => (
                <div key={act.id} className="activity-item">
                  <div className="activity-dot" />
                  <div className="activity-content">
                    <p className="activity-text" dangerouslySetInnerHTML={{ __html: act.text }} />
                    <p className="activity-time">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Placement Trend Chart */}
      <div className="section-card" style={{ marginTop: '1.5rem' }}>
        <div className="section-card-header">
          <div><h3>Placement Trend</h3><p>Last 6 months</p></div>
        </div>
        <div className="section-card-body">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={agentMonthlyData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="agentPlacements" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00ABB3" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00ABB3" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="agentCommission" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#C68A00" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C68A00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left"  tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                />
                <Area yAxisId="left"  type="monotone" dataKey="placements" name="Placements" stroke="#00ABB3" strokeWidth={2}   fill="url(#agentPlacements)" dot={false} />
                <Area yAxisId="right" type="monotone" dataKey="commission" name="Commission" stroke="#C68A00" strokeWidth={2}   fill="url(#agentCommission)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentOverview;
