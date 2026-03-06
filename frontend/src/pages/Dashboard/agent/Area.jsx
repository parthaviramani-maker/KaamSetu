import { MdLocationOn, MdGroup, MdWork, MdBusiness } from 'react-icons/md';

const areaStats = [
  { label: 'Primary Area',       val: 'Surat, Gujarat',  icon: <MdLocationOn />,  color: 'teal' },
  { label: 'Workers in Area',    val: '34',               icon: <MdGroup />,       color: 'blue' },
  { label: 'Active Jobs Nearby', val: '12',               icon: <MdWork />,        color: 'green' },
  { label: 'Employers in Area',  val: '8',                icon: <MdBusiness />,    color: 'amber' },
];

const coverageAreas = [
  { area: 'Surat (City)',          workers: 18, jobs: 7,  status: 'primary' },
  { area: 'Surat (Hazira GIDC)',   workers: 9,  jobs: 3,  status: 'active' },
  { area: 'Surat (Sachin GIDC)',   workers: 5,  jobs: 2,  status: 'active' },
  { area: 'Navsari',               workers: 2,  jobs: 0,  status: 'limited' },
];

const nearbyJobs = [
  { employer: 'Shah Constructions',   area: 'Surat',       role: 'Construction Worker', workers: 10 },
  { employer: 'Mehta Infra Projects', area: 'Hazira GIDC', role: 'Electrician',          workers: 3  },
  { employer: 'Joshi Developers',     area: 'Sachin GIDC', role: 'Plumber',              workers: 5  },
  { employer: 'Color Homes',          area: 'Surat',       role: 'Painter',              workers: 4  },
];

const Area = () => (
  <div>
    {/* Stats */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {areaStats.map(c => (
        <div key={c.label} className={`stat-card stat-card--${c.color}`}>
          <div className="stat-icon">{c.icon}</div>
          <div className="stat-body">
            <p className="stat-label">{c.label}</p>
            <p className="stat-value" style={{ fontSize: c.label === 'Primary Area' ? '0.9rem' : undefined }}>{c.val}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Map Placeholder + Coverage Table */}
    <div className="dash-grid-2">
      {/* Map Placeholder */}
      <div className="section-card">
        <div className="section-card-header">
          <div><h3>Area Map</h3><p>Coverage territory</p></div>
        </div>
        <div className="section-card-body">
          <div style={{
            height: '240px',
            background: 'var(--bg-hover)',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            border: '2px dashed var(--border-color)',
          }}>
            <MdLocationOn size={40} style={{ color: 'var(--color-accent)' }} />
            <p style={{ fontWeight: 600, margin: 0 }}>Surat, Gujarat</p>
            <p style={{ fontSize: '0.8rem', margin: 0 }}>Map integration — coming soon</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Surat', 'Hazira', 'Sachin', 'Navsari'].map(z => (
                <span key={z} style={{
                  fontSize: '0.72rem', padding: '3px 10px',
                  background: 'rgba(0,171,179,0.1)', color: 'var(--color-accent)',
                  borderRadius: '12px', fontWeight: 600,
                }}>{z}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Table */}
      <div className="section-card">
        <div className="section-card-header">
          <div><h3>Coverage Areas</h3><p>Zones you operate in</p></div>
        </div>
        <div className="section-card-body">
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr><th>Area</th><th>Workers</th><th>Jobs</th><th>Status</th></tr>
              </thead>
              <tbody>
                {coverageAreas.map(a => (
                  <tr key={a.area}>
                    <td style={{ fontWeight: 600 }}>{a.area}</td>
                    <td>{a.workers}</td>
                    <td>{a.jobs}</td>
                    <td>
                      <span className={`badge badge-${a.status === 'primary' ? 'hired' : a.status === 'active' ? 'active' : 'reviewing'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    {/* Nearby Jobs */}
    <div className="section-card" style={{ marginTop: '1.5rem' }}>
      <div className="section-card-header">
        <div><h3>Nearby Job Openings</h3><p>Employers hiring in your area</p></div>
      </div>
      <div className="section-card-body">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr><th>Employer</th><th>Area</th><th>Role Needed</th><th>Workers</th></tr>
            </thead>
            <tbody>
              {nearbyJobs.map((j, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{j.employer}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{j.area}</td>
                  <td>{j.role}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{j.workers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default Area;
