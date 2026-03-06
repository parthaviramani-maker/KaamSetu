// =============================================================================
// KAAMSETU DUMMY DATA
// All demo data for 4 role dashboards
// Unsplash images: https://images.unsplash.com/photo-{id}?w=80&h=80&fit=crop&crop=face
// =============================================================================

// ── Unsplash avatar helpers ───────────────────────────────────────────────────
const avatar = (id, w = 80) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${w}&fit=crop&crop=face&auto=format&q=80`;

// ── WORKERS dummy data ────────────────────────────────────────────────────────
export const workers = [
  { id: 1, name: 'Ramesh Patel',    skill: 'Construction Worker', area: 'Surat',     rate: '₹600/day', status: 'available', rating: 4.5, jobs: 28, avatar: avatar('1552058919-678f37b2e8ef') },
  { id: 2, name: 'Suresh Kumar',    skill: 'Electrician',         area: 'Ahmedabad', rate: '₹800/day', status: 'available', rating: 4.8, jobs: 42, avatar: avatar('1507003211169-0a1dd7228f2d') },
  { id: 3, name: 'Dinesh Yadav',    skill: 'Plumber',             area: 'Surat',     rate: '₹700/day', status: 'on-job',    rating: 4.3, jobs: 19, avatar: avatar('1472099645785-5658abf4ff4e') },
  { id: 4, name: 'Manoj Singh',     skill: 'Painter',             area: 'Vadodara',  rate: '₹550/day', status: 'available', rating: 4.6, jobs: 35, avatar: avatar('1500648767791-00dcc994a43e') },
  { id: 5, name: 'Arvind Chauhan',  skill: 'Mason',               area: 'Rajkot',    rate: '₹650/day', status: 'available', rating: 4.2, jobs: 22, avatar: avatar('1519085360753-af0119f7cbe7') },
  { id: 6, name: 'Pratap Solanki',  skill: 'Helper',              area: 'Surat',     rate: '₹400/day', status: 'on-job',    rating: 4.0, jobs: 14, avatar: avatar('1542909168-38c3df6b1d85') },
  { id: 7, name: 'Kamlesh Verma',   skill: 'Welder',              area: 'Anand',     rate: '₹750/day', status: 'available', rating: 4.7, jobs: 31, avatar: avatar('1570295999919-56ceb5ecca61') },
  { id: 8, name: 'Vijay Rathod',    skill: 'Carpenter',           area: 'Mehsana',   rate: '₹680/day', status: 'inactive',  rating: 4.1, jobs: 16, avatar: avatar('1624561172888-ac93c696d3a8') },
];

// ── EMPLOYERS dummy data ──────────────────────────────────────────────────────
export const employers = [
  { id: 1, name: 'Rajesh Shah',      company: 'Shah Constructions',   city: 'Surat',     avatar: avatar('1560250097-0b93528c311a'), jobsPosted: 12, hired: 48 },
  { id: 2, name: 'Anita Mehta',      company: 'Mehta Infra Projects', city: 'Ahmedabad', avatar: avatar('1494790108377-be9c29b29330'), jobsPosted: 8,  hired: 32 },
  { id: 3, name: 'Pradeep Joshi',    company: 'Joshi Developers',     city: 'Vadodara',  avatar: avatar('1560250097-0b93528c311a'), jobsPosted: 5,  hired: 18 },
];

// ── JOBS dummy data ───────────────────────────────────────────────────────────
export const jobs = [
  {
    id: 1, title: 'Construction Workers Needed',  company: 'Shah Constructions',
    area: 'Surat, Gujarat', pay: '₹600/day', type: 'Full-time',
    skills: ['Construction', 'Physical Labor'], workers: 10, status: 'active',
    posted: '2 days ago', deadline: 'Dec 30, 2024', icon: 'construction',
    description: 'Need 10 construction workers for a residential project in Surat. Experience in RCC work preferred.',
  },
  {
    id: 2, title: 'Electrician Required',          company: 'Mehta Infra Projects',
    area: 'Ahmedabad, Gujarat', pay: '₹800/day', type: 'Contract',
    skills: ['Wiring', 'Panel Work'], workers: 3, status: 'active',
    posted: '1 day ago', deadline: 'Jan 5, 2025', icon: 'electric',
    description: 'Qualified electricians needed for commercial building wiring project.',
  },
  {
    id: 3, title: 'Plumber for Apartment Project', company: 'Joshi Developers',
    area: 'Vadodara, Gujarat', pay: '₹700/day', type: 'Contract',
    skills: ['Plumbing', 'Pipe Fitting'], workers: 5, status: 'active',
    posted: '3 days ago', deadline: 'Jan 10, 2025', icon: 'plumbing',
    description: 'Experienced plumbers for high-rise apartment plumbing work.',
  },
  {
    id: 4, title: 'House Painters Needed',         company: 'Color Homes',
    area: 'Rajkot, Gujarat', pay: '₹550/day', type: 'Part-time',
    skills: ['Painting', 'Finishing'], workers: 4, status: 'open',
    posted: '5 days ago', deadline: 'Jan 15, 2025', icon: 'painting',
    description: 'Interior and exterior painters for a housing society project.',
  },
  {
    id: 5, title: 'Mason for Bridge Project',      company: 'Gujarat Roads Ltd',
    area: 'Anand, Gujarat', pay: '₹700/day', type: 'Full-time',
    skills: ['Masonry', 'Brickwork'], workers: 8, status: 'open',
    posted: '1 week ago', deadline: 'Jan 20, 2025', icon: 'masonry',
    description: 'Skilled masons required for bridge construction project.',
  },
  {
    id: 6, title: 'Welder for Factory Setup',      company: 'Patel Industries',
    area: 'Anand, Gujarat', pay: '₹750/day', type: 'Contract',
    skills: ['Welding', 'Fabrication'], workers: 6, status: 'closed',
    posted: '2 weeks ago', deadline: 'Dec 20, 2024', icon: 'welding',
    description: 'Arc and MIG welders for factory infrastructure setup.',
  },
];

// ── APPLICANTS (employer sees these) ─────────────────────────────────────────
export const applicants = [
  { id: 1, name: 'Ramesh Patel',   skill: 'Construction Worker', job: 'Construction Workers Needed', status: 'reviewing', applied: '2 days ago',  avatar: avatar('1552058919-678f37b2e8ef'), rating: 4.5 },
  { id: 2, name: 'Suresh Kumar',   skill: 'Electrician',         job: 'Electrician Required',        status: 'hired',     applied: '1 day ago',   avatar: avatar('1507003211169-0a1dd7228f2d'), rating: 4.8 },
  { id: 3, name: 'Dinesh Yadav',   skill: 'Plumber',             job: 'Plumber for Apartment Project',status: 'interview', applied: '3 days ago',  avatar: avatar('1472099645785-5658abf4ff4e'), rating: 4.3 },
  { id: 4, name: 'Manoj Singh',    skill: 'Painter',             job: 'House Painters Needed',       status: 'applied',   applied: '4 days ago',  avatar: avatar('1500648767791-00dcc994a43e'), rating: 4.6 },
  { id: 5, name: 'Arvind Chauhan', skill: 'Mason',               job: 'Mason for Bridge Project',    status: 'reviewing', applied: '5 days ago',  avatar: avatar('1519085360753-af0119f7cbe7'), rating: 4.2 },
  { id: 6, name: 'Kamlesh Verma',  skill: 'Welder',              job: 'Welder for Factory Setup',    status: 'hired',     applied: '6 days ago',  avatar: avatar('1570295999919-56ceb5ecca61'), rating: 4.7 },
  { id: 7, name: 'Vijay Rathod',   skill: 'Carpenter',           job: 'Construction Workers Needed', status: 'rejected',  applied: '1 week ago',  avatar: avatar('1624561172888-ac93c696d3a8'), rating: 4.1 },
];

// ── PLACEMENTS (agent sees these) ─────────────────────────────────────────────
export const placements = [
  { id: 1, worker: 'Ramesh Patel',   employer: 'Shah Constructions',   job: 'Construction Worker', date: 'Dec 15, 2024', commission: '₹1,200', status: 'placed' },
  { id: 2, worker: 'Suresh Kumar',   employer: 'Mehta Infra Projects', job: 'Electrician',         date: 'Dec 12, 2024', commission: '₹1,600', status: 'placed' },
  { id: 3, worker: 'Dinesh Yadav',   employer: 'Joshi Developers',     job: 'Plumber',             date: 'Dec 10, 2024', commission: '₹1,400', status: 'placed' },
  { id: 4, worker: 'Manoj Singh',    employer: 'Color Homes',          job: 'Painter',             date: 'Dec 8, 2024',  commission: '₹1,100', status: 'pending' },
  { id: 5, worker: 'Kamlesh Verma',  employer: 'Patel Industries',     job: 'Welder',              date: 'Dec 5, 2024',  commission: '₹1,500', status: 'placed' },
  { id: 6, worker: 'Arvind Chauhan', employer: 'Gujarat Roads Ltd',    job: 'Mason',               date: 'Dec 1, 2024',  commission: '₹1,300', status: 'pending' },
];

// ── ACTIVITY FEED ─────────────────────────────────────────────────────────────
export const employerActivity = [
  { id: 1, text: '<strong>Suresh Kumar</strong> accepted your job offer for Electrician', time: '2 hours ago' },
  { id: 2, text: 'New applicant <strong>Ramesh Patel</strong> applied to Construction Workers', time: '4 hours ago' },
  { id: 3, text: 'Job posting <strong>"House Painters Needed"</strong> is live', time: '1 day ago' },
  { id: 4, text: 'Payment of <strong>₹4,800</strong> processed for Mason project', time: '2 days ago' },
  { id: 5, text: '<strong>Dinesh Yadav</strong> completed plumbing work — rated 4.8★', time: '3 days ago' },
];

export const workerActivity = [
  { id: 1, text: '<strong>Shah Constructions</strong> shortlisted you for Construction job', time: '1 hour ago' },
  { id: 2, text: 'Interview scheduled with <strong>Mehta Infra</strong> on Dec 22', time: '3 hours ago' },
  { id: 3, text: 'Your application to <strong>"Electrician Required"</strong> was viewed', time: '5 hours ago' },
  { id: 4, text: 'Payment of <strong>₹4,200</strong> received from Gujarat Roads Ltd', time: '1 day ago' },
  { id: 5, text: 'Agent <strong>Bhavesh Patel</strong> registered you for Surat area', time: '3 days ago' },
];

export const agentActivity = [
  { id: 1, text: 'Placed <strong>Suresh Kumar</strong> at Mehta Infra Projects', time: '30 min ago' },
  { id: 2, text: '<strong>Ramesh Patel</strong> registered as new worker in your area', time: '2 hours ago' },
  { id: 3, text: 'Commission of <strong>₹1,600</strong> credited to your account', time: '1 day ago' },
  { id: 4, text: 'New job posting from <strong>Shah Constructions</strong> in Surat area', time: '1 day ago' },
  { id: 5, text: '3 workers in your roster are <strong>available</strong> for new jobs', time: '2 days ago' },
];

// ── STATS for dashboards ──────────────────────────────────────────────────────
export const employerStats = {
  activeJobs: 8,
  totalApplicants: 47,
  hired: 12,
  monthlySpend: '₹24,500',
  monthlySpendRaw: 24500,
};

export const workerStats = {
  applicationsSent: 6,
  pendingInterviews: 2,
  jobsCompleted: 18,
  totalEarned: '₹42,000',
  thisMonthEarned: '₹7,800',
  rating: 4.6,
};

export const agentStats = {
  registeredWorkers: 34,
  activePlacements: 12,
  pendingMatches: 8,
  monthlyCommission: '₹8,200',
  totalCommission: '₹64,500',
  successRate: 78,
};

export const adminStats = {
  totalEmployers: 1240,
  totalWorkers: 8950,
  totalAgents: 320,
  platformRevenue: '₹4,82,000',
  activeJobs: 284,
  completedPlacements: 6748,
  newSignupsToday: 47,
  pendingVerifications: 23,
};

// ── Monthly chart data ────────────────────────────────────────────────────────
export const employerMonthlyData = [
  { month: 'Jul', applicants: 18, hired: 5, spend: 14200 },
  { month: 'Aug', applicants: 24, hired: 8, spend: 18600 },
  { month: 'Sep', applicants: 31, hired: 10, spend: 21000 },
  { month: 'Oct', applicants: 28, hired: 9,  spend: 19800 },
  { month: 'Nov', applicants: 35, hired: 12, spend: 22400 },
  { month: 'Dec', applicants: 47, hired: 14, spend: 24500 },
];

export const workerMonthlyData = [
  { month: 'Jul', earned: 4200 },
  { month: 'Aug', earned: 5600 },
  { month: 'Sep', earned: 6800 },
  { month: 'Oct', earned: 5200 },
  { month: 'Nov', earned: 7200 },
  { month: 'Dec', earned: 7800 },
];

export const agentMonthlyData = [
  { month: 'Jul', placements: 6,  commission: 4800 },
  { month: 'Aug', placements: 8,  commission: 6400 },
  { month: 'Sep', placements: 10, commission: 7200 },
  { month: 'Oct', placements: 9,  commission: 6800 },
  { month: 'Nov', placements: 11, commission: 7600 },
  { month: 'Dec', placements: 12, commission: 8200 },
];

export const adminMonthlyData = [
  { month: 'Jul', placements: 520, revenue: 38000 },
  { month: 'Aug', placements: 580, revenue: 42000 },
  { month: 'Sep', placements: 620, revenue: 46000 },
  { month: 'Oct', placements: 700, revenue: 52000 },
  { month: 'Nov', placements: 780, revenue: 58000 },
  { month: 'Dec', placements: 840, revenue: 64000 },
];

// ── TOP AGENTS ────────────────────────────────────────────────────────────────
export const topAgents = [
  { id: 1, name: 'Bhavesh Patel',  area: 'Surat',     placements: 48, commission: '₹57,600', rating: 4.9, avatar: avatar('1506794778202-cad9cf4a3baf') },
  { id: 2, name: 'Deepak Sharma',  area: 'Ahmedabad', placements: 41, commission: '₹49,200', rating: 4.7, avatar: avatar('1560250097-0b93528c311a') },
  { id: 3, name: 'Nilesh Kothari', area: 'Vadodara',  placements: 36, commission: '₹43,200', rating: 4.6, avatar: avatar('1519085360753-af0119f7cbe7') },
  { id: 4, name: 'Sanjay Trivedi', area: 'Rajkot',    placements: 29, commission: '₹34,800', rating: 4.5, avatar: avatar('1472099645785-5658abf4ff4e') },
  { id: 5, name: 'Hemant Dave',    area: 'Anand',     placements: 24, commission: '₹28,800', rating: 4.4, avatar: avatar('1500648767791-00dcc994a43e') },
];

// ── ALL USERS (admin view) ────────────────────────────────────────────────────
export const allUsers = [
  { id: 1, name: 'Rajesh Shah',    email: 'rajesh@shah.com',   role: 'employer', status: 'active',   joined: 'Oct 15, 2024', avatar: avatar('1560250097-0b93528c311a') },
  { id: 2, name: 'Ramesh Patel',   email: 'ramesh@gmail.com',  role: 'worker',   status: 'active',   joined: 'Nov 2, 2024',  avatar: avatar('1552058919-678f37b2e8ef') },
  { id: 3, name: 'Bhavesh Patel',  email: 'bhavesh@agent.com', role: 'agent',    status: 'active',   joined: 'Sep 20, 2024', avatar: avatar('1506794778202-cad9cf4a3baf') },
  { id: 4, name: 'Anita Mehta',    email: 'anita@mehta.com',   role: 'employer', status: 'active',   joined: 'Oct 28, 2024', avatar: avatar('1494790108377-be9c29b29330') },
  { id: 5, name: 'Suresh Kumar',   email: 'suresh@gmail.com',  role: 'worker',   status: 'active',   joined: 'Nov 10, 2024', avatar: avatar('1507003211169-0a1dd7228f2d') },
  { id: 6, name: 'Deepak Sharma',  email: 'deepak@agent.com',  role: 'agent',    status: 'active',   joined: 'Aug 5, 2024',  avatar: avatar('1560250097-0b93528c311a') },
  { id: 7, name: 'Pradeep Joshi',  email: 'pradeep@joshi.com', role: 'employer', status: 'inactive', joined: 'Sep 1, 2024',  avatar: avatar('1519085360753-af0119f7cbe7') },
  { id: 8, name: 'Dinesh Yadav',   email: 'dinesh@gmail.com',  role: 'worker',   status: 'active',   joined: 'Nov 18, 2024', avatar: avatar('1472099645785-5658abf4ff4e') },
];
