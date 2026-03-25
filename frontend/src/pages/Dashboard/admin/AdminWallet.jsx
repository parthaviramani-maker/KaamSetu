import { MdAccountBalanceWallet, MdTrendingUp, MdTrendingDown, MdSwapHoriz } from 'react-icons/md';
import { useGetWalletBalanceQuery, useGetTransactionsQuery } from '../../../services/walletApi';
import WalletCard from '../../../components/WalletCard/WalletCard';

const AdminWallet = () => {
  const { data: balData } = useGetWalletBalanceQuery();
  const { data: txnData, isLoading } = useGetTransactionsQuery({ limit: 50 });

  const balance      = balData?.data?.balance ?? 0;
  const transactions = txnData?.data?.transactions ?? [];

  const credits    = transactions.filter(t => t.type === 'credit');
  const debits     = transactions.filter(t => t.type === 'debit');
  const totalIn    = credits.reduce((s, t) => s + t.amount, 0);
  const totalOut   = debits.reduce((s, t) => s + t.amount, 0);

  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div>
      {/* Wallet Card — Add Money + Withdraw */}
      <WalletCard showTransactions={false} />

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Wallet Balance', val: fmt(balance),   color: 'teal',  icon: <MdAccountBalanceWallet /> },
          { label: 'Total Added',    val: fmt(totalIn),   color: 'green', icon: <MdTrendingUp /> },
          { label: 'Total Withdrawn',val: fmt(totalOut),  color: 'amber', icon: <MdTrendingDown /> },
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

      {/* Full Transaction History */}
      <div className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Transaction History</h3>
            <p>{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="section-card-body">
          {isLoading && (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</p>
          )}
          {!isLoading && (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Balance After</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                        No transactions yet. Add money to get started.
                      </td>
                    </tr>
                  )}
                  {transactions.map(t => (
                    <tr key={t._id}>
                      <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>{t.description}</td>
                      <td>
                        <span style={{
                          fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px',
                          fontWeight: 600, textTransform: 'capitalize',
                          background: t.category === 'topup' ? 'rgba(39,174,96,0.1)'
                            : t.category === 'withdrawal' ? 'rgba(231,76,60,0.1)'
                            : 'rgba(0,171,179,0.1)',
                          color: t.category === 'topup' ? '#27AE60'
                            : t.category === 'withdrawal' ? '#e74c3c'
                            : 'var(--color-accent)',
                        }}>
                          {t.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
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

export default AdminWallet;
