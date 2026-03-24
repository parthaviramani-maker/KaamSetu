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

# 💰 NEXT FEATURE — Wallet & Coin Flow Plan

> Aano goal: Real money flow simulate karavo jema drakho kaun ketalu le chhe e clearly show thay.

---

## 🎯 Flow Overview (Poori story)

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

## 💡 Commission Types (Agent choose kari shake)

Agent placement create karte vakhte 2 options hase:

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

## 💳 Wallet Top-up — QR Code Flow

```
1. User "Add Money" button dabaave
2. Modal khule — QR code show thay (user na email + amount sathe generate thayelu)
3. User amount enter kare (e.g. ₹500)
4. User potano LOGIN PASSWORD enter kare (security mate)
5. Password bcrypt sathe verify thay backend par
6. Correct hoy to → walletBalance + ₹500
7. Transaction record bane: type=topup, amount=500
8. Framer-motion sathe coin animation + success toast show thay
```

> **Note:** Real UPI nathi — demo/college project mate simulate karyu chhe.
> QR code ma fake UPI ID hase: `kaamsetu@upi`

---

## 🏗️ Backend — Shu banavaanu chhe

### 1. User Model — Navo field

```js
walletBalance: { type: Number, default: 0 }
```

### 2. Transaction Model (navo model)

```js
{
  userId:        ObjectId → User,
  type:          'credit' | 'debit',
  amount:        Number,
  description:   String,         // e.g. "Job Payment — Construction Worker"
  category:      'topup' | 'job_payment' | 'commission' | 'platform_fee',
  refId:         ObjectId?,      // Placement ID reference
  balanceBefore: Number,
  balanceAfter:  Number,
  createdAt:     Date
}
```

### 3. Placement Model — Nava fields

```js
commissionType:  'fixed' | 'percent'   // Agent choose kare
platformFee:     Number                // 10% of job.pay — recorded at time of placement
workerPaid:      Number                // Actual amount worker ne meli
```

### 4. Config — Platform Fee

```js
// config.js ma add karvu
PLATFORM_FEE_PERCENT = 10   // Admin badlavi shake future ma
```

### 5. Nava Routes — `/api/v1/wallet`

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| GET | `/balance` | — | ✅ Any | Balance + last 10 transactions |
| POST | `/topup` | `{ amount, password }` | ✅ Any | QR se money add karo |
| GET | `/transactions` | — | ✅ Any | Full transaction history |

### 6. Modify: `createPlacement` controller

```
Existing flow:
  → Placement record banavo

New flow:
  → Employer ni wallet check karo (sufficient balance?)
  → If not enough → Error return karo "Insufficient balance"
  → Calculate amounts:
       commission = commissionType==='percent'
                    ? (job.pay * commissionValue / 100)
                    : commissionValue
       platformFee = job.pay * PLATFORM_FEE_PERCENT / 100
       workerEarns = job.pay - platformFee
       employerDeducted = job.pay + commission
  → Employer wallet deduct
  → Worker wallet credit
  → Agent wallet credit
  → 4 Transaction records create karo (employer, worker, agent, platform)
  → Placement record banavo (nava fields sathe)
```

---

## 🖥️ Frontend — Shu banavaanu chhe

### 1. Install — `qrcode.react` package

```bash
cd frontend
npm install qrcode.react
```

### 2. Nava Components

#### `WalletCard` (shared — badha dashboards par show thase)
```
┌────────────────────────────────┐
│  💰 My Wallet                  │
│  Balance: ₹1,250               │
│  [+ Add Money]                 │
└────────────────────────────────┘
```

#### `TopupModal` (QR code modal)
```
┌────────────────────────────────────┐
│  Add Money to Wallet               │
│                                    │
│  [QR Code Image]                   │
│  Scan with any UPI app             │
│  UPI ID: kaamsetu@upi              │
│                                    │
│  Amount: [_________]  ₹            │
│  Password: [_________] 🔒          │
│                                    │
│  [Add Money ₹___]                  │
└────────────────────────────────────┘
```
On success → coin rain animation (Framer Motion) + toast

