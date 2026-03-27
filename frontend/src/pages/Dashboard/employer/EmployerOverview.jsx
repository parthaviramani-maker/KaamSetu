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
  <div className="empty-state">{message}</div>
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
          <p className="greeting-tag"><span className="greeting-tag-inner"><MdWbSunny size={13} /> {getGreeting()}</span></p>
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
          <div className="stat-icon"><MdPeople /></div>
          <div className="stat-body">
            <p className="stat-label">Total Jobs Posted</p>
            <p className="stat-value">{totalJobs}</p>
            <p className="stat-sub">{totalJobs === 0 ? 'No jobs posted yet' : `${totalJobs} total`}</p>
          </div>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon"><MdPersonAdd /></div>
          <div className="stat-body">
            <p className="stat-label">Workers Hired</p>
            <p className="stat-value">0</p>
            <p className="stat-sub">Hire tracking coming soon</p>
          </div>
        </div>

        <div className="stat-card stat-card--amber">
          <div className="stat-icon"><MdAttachMoney /></div>
          <div className="stat-body">
            <p className="stat-label">Monthly Spend</p>
            <p className="stat-value">₹0</p>
            <p className="stat-sub">Payments coming soon</p>
          </div>
        </div>
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
              <div className="item-list">
                {jobs.filter(j => j.status === 'open').slice(0, 3).map(job => (
                  <div key={job._id} className="item-row">
                    <div className="item-info">
                      <p className="item-title">{job.title}</p>
                      <p className="item-meta">
                        <MdLocationOn size={12} />{job.city}{job.area ? `, ${job.area}` : ''}
                        <MdAccessTime size={12} style={{ marginLeft: '6px' }} />{job.workersNeeded} workers
                      </p>
                    </div>
                    <span className="item-price">
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
