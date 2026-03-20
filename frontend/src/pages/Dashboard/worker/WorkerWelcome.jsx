import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MdSearch, MdAssignment, MdAttachMoney, MdPerson,
  MdArrowForward, MdWbSunny, MdNightlight, MdWbTwilight,
} from 'react-icons/md';
import { selectUser } from '../../../store/authSlice';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning',   Icon: MdWbSunny    };
  if (h < 17) return { text: 'Good Afternoon',  Icon: MdWbTwilight };
  if (h < 21) return { text: 'Good Evening',    Icon: MdNightlight };
  return       { text: 'Good Night',    Icon: MdNightlight };
};

const QUICK_LINKS = [
  { to: '/dashboard/worker/find-jobs',    icon: MdSearch,     color: 'teal',  label: 'Find Jobs',        desc: 'Browse available opportunities' },
  { to: '/dashboard/worker/applications', icon: MdAssignment, color: 'blue',  label: 'My Applications',  desc: 'Track your applications'        },
  { to: '/dashboard/worker/earnings',     icon: MdAttachMoney,color: 'green', label: 'Earnings',         desc: 'Your income & payments'         },
  { to: '/dashboard/profile',             icon: MdPerson,     color: 'amber', label: 'My Profile',       desc: 'Update your skills & details'   },
];

const WorkerWelcome = () => {
  const user           = useSelector(selectUser);
  const { text, Icon } = getGreeting();
  const firstName      = user?.name?.split(' ')[0] || 'there';
  const today          = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="welcome-page">

      <div className="welcome-hero">
        <div className="welcome-hero__left">
          <p className="welcome-hero__tag">
            <Icon size={14} /> {text}
          </p>
          <h2 className="welcome-hero__name">Welcome, {firstName}!</h2>
          <p className="welcome-hero__desc">
            Find your next job opportunity and grow your career with KaamSetu.
          </p>
        </div>
        <div className="welcome-hero__right">
          <p className="welcome-hero__date">{today}</p>
          <span className="welcome-hero__role-badge">
            <span className="welcome-hero__role-dot" />
            Kaam Saathi · Worker
          </span>
        </div>
      </div>

      <h3 className="welcome-section-title">Quick Actions</h3>
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
        <h3>Getting Started</h3>
        <p>
          Browse job listings near you and apply to ones that match your skills.
          Complete your profile to get more job matches from employers.
        </p>
        <Link to="/dashboard/worker/find-jobs" className="welcome-info-card__btn">
          Browse Jobs <MdArrowForward size={15} />
        </Link>
      </div>

    </div>
  );
};

export default WorkerWelcome;
