import { useState } from 'react';
import { MdAccountBalanceWallet, MdAddCircle, MdTrendingUp, MdOutlineArrowCircleDown, MdAccountBalance } from 'react-icons/md';
import { useGetWalletBalanceQuery } from '../../services/walletApi';
import { useGetBankDetailsQuery } from '../../services/userApi';
import TopupModal from '../TopupModal/TopupModal';
import WithdrawModal from '../WithdrawModal/WithdrawModal';
import BankDetailsModal from '../BankDetailsModal/BankDetailsModal';
import './WalletCard.scss';

const WalletCard = ({ showTransactions = false }) => {
  const { data, isLoading, refetch } = useGetWalletBalanceQuery();
  const { data: bankData, refetch: refetchBank } = useGetBankDetailsQuery();
  const [showModal,    setShowModal]    = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showBankModal,  setShowBankModal]  = useState(false);
  const [pendingAction,  setPendingAction]  = useState(null); // 'topup' | 'withdraw'

  const balance      = data?.data?.balance ?? 0;
  const recent       = data?.data?.recentTransactions ?? [];
  const lastCredit   = recent.find(t => t.type === 'credit');
  const bankDetails  = bankData?.data;
  const hasBankAccount = !!(bankDetails?.accountNumber);

  const handleAddMoneyClick = () => {
    if (!hasBankAccount) {
      setPendingAction('topup');
      setShowBankModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleWithdrawClick = () => {
    if (!hasBankAccount) {
      setPendingAction('withdraw');
      setShowBankModal(true);
    } else {
      setShowWithdraw(true);
    }
  };

  const handleBankModalSuccess = () => {
    refetchBank();
    setShowBankModal(false);
    if (pendingAction === 'topup')    setShowModal(true);
    if (pendingAction === 'withdraw') setShowWithdraw(true);
    setPendingAction(null);
  };

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
            onClick={handleAddMoneyClick}
          >
            <MdAddCircle size={16} />
            Add Money
          </button>
          <button
            className="wallet-card__btn wallet-card__btn--withdraw"
            onClick={handleWithdrawClick}
            disabled={balance === 0 && hasBankAccount}
            style={{ marginTop: '0.4rem', background: (balance === 0 && hasBankAccount) ? 'var(--bg-hover)' : 'rgba(41,128,185,0.12)', color: (balance === 0 && hasBankAccount) ? 'var(--text-muted)' : '#2980b9', border: '1.5px solid rgba(41,128,185,0.3)' }}
          >
            <MdOutlineArrowCircleDown size={16} />
            Withdraw
          </button>
          {!hasBankAccount && (
            <button
              className="wallet-card__btn"
              onClick={() => { setPendingAction(null); setShowBankModal(true); }}
              style={{ marginTop: '0.4rem', background: 'rgba(168,85,247,0.12)', color: '#a855f7', border: '1.5px solid rgba(168,85,247,0.3)', fontSize: '0.75rem' }}
            >
              <MdAccountBalance size={14} />
              Link Bank Account
            </button>
          )}
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

      {showBankModal && (
        <BankDetailsModal
          existingDetails={hasBankAccount ? bankDetails : null}
          onClose={() => { setShowBankModal(false); setPendingAction(null); }}
          onSuccess={handleBankModalSuccess}
        />
      )}
    </>
  );
};

export default WalletCard;
