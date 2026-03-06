import { MdAttachMoney, MdTrendingUp, MdReceipt, MdCheckCircle } from 'react-icons/md';

const paymentHistory = [
  { id: 1, desc: 'Construction Workers — 5 days',  amount: '₹3,000', date: 'Dec 15, 2024', job: 'Construction Workers Needed', status: 'paid' },
  { id: 2, desc: 'Electrician — 3 days',            amount: '₹2,400', date: 'Dec 12, 2024', job: 'Electrician Required',        status: 'paid' },
  { id: 3, desc: 'Plumber — 2 days',               amount: '₹1,400', date: 'Dec 10, 2024', job: 'Plumber for Apartment Project',status: 'paid' },
  { id: 4, desc: 'Mason — advance payment',         amount: '₹5,600', date: 'Dec 8, 2024',  job: 'Mason for Bridge Project',    status: 'paid' },
  { id: 5, desc: 'Welder — project completion',     amount: '₹4,500', date: 'Nov 28, 2024', job: 'Welder for Factory Setup',    status: 'paid' },
  { id: 6, desc: 'Painter — partial payment',       amount: '₹2,200', date: 'Nov 20, 2024', job: 'House Painters Needed',       status: 'paid' },
  { id: 7, desc: 'Helper — weekly wages',           amount: '₹2,000', date: 'Nov 15, 2024', job: 'Construction Workers Needed', status: 'pending' },
];

const billing = {
  totalSpent:    '₹21,100',
  thisMonth:     '₹6,800',
  lastMonth:     '₹7,400',
  outstanding:   '₹2,000',
};

const Payments = () => (
  <div>
    {/* Billing Summary */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Total Spent',    val: billing.totalSpent,  color: 'teal',  icon: <MdAttachMoney /> },
        { label: 'This Month',     val: billing.thisMonth,   color: 'blue',  icon: <MdReceipt /> },
        { label: 'Last Month',     val: billing.lastMonth,   color: 'green', icon: <MdTrendingUp /> },
        { label: 'Outstanding',    val: billing.outstanding, color: 'amber', icon: <MdCheckCircle /> },
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

    {/* Payment History Table */}
    <div className="section-card">
      <div className="section-card-header">
        <div>
          <h3>Payment History</h3>
          <p>{paymentHistory.length} transactions</p>
        </div>
      </div>
      <div className="section-card-body">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Job</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{String(i + 1).padStart(2, '0')}</td>
                  <td style={{ fontWeight: 500 }}>{p.desc}</td>
                  <td style={{ fontSize: '0.8rem', maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)' }}>{p.job}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.date}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{p.amount}</td>
                  <td>
                    <span className={`badge badge-${p.status === 'paid' ? 'hired' : 'reviewing'}`}>
                      {p.status}
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
);

export default Payments;
