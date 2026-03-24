# KaamSetu — Indian Labour Marketplace 🏗️

> **KaamSetu** = Kaam (Work) + Setu (Bridge)
> Employers ne Workers sathe joday chhe — through Agents (Kaam Setu).

---

## Roles (Paatraat)

| Role | Hindi Name | Kaay kare chhe |
|------|-----------|----------------|
| `employer` | Kaam Saheb | Job post kare, workers hire kare |
| `worker` | Kaam Saathi | Jobs shodhhe, apply kare |
| `agent` | Kaam Setu | Workers ne employers sathe match kare, commission le chhe |
| `admin` | Admin | Poori platform manage kare |

---

## Current Tech Stack

| Part | Tech |
|------|------|
| Backend | Node.js + Express + MongoDB (Mongoose) |
| Auth | JWT + bcrypt + Google OAuth |
| Validation | Joi |
| Frontend | React 19 + Vite |
| State | Redux Toolkit + redux-persist |
| API calls | RTK Query |
| Styling | SCSS + dark/light mode |
| Animations | Framer Motion |

---

## Existing Flow (Atyaari chhe)

```
1. Employer  → Job post kare (title, pay, city, area, workType)
2. Worker    → Job browse kare, apply kare
3. Employer  → Application approve / reject kare
4. Agent     → Worker ne Job sathe manually match kare (Placement create kare)
5. Agent     → Commission set kare (fixed ₹ amount)
6. Admin     → Badhu jowe chhe (users, jobs, agents, stats)
```

---

---

# ✅ FEATURE 1 — Wallet & Coin Flow `[DONE]`

> Real money flow simulate karyu chhe — drakho kaun ketalu le chhe e clearly show thay.

---

## 🎯 Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      PAYMENT FLOW                           │
│                                                             │
│  Employer Wallet ──deduct──► splits into 3 parts:          │
│                                                             │
│       ┌──────────────────────────────────────┐             │
│       │  Job Pay (e.g. ₹300)                 │             │
│       │    └─ Platform Fee 10% = ₹30         │             │
│       │    └─ Worker gets = ₹270  ──► Worker Wallet        │
│       │                                      │             │
│       │  Agent Commission (e.g. ₹100)        │             │
│       │    └─ Agent gets = ₹100  ──► Agent Wallet          │
│       │                                      │             │
│       │  Platform earns = ₹30 (tracked)      │             │
│       └──────────────────────────────────────┘             │
│                                                             │
│  Employer total deducted = ₹300 + ₹100 = ₹400             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Commission Types

| Type | Example | Formula |
|------|---------|---------|
| Fixed ₹ | "Mane ₹100 joiye" | commission = 100 |
| Percentage % | "Job pay na 20%" | commission = job.pay × 20 / 100 |

---

## 📊 Kaun Ketalu Le Chhe — Example

> Job Pay = ₹300, Agent Commission = 20% (₹60), Platform Fee = 10%

| Kaun | Ketalu | Kyathi |
|------|--------|--------|
| Employer | -₹360 deducted | ₹300 + ₹60 commission |
| Worker | +₹270 credited | ₹300 - 10% platform fee |
| Agent | +₹60 credited | Commission jo setiye set karyu |
| KaamSetu | +₹30 tracked | 10% of job pay |

---

## 💳 Wallet Top-up — QR Code Flow `[DONE]`

```
1. ✅ User "Add Money" button dabaave
2. ✅ Modal khule — QR code show thay (UPI string sathe generate thayelu)
3. ✅ User amount enter kare + quick preset buttons (₹100, ₹250, ₹500...)
4. ✅ User potano LOGIN PASSWORD enter kare (security mate)
5. ✅ Password bcrypt sathe verify thay backend par
6. ✅ Correct hoy to → walletBalance + amount
7. ✅ Transaction record bane: type=credit, category=topup
8. ✅ Framer-motion sathe coin rain animation + success toast show thay
9. ✅ Google OAuth users (no password) → set-password step show thay first
```

