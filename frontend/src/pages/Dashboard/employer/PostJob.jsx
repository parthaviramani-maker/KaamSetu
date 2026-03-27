import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCheckCircle, MdArrowBack, MdWarning, MdAccountBalanceWallet, MdLock, MdWork } from 'react-icons/md';
import { useCreateJobMutation } from '../../../services/jobApi';
import { useGetWalletBalanceQuery } from '../../../services/walletApi';
import WalletCard from '../../../components/WalletCard/WalletCard';
import toast from '../../../components/Toast/toast';

const initialForm = {
  title: '', company: '', area: '', city: '',
  workType: '', pay: '', payPeriod: 'day',
  workers: '', deadline: '', skills: '',
  description: '', contactName: '', contactPhone: '',
};

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [createJob, { isLoading: isPosting }] = useCreateJobMutation();
  const { data: walletData } = useGetWalletBalanceQuery();
  const walletBalance = walletData?.data?.balance ?? 0;
  const jobPay = Number(form.pay) || 0;
  const isBalanceLow = jobPay > 0 && walletBalance < jobPay;

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Job title is required';
    if (!form.company.trim())     e.company     = 'Company name is required';
    if (!form.area.trim())        e.area        = 'Work area / site is required';
    if (!form.city.trim())        e.city        = 'City is required';
    if (!form.workType)           e.workType    = 'Please select work type';
    if (!form.pay)                           e.pay = 'Pay amount is required';
    else if (isNaN(Number(form.pay)) || Number(form.pay) <= 0) e.pay = 'Enter a valid amount greater than 0';
    if (!form.workers.trim())     e.workers     = 'No. of workers required';
    else if (isNaN(Number(form.workers)) || Number(form.workers) < 1)
                                  e.workers     = 'Enter valid number ≥ 1';
    if (!form.deadline)           e.deadline    = 'Application deadline is required';
    if (!form.skills.trim())      e.skills      = 'Enter at least one skill';
    if (!form.description.trim()) e.description = 'Job description is required';
    if (!form.contactName.trim()) e.contactName = 'Contact name is required';
    if (!form.contactPhone.trim()) e.contactPhone = 'Contact phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.contactPhone.trim()))
                                  e.contactPhone = 'Enter valid 10-digit Indian mobile number';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  // Map payPeriod UI value → backend payType
  const toPayType = (period) => {
    if (period === 'day')   return 'daily';
    if (period === 'month') return 'monthly';
    return 'daily'; // week/job treated as daily
  };

  // Map workType UI value → backend enum
  const toWorkType = (wt) => {
    if (wt === 'Daily Wage') return 'Daily-wage';
    return wt; // Full-time, Part-time, Contract stay the same
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await createJob({
        title:         form.title.trim(),
        company:       form.company.trim(),
        city:          form.city,
        area:          form.area.trim(),
        workType:      toWorkType(form.workType),
        pay:           Number(form.pay),
        payType:       toPayType(form.payPeriod),
        workersNeeded: Number(form.workers),
        deadline:      form.deadline || null,
        skills:        form.skills.split(',').map(s => s.trim()).filter(Boolean),
        description:   form.description.trim(),
        contactInfo:   `${form.contactName.trim()} — ${form.contactPhone.trim()}`,
      }).unwrap();
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to post job. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="section-card">
        <div className="section-card-body">
          <div className="success-state">
            <div className="success-state__icon">
              <MdCheckCircle size={64} />
            </div>
            <h2 className="success-state__title">Job Posted Successfully!</h2>
            <p className="success-state__desc">
              Your job <strong>"{form.title}"</strong> is now live. Workers in your area will see it.
            </p>
            <div className="success-state__actions">
              <button className="btn btn-primary" onClick={() => { setForm(initialForm); setSubmitted(false); }}>
                Post Another Job
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/dashboard/employer/my-jobs')}>
                View My Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="post-job-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <MdArrowBack size={18} />
        </button>
        <div className="post-job-header__info">
          <h2>Post New Job</h2>
          <p>Fill in details to find the right workers</p>
        </div>
      </div>

      {/* Wallet card — employer sees balance before posting */}
      <WalletCard showTransactions={false} />

      <div className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Job Details</h3>
            <p>All fields marked * are required</p>
          </div>
        </div>
        <div className="section-card-body">
          <form className="dash-form" onSubmit={handleSubmit} noValidate>

            {/* Row 1: Title + Company */}
            <div className="form-row">
              <div className="form-group">
                <label>Job Title <span className="required">*</span></label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Construction Workers Needed" />
                {errors.title && <span className="field-error"><MdWarning size={14} /> {errors.title}</span>}
              </div>
              <div className="form-group">
                <label>Company / Organisation Name <span className="required">*</span></label>
                <input name="company" value={form.company} onChange={handleChange}
                  placeholder="e.g. Shah Constructions" />
                {errors.company && <span className="field-error"><MdWarning size={14} /> {errors.company}</span>}
              </div>
            </div>

            {/* Row 2: City + Area */}
            <div className="form-row">
              <div className="form-group">
                <label>City <span className="required">*</span></label>
                <select name="city" value={form.city} onChange={handleChange}>
                  <option value="">Select city</option>
                  {['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Anand', 'Bhavnagar', 'Jamnagar', 'Gandhinagar'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && <span className="field-error"><MdWarning size={14} /> {errors.city}</span>}
              </div>
              <div className="form-group">
                <label>Work Site / Area <span className="required">*</span></label>
                <input name="area" value={form.area} onChange={handleChange}
                  placeholder="e.g. Adajan, Surat" />
                {errors.area && <span className="field-error"><MdWarning size={14} /> {errors.area}</span>}
              </div>
            </div>

            {/* Row 3: Work Type + Workers */}
            <div className="form-row">
              <div className="form-group">
                <label>Work Type <span className="required">*</span></label>
                <select name="workType" value={form.workType} onChange={handleChange}>
                  <option value="">Select type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Daily Wage">Daily Wage</option>
                </select>
                {errors.workType && <span className="field-error"><MdWarning size={14} /> {errors.workType}</span>}
              </div>
              <div className="form-group">
                <label>Workers Needed <span className="required">*</span></label>
                <input name="workers" type="number" min="1" value={form.workers} onChange={handleChange}
                  placeholder="e.g. 10" />
                {errors.workers && <span className="field-error"><MdWarning size={14} /> {errors.workers}</span>}
              </div>
            </div>

            {/* Row 4: Pay + Deadline */}
            <div className="form-row">
              <div className="form-group">
                <label>Pay (₹) <span className="required">*</span></label>
                <div className="pay-input-group">
                  <input
                    name="pay"
                    type="number"
                    min="1"
                    step="1"
                    value={form.pay}
                    onChange={handleChange}
                    placeholder="e.g. 600"
                  />
                  <select name="payPeriod" value={form.payPeriod} onChange={handleChange}>
                    <option value="day">per day</option>
                    <option value="week">per week</option>
                    <option value="month">per month</option>
                    <option value="job">per job</option>
                  </select>
                </div>
                {errors.pay && <span className="field-error"><MdWarning size={14} /> {errors.pay}</span>}
                {isBalanceLow && (
                  <div className="balance-warning">
                    <p className="balance-warning__title">
                      <MdWarning size={18} /> Insufficient Wallet Balance
                    </p>
                    <p className="balance-warning__detail">
                      Your wallet: <strong>₹{walletBalance.toLocaleString('en-IN')}</strong>
                      &nbsp;&nbsp;|&nbsp;&nbsp;
                      Job pay: <strong>₹{jobPay.toLocaleString('en-IN')}</strong>
                    </p>
                    <p className="balance-warning__cta">
                      Top up your wallet first — job cannot be posted without sufficient balance.
                    </p>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Application Deadline <span className="required">*</span></label>
                <input name="deadline" type="date" value={form.deadline} onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} />
                {errors.deadline && <span className="field-error"><MdWarning size={14} /> {errors.deadline}</span>}
              </div>
            </div>

            {/* Skills */}
            <div className="form-group">
              <label>Required Skills <span className="required">*</span></label>
              <input name="skills" value={form.skills} onChange={handleChange}
                placeholder="e.g. Construction, RCC Work, Physical Labour (comma separated)" />
              {errors.skills && <span className="field-error"><MdWarning size={14} /> {errors.skills}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Job Description <span className="required">*</span></label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe the work, timings, requirements, accommodation details etc." rows={4} />
              {errors.description && <span className="field-error"><MdWarning size={14} /> {errors.description}</span>}
            </div>

            {/* Contact */}
            <div className="form-row">
              <div className="form-group">
                <label>Contact Person Name <span className="required">*</span></label>
                <input name="contactName" value={form.contactName} onChange={handleChange}
                  placeholder="Your name or manager's name" />
                {errors.contactName && <span className="field-error"><MdWarning size={14} /> {errors.contactName}</span>}
              </div>
              <div className="form-group">
                <label>Contact Phone <span className="required">*</span></label>
                <input name="contactPhone" value={form.contactPhone} onChange={handleChange}
                  placeholder="10-digit mobile number" maxLength={10} />
                {errors.contactPhone && <span className="field-error"><MdWarning size={14} /> {errors.contactPhone}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-ghost"
                onClick={() => { setForm(initialForm); setErrors({}); }}
                disabled={isPosting}>
                Reset
              </button>
              <button type="submit" className="btn btn-primary" disabled={isPosting || isBalanceLow}>
                {isPosting
                  ? 'Posting…'
                  : isBalanceLow
                    ? <><MdLock size={18} /> Top Up to Post</>
                    : <><MdWork size={18} /> Post Job</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
