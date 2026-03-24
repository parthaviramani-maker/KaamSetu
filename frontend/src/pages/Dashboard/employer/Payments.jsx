import { MdAttachMoney, MdTrendingUp, MdReceipt, MdAccountBalanceWallet } from 'react-icons/md';
import { useGetWalletBalanceQuery, useGetTransactionsQuery } from '../../../services/walletApi';
import WalletCard from '../../../components/WalletCard/WalletCard';

const Payments = () => {
  const { data: balData } = useGetWalletBalanceQuery();
  const { data: txnData, isLoading } = useGetTransactionsQuery({ limit: 50 });

  const balance      = balData?.data?.balance ?? 0;
  const transactions = txnData?.data?.transactions ?? [];
  const total        = txnData?.data?.total ?? 0;

  // Stats
  const now        = new Date();
  const thisMonth  = transactions.filter(t => t.type === 'debit' && new Date(t.createdAt).getMonth() === now.getMonth());
  const lastMonth  = transactions.filter(t => t.type === 'debit' && new Date(t.createdAt).getMonth() === now.getMonth() - 1);
  const totalSpent = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const thisSpent  = thisMonth.reduce((s, t) => s + t.amount, 0);
  const lastSpent  = lastMonth.reduce((s, t) => s + t.amount, 0);

  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

  return (
  <div>
    {/* Wallet Card */}
    <WalletCard showTransactions={false} />

    {/* Stats */}
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Wallet Balance', val: fmt(balance),    color: 'teal',  icon: <MdAccountBalanceWallet /> },
        { label: 'Total Spent',    val: fmt(totalSpent), color: 'blue',  icon: <MdAttachMoney /> },
        { label: 'This Month',     val: fmt(thisSpent),  color: 'green', icon: <MdReceipt /> },
        { label: 'Last Month',     val: fmt(lastSpent),  color: 'amber', icon: <MdTrendingUp /> },
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

    {/* Transaction History */}
    <div className="section-card">
      <div className="section-card-header">
        <div>
          <h3>Payment History</h3>
          <p>{total} transactions</p>
        </div>
      </div>
      <div className="section-card-body">
        {isLoading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</p>}
        {!isLoading && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Balance After</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No transactions yet. Add money to start!</td></tr>
              )}
              {transactions.map((t, i) => (
                <tr key={t._id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{String(i + 1).padStart(2, '0')}</td>
                  <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>{t.description}</td>
                  <td>
                    <span className={`badge badge-${ t.category === 'topup' ? 'hired' : t.category === 'platform_fee' ? 'rejected' : 'reviewing' }`}>
                      {t.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(t.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ fontWeight: 700, color: t.type === 'credit' ? '#27AE60' : '#e74c3c' }}>
                    {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
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
  );
};

export default Payments;