> **Note:** Real UPI nathi — demo/college project mate simulate karyu chhe.
> QR code ma fake UPI ID: `kaamsetu@upi`

---

## 🏗️ Backend — Completed Files `[ALL DONE]`

### Models
```
✅ userModel.js              → walletBalance: { type: Number, default: 0, min: 0 }
✅ placementModel.js         → commissionType, commissionValue, platformFee, workerPaid
✅ transactionModel.js       → NEW model
                                 userId, type(credit|debit), amount, description,
                                 category(topup|job_payment|commission|platform_fee),
                                 refId, balanceBefore, balanceAfter
```

### Config
```
✅ config.js                 → PLATFORM_FEE_PERCENT = 10
```

### Wallet Controller + Routes
```
✅ walletController/getBalance.js       → GET  /wallet/balance
✅ walletController/topup.js            → POST /wallet/topup { amount, password }
✅ walletController/getTransactions.js  → GET  /wallet/transactions?page&limit&category
✅ walletController/index.js            → exports
✅ walletRoutes.js                      → mounted at /api/v1/wallet
✅ routes/index.js                      → walletRoutes added
```

### createPlacement controller
```
✅ agentController/createPlacement.js  → Full wallet flow:
   → Employer balance check (insufficient → error)
   → commission = fixed OR percent of job.pay
   → platformFee = 10% of job.pay
   → workerPaid = job.pay - platformFee
   → employerDeducted = job.pay + commission
   → Employer wallet debit
   → Worker wallet credit
   → Agent wallet credit
   → 4 Transaction records (insertMany)
   → Placement saved with new fields
```

---

## 🖥️ Frontend — Completed Files `[ALL DONE]`

```
✅ qrcode.react              → installed in package.json
✅ services/walletApi.js     → getWalletBalance, topupWallet, getTransactions (RTK Query)
✅ store/store.js            → walletApi added + apiCacheResetMiddleware
                                (RTK cache clears on logout — multi-user bug fix)
✅ components/WalletCard/
     WalletCard.jsx          → balance display, Add Money button, recent transactions table
     WalletCard.scss         → styles
✅ components/TopupModal/
     TopupModal.jsx          → QR code, preset amounts, password verify,
                               coin rain animation, set-password step for Google users
```

---

---

# 💸 NEXT FEATURE — Wallet Withdrawal `[TODO]`

> Worker/Agent/Employer — potana wallet na paise bahar kadhva shake (UPI/Bank par).
> Same as topup but reverse — password verify + balance check.

---

## 🎯 Withdrawal Flow

```
1. User "Withdraw" button dabaave (WalletCard par)
2. WithdrawModal khule
3. User amount enter kare (max = current balance)
4. User potano LOGIN PASSWORD enter kare (security mate)
5. Backend:
     → Password bcrypt sathe verify karo
     → Balance check: walletBalance >= amount ? proceed : error
     → walletBalance − amount
     → Transaction record: type=debit, category=withdrawal
6. Frontend:
     → Success → balance update thay
     → Framer-motion exit animation + toast
```

---

## 🏗️ Backend — Shu banavaanu chhe

### 1. Transaction Model — category enum ma `withdrawal` add karo

```js
// transactionModel.js
category: {
  enum: ['topup', 'job_payment', 'commission', 'platform_fee', 'withdrawal'],  // ← ADD
}
```

### 2. Navo Controller — `walletController/withdraw.js`

```
Logic:
  → Joi validate: amount (min:1, max:100000), password (required)
  → User fetch karo (.select('password walletBalance'))
  → Google OAuth users: password nathi → error (same as topup)
  → bcrypt.compare(password, user.password)
  → walletBalance < amount → error "Insufficient balance"
  → balanceBefore = user.walletBalance
  → user.walletBalance -= amount
  → user.save()
  → Transaction.create({ type:'debit', category:'withdrawal', ... })
  → Response: { balance: balanceAfter, withdrawn: amount }
```

