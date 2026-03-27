import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  MdDashboard, MdWork, MdPostAdd, MdPeople, MdPayment,
  MdSearch, MdAssignment, MdAttachMoney, MdPerson,
  MdGroup, MdSwapHoriz, MdMonetizationOn, MdMap,
  MdSupervisorAccount, MdBusinessCenter, MdBarChart,
  MdSettings, MdLogout, MdMenu, MdClose, MdLightMode, MdDarkMode,
  MdAccountBalanceWallet
} from 'react-icons/md';
import { FiSun, FiMoon } from 'react-icons/fi';
import { logout, selectUser, selectRole } from '../../store/authSlice';
import { selectIsDark, toggleTheme } from '../../store/themeSlice';
import './Dashboard.scss';

// ── Role-specific menu configs ────────────────────────────────────────────────
const MENUS = {
  employer: [
    { id: 'overview', label: 'Dashboard',    icon: MdDashboard,      path: '/dashboard/employer' },
    { id: 'post-job', label: 'Post Job',      icon: MdPostAdd,        path: '/dashboard/employer/post-job' },
    { id: 'my-jobs',  label: 'My Jobs',       icon: MdWork,           path: '/dashboard/employer/my-jobs' },
    { id: 'applicants',label: 'Applicants',   icon: MdPeople,         path: '/dashboard/employer/applicants' },
    { id: 'payments', label: 'Payments',      icon: MdPayment,        path: '/dashboard/employer/payments' },
    { id: 'profile',  label: 'My Profile',    icon: MdPerson,         path: '/dashboard/profile' },
  ],
  worker: [
    { id: 'overview', label: 'Dashboard',    icon: MdDashboard,       path: '/dashboard/worker' },
    { id: 'find',     label: 'Find Jobs',     icon: MdSearch,          path: '/dashboard/worker/find-jobs' },
    { id: 'apps',     label: 'My Applications',icon: MdAssignment,    path: '/dashboard/worker/applications' },
    { id: 'earnings', label: 'Earnings',      icon: MdAttachMoney,     path: '/dashboard/worker/earnings' },
    { id: 'profile',  label: 'My Profile',    icon: MdPerson,          path: '/dashboard/profile' },
  ],
  agent: [
    { id: 'overview', label: 'Dashboard',    icon: MdDashboard,       path: '/dashboard/agent' },
    { id: 'workers',  label: 'My Workers',   icon: MdGroup,           path: '/dashboard/agent/workers' },
    { id: 'placements',label:'Placements',   icon: MdSwapHoriz,       path: '/dashboard/agent/placements' },
    { id: 'commission',label:'Commission',   icon: MdMonetizationOn,  path: '/dashboard/agent/commission' },
    { id: 'area',     label: 'My Area',      icon: MdMap,             path: '/dashboard/agent/area' },
    { id: 'profile',  label: 'My Profile',   icon: MdPerson,          path: '/dashboard/profile' },
  ],
  admin: [
    { id: 'overview', label: 'Dashboard',    icon: MdDashboard,            path: '/dashboard/admin' },
    { id: 'users',    label: 'All Users',    icon: MdSupervisorAccount,    path: '/dashboard/admin/users' },
    { id: 'jobs',     label: 'All Jobs',     icon: MdBusinessCenter,       path: '/dashboard/admin/jobs' },
    { id: 'agents',   label: 'All Agents',   icon: MdGroup,                path: '/dashboard/admin/agents' },
    { id: 'reports',  label: 'Reports',      icon: MdBarChart,             path: '/dashboard/admin/reports' },
    { id: 'wallet',   label: 'My Wallet',    icon: MdAccountBalanceWallet, path: '/dashboard/admin/wallet' },
    { id: 'settings', label: 'Settings',     icon: MdSettings,             path: '/dashboard/admin/settings' },
  ],
};

const ROLE_LABELS = {
  employer: 'Kaam Saheb',
  worker:   'Kaam Saathi',
  agent:    'Kaam Setu',
  admin:    'Super Admin',
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
};

