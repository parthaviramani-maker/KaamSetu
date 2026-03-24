import { useState } from 'react';
import { MdAccountBalanceWallet, MdAddCircle, MdTrendingUp, MdOutlineArrowCircleDown } from 'react-icons/md';
import { useGetWalletBalanceQuery } from '../../services/walletApi';
import TopupModal from '../TopupModal/TopupModal';
import WithdrawModal from '../WithdrawModal/WithdrawModal';
import './WalletCard.scss';

const WalletCard = ({ showTransactions = false }) => {
  const { data, isLoading, refetch } = useGetWalletBalanceQuery();
  const [showModal,    setShowModal]    = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const balance      = data?.data?.balance ?? 0;
  const recent       = data?.data?.recentTransactions ?? [];
  const lastCredit   = recent.find(t => t.type === 'credit');

  return (
    <>
      <div className="wallet-card">
        <div className="wallet-card__left">
          <div className="wallet-card__label">
            <MdAccountBalanceWallet size={14} />
            My KaamSetu Wallet
          </div>
          <div className="wallet-card__balance">
            <span className="rupee">₹</span>
            {isLoading ? '—' : balance.toLocaleString('en-IN')}
          </div>
          {lastCredit && (
            <div className="wallet-card__sub">
              <MdTrendingUp size={11} style={{ verticalAlign: 'middle' }} />{' '}
              Last credit: +₹{lastCredit.amount.toLocaleString('en-IN')}
            </div>
          )}
          {!lastCredit && !isLoading && (
            <div className="wallet-card__sub">Add money to get started</div>
          )}
        </div>

        <div className="wallet-card__right">
          <button
            className="wallet-card__btn"
            onClick={() => setShowModal(true)}
          >
            <MdAddCircle size={16} />
            Add Money
          </button>
          <button
            className="wallet-card__btn wallet-card__btn--withdraw"
            onClick={() => setShowWithdraw(true)}
            disabled={balance === 0}
            style={{ marginTop: '0.4rem', background: balance === 0 ? 'var(--bg-hover)' : 'rgba(41,128,185,0.12)', color: balance === 0 ? 'var(--text-muted)' : '#2980b9', border: '1.5px solid rgba(41,128,185,0.3)' }}
          >
            <MdOutlineArrowCircleDown size={16} />
            Withdraw
          </button>
        </div>

        <span className="wallet-card__icon">💰</span>
      </div>

      {/* Recent mini transactions */}
      {showTransactions && recent.length > 0 && (
        <div className="section-card" style={{ marginBottom: '1.5rem' }}>
          <div className="section-card-header">
            <div><h3>Recent Transactions</h3><p>Last {recent.length} entries</p></div>
          </div>
          <div className="section-card-body">
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(t => (
                    <tr key={t._id}>
                      <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>{t.description}</td>
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
          </div>
        </div>
      )}

      {showModal && (
        <TopupModal
          currentBalance={balance}
          onClose={() => setShowModal(false)}
          onSuccess={() => { refetch(); setShowModal(false); }}
        />
      )}

      {showWithdraw && (
        <WithdrawModal
          currentBalance={balance}
          onClose={() => setShowWithdraw(false)}
          onSuccess={() => { refetch(); setShowWithdraw(false); }}
        />
      )}
    </>
  );
};

export default WalletCard;
