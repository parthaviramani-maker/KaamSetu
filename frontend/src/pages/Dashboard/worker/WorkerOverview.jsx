import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MdAssignment, MdEvent, MdStar, MdAttachMoney,
  MdArrowForward, MdLocationOn, MdAccessTime, MdTrendingUp,
  MdSearch, MdAccountBalanceWallet, MdPerson, MdWbSunny,
} from 'react-icons/md';
import { selectUser } from '../../../store/authSlice';
import { useGetMyApplicationsQuery } from '../../../services/applicationApi';
import WalletCard from '../../../components/WalletCard/WalletCard';

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
          <p className="greeting-tag"><span className="greeting-tag-inner"><MdWbSunny size={13} /> {getGreeting()}</span></p>
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
          <div className="stat-icon"><MdEvent /></div>
          <div className="stat-body">
            <p className="stat-label">Pending Reviews</p>
            <p className="stat-value">{pendingCnt}</p>
            <p className="stat-sub">{pendingCnt === 0 ? 'No pending reviews' : `${pendingCnt} awaiting`}</p>
          </div>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon"><MdStar /></div>
          <div className="stat-body">
            <p className="stat-label">Approved</p>
            <p className="stat-value">{approvedCnt}</p>
            <p className="stat-sub">{approvedCnt === 0 ? 'No approvals yet' : `${approvedCnt} approved`}</p>
          </div>
        </div>

        <div className="stat-card stat-card--amber">
          <div className="stat-icon"><MdAttachMoney /></div>
          <div className="stat-body">
            <p className="stat-label">This Month Earned</p>
            <p className="stat-value">₹0</p>
            <p className="stat-sub">Earnings coming soon</p>
          </div>
        </div>
      </div>

      {/* Primary Data: Wallet & Transactions */}
      <div style={{ marginTop: '1.5rem' }}>
        <WalletCard showTransactions={true} />
      </div>
    </div>
  );
};

export default WorkerOverview;
