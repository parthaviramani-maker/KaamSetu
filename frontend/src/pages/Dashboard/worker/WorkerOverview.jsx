import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MdAssignment, MdEvent, MdStar, MdAttachMoney,
  MdArrowForward, MdLocationOn, MdAccessTime, MdTrendingUp,
  MdSearch, MdAccountBalanceWallet, MdPerson, MdWbSunny,
} from 'react-icons/md';
import { JobIcon } from '../data/jobIcons';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { selectUser } from '../../../store/authSlice';
import { jobs, workerActivity, workerStats, workerMonthlyData } from '../data/dummyData';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
};

const WorkerOverview = () => {
  const user = useSelector(selectUser);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const profileCompletion = 75;
  const recommended = jobs.filter(j => j.status !== 'closed').slice(0, 4);

  return (
    <div>
      {/* Greeting Banner */}
      <div className="dash-greeting">
        <div className="greeting-left">
          <p className="greeting-tag" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MdWbSunny size={13} /> {getGreeting()}</p>
          <h2>{user?.name || 'Ramesh Patel'}</h2>
          <p>Find your next job opportunity and grow your career.</p>
        </div>
        <div className="greeting-right">
          <p className="greeting-date">{today}</p>
          <span className="greeting-role">Kaam Saathi · Worker</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-card--teal">
          <div className="stat-icon"><MdAssignment /></div>
          <div className="stat-body">
            <p className="stat-label">Applications Sent</p>
            <p className="stat-value">{workerStats.applicationsSent}</p>
            <p className="stat-sub">2 awaiting response</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> Active</span>
        </div>

        <div className="stat-card stat-card--blue">
          <div className="stat-icon" style={{ background: 'rgba(49,130,206,0.12)', color: '#3182CE' }}><MdEvent /></div>
          <div className="stat-body">
            <p className="stat-label">Pending Interviews</p>
            <p className="stat-value">{workerStats.pendingInterviews}</p>
            <p className="stat-sub">Upcoming this week</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> Scheduled</span>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon" style={{ background: 'rgba(39,174,96,0.12)', color: '#27AE60' }}><MdStar /></div>
          <div className="stat-body">
            <p className="stat-label">Jobs Completed</p>
            <p className="stat-value">{workerStats.jobsCompleted}</p>
            <p className="stat-sub" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>Rating: {workerStats.rating} <MdStar size={11} style={{ color: '#C68A00' }} /></p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> +3 this month</span>
        </div>

        <div className="stat-card stat-card--amber">
          <div className="stat-icon" style={{ background: 'rgba(246,173,85,0.12)', color: '#C68A00' }}><MdAttachMoney /></div>
          <div className="stat-body">
            <p className="stat-label">This Month Earned</p>
            <p className="stat-value">{workerStats.thisMonthEarned}</p>
            <p className="stat-sub">Total: {workerStats.totalEarned}</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> +12% vs last</span>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="section-card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-card-header">
          <div>
            <h3>Profile Completion</h3>
            <p>Complete your profile to get more job matches</p>
          </div>
          <Link to="/dashboard/profile" className="view-all-link">Complete Profile <MdArrowForward /></Link>
        </div>
        <div className="section-card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="progress-bar-wrap" style={{ flex: 1 }}>
              <div className="progress-bar-fill" style={{ width: `${profileCompletion}%` }} />
            </div>
            <span style={{ fontWeight: 700, color: 'var(--color-accent)', minWidth: '40px' }}>{profileCompletion}%</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Add your skills and work experience to reach 100%
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/dashboard/worker/find-jobs" className="quick-action-btn">
          <div className="qa-icon teal"><MdSearch size={24} /></div>
          <span>Find Jobs</span>
        </Link>
        <Link to="/dashboard/worker/applications" className="quick-action-btn">
          <div className="qa-icon blue"><MdAssignment size={24} /></div>
          <span>My Applications</span>
        </Link>
        <Link to="/dashboard/worker/earnings" className="quick-action-btn">
          <div className="qa-icon green"><MdAccountBalanceWallet size={24} /></div>
          <span>My Earnings</span>
        </Link>
        <Link to="/dashboard/profile" className="quick-action-btn">
          <div className="qa-icon amber"><MdPerson size={24} /></div>
          <span>My Profile</span>
        </Link>
      </div>

      {/* Recommended Jobs + Activity */}
      <div className="dash-grid-2">
        <div className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Recommended Jobs</h3>
              <p>Based on your skills &amp; area</p>
            </div>
            <Link to="/dashboard/worker/find-jobs" className="view-all-link">View All <MdArrowForward /></Link>
          </div>
          <div className="section-card-body">
            <div className="jobs-list">
              {recommended.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-icon"><JobIcon iconKey={job.icon} /></div>
                  <div className="job-info">
                    <h4>{job.title}</h4>
                    <div className="job-meta">
                      <span><MdLocationOn />{job.area}</span>
                      <span><MdAccessTime />{job.posted}</span>
                    </div>
                    <span className={`badge badge-${job.status}`}>{job.type}</span>
                  </div>
                  <div className="job-right">
                    <p className="job-pay">{job.pay}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Recent Activity</h3>
              <p>Your latest updates</p>
            </div>
          </div>
          <div className="section-card-body">
            <div className="activity-list">
              {workerActivity.map(act => (
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
      {/* Earnings Trend Chart */}
      <div className="section-card" style={{ marginTop: '1.5rem' }}>
        <div className="section-card-header">
          <div><h3>Earnings Trend</h3><p>Last 6 months (₹)</p></div>
        </div>
        <div className="section-card-body">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={workerMonthlyData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="wrkEarned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#27AE60" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#27AE60" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                  formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Earned']}
                />
                <Area type="monotone" dataKey="earned" name="Earned" stroke="#27AE60" strokeWidth={2.5} fill="url(#wrkEarned)" dot={{ r: 3, fill: '#27AE60' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerOverview;
