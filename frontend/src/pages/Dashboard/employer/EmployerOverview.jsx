import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MdWork, MdPeople, MdPersonAdd, MdAttachMoney,
  MdArrowForward, MdLocationOn, MdAccessTime, MdTrendingUp,
  MdPostAdd, MdPayment, MdWbSunny,
} from 'react-icons/md';
import { JobIcon } from '../data/jobIcons';
import Avatar from '../../../components/Avatar';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { selectUser } from '../../../store/authSlice';
import {
  jobs, applicants, employerActivity,
  employerStats, employerMonthlyData,
} from '../data/dummyData';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
};

const EmployerOverview = () => {
  const user = useSelector(selectUser);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const activeJobs = jobs.filter(j => j.status === 'active');

  return (
    <div>
      {/* Greeting Banner */}
      <div className="dash-greeting">
        <div className="greeting-left">
          <p className="greeting-tag" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MdWbSunny size={13} /> {getGreeting()}</p>
          <h2>{user?.name || 'Rajesh Shah'}</h2>
          <p>Manage your workforce — find skilled workers for your projects.</p>
        </div>
        <div className="greeting-right">
          <p className="greeting-date">{today}</p>
          <span className="greeting-role">Kaam Saheb · Employer</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-card--teal">
          <div className="stat-icon"><MdWork /></div>
          <div className="stat-body">
            <p className="stat-label">Active Jobs</p>
            <p className="stat-value">{employerStats.activeJobs}</p>
            <p className="stat-sub">2 closing this week</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> +2 this month</span>
        </div>

        <div className="stat-card stat-card--blue">
          <div className="stat-icon" style={{ background: 'rgba(49,130,206,0.12)', color: '#3182CE' }}><MdPeople /></div>
          <div className="stat-body">
            <p className="stat-label">Total Applicants</p>
            <p className="stat-value">{employerStats.totalApplicants}</p>
            <p className="stat-sub">12 new today</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> +18% this week</span>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon" style={{ background: 'rgba(39,174,96,0.12)', color: '#27AE60' }}><MdPersonAdd /></div>
          <div className="stat-body">
            <p className="stat-label">Workers Hired</p>
            <p className="stat-value">{employerStats.hired}</p>
            <p className="stat-sub">All time placements</p>
          </div>
          <span className="stat-trend up"><MdTrendingUp /> 3 this month</span>
        </div>

        <div className="stat-card stat-card--amber">
          <div className="stat-icon" style={{ background: 'rgba(246,173,85,0.12)', color: '#C68A00' }}><MdAttachMoney /></div>
          <div className="stat-body">
            <p className="stat-label">Monthly Spend</p>
            <p className="stat-value">{employerStats.monthlySpend}</p>
            <p className="stat-sub">Dec 2024</p>
          </div>
          <span className="stat-trend down">↓ 8% vs last month</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/dashboard/employer/post-job" className="quick-action-btn">
          <div className="qa-icon teal"><MdPostAdd size={24} /></div>
          <span>Post New Job</span>
        </Link>
        <Link to="/dashboard/employer/applicants" className="quick-action-btn">
          <div className="qa-icon blue"><MdPeople size={24} /></div>
          <span>View Applicants</span>
        </Link>
        <Link to="/dashboard/employer/my-jobs" className="quick-action-btn">
          <div className="qa-icon green"><MdWork size={24} /></div>
          <span>My Jobs</span>
        </Link>
        <Link to="/dashboard/employer/payments" className="quick-action-btn">
          <div className="qa-icon amber"><MdPayment size={24} /></div>
          <span>Payments</span>
        </Link>
      </div>

      {/* Two column: Active Jobs + Recent Applicants */}
      <div className="dash-grid-2">
        {/* Active Jobs */}
        <div className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Active Job Postings</h3>
              <p>{activeJobs.length} jobs currently live</p>
            </div>
            <Link to="/dashboard/employer/my-jobs" className="view-all-link">
              View All <MdArrowForward />
            </Link>
          </div>
          <div className="section-card-body">
            <div className="jobs-list">
              {activeJobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-icon"><JobIcon iconKey={job.icon} /></div>
                  <div className="job-info">
                    <h4>{job.title}</h4>
                    <div className="job-meta">
                      <span><MdLocationOn />{job.area}</span>
                      <span><MdAccessTime />{job.posted}</span>
                    </div>
                    <span className={`badge badge-${job.status}`}>{job.status}</span>
                  </div>
                  <div className="job-right">
                    <p className="job-pay">{job.pay}</p>
                    <span className={`badge badge-open`}>{job.workers} needed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="section-card">
          <div className="section-card-header">
            <div>
              <h3>Recent Applicants</h3>
              <p>Latest applications received</p>
            </div>
            <Link to="/dashboard/employer/applicants" className="view-all-link">
              View All <MdArrowForward />
            </Link>
          </div>
          <div className="section-card-body">
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>Job</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.slice(0, 5).map(a => (
                    <tr key={a.id}>
                      <td>
                        <div className="td-user">
                          <Avatar src={a.avatar} alt={a.name} />
                          <div className="td-user-info">
                            <div className="name">{a.name}</div>
                            <div className="meta">{a.skill}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {a.job}
                      </td>
                      <td>
                        <span className={`badge badge-${a.status}`}>{a.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Month Trend Chart */}
      <div className="section-card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-card-header">
          <div><h3>6-Month Trend</h3><p>Applicants received &amp; workers hired</p></div>
        </div>
        <div className="section-card-body">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={employerMonthlyData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="empApplicants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00ABB3" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00ABB3" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="empHired" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#27AE60" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#27AE60" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                />
                <Area type="monotone" dataKey="applicants" name="Applicants" stroke="#00ABB3" strokeWidth={2} fill="url(#empApplicants)" dot={false} />
                <Area type="monotone" dataKey="hired"      name="Hired"      stroke="#27AE60" strokeWidth={2} fill="url(#empHired)"      dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Recent Activity</h3>
            <p>Latest updates on your jobs &amp; workers</p>
          </div>
        </div>
        <div className="section-card-body">
          <div className="activity-list">
            {employerActivity.map(act => (
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
  );
};

export default EmployerOverview;
