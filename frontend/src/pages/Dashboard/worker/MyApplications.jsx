import { applicants } from '../data/dummyData';

const myApps = applicants.slice(0, 6).map(a => ({
  ...a,
  employer: a.job.includes('Construction') ? 'Shah Constructions'
          : a.job.includes('Electri')      ? 'Mehta Infra Projects'
          : a.job.includes('Plumb')        ? 'Joshi Developers'
          : a.job.includes('Paint')        ? 'Color Homes'
          : a.job.includes('Mason')        ? 'Gujarat Roads Ltd'
          : 'Patel Industries',
}));

const STATUS_CLASS = {
  applied:   'badge-applied',
  reviewing: 'badge-reviewing',
  interview: 'badge-interview',
  hired:     'badge-hired',
  rejected:  'badge-rejected',
};

const MyApplications = () => (
  <div>
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Total Applied',  val: myApps.length,                                           color: 'teal' },
        { label: 'In Review',      val: myApps.filter(a => a.status === 'reviewing').length,      color: 'blue' },
        { label: 'Interviews',     val: myApps.filter(a => a.status === 'interview').length,      color: 'green' },
        { label: 'Offers',         val: myApps.filter(a => a.status === 'hired').length,          color: 'amber' },
      ].map(c => (
        <div key={c.label} className={`stat-card stat-card--${c.color}`}>
          <div className="stat-body">
            <p className="stat-label">{c.label}</p>
            <p className="stat-value">{c.val}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="section-card">
      <div className="section-card-header">
        <div>
          <h3>My Applications</h3>
          <p>Track the status of all your job applications</p>
        </div>
      </div>
      <div className="section-card-body">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Employer</th>
                <th>Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myApps.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.job}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{a.employer}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{a.applied}</td>
                  <td><span className={`badge ${STATUS_CLASS[a.status] || 'badge-applied'}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default MyApplications;
