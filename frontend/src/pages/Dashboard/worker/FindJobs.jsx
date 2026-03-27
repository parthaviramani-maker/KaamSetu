import { useState } from 'react';
import {
  MdSearch, MdLocationOn, MdAccessTime, MdWork,
  MdExpandMore, MdExpandLess, MdSend, MdCheckCircle,
  MdPeople, MdCalendarToday, MdPhone, MdBusiness, MdWarning,
} from 'react-icons/md';
import { JobIcon } from '../data/jobIcons';
import { useGetAllJobsQuery } from '../../../services/jobApi';
import { useApplyJobMutation, useGetMyApplicationsQuery } from '../../../services/applicationApi';
import toast from '../../../components/Toast/toast';

const FindJobs = () => {
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expanded,   setExpanded]   = useState(null);
  const [applying,   setApplying]   = useState(new Set());
  const [newlyApplied, setNewlyApplied] = useState(new Set());

  const { data: jobsRes, isLoading, isError } = useGetAllJobsQuery();
  const { data: myAppsRes } = useGetMyApplicationsQuery();
  const [applyJob] = useApplyJobMutation();

  const dbAppliedIds = new Set(
    (myAppsRes?.data || []).map(app => app.jobId?._id || app.jobId)
  );
  const appliedSet = new Set([...dbAppliedIds, ...newlyApplied]);

  const jobs = jobsRes?.data || [];

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.area.toLowerCase().includes(search.toLowerCase()) ||
                        j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'all' || j.workType === typeFilter;
    return matchSearch && matchType;
  });

  const handleApply = async (jobId) => {
    setApplying(prev => new Set([...prev, jobId]));
    try {
      const res = await applyJob({ jobId }).unwrap();
      setNewlyApplied(prev => new Set([...prev, jobId]));
      toast.success(res?.message || 'Application submitted!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to apply');
    } finally {
      setApplying(prev => { const s = new Set(prev); s.delete(jobId); return s; });
    }
  };

  if (isLoading) return (
    <div className="empty-state">
      <MdSearch size={48} className="empty-icon" />
      <h4>Loading jobs…</h4>
    </div>
  );

  if (isError) return (
    <div className="empty-state">
      <MdWarning size={48} className="empty-icon" />
      <h4>Failed to load jobs</h4>
      <p>Please try refreshing the page</p>
    </div>
  );

  return (
    <div>
      {/* ── Search + Filter Bar ──────────────────────────────────────────── */}
      <div className="section-card fj-filter-card">
        <div className="section-card-body">
          <div className="fj-filter-bar">
            <div className="fj-search-wrap">
              <MdSearch size={18} className="search-icon" />
              <input
                placeholder="Search by title, area, or skill…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="dash-filter-select"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {['Full-time', 'Part-time', 'Daily-wage', 'Contract'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="fj-result-count">
        {filtered.length} job{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* ── Job Cards ──────────────────────────────────────────────── */}
      <div className="fj-list">

        {filtered.length === 0 && (
          <div className="empty-state">
            <MdWork size={48} className="empty-icon" />
            <h4>No jobs found</h4>
            <p>Try different keywords or remove filters</p>
          </div>
        )}

        {filtered.map(job => {
          const jobId      = job._id;
          const isApplied  = appliedSet.has(jobId);
          const isApplying = applying.has(jobId);
          const isOpen     = expanded === jobId;
          const daysLeft   = job.deadline
            ? Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24))
            : null;

          return (
            <div
              key={jobId}
              className={`section-card${isApplied ? ' fj-card--applied' : ''}`}
            >
              <div className="fj-card-body">

                {/* ── Top Row ──────────────────────────────────────── */}
                <div className="fj-top-row">
                  <div className="fj-job-icon">
                    <JobIcon iconKey={job.workType} size={24} />
                  </div>

                  <div className="fj-info">
                    <div className="fj-title-row">
                      <h3>{job.title}</h3>
                      <span className={`badge badge-${job.status}`}>{job.status}</span>
                      {isApplied && (
                        <span className="badge badge-active">
                          <MdCheckCircle size={14} /> Applied
                        </span>
                      )}
                    </div>

                    <div className="fj-company-row">
                      <MdBusiness size={14} />
                      <span>{job.company}</span>
                    </div>

                    <div className="fj-meta-pills">
                      <span className="job-pill"><MdLocationOn size={14} /> {job.city}{job.area ? `, ${job.area}` : ''}</span>
                      <span className="job-pill"><MdWork size={14} /> {job.workType}</span>
                      <span className="job-pill"><MdPeople size={14} /> {job.workersNeeded} needed</span>
                      {daysLeft !== null && (
                        <span className={`job-pill${daysLeft <= 3 ? ' job-pill--urgent' : ''}`}>
                          <MdCalendarToday size={14} />
                          {daysLeft > 0 ? `${daysLeft}d left` : 'Last day!'}
                        </span>
                      )}
                    </div>

                    <div className="fj-skills">
                      {(job.skills || []).map(s => (
                        <span key={s} className="badge-teal">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="fj-pay">
                    <p className="fj-pay__amount">₹{job.pay.toLocaleString('en-IN')}</p>
                    <p className="fj-pay__period">per {job.payType === 'monthly' ? 'month' : 'day'}</p>
                  </div>
                </div>

                <div className="fj-divider" />

                {/* ── Bottom Row ───────────────────────────────────── */}
                <div className="fj-bottom-row">
                  <button
                    className="fj-expand-btn"
                    onClick={() => setExpanded(isOpen ? null : jobId)}
                  >
                    {isOpen
                      ? <><MdExpandLess size={18} /> Hide details</>
                      : <><MdExpandMore size={18} /> View details</>}
                  </button>

                  {isApplied ? (
                    <div className="fj-applied-indicator">
                      <MdCheckCircle size={18} /> Application Sent
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleApply(jobId)}
                      disabled={isApplying}
                    >
                      <MdSend size={18} />
                      {isApplying ? 'Applying…' : 'Apply Now'}
                    </button>
                  )}
                </div>

                {/* ── Expanded Details ──────────────────────────── */}
                {isOpen && (
                  <div className="fj-details">
                    {job.description && (
                      <p className="fj-details__desc">{job.description}</p>
                    )}
                    <div className="fj-details__meta">
                      {job.deadline && (
                        <span className="fj-meta-item">
                          <MdCalendarToday size={14} />
                          <strong>Deadline:</strong>&nbsp;{new Date(job.deadline).toLocaleDateString('en-IN')}
                        </span>
                      )}
                      {job.contactInfo && (
                        <span className="fj-meta-item">
                          <MdPhone size={14} />
                          <strong>Contact:</strong>&nbsp;{job.contactInfo}
                        </span>
                      )}
                      <span className="fj-meta-item">
                        <MdAccessTime size={14} />
                        <strong>Posted:</strong>&nbsp;{new Date(job.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FindJobs;
