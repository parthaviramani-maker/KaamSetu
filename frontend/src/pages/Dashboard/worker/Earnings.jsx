import {
  MdAttachMoney, MdTrendingUp, MdWork, MdAccountBalanceWallet,
  MdCalendarMonth, MdReceiptLong, MdArrowUpward,
} from 'react-icons/md';
import { useGetWalletBalanceQuery, useGetTransactionsQuery } from '../../../services/walletApi';
import WalletCard from '../../../components/WalletCard/WalletCard';

const Earnings = () => {
  const { data: balData } = useGetWalletBalanceQuery();
  const { data: txnData, isLoading } = useGetTransactionsQuery({ category: 'job_payment', limit: 50 });

  const balance      = balData?.data?.balance ?? 0;
  const transactions = txnData?.data?.transactions ?? [];
  const credits      = transactions.filter(t => t.type === 'credit');

  const now       = new Date();
  const thisMonth = credits.filter(t => new Date(t.createdAt).getMonth() === now.getMonth());
  const lastMonth = credits.filter(t => {
    const d = new Date(t.createdAt);
    const lm = (now.getMonth() - 1 + 12) % 12;
    return d.getMonth() === lm;
  });

  const totalEarned  = credits.reduce((s, t) => s + t.amount, 0);
  const thisEarned   = thisMonth.reduce((s, t) => s + t.amount, 0);
  const lastEarned   = lastMonth.reduce((s, t) => s + t.amount, 0);
  const growth       = lastEarned > 0 ? Math.round(((thisEarned - lastEarned) / lastEarned) * 100) : null;

  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

  // Group credits by month
  const grouped = credits.reduce((acc, t) => {
    const d = new Date(t.createdAt);
    const key = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const stats = [
    { label: 'Total Earned',   val: fmt(totalEarned), color: 'blue',  icon: <MdAttachMoney size={22} /> },
    { label: 'This Month',     val: fmt(thisEarned),  color: 'green', icon: <MdTrendingUp size={22} /> },
    { label: 'Jobs Done',      val: credits.length,   color: 'amber', icon: <MdWork size={22} /> },
  ];

  return (
    <div>
      {/* Wallet Card */}
      <WalletCard showTransactions={false} />

      {/* Stats — forced 4-col regardless of viewport within dashboard */}
      <div className="earn-stats-grid">
        {stats.map(s => (
          <div key={s.label} className={`stat-card stat-card--${s.color}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-body">
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">{s.val}</p>
              {s.label === 'This Month' && growth !== null && (
                <p className={`stat-sub ${growth >= 0 ? 'text-success' : 'text-danger'}`}>
                  {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}% vs last month
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payment History */}
      <div className="section-card">
        <div className="section-card-header">
          <div>
            <h3 className="earn-section-title">
              <MdReceiptLong size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Payment History
            </h3>
            <p>{credits.length} earning{credits.length !== 1 ? 's' : ''} recorded</p>
          </div>
          {thisEarned > 0 && (
            <div className="earn-month-badge">
              <MdCalendarMonth size={14} />
              This month: <strong>{fmt(thisEarned)}</strong>
            </div>
          )}
        </div>

        <div className="section-card-body">
          {isLoading && (
            <div className="empty-state">Loading transactions…</div>
          )}

          {!isLoading && credits.length === 0 && (
            <div className="earn-empty">
              <MdAttachMoney size={48} className="earn-empty__icon" />
              <h4>No earnings yet</h4>
              <p>Apply for jobs and get hired to start earning!</p>
            </div>
          )}

          {!isLoading && credits.length > 0 && (
            <div className="earn-timeline">
              {Object.entries(grouped).map(([month, txns]) => (
                <div key={month} className="earn-month-group">
                  {/* Month header */}
                  <div className="earn-month-label">
                    <span>{month}</span>
                    <span className="earn-month-total">
                      {fmt(txns.reduce((s, t) => s + t.amount, 0))}
                    </span>
                  </div>

                  {/* Transaction rows */}
                  {txns.map((t, i) => (
                    <div key={t._id} className="earn-tx-row">
                      <div className="earn-tx-icon">
                        <MdArrowUpward size={16} />
                      </div>
                      <div className="earn-tx-info">
                        <p className="earn-tx-desc">{t.description}</p>
                        <p className="earn-tx-date">
                          {new Date(t.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="earn-tx-right">
                        <span className="earn-tx-amount">
                          +{fmt(t.amount)}
                        </span>
                        <span className="earn-tx-balance">
                          Balance: {fmt(t.balanceAfter)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Earnings;
