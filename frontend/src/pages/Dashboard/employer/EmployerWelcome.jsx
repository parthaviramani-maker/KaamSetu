import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MdPostAdd, MdWork, MdPeople, MdPayment,
  MdPerson, MdArrowForward, MdWbSunny,
  MdNightlight, MdWbTwilight,
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
  { to: '/dashboard/employer/post-job',   icon: MdPostAdd, color: 'teal',  label: 'Post a Job',     desc: 'Create a new job listing'    },
  { to: '/dashboard/employer/my-jobs',    icon: MdWork,    color: 'blue',  label: 'My Jobs',        desc: 'Manage your postings'        },
  { to: '/dashboard/employer/applicants', icon: MdPeople,  color: 'green', label: 'Applicants',     desc: 'Review job applicants'       },
  { to: '/dashboard/employer/payments',   icon: MdPayment, color: 'amber', label: 'Payments',       desc: 'Billing & payment history'   },
  { to: '/dashboard/profile',             icon: MdPerson,  color: 'grey',  label: 'My Profile',     desc: 'Update your account details' },
];

const EmployerWelcome = () => {
  const user             = useSelector(selectUser);
  const { text, Icon }   = getGreeting();
  const firstName        = user?.name?.split(' ')[0] || 'there';
  const today            = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="welcome-page">

      {/* ── Greeting Banner ──────────────────────────────────────────────── */}
      <div className="welcome-hero">
        <div className="welcome-hero__left">
          <p className="welcome-hero__tag">
            <Icon size={14} /> {text}
          </p>
          <h2 className="welcome-hero__name">Welcome, {firstName}!</h2>
          <p className="welcome-hero__desc">
            Manage your workforce — post jobs, review applicants, and hire skilled workers.
          </p>
        </div>
        <div className="welcome-hero__right">
          <p className="welcome-hero__date">{today}</p>
          <span className="welcome-hero__role-badge">
            <span className="welcome-hero__role-dot" />
            Kaam Saheb · Employer
          </span>
        </div>
      </div>

      {/* ── Quick Links ──────────────────────────────────────────────────── */}
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

      {/* ── Getting Started ──────────────────────────────────────────────── */}
      <div className="welcome-info-card">
        <h3>Getting Started</h3>
        <p>
          Start by posting a job to find skilled workers in your area.
          Once applicants apply, review their profiles and hire the best fit.
        </p>
        <Link to="/dashboard/employer/post-job" className="welcome-info-card__btn">
          Post Your First Job <MdArrowForward size={15} />
        </Link>
      </div>

    </div>
  );
};

export default EmployerWelcome;
