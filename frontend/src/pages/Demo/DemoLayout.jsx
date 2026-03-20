import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  MdDashboard, MdWork, MdPostAdd, MdPeople, MdPayment,
  MdSearch, MdAssignment, MdAttachMoney, MdPerson,
  MdGroup, MdSwapHoriz, MdMonetizationOn, MdMap,
  MdSupervisorAccount, MdBusinessCenter, MdBarChart,
  MdSettings, MdMenu, MdClose, MdScience, MdArrowBack,
} from 'react-icons/md';
import { FiSun, FiMoon } from 'react-icons/fi';
import { selectIsDark, toggleTheme } from '../../store/themeSlice';
import EmployerOverview from '../Dashboard/employer/EmployerOverview';
import WorkerOverview   from '../Dashboard/worker/WorkerOverview';
import AgentOverview    from '../Dashboard/agent/AgentOverview';
import AdminOverview    from '../Dashboard/admin/AdminOverview';
import '../Dashboard/Dashboard.scss';

const MENUS = {
  employer: [
    { id: 'overview',  label: 'Dashboard',    icon: MdDashboard  },
    { id: 'post-job',  label: 'Post Job',      icon: MdPostAdd    },
    { id: 'my-jobs',   label: 'My Jobs',       icon: MdWork       },
    { id: 'applicants',label: 'Applicants',    icon: MdPeople     },
    { id: 'payments',  label: 'Payments',      icon: MdPayment    },
  ],
  worker: [
    { id: 'overview',  label: 'Dashboard',     icon: MdDashboard  },
    { id: 'find-jobs', label: 'Find Jobs',      icon: MdSearch     },
    { id: 'apps',      label: 'Applications',   icon: MdAssignment },
    { id: 'earnings',  label: 'Earnings',       icon: MdAttachMoney},
  ],
  agent: [
    { id: 'overview',  label: 'Dashboard',     icon: MdDashboard  },
    { id: 'workers',   label: 'My Workers',    icon: MdGroup      },
    { id: 'placements',label: 'Placements',    icon: MdSwapHoriz  },
    { id: 'commission',label: 'Commission',    icon: MdMonetizationOn },
    { id: 'area',      label: 'My Area',       icon: MdMap        },
  ],
  admin: [
    { id: 'overview',  label: 'Dashboard',     icon: MdDashboard  },
    { id: 'users',     label: 'All Users',      icon: MdSupervisorAccount },
    { id: 'jobs',      label: 'All Jobs',       icon: MdBusinessCenter },
    { id: 'agents',    label: 'All Agents',     icon: MdGroup     },
    { id: 'reports',   label: 'Reports',        icon: MdBarChart  },
    { id: 'settings',  label: 'Settings',       icon: MdSettings  },
  ],
};

const DEMO_USERS = {
  employer: { name: 'Rajesh Shah',   roleLabel: 'Kaam Saheb',  sub: 'Employer' },
  worker:   { name: 'Ramesh Patel',  roleLabel: 'Kaam Saathi', sub: 'Worker'   },
  agent:    { name: 'Bhavesh Patel', roleLabel: 'Kaam Setu',   sub: 'Agent'    },
  admin:    { name: 'Admin User',    roleLabel: 'Super Admin',  sub: 'Admin'    },
};

const ROLE_TABS = [
  { value: 'employer', label: 'Employer' },
  { value: 'worker',   label: 'Worker'   },
  { value: 'agent',    label: 'Agent'    },
  { value: 'admin',    label: 'Admin'    },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
};

const OVERVIEW_MAP = {
  employer: EmployerOverview,
  worker:   WorkerOverview,
  agent:    AgentOverview,
  admin:    AdminOverview,
};

const DemoLayout = () => {
  const { role: urlRole } = useParams();
  const navigate          = useNavigate();
  const dispatch          = useDispatch();
  const isDark            = useSelector(selectIsDark);

  const validRoles  = Object.keys(DEMO_USERS);
  const role        = validRoles.includes(urlRole) ? urlRole : 'employer';
  const demoUser    = DEMO_USERS[role];
  const menuItems   = MENUS[role] || MENUS.employer;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on role change
  useEffect(() => { setSidebarOpen(false); }, [role]);

  const OverviewComponent = OVERVIEW_MAP[role];

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(demoUser.name)}&background=00ABB3&color=fff&size=64`;

  return (
    <div className="dashboard-container" style={{ flexDirection: 'column' }}>

      {/* ── DEMO BANNER ─────────────────────────────────────────────────────── */}
      <div className="demo-banner">
        <MdScience size={16} />
        <span>
          <strong>Demo Mode</strong> — Sample data only. Not real.
        </span>
        <Link to="/auth" className="demo-banner__cta">
          Sign In for real dashboard →
        </Link>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100dvh - 44px)' }}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── SIDEBAR ───────────────────────────────────────────────────────── */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <a className="brand" href="/demo">
              <div className="brand-logo">
                <img
                  src={isDark ? '/favicon.png' : '/favicon-light.png'}
                  alt="KaamSetu"
                  className="brand-logo-img"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <span className="brand-logo-fallback">K</span>
              </div>
              <div className="brand-text">
                <h2>KaamSetu</h2>
                <p>Demo Mode</p>
              </div>
            </a>
            <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
              <MdClose />
            </button>
          </div>

          <nav className="sidebar-nav">
            <div className="sidebar-section-label">Navigation</div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isOverview = item.id === 'overview';
              return (
                <div
                  key={item.id}
                  className={`nav-item${isOverview ? ' active' : ''}`}
                  style={{ cursor: isOverview ? 'default' : 'not-allowed', opacity: isOverview ? 1 : 0.45 }}
                  title={isOverview ? '' : 'Available in real dashboard'}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </div>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="footer-user">
              <img
                src={avatarUrl}
                alt={demoUser.name}
                className="user-avatar-small"
              />
              <div className="user-info">
                <p className="user-name">{demoUser.name}</p>
                <p className="user-role-badge">{demoUser.roleLabel}</p>
              </div>
            </div>
            <div className="footer-actions">
              <Link to="/auth" className="sidebar-logout-btn" style={{ textDecoration: 'none' }}>
                <MdArrowBack />
                Sign In
              </Link>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <main className="main-content">
          <header className="top-bar">
            <button
              className="menu-toggle-mobile"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <MdMenu />
            </button>

            <div className="top-bar-left">
              <h1>Dashboard</h1>
              <p className="page-subtitle">{demoUser.roleLabel} · {demoUser.sub}</p>
            </div>

            <div className="top-bar-right">
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                {getGreeting()},&nbsp;
                <strong style={{ color: 'var(--text-primary)' }}>
                  {demoUser.name.split(' ')[0]}
                </strong>
              </span>
              <img
                src={avatarUrl}
                alt={demoUser.name}
                style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-strong)', flexShrink: 0 }}
              />
            </div>
          </header>

          <div className="scrollable-content">
            <OverviewComponent />
          </div>
        </main>

        {/* Floating theme toggle */}
        <button
          className="theme-fab"
          onClick={() => dispatch(toggleTheme())}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default DemoLayout;
