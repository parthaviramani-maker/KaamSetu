import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MdAssignment, MdEvent, MdStar, MdAttachMoney,
  MdArrowForward, MdLocationOn, MdAccessTime, MdTrendingUp,
  MdSearch, MdAccountBalanceWallet, MdPerson, MdWbSunny,
} from 'react-icons/md';
import { selectUser } from '../../../store/authSlice';
import { useGetMyApplicationsQuery } from '../../../services/applicationApi';

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

const WorkerOverview = () => {
  const user = useSelector(selectUser);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const { data: appsRes } = useGetMyApplicationsQuery();
  const apps = appsRes?.data || [];
  const totalApps  = apps.length;
  const pendingCnt = apps.filter(a => a.status === 'pending').length;
  const approvedCnt = apps.filter(a => a.status === 'approved').length;

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
            <p className="stat-value">{totalApps}</p>
            <p className="stat-sub">{totalApps === 0 ? 'No applications yet' : `${totalApps} total`}</p>
          </div>
        </div>

        <div className="stat-card stat-card--blue">
          <div className="stat-icon" style={{ background: 'rgba(49,130,206,0.12)', color: '#3182CE' }}><MdEvent /></div>
          <div className="stat-body">
            <p className="stat-label">Pending Reviews</p>
            <p className="stat-value">{pendingCnt}</p>
            <p className="stat-sub">{pendingCnt === 0 ? 'No pending reviews' : `${pendingCnt} awaiting`}</p>
          </div>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon" style={{ background: 'rgba(39,174,96,0.12)', color: '#27AE60' }}><MdStar /></div>
          <div className="stat-body">
            <p className="stat-label">Approved</p>
            <p className="stat-value">{approvedCnt}</p>
            <p className="stat-sub">{approvedCnt === 0 ? 'No approvals yet' : `${approvedCnt} approved`}</p>
          </div>
        </div>

        <div className="stat-card stat-card--amber">
          <div className="stat-icon" style={{ background: 'rgba(246,173,85,0.12)', color: '#C68A00' }}><MdAttachMoney /></div>
          <div className="stat-body">
            <p className="stat-label">This Month Earned</p>
            <p className="stat-value">₹0</p>
            <p className="stat-sub">Earnings coming soon</p>
          </div>
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
            <EmptyState message="No recommendations yet. Complete your profile to get job matches." />
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
            <EmptyState message="No activity yet." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerOverview;
