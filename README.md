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

# ✅ FEATURE 2 — Wallet Withdrawal `[DONE]`

> Worker/Agent/Employer — potana wallet na paise bahar kadhva shake (Bank par).
> Password verify + bank account linked check + balance check.

```
✅ walletController/withdraw.js     → POST /wallet/withdraw { amount, password }
✅ transactionModel.js              → 'withdrawal' category already in enum
✅ walletRoutes.js                  → POST /withdraw route added
✅ walletApi.js                     → useWithdrawWalletMutation
✅ WithdrawModal/WithdrawModal.jsx  → Quick presets, password verify, success animation
✅ WalletCard.jsx                   → Withdraw button (disabled if balance=0)
```

---

# ✅ FEATURE 3 — Wallet Send Money (Transfer) `[DONE]`

> User to User wallet transfer by email. Password verify + balance check. 2 transaction records.

```
✅ walletController/transfer.js     → POST /wallet/transfer { receiverEmail, amount, password }
✅ transactionModel.js              → 'transfer_sent' + 'transfer_received' categories in enum
✅ walletRoutes.js                  → POST /transfer route added
✅ walletApi.js                     → useTransferWalletMutation
✅ TransferModal/TransferModal.jsx  → User dropdown search, presets, password, success animation
✅ WalletCard.jsx                   → Send Money button
```

---

# 📊 NEXT FEATURE — Admin Reports Page `[TODO]`

> Admin Reports page hamare placeholder chhe (hardcoded zeros). Real data connect karvu chhe.
> Monthly placements + revenue charts + growth table.

---

## 🎯 Reports Page Flow

```
1. Admin Reports page khule
2. Summary stats (Active Jobs, Total Users, Platform Revenue, Total Placements)
3. Monthly Placements Bar Chart (last 6 months)
4. Monthly Revenue Bar Chart (last 6 months)
5. Monthly Growth Report table (month-wise data)
```

---

## 🏗️ Backend — Shu banavaanu chhe

### Navo Controller — `adminController/getReports.js`

```
GET /admin/reports
Logic:
  → Last 6 months monthly breakdown:
     - Placement.aggregate → placements count per month
     - Transaction.aggregate (category=platform_fee) → revenue per month
  → Response: { monthly: [{ month, year, placements, revenue }] }
```

---

## 🖥️ Frontend — Shu banavaanu chhe

### 1. `adminApi.js` ma navo endpoint add karo

```js
getAdminReports: builder.query({
  query: () => '/admin/reports',
  providesTags: ['Admin'],
})
// export: useGetAdminReportsQuery
```

### 2. `Reports.jsx` update — real data

```
- useGetAdminStatsQuery → summary stat cards (Active Jobs, Total Users, Revenue, Placements)
- useGetAdminReportsQuery → monthly charts + growth table
- recharts BarChart → Monthly Placements (last 6 months)
- recharts BarChart → Monthly Revenue (last 6 months)
- Growth Table → month-wise placements + revenue
```

---

## 📁 Files

### Backend (new files)
```
backend/src/controllers/adminController/getReports.js   ← NEW
```

### Backend (modified files)
```
backend/src/controllers/adminController/index.js        ← ADD getReports export
backend/src/routes/adminRoutes.js                       ← ADD GET /reports route
```

### Frontend (modified files)
```
frontend/src/services/adminApi.js                       ← ADD getAdminReports query
frontend/src/pages/Dashboard/admin/Reports.jsx          ← Connect real data + charts
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
