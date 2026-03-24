import { MdAttachMoney, MdTrendingUp, MdWork, MdAccountBalanceWallet } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useGetWalletBalanceQuery, useGetTransactionsQuery } from '../../../services/walletApi';
import WalletCard from '../../../components/WalletCard/WalletCard';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Earnings = () => {
  const { data: balData } = useGetWalletBalanceQuery();
  const { data: txnData, isLoading } = useGetTransactionsQuery({ category: 'job_payment', limit: 50 });

  const balance      = balData?.data?.balance ?? 0;
  const transactions = txnData?.data?.transactions ?? [];
  const credits      = transactions.filter(t => t.type === 'credit');

  const now       = new Date();
  const thisMonth = credits.filter(t => new Date(t.createdAt).getMonth() === now.getMonth());
  const totalEarned = credits.reduce((s, t) => s + t.amount, 0);
  const thisEarned  = thisMonth.reduce((s, t) => s + t.amount, 0);

  // Monthly chart: last 6 months
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const m   = (now.getMonth() - 5 + i + 12) % 12;
    const y   = now.getFullYear() - (now.getMonth() - 5 + i < 0 ? 1 : 0);
    const sum = credits
      .filter(t => { const d = new Date(t.createdAt); return d.getMonth() === m && d.getFullYear() === y; })
      .reduce((s, t) => s + t.amount, 0);
    return { month: MONTH_NAMES[m], amount: sum };
  });

  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

  return (
  <div>
    {/* Wallet Card */}
    <WalletCard showTransactions={false} />

    {/* Stats */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Wallet Balance', val: fmt(balance),      color: 'teal',  icon: <MdAccountBalanceWallet /> },
        { label: 'Total Earned',   val: fmt(totalEarned),  color: 'blue',  icon: <MdAttachMoney /> },
        { label: 'This Month',     val: fmt(thisEarned),   color: 'green', icon: <MdTrendingUp /> },
        { label: 'Jobs Done',      val: credits.length,    color: 'amber', icon: <MdWork /> },
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

    <div className="dash-grid-2">
      {/* Monthly Bar Chart */}
      <div className="section-card">
        <div className="section-card-header">
          <div><h3>Monthly Earnings</h3><p>Last 6 months</p></div>
        </div>
        <div className="section-card-body">
          {credits.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              No earnings yet. Apply for jobs to start earning!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={v => `₹${v}`} />
                <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Earned']} />
                <Bar dataKey="amount" fill="#27ae60" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="section-card">
        <div className="section-card-header">
          <div><h3>Payment History</h3><p>{credits.length} earnings</p></div>
        </div>
        <div className="section-card-body">
          {isLoading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</p>}
          {!isLoading && (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Job / Description</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {credits.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No payment history yet.</td></tr>
                )}
                {credits.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>{t.description}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {new Date(t.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ fontWeight: 700, color: '#27AE60' }}>
                      +₹{t.amount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      ₹{t.balanceAfter.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default Earnings;
