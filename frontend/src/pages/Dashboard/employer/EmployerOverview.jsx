import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MdWork, MdPeople, MdPersonAdd, MdAttachMoney,
  MdArrowForward, MdLocationOn, MdAccessTime,
  MdPostAdd, MdPayment, MdWbSunny,
} from 'react-icons/md';
import { selectUser } from '../../../store/authSlice';
import { useGetMyJobsQuery } from '../../../services/jobApi';

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

const EmployerOverview = () => {
  const user  = useSelector(selectUser);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const { data: jobsRes } = useGetMyJobsQuery();
  const jobs = jobsRes?.data || [];
  const openJobs   = jobs.filter(j => j.status === 'open').length;
  const totalJobs  = jobs.length;

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
            <p className="stat-label">Open Jobs</p>
            <p className="stat-value">{openJobs}</p>
            <p className="stat-sub">{openJobs === 0 ? 'No open jobs yet' : `${openJobs} open`}</p>
          </div>
        </div>

        <div className="stat-card stat-card--blue">
          <div className="stat-icon" style={{ background: 'rgba(49,130,206,0.12)', color: '#3182CE' }}><MdPeople /></div>
          <div className="stat-body">
            <p className="stat-label">Total Jobs Posted</p>
            <p className="stat-value">{totalJobs}</p>
            <p className="stat-sub">{totalJobs === 0 ? 'No jobs posted yet' : `${totalJobs} total`}</p>
          </div>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon" style={{ background: 'rgba(39,174,96,0.12)', color: '#27AE60' }}><MdPersonAdd /></div>
          <div className="stat-body">
            <p className="stat-label">Workers Hired</p>
            <p className="stat-value">0</p>
            <p className="stat-sub">Hire tracking coming soon</p>
          </div>
        </div>

        <div className="stat-card stat-card--amber">
          <div className="stat-icon" style={{ background: 'rgba(246,173,85,0.12)', color: '#C68A00' }}><MdAttachMoney /></div>
          <div className="stat-body">
            <p className="stat-label">Monthly Spend</p>
            <p className="stat-value">₹0</p>
            <p className="stat-sub">Payments coming soon</p>
          </div>
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
              <p>Your live job listings</p>
            </div>
            <Link to="/dashboard/employer/my-jobs" className="view-all-link">
              View All <MdArrowForward />
            </Link>
          </div>
          <div className="section-card-body">
            {jobs.filter(j => j.status === 'open').length === 0 ? (
              <EmptyState message="No active jobs. Post your first job to get started." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {jobs.filter(j => j.status === 'open').slice(0, 3).map(job => (
                  <div key={job._id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-hover)',
                    gap: '0.5rem', flexWrap: 'wrap',
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{job.title}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MdLocationOn size={12} />{job.city}{job.area ? `, ${job.area}` : ''}
                        <MdAccessTime size={12} style={{ marginLeft: '6px' }} />{job.workersNeeded} workers
                      </p>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      ₹{job.pay}/{job.payType === 'monthly' ? 'mo' : 'day'}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
            <EmptyState message="No applicants yet. Post a job to start receiving applications." />
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
          <EmptyState message="No activity yet." />
        </div>
      </div>
    </div>
  );
};

export default EmployerOverview;
