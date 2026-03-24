import { useState } from 'react';
import { MdSwapHoriz, MdCheckCircle, MdPending, MdMonetizationOn, MdAdd, MdClose, MdInfo } from 'react-icons/md';
import { useGetAgentPlacementsQuery, useGetAllWorkersQuery, useCreatePlacementMutation } from '../../../services/agentApi';
import { useGetAllJobsQuery } from '../../../services/jobApi';
import WalletCard from '../../../components/WalletCard/WalletCard';
import toast from '../../../components/Toast/toast';

const PLATFORM_FEE = 10; // 10% — must match backend config
const initialForm = { jobId: '', workerId: '', commissionType: 'fixed', commissionValue: '' };

const Placements = () => {
  const { data: res, isLoading, isError } = useGetAgentPlacementsQuery();
  const placements = res?.data || [];

  const { data: workersRes } = useGetAllWorkersQuery();
  const allWorkers = workersRes?.data?.workers || [];

  const { data: jobsRes } = useGetAllJobsQuery();
  const allJobs = jobsRes?.data || [];

  const [createPlacement, { isLoading: isCreating }] = useCreatePlacementMutation();

  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(initialForm);
  const [errors, setErrors]       = useState({});

  const total      = placements.length;
  const active     = placements.filter(p => p.status === 'active').length;
  const completed  = placements.filter(p => p.status === 'completed').length;
  const totalComm  = placements.reduce((s, p) => s + (p.commission || 0), 0);

  // Selected job info
  const selectedJob = allJobs.find(j => j._id === form.jobId) || null;

  // Build Set of active placements: "workerId|jobId"
  const activePairs = new Set(
    placements
      .filter(p => p.status === 'active')
      .map(p => `${p.workerId?._id}|${p.jobId?._id}`)
  );
  const isDuplicate = !!(form.workerId && form.jobId && activePairs.has(`${form.workerId}|${form.jobId}`));

  // Live payment preview
  const jobPay      = selectedJob?.pay || 0;
  const commVal     = Number(form.commissionValue) || 0;
  const commission  = form.commissionType === 'percent'
    ? Math.round(jobPay * commVal / 100)
    : commVal;
  const platformFee     = Math.round(jobPay * PLATFORM_FEE / 100);
  const workerGets      = jobPay - platformFee;
  const employerPays    = jobPay + commission;
  const showPreview     = jobPay > 0 && commVal >= 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.jobId)    e.jobId    = 'Please select a job';
    if (!form.workerId) e.workerId = 'Please select a worker';
    if (form.commissionValue === '' || isNaN(Number(form.commissionValue)) || Number(form.commissionValue) < 0)
      e.commissionValue = 'Enter valid commission (0 or more)';
    if (form.commissionType === 'percent' && Number(form.commissionValue) > 100)
      e.commissionValue = 'Percentage cannot exceed 100%';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      await createPlacement({
        jobId:           form.jobId,
        workerId:        form.workerId,
        employerId:      selectedJob?.postedBy?._id,
        commissionType:  form.commissionType,
        commissionValue: Number(form.commissionValue),
      }).unwrap();
      toast.success('Placement created & payments processed! 🎉');
      setForm(initialForm);
      setShowForm(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create placement');
    }
  };

  return (
  <div>
    {/* Wallet Card */}
    <WalletCard showTransactions={false} />

    {/* Summary */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Total Placements', val: total,     color: 'teal',  icon: <MdSwapHoriz /> },
        { label: 'Active',           val: active,    color: 'blue',  icon: <MdPending /> },
        { label: 'Completed',        val: completed, color: 'green', icon: <MdCheckCircle /> },
        { label: 'Total Commission', val: `₹${totalComm.toLocaleString('en-IN')}`, color: 'amber', icon: <MdMonetizationOn /> },
      ].map(c => (
        <div key={c.label} className={`stat-card stat-card--${c.color}`}>
          <div className="stat-icon">{c.icon}</div>
          <div className="stat-body">
            <p className="stat-label">{c.label}</p>
            <p className="stat-value">{c.val}</p>
          </div>
        </div>
      ))}
    </div>

    {/* ── New Placement Form ───────────────────────────────────────────── */}
    <div className="section-card" style={{ marginBottom: '1.5rem' }}>
      <div className="section-card-header" style={{ cursor: 'pointer' }} onClick={() => setShowForm(v => !v)}>
        <div><h3>New Placement</h3><p>Assign a worker to an employer job</p></div>
        <button
          type="button"
          className={`btn btn-${showForm ? 'ghost' : 'primary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          onClick={(e) => { e.stopPropagation(); setShowForm(v => !v); }}
        >
          {showForm ? <><MdClose size={16}/> Cancel</> : <><MdAdd size={16}/> New Placement</>}
        </button>
      </div>

      {showForm && (
        <div className="section-card-body">
          <form className="dash-form" onSubmit={handleSubmit} noValidate>

            {/* Row 1: Job selector */}
            <div className="form-group">
              <label>Select Job <span className="required">*</span></label>
              <select name="jobId" value={form.jobId} onChange={handleChange}>
                <option value="">-- Choose a job --</option>
                {allJobs.map(j => {
                  const alreadyPlaced = form.workerId && activePairs.has(`${form.workerId}|${j._id}`);
                  return (
                    <option key={j._id} value={j._id} disabled={alreadyPlaced}>
                      {j.title} — {j.company} ({j.city}){alreadyPlaced ? ' ✔ Active' : ''}
                    </option>
                  );
                })}
              </select>
              {errors.jobId && <span className="field-error">⚠ {errors.jobId}</span>}
              {selectedJob && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  Employer: <strong>{selectedJob.postedBy?.name}</strong> ({selectedJob.postedBy?.email})
                </p>
              )}
            </div>

            {/* Row 2: Worker */}
            <div className="form-group">
              <label>Select Worker <span className="required">*</span></label>
              <select name="workerId" value={form.workerId} onChange={handleChange}>
                <option value="">-- Choose a worker --</option>
                {allWorkers.map(w => {
                  const alreadyPlaced = form.jobId && activePairs.has(`${w._id}|${form.jobId}`);
                  return (
                    <option key={w._id} value={w._id} disabled={alreadyPlaced}>
                      {w.name}{w.phone ? ` — ${w.phone}` : ''}{alreadyPlaced ? ' ✔ Active placement' : ''}
                    </option>
                  );
                })}
              </select>
              {errors.workerId && <span className="field-error">⚠ {errors.workerId}</span>}
              {isDuplicate && (
                <p style={{ fontSize: '0.8rem', color: '#e67e22', marginTop: '0.35rem', fontWeight: 600 }}>
                  ⚠ This worker already has an active placement for this job.
                </p>
              )}
            </div>

            {/* Row 3: Commission Type + Value */}
            <div className="form-row">
              <div className="form-group">
                <label>Commission Type <span className="required">*</span></label>
                <select name="commissionType" value={form.commissionType} onChange={handleChange}>
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="percent">Percentage (%)</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  {form.commissionType === 'fixed' ? 'Commission (₹)' : 'Commission (%)'}{' '}
                  <span className="required">*</span>
                </label>
                <input
                  name="commissionValue"
                  type="number"
                  min="0"
                  max={form.commissionType === 'percent' ? 100 : undefined}
                  value={form.commissionValue}
                  onChange={handleChange}
                  placeholder={form.commissionType === 'fixed' ? 'e.g. 500' : 'e.g. 20'}
                />
                {errors.commissionValue && <span className="field-error">⚠ {errors.commissionValue}</span>}
              </div>
            </div>

            {/* Live Payment Preview */}
            {showPreview && (
              <div style={{
                background: 'rgba(39,174,96,0.07)',
                border: '1.5px solid rgba(39,174,96,0.25)',
                borderRadius: '0.75rem',
                padding: '1rem 1.2rem',
                marginBottom: '1rem',
                fontSize: '0.83rem',
              }}>
                <div style={{ fontWeight: 700, color: '#27ae60', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MdInfo size={15} /> Payment Breakdown Preview
                </div>
                {[
                  { label: 'Job Pay (set by employer)',   val: `₹${jobPay.toLocaleString('en-IN')}`,          color: 'var(--text-primary)' },
                  { label: `Your Commission (${form.commissionType === 'percent' ? commVal + '%' : 'fixed'})`, val: `+₹${commission.toLocaleString('en-IN')}`, color: '#27ae60' },
                  { label: `Platform Fee (${PLATFORM_FEE}% of job pay)`, val: `-₹${platformFee.toLocaleString('en-IN')}`, color: '#e74c3c' },
                  { label: 'Worker will receive',         val: `₹${workerGets.toLocaleString('en-IN')}`,       color: '#2980b9' },
                  { label: 'Employer total deducted',     val: `₹${employerPays.toLocaleString('en-IN')}`,     color: '#e67e22', fontWeight: 800 },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                    <strong style={{ color: row.color, fontWeight: row.fontWeight || 700 }}>{row.val}</strong>
                  </div>
                ))}
                <div style={{
                  marginTop: '0.7rem',
                  paddingTop: '0.6rem',
                  borderTop: '1px dashed rgba(231,76,60,0.3)',
                  fontSize: '0.75rem',
                  color: '#e67e22',
                  fontWeight: 600,
                }}>
                  ⚠ Make sure employer has at least ₹{employerPays.toLocaleString('en-IN')} in their wallet before creating this placement.
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn btn-ghost"
                onClick={() => { setForm(initialForm); setErrors({}); setShowForm(false); }}
                disabled={isCreating}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isCreating || isDuplicate}>
                {isCreating ? 'Creating…' : '🤝 Create Placement'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>

    <div className="section-card">
      <div className="section-card-header">
        <div><h3>All Placements</h3><p>Workers placed at employer sites</p></div>
      </div>
      <div className="section-card-body">
        {isLoading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</p>}
        {isError   && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-error)' }}>Failed to load placements.</p>}
        {!isLoading && !isError && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Worker</th>
                <th>Employer</th>
                <th>Job Role</th>
                <th>Date</th>
                <th>Commission</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {placements.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No placements yet.</td></tr>
              )}
              {placements.map((p, i) => (
                <tr key={p._id}>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{i + 1}</td>
                  <td>{p.workerId?.name || '—'}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{p.employerId?.name || '—'}</td>
                  <td style={{ fontSize: '0.82rem' }}>{p.jobId?.title || '—'}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {new Date(p.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ fontWeight: 700, color: '#27AE60' }}>₹{(p.commission || 0).toLocaleString('en-IN')}</td>
                  <td><span className={`badge badge-${p.status === 'active' ? 'reviewing' : p.status === 'completed' ? 'hired' : 'applied'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Placements;
