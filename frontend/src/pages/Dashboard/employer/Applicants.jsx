import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MdFilterList, MdSearch, MdCheckCircle, MdCancel, MdStar } from 'react-icons/md';
import Avatar from '../../../components/Avatar';
import { useGetMyJobsQuery } from '../../../services/jobApi';
import { useGetJobApplicantsQuery, useUpdateStatusMutation } from '../../../services/applicationApi';
import toast from '../../../components/Toast/toast';

const STATUS_COLORS = {
  pending:  'badge-reviewing',
  approved: 'badge-hired',
  rejected: 'badge-rejected',
};
const STATUS_LABEL = {
  pending:  'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const Applicants = () => {
  const [searchParams] = useSearchParams();
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: jobsRes } = useGetMyJobsQuery();
  const jobs = jobsRes?.data || [];

  // Pre-select job from ?jobId= query param if present
  const [selectedJobId, setSelectedJobId] = useState(() => searchParams.get('jobId') || '');

  const {
    data: appsRes,
    isLoading: appsLoading,
    isError: appsError,
  } = useGetJobApplicantsQuery(selectedJobId, { skip: !selectedJobId });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();

  const list = appsRes?.data || [];

  const filtered = list.filter(a => {
    const workerName = a.workerId?.name || '';
    const matchSearch = workerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = async (id) => {
    try {
      await updateStatus({ id, status: 'approved', jobId: selectedJobId }).unwrap();
      toast.success('Application approved');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to approve');
    }
  };
  const handleReject = async (id) => {
    try {
      await updateStatus({ id, status: 'rejected', jobId: selectedJobId }).unwrap();
      toast.success('Application rejected');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to reject');
    }
  };

  const counts = {
    total:    list.length,
    pending:  list.filter(a => a.status === 'pending').length,
    approved: list.filter(a => a.status === 'approved').length,
    rejected: list.filter(a => a.status === 'rejected').length,
  };

  return (
    <div>
      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total',    val: counts.total,    color: 'teal' },
          { label: 'Pending',  val: counts.pending,  color: 'blue' },
          { label: 'Approved', val: counts.approved, color: 'green' },
          { label: 'Rejected', val: counts.rejected, color: 'amber' },
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
        {/* Filters */}
        <div className="section-card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Job selector */}
          <select
            className="dash-filter-select"
            style={{ flex: '1 1 220px', minWidth: 0 }}
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
          >
            <option value="">-- Select a Job --</option>
            {jobs.map(j => (
              <option key={j._id} value={j._id}>{j.title} ({j.status})</option>
            ))}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 200px' }}>
            <MdSearch size={18} style={{ color: 'var(--text-secondary)' }} />
            <input
              className="dash-search-input"
              placeholder="Search applicants…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select className="dash-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              {['pending','approved','rejected'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="section-card-body">
          {!selectedJobId && (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Select a job above to see its applicants.</p>
          )}
          {appsLoading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</p>}
          {appsError   && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-error)' }}>Failed to load applicants.</p>}
          {selectedJobId && !appsLoading && !appsError && (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Email</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No applicants found</td></tr>
                )}
                {filtered.map(a => {
                  const worker = a.workerId || {};
                  return (
                  <tr key={a._id}>
                    <td>
                      <div className="td-user">
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name || 'W')}&background=00ABB3&color=fff&size=80`}
                          alt={worker.name}
                        />
                        <div className="td-user-info">
                          <div className="name">{worker.name || '—'}</div>
                          <div className="meta">{worker.phone || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{worker.email || '—'}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {new Date(a.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td><span className={`badge ${STATUS_COLORS[a.status] || 'badge-applied'}`}>{STATUS_LABEL[a.status] || a.status}</span></td>
                    <td>
                      {a.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            className="btn-icon-action btn-icon-action--green"
                            title="Approve"
                            onClick={() => handleApprove(a._id)}
                            disabled={isUpdating}
                          >
                            <MdCheckCircle size={18} />
                          </button>
                          <button
                            className="btn-icon-action btn-icon-action--red"
                            title="Reject"
                            onClick={() => handleReject(a._id)}
                            disabled={isUpdating}
                          >
                            <MdCancel size={18} />
                          </button>
                        </div>
                      )}
                      {a.status === 'approved' && <span style={{ fontSize: '0.78rem', color: '#27AE60', fontWeight: 600 }}>✓ Approved</span>}
                      {a.status === 'rejected' && <span style={{ fontSize: '0.78rem', color: 'var(--color-error)', fontWeight: 600 }}>✗ Rejected</span>}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applicants;
