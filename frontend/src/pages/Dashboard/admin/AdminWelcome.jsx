import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MdSupervisorAccount, MdBusinessCenter, MdGroup, MdBarChart,
  MdSettings, MdArrowForward, MdAdminPanelSettings,
} from 'react-icons/md';
import { selectUser } from '../../../store/authSlice';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
};

const QUICK_LINKS = [
  { to: '/dashboard/admin/users',    icon: MdSupervisorAccount, color: 'teal',  label: 'All Users',    desc: 'Manage platform users'           },
  { to: '/dashboard/admin/jobs',     icon: MdBusinessCenter,    color: 'blue',  label: 'All Jobs',     desc: 'All job postings on platform'    },
  { to: '/dashboard/admin/agents',   icon: MdGroup,             color: 'green', label: 'All Agents',   desc: 'Manage & verify agents'          },
  { to: '/dashboard/admin/reports',  icon: MdBarChart,          color: 'amber', label: 'Reports',      desc: 'Platform analytics & insights'   },
  { to: '/dashboard/admin/settings', icon: MdSettings,          color: 'grey',  label: 'Settings',     desc: 'Platform configuration'          },
];

const AdminWelcome = () => {
  const user      = useSelector(selectUser);
  const firstName = user?.name?.split(' ')[0] || 'Admin';
  const today     = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="welcome-page">

      <div className="welcome-hero">
        <div className="welcome-hero__left">
          <p className="welcome-hero__tag">
            <MdAdminPanelSettings size={14} /> {getGreeting()}
          </p>
          <h2 className="welcome-hero__name">Welcome, {firstName}!</h2>
          <p className="welcome-hero__desc">
            Monitor all platform activity, users, agents, and performance metrics.
          </p>
        </div>
        <div className="welcome-hero__right">
          <p className="welcome-hero__date">{today}</p>
          <span className="welcome-hero__role-badge">
            <span className="welcome-hero__role-dot" />
            Super Admin
          </span>
        </div>
      </div>

      <h3 className="welcome-section-title">Admin Controls</h3>
      <div className="welcome-links-grid">
        {QUICK_LINKS.map(({ to, icon: LinkIcon, color, label, desc }) => (
          <Link key={to} to={to} className={`welcome-link-card welcome-link-card--${color}`}>
            <div className={`welcome-link-card__icon qa-icon ${color}`}>
              <LinkIcon size={22} />
            </div>
            <div className="welcome-link-card__body">
              <p className="welcome-link-card__label">{label}</p>
              <p className="welcome-link-card__desc">{desc}</p>
            </div>
            <MdArrowForward size={18} className="welcome-link-card__arrow" />
          </Link>
        ))}
      </div>

      <div className="welcome-info-card">
        <h3>Platform Overview</h3>
        <p>
          Review pending agent verifications, monitor job activity, and manage
          platform settings from the admin panel.
        </p>
        <Link to="/dashboard/admin/users" className="welcome-info-card__btn">
          View All Users <MdArrowForward size={15} />
        </Link>
      </div>

    </div>
  );
};

export default AdminWelcome;
