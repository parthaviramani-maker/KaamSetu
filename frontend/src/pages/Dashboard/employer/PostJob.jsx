import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCheckCircle, MdArrowBack } from 'react-icons/md';
import { useCreateJobMutation } from '../../../services/jobApi';
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

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Job title is required';
    if (!form.company.trim())     e.company     = 'Company name is required';
    if (!form.area.trim())        e.area        = 'Work area / site is required';
    if (!form.city.trim())        e.city        = 'City is required';
    if (!form.workType)           e.workType    = 'Please select work type';
    if (!form.pay.trim())         e.pay         = 'Pay amount is required';
    else if (isNaN(Number(form.pay))) e.pay     = 'Enter a valid number';
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
      <div className="section-card" style={{ maxWidth: 560, margin: '4rem auto', textAlign: 'center' }}>
        <div className="section-card-body" style={{ padding: '3rem 2rem' }}>
          <MdCheckCircle style={{ fontSize: 64, color: '#27AE60', marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Job Posted Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Your job <strong>"{form.title}"</strong> is now live. Workers in your area will see it.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => { setForm(initialForm); setSubmitted(false); }}>
              Post Another Job
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard/employer/my-jobs')}>
              View My Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
          <MdArrowBack style={{ fontSize: '1.25rem' }} />
        </button>
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700 }}>Post New Job</h2>
          <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Fill in details to find the right workers</p>
        </div>
      </div>

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
                {errors.title && <span className="field-error">⚠ {errors.title}</span>}
              </div>
              <div className="form-group">
                <label>Company / Organisation Name <span className="required">*</span></label>
                <input name="company" value={form.company} onChange={handleChange}
                  placeholder="e.g. Shah Constructions" />
                {errors.company && <span className="field-error">⚠ {errors.company}</span>}
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
                {errors.city && <span className="field-error">⚠ {errors.city}</span>}
              </div>
              <div className="form-group">
                <label>Work Site / Area <span className="required">*</span></label>
                <input name="area" value={form.area} onChange={handleChange}
                  placeholder="e.g. Adajan, Surat" />
                {errors.area && <span className="field-error">⚠ {errors.area}</span>}
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
                {errors.workType && <span className="field-error">⚠ {errors.workType}</span>}
              </div>
              <div className="form-group">
                <label>Workers Needed <span className="required">*</span></label>
                <input name="workers" type="number" min="1" value={form.workers} onChange={handleChange}
                  placeholder="e.g. 10" />
                {errors.workers && <span className="field-error">⚠ {errors.workers}</span>}
              </div>
            </div>

            {/* Row 4: Pay + Deadline */}
            <div className="form-row">
              <div className="form-group">
                <label>Pay (₹) <span className="required">*</span></label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input name="pay" value={form.pay} onChange={handleChange}
                    placeholder="e.g. 600" style={{ flex: 1 }} />
                  <select name="payPeriod" value={form.payPeriod} onChange={handleChange}
                    style={{ width: 100 }}>
                    <option value="day">per day</option>
                    <option value="week">per week</option>
                    <option value="month">per month</option>
                    <option value="job">per job</option>
                  </select>
                </div>
                {errors.pay && <span className="field-error">⚠ {errors.pay}</span>}
              </div>
              <div className="form-group">
                <label>Application Deadline <span className="required">*</span></label>
                <input name="deadline" type="date" value={form.deadline} onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} />
                {errors.deadline && <span className="field-error">⚠ {errors.deadline}</span>}
              </div>
            </div>

            {/* Skills */}
            <div className="form-group">
              <label>Required Skills <span className="required">*</span></label>
              <input name="skills" value={form.skills} onChange={handleChange}
                placeholder="e.g. Construction, RCC Work, Physical Labour (comma separated)" />
              {errors.skills && <span className="field-error">⚠ {errors.skills}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Job Description <span className="required">*</span></label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe the work, timings, requirements, accommodation details etc." rows={4} />
              {errors.description && <span className="field-error">⚠ {errors.description}</span>}
            </div>

            {/* Contact */}
            <div className="form-row">
              <div className="form-group">
                <label>Contact Person Name <span className="required">*</span></label>
                <input name="contactName" value={form.contactName} onChange={handleChange}
                  placeholder="Your name or manager's name" />
                {errors.contactName && <span className="field-error">⚠ {errors.contactName}</span>}
              </div>
              <div className="form-group">
                <label>Contact Phone <span className="required">*</span></label>
                <input name="contactPhone" value={form.contactPhone} onChange={handleChange}
                  placeholder="10-digit mobile number" maxLength={10} />
                {errors.contactPhone && <span className="field-error">⚠ {errors.contactPhone}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-ghost"
                onClick={() => { setForm(initialForm); setErrors({}); }}
                disabled={isPosting}>
                Reset
              </button>
              <button type="submit" className="btn btn-primary" disabled={isPosting}>
                {isPosting ? 'Posting…' : '🚀 Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