### 3. Navi Service File — `walletApi.js`

```
getWalletBalance   → GET /wallet/balance
topupWallet        → POST /wallet/topup  { amount, password }
getTransactions    → GET /wallet/transactions
```

### 4. Update — Employer Payments Page
- WalletCard show karo (real balance)
- Transaction history → real DB data
- Show "Low Balance" warning jyare balance < next job pay

### 5. Update — Worker Earnings Page
- WalletCard show karo (real earned balance)
- Transaction history → real DB data
- Monthly earnings chart (Recharts — already installed)

### 6. Update — Agent Commission Page
- WalletCard show karo
- Commission history → already real, sirf wallet link karvu chhe

### 7. Update — Agent Placements Form
- Commission Type select karo: Fixed ₹ ya Percentage %
- Live preview show thay:
  ```
  Job Pay: ₹300
  Your Commission: ₹60 (20%)
  Worker will get: ₹270
  Employer pays: ₹360
  Platform fee: ₹30
  ```
- Employer balance check — insufficient hoy to warning show thay

### 8. Update — Admin Dashboard
- Platform Earnings card (sum of all platformFee transactions)

---

## 📁 Nava Files — Complete List

### Backend (new files)
```
backend/src/
  models/
    transactionModel.js          ← NEW
  controllers/
    walletController/
      getBalance.js              ← NEW
      topup.js                   ← NEW
      getTransactions.js         ← NEW
      index.js                   ← NEW
  routes/
    walletRoutes.js              ← NEW
```

### Backend (modified files)
```
backend/src/
  models/
    userModel.js                 ← ADD walletBalance field
    placementModel.js            ← ADD commissionType, platformFee, workerPaid
  config/
    config.js                    ← ADD PLATFORM_FEE_PERCENT
  controllers/
    agentController/
      createPlacement.js         ← MODIFY (wallet deduction logic)
  routes/
    index.js                     ← ADD walletRoutes
```

### Frontend (new files)
```
frontend/src/
  components/
    WalletCard/
      WalletCard.jsx             ← NEW
      WalletCard.scss            ← NEW
    TopupModal/
      TopupModal.jsx             ← NEW
  services/
    walletApi.js                 ← NEW
```

### Frontend (modified files)
```
frontend/src/
  store/
    store.js                     ← ADD walletApi
  pages/Dashboard/
    employer/Payments.jsx        ← MODIFY (real data)
    worker/Earnings.jsx          ← MODIFY (real data)
    agent/Commission.jsx         ← MODIFY (wallet card add)
    agent/Placements.jsx         ← MODIFY (commission type + live preview)
    admin/AdminOverview.jsx      ← MODIFY (platform earnings card)
  pages/Dashboard/
    DashboardLayout.jsx          ← MODIFY (wallet balance in header/sidebar)
```

---

## ✅ Implementation Order (Step by Step)

```
Step 1: Backend Models update
        → userModel.js (walletBalance)
        → placementModel.js (commissionType, platformFee, workerPaid)
        → transactionModel.js (navo)
        → config.js (PLATFORM_FEE_PERCENT)

Step 2: Backend Wallet Routes
        → walletController/ (getBalance, topup, getTransactions)
        → walletRoutes.js
        → routes/index.js ma mount karo

Step 3: Backend createPlacement modify
        → Commission calculation (fixed/percent)
        → Employer balance check
        → Wallet debit/credit logic
        → Transaction records

Step 4: Frontend walletApi.js service

Step 5: Frontend WalletCard component

Step 6: Frontend TopupModal (QR + password + animation)

Step 7: Update Employer Payments page

Step 8: Update Worker Earnings page

Step 9: Update Agent Placements form (commission type + preview)

Step 10: Update Admin stats (platform earnings)
```

---

## 🔐 Security Notes

- Wallet top-up mate user potano **login password** verify thay (bcrypt compare)
- JWT token required for all wallet endpoints
- Negative balance prevent karo — employer pass insufficient funds hoy to placement fail
- Transaction records immutable (delete nai thay)

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
