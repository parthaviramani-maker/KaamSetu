import { useState } from 'react';
import {
  MdAccountBalanceWallet, MdAddCircle, MdTrendingUp,
  MdOutlineArrowCircleDown, MdAccountBalance, MdSend, MdCheckCircle,
  MdEdit,
} from 'react-icons/md';
import { useGetWalletBalanceQuery } from '../../services/walletApi';
import { useGetBankDetailsQuery } from '../../services/userApi';
import TopupModal from '../TopupModal/TopupModal';
import WithdrawModal from '../WithdrawModal/WithdrawModal';
import TransferModal from '../TransferModal/TransferModal';
import BankDetailsModal from '../BankDetailsModal/BankDetailsModal';
import './WalletCard.scss';

const WalletCard = ({ showTransactions = false }) => {
  const { data, isLoading, refetch } = useGetWalletBalanceQuery();
  const { data: bankData, refetch: refetchBank } = useGetBankDetailsQuery();
  const [showModal,     setShowModal]     = useState(false);
  const [showWithdraw,  setShowWithdraw]  = useState(false);
  const [showTransfer,  setShowTransfer]  = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const balance        = data?.data?.balance            ?? 0;
  const recent         = data?.data?.recentTransactions ?? [];
  const lastCredit     = recent.find(t => t.type === 'credit');
  const bankDetails    = bankData?.data;
  const hasBankAccount = !!(bankDetails?.accountNumber);

  const handleAddMoneyClick = () => {
    if (!hasBankAccount) { setPendingAction('topup'); setShowBankModal(true); }
    else setShowModal(true);
  };

  const handleWithdrawClick = () => {
    if (!hasBankAccount) { setPendingAction('withdraw'); setShowBankModal(true); }
    else setShowWithdraw(true);
  };

  const handleBankModalSuccess = () => {
    refetchBank();
    setShowBankModal(false);
    if (pendingAction === 'topup')    setShowModal(true);
    if (pendingAction === 'withdraw') setShowWithdraw(true);
    setPendingAction(null);
  };

  // 4 action boxes
  const actions = [
    {
      key: 'add',
      icon: <MdAddCircle size={32} />,
      label: 'Add Money',
      sub: 'Top up wallet',
      mod: 'teal',
      onClick: handleAddMoneyClick,
      disabled: false,
    },
    {
      key: 'withdraw',
      icon: <MdOutlineArrowCircleDown size={32} />,
      label: 'Withdraw',
      sub: 'To bank account',
      mod: 'warning',
      onClick: handleWithdrawClick,
      disabled: balance === 0 && hasBankAccount,
    },
    {
      key: 'send',
      icon: <MdSend size={32} />,
      label: 'Send Money',
      sub: 'Transfer to user',
      mod: 'info',
      onClick: () => setShowTransfer(true),
      disabled: balance === 0,
    },
    {
      key: 'bank',
      icon: <MdAccountBalance size={32} />,
      label: 'Link Bank',
      sub: 'Required for wallet',
      mod: 'success',
      onClick: () => { setPendingAction(null); setShowBankModal(true); },
      disabled: false,
    },
  ];

  // If bank is linked, we only show first 3 actions (Add, Withdraw, Send)
  // to keep a clean 3-column layout as requested.
  const displayActions = hasBankAccount ? actions.slice(0, 3) : actions;

  return (
    <>
      {/* ── Balance Card ── */}
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
              <MdTrendingUp size={14} />{' '}
              Last credit: +₹{lastCredit.amount.toLocaleString('en-IN')}
            </div>
          )}
        </div>
        
        {hasBankAccount && (
          <div className="wallet-card__bank-badge">
            <div className="bank-pill-mini">
              <MdAccountBalance size={11} />
              <span>{bankDetails.bankName}</span>
              <button
                type="button"
                className="bank-edit-btn"
                onClick={(e) => { e.stopPropagation(); setShowBankModal(true); }}
                title="Edit Bank Details"
              >
                <MdEdit size={11} />
              </button>
            </div>
          </div>
        )}

        <MdAccountBalanceWallet className="wallet-card__icon" size={84} />
      </div>

      {/* ── Action Boxes (Auto 3 or 4 cols) ── */}
      <div className={`wallet-actions ${hasBankAccount ? 'wallet-actions--3' : ''}`}>
        {displayActions.map(a => (
          <button
            key={a.key}
            type="button"
            className={`wallet-action wallet-action--${a.mod}`}
            onClick={a.onClick}
            disabled={a.disabled}
          >
            <span className="wallet-action__icon-wrap">{a.icon}</span>
            <div className="wallet-action__content">
              <span className="wallet-action__label">{a.label}</span>
              <span className="wallet-action__sub">{a.sub}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Recent mini transactions */}
      {showTransactions && recent.length > 0 && (
        <div className="section-card wallet-transactions">
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
                      <td className="tx-desc">{t.description}</td>
                      <td className="tx-date">
                        {new Date(t.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className={`tx-amount tx-amount--${t.type}`}>
                        {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="tx-balance">
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

      {showTransfer && (
        <TransferModal
          currentBalance={balance}
          onClose={() => setShowTransfer(false)}
          onSuccess={() => { refetch(); setShowTransfer(false); }}
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