### 3. Route — `walletRoutes.js` ma add karo

```
| Method | Endpoint         | Body                | Auth | Description          |
|--------|-----------------|---------------------|------|----------------------|
| POST   | /wallet/withdraw | { amount, password } | ✅   | Wallet se paise kaadho |
```

---

## 🖥️ Frontend — Shu banavaanu chhe

### 1. `walletApi.js` ma navo endpoint add karo

```js
withdrawWallet: builder.mutation({
  query: (body) => ({ url: '/wallet/withdraw', method: 'POST', body }),
  invalidatesTags: [{ type: 'Wallet', id: 'BALANCE' }, { type: 'Wallet', id: 'TXN' }],
})
// export: useWithdrawWalletMutation
```

### 2. Navo Component — `WithdrawModal/WithdrawModal.jsx`

```
┌────────────────────────────────────────┐
│  💸 Withdraw from Wallet               │
│  Current Balance: ₹1,250               │
│                                        │
│  Quick: [₹100] [₹250] [₹500] [All]     │
│                                        │
│  Amount (₹): [_________]               │
│  (max: ₹1,250)                         │
│                                        │
│  🔒 Password: [_________]              │
│                                        │
│  Preview:                              │
│    Withdrawing:   -₹500                │
│    Balance left:  ₹750                 │
│                                        │
│  [💸 Withdraw ₹500]                    │
└────────────────────────────────────────┘
```
- Max amount button → current balance fill kare
- Insufficient amount → button disable + red warning
- On success → green exit animation + toast

### 3. `WalletCard.jsx` update — Withdraw button add karo

```
┌────────────────────────────────────┐
│  💰 My KaamSetu Wallet             │
│  Balance: ₹1,250                   │
│  [+ Add Money]  [💸 Withdraw]      │
└────────────────────────────────────┘
```

---

## 📁 Files — Complete List

### Backend (new files)
```
backend/src/
  controllers/
    walletController/
      withdraw.js              ← NEW
```

### Backend (modified files)
```
backend/src/
  models/
    transactionModel.js        ← ADD 'withdrawal' to category enum
  controllers/
    walletController/
      index.js                 ← ADD withdraw export
  routes/
    walletRoutes.js            ← ADD POST /withdraw route
```

### Frontend (new files)
```
frontend/src/
  components/
    WithdrawModal/
      WithdrawModal.jsx         ← NEW
```

### Frontend (modified files)
```
frontend/src/
  services/
    walletApi.js               ← ADD withdrawWallet mutation
  components/
    WalletCard/
      WalletCard.jsx           ← ADD Withdraw button + WithdrawModal
```

---

## ✅ Implementation Order

```
Step 1: transactionModel.js → 'withdrawal' enum add karo
Step 2: walletController/withdraw.js → navo file banavo
Step 3: walletController/index.js → withdraw export karo
Step 4: walletRoutes.js → POST /withdraw route add karo
Step 5: walletApi.js → withdrawWallet mutation add karo
Step 6: WithdrawModal.jsx → navo component banavo
Step 7: WalletCard.jsx → Withdraw button + modal wire karo
```

---

## 🔐 Security Notes

- Top-up + Withdrawal **dono mate** user no login password verify thay (bcrypt)
- JWT token required for all wallet endpoints
- Withdrawal: balance < amount hoy to 400 error — negative balance impossible
- Top-up: max ₹1,00,000 per transaction
- Transaction records immutable (delete/update nai thay)
- RTK Query cache logout vakhte clear thay (multi-user data leak prevent)

---

## 🚀 Run Project

```bash
# Root directory par
npm run dev

# Starts:
# Backend  → http://localhost:5000
# Frontend → http://localhost:5173
```

---

*KaamSetu — Connecting Labour, Building Futures 🌉*