const getPageTitle = (pathname) => {
  const map = {
    '/dashboard':                       ['Dashboard',      'Welcome to KaamSetu'],
    '/dashboard/employer':              ['Dashboard',      'Employer Overview'],
    '/dashboard/employer/post-job':     ['Post New Job',   'Create a job posting'],
    '/dashboard/employer/my-jobs':      ['My Jobs',        'Manage your job postings'],
    '/dashboard/employer/applicants':   ['Applicants',     'Review job applicants'],
    '/dashboard/employer/payments':     ['Payments',       'Billing & payment history'],
    '/dashboard/worker':                ['Dashboard',      'Worker Overview'],
    '/dashboard/worker/find-jobs':      ['Find Jobs',      'Browse available opportunities'],
    '/dashboard/worker/applications':   ['My Applications','Track your job applications'],
    '/dashboard/worker/earnings':       ['Earnings',       'Your income & payments'],
    '/dashboard/agent':                 ['Dashboard',      'Agent Overview'],
    '/dashboard/agent/workers':         ['My Workers',     'Manage registered workers'],
    '/dashboard/agent/placements':      ['Placements',     'Track successful job placements'],
    '/dashboard/agent/commission':      ['Commission',     'Your earnings & commissions'],
    '/dashboard/agent/area':            ['My Area',        'Coverage & territory'],
    '/dashboard/admin':                 ['Dashboard',      'Platform Admin Overview'],
    '/dashboard/admin/users':           ['All Users',      'Manage platform users'],
    '/dashboard/admin/jobs':            ['All Jobs',       'All job postings on platform'],
    '/dashboard/admin/agents':          ['All Agents',     'Manage agents'],
    '/dashboard/admin/reports':         ['Reports',        'Platform analytics & insights'],
    '/dashboard/admin/wallet':          ['My Wallet',      'Add money, withdraw & transaction history'],
    '/dashboard/admin/settings':        ['Settings',       'Platform configuration'],
    '/dashboard/profile':               ['My Profile',     'Manage your account'],
  };
  return map[pathname] || ['KaamSetu', 'Dashboard'];
};

// ── Component ─────────────────────────────────────────────────────────────────
const DashboardLayout = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const user      = useSelector(selectUser);
  const role      = useSelector(selectRole);
  const isDark    = useSelector(selectIsDark);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync theme class on html
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark-mode');
      html.classList.remove('light-mode');
    } else {
      html.classList.add('light-mode');
      html.classList.remove('dark-mode');
    }
  }, [isDark]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  };

  const menuItems = MENUS[role] || MENUS.worker;
  const [pageTitle, pageSubtitle] = getPageTitle(location.pathname);
  const roleLabel = ROLE_LABELS[role] || 'User';

  const avatarUrl = user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=00ABB3&color=fff&size=64`;

  return (
    <div className="dashboard-container">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ───────────────────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <a className="brand" href="/dashboard">
            <div className="brand-logo">
          <img
                src="/favicon.png"
                alt="KaamSetu"
                className="brand-logo-img"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              <span className="brand-logo-fallback">K</span>
            </div>
            <div className="brand-text">
              <h2>KaamSetu</h2>
              <p>Labour Marketplace</p>
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
            // For overview routes, use exact matching
            const isOverview = item.path === `/dashboard/${role}` || item.path === `/dashboard/admin`;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={isOverview}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-user">
            <img
              src={avatarUrl}
              alt={user?.name || 'User'}
              className="user-avatar-small"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=00ABB3&color=fff`;
              }}
            />
            <div className="user-info">
              <p className="user-name">{user?.name || 'Demo User'}</p>
              <p className="user-role-badge">{roleLabel}</p>
            </div>
          </div>
          <div className="footer-actions">
            <button className="sidebar-logout-btn" onClick={handleLogout}>
              <MdLogout />
              Logout
            </button>
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
            <h1>{pageTitle}</h1>
            <p className="page-subtitle">{pageSubtitle}</p>
          </div>

          <div className="top-bar-right">
            <span className="topbar-greeting">
              {getGreeting()},&nbsp;<strong>{user?.name?.split(' ')[0] || 'User'}</strong>
            </span>
            <img
              src={avatarUrl}
              alt={user?.name || 'User'}
              className="topbar-avatar"
              referrerPolicy="no-referrer"
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=00ABB3&color=fff`; }}
            />
          </div>
        </header>

        <div className="scrollable-content">
          <Outlet />
        </div>
      </main>

      {/* Floating theme toggle FAB */}
      <button
        className="theme-fab"
        onClick={() => dispatch(toggleTheme())}
        aria-label="Toggle theme"
        data-tooltip={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
    </div>
  );
};

export default DashboardLayout;
