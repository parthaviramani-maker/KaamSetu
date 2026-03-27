import { useState } from 'react';
import {
  MdAttachMoney, MdTrendingUp, MdReceipt, MdAccountBalanceWallet, MdSearch,
} from 'react-icons/md';
import { useGetWalletBalanceQuery, useGetTransactionsQuery } from '../../../services/walletApi';
import WalletCard from '../../../components/WalletCard/WalletCard';
import './Payments.scss';

const CATEGORY_BADGE = {
  topup:        { label: 'Top Up',       cls: 'badge-active'    },
  withdrawal:   { label: 'Withdrawal',   cls: 'badge-reviewing' },
  platform_fee: { label: 'Platform Fee', cls: 'badge-rejected'  },
  transfer:     { label: 'Transfer',     cls: 'badge-interview' },
  job_payment:  { label: 'Job Payment',  cls: 'badge-hired'     },
};

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const catInfo = (cat) =>
  CATEGORY_BADGE[cat] ?? { label: cat.replace(/_/g, ' '), cls: 'badge-open' };

const Payments = () => {
  const { data: balData }               = useGetWalletBalanceQuery();
  const { data: txnData, isLoading }    = useGetTransactionsQuery({ limit: 100 });

  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'credit' | 'debit'

  const balance      = balData?.data?.balance       ?? 0;
  const transactions = txnData?.data?.transactions  ?? [];
  const total        = txnData?.data?.total         ?? 0;

  const now         = new Date();
  const totalSpent  = transactions.filter(t => t.type === 'debit').reduce((s, t)  => s + t.amount, 0);
  const totalEarned = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const thisSpent   = transactions
    .filter(t => t.type === 'debit'
      && new Date(t.createdAt).getMonth()     === now.getMonth()
      && new Date(t.createdAt).getFullYear()  === now.getFullYear())
    .reduce((s, t) => s + t.amount, 0);

  const filtered = transactions.filter(t => {
    const matchType   = typeFilter === 'all' || t.type === typeFilter;
    const q           = search.toLowerCase();
    const matchSearch = !q || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  return (
    <div className="payments-page">

      {/* Wallet Card */}
      <WalletCard showTransactions={false} />

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: 'Wallet Balance',  val: fmt(balance),     color: 'teal',  icon: <MdAccountBalanceWallet size={22} /> },
          { label: 'Total Spent',     val: fmt(totalSpent),  color: 'blue',  icon: <MdAttachMoney size={22} /> },
          { label: 'Total Received',  val: fmt(totalEarned), color: 'green', icon: <MdTrendingUp size={22} /> },
          { label: 'This Month',      val: fmt(thisSpent),   color: 'amber', icon: <MdReceipt size={22} /> },
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
            <h3>Transaction History</h3>
            <p>{total} total transactions</p>
          </div>
          <div className="header-right">
            <div className="pay-search">
              <MdSearch size={15} className="pay-search__icon" />
              <input
                type="text"
                className="pay-search__input"
                placeholder="Search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="pay-tabs">
              {[
                { key: 'all',    label: 'All'    },
                { key: 'credit', label: 'Credit' },
                { key: 'debit',  label: 'Debit'  },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`pay-tabs__btn pay-tabs__btn--${key}${typeFilter === key ? ' pay-tabs__btn--active' : ''}`}
                  onClick={() => setTypeFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="section-card-body">
          {isLoading && (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <p>Loading transactions…</p>
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <h4>{search || typeFilter !== 'all' ? 'No matching transactions' : 'No transactions yet'}</h4>
              <p>{search || typeFilter !== 'all' ? 'Try adjusting your search or filter.' : 'Add money to your wallet to get started!'}</p>
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
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
                  {filtered.map((t, i) => {
                    const cat = catInfo(t.category);
                    return (
                      <tr key={t._id}>
                        <td className="tx-serial">{String(i + 1).padStart(2, '0')}</td>
                        <td className="tx-desc">{t.description}</td>
                        <td>
                          <span className={`badge ${cat.cls}`}>{cat.label}</span>
                        </td>
                        <td className="tx-date">
                          {new Date(t.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td>
                          <span className={`tx-amount tx-amount--${t.type}`}>
                            {t.type === 'credit' ? '+' : '−'}{fmt(t.amount)}
                          </span>
                        </td>
                        <td className="tx-balance">{fmt(t.balanceAfter)}</td>
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

export default Payments;
