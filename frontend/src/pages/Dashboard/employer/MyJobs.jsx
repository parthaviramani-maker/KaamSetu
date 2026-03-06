import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdSearch, MdAdd, MdLocationOn, MdAccessTime, MdPeople, MdWork } from 'react-icons/md';
import { JobIcon } from '../data/jobIcons';
import { jobs } from '../data/dummyData';

const MyJobs = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.area.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || j.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search jobs by title or area..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <Link to="/dashboard/employer/post-job" className="btn btn-primary">
          <MdAdd /> <span className="btn-text">Post New Job</span>
        </Link>
      </div>

      {/* Summary Row */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total', count: jobs.length, color: 'var(--text-secondary)' },
          { label: 'Active', count: jobs.filter(j => j.status === 'active').length, color: '#00ABB3' },
          { label: 'Open', count: jobs.filter(j => j.status === 'open').length, color: '#27AE60' },
          { label: 'Closed', count: jobs.filter(j => j.status === 'closed').length, color: '#E53E3E' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '0.75rem', padding: '0.75rem 1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center'
          }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: s.color }}>{s.count}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><MdWork size={48} /></div>
          <h4>No jobs found</h4>
          <p>Try adjusting your search or filters.</p>
          <Link to="/dashboard/employer/post-job" className="btn btn-primary">Post a Job</Link>
        </div>
      ) : (
        <div className="jobs-list">
          {filtered.map(job => (
            <div key={job.id} className="section-card" style={{ marginBottom: '1rem' }}>
              <div className="section-card-body">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="job-icon" style={{ width: 52, height: 52 }}><JobIcon iconKey={job.icon} size={26} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>{job.title}</h3>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{job.company}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className={`badge badge-${job.status}`}>{job.status}</span>
                        <span style={{ fontWeight: 700, color: '#00ABB3', fontSize: '0.9rem' }}>{job.pay}</span>
                      </div>
                    </div>

                    <div className="job-meta" style={{ marginTop: '0.75rem' }}>
                      <span><MdLocationOn />{job.area}</span>
                      <span><MdPeople />{job.workers} workers needed</span>
                      <span><MdAccessTime />Posted {job.posted}</span>
                      <span>Deadline: {job.deadline}</span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.5 }}>
                      {job.description}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                      {job.skills.map(s => (
                        <span key={s} className="skill-tag" style={{ background: 'rgba(0,171,179,0.1)', color: '#00ABB3', fontSize: '11px', padding: '2px 10px', borderRadius: '999px', fontWeight: 500 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                  <Link to="/dashboard/employer/applicants" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                    View Applicants
                  </Link>
                  {job.status !== 'closed' && (
                    <button className="btn btn-danger" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                      Close Job
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
