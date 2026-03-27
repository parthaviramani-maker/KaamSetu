# MYASHBABARIYA MASTER RULES & STRUCTURE GUIDE
> Follow this file before starting ANY project. README first → Design → Code → Deploy.

---

## RULE #0 — THE GOLDEN FLOW (ALWAYS)

```
1. README.md banavo (complete project plan)
2. Design tokens decide karo (colors, fonts, spacing)
3. Folder structure banavo
4. Backend schema + routes plan karo
5. Frontend pages + components plan karo
6. Code start karo
7. Deploy karo
```

**NEVER** start coding without completing Step 1 & 2.

---

## RULE #1 — DESIGN CONSISTENCY (MOST IMPORTANT)

### 1.1 Button Rule — PICK ONE, STICK TO IT
- If rounded buttons → **ALL** buttons rounded (`border-radius: 8px` or `border-radius: 50px`)
- If sharp buttons → **ALL** buttons sharp (`border-radius: 0`)
- **NEVER** mix rounded and sharp in same project

### 1.2 Font Rule
- Pick **ONE** font family for the whole project
- Recommended: `Inter`, `Plus Jakarta Sans`, or `Nunito`
- **ONE** font for headings, **ONE** for body (max 2 fonts total)
- Never use more than 2 font families

```scss
// _typography.scss
$font-primary: 'Inter', sans-serif;
$font-heading: 'Plus Jakarta Sans', sans-serif;
```

### 1.3 Color Rule — MAX 5 COLORS
```scss
// _variables.scss
$color-primary:    #YOUR_BRAND_COLOR;   // Main brand color
$color-secondary:  #YOUR_ACCENT_COLOR;  // Accent/secondary
$color-success:    #22C55E;             // Green — always same
$color-danger:     #EF4444;             // Red — always same
$color-warning:    #F59E0B;             // Yellow — always same

$color-bg:         #F9FAFB;             // Page background
$color-surface:    #FFFFFF;             // Card/panel background
$color-border:     #E5E7EB;             // All borders
$color-text:       #111827;             // Primary text
$color-text-muted: #6B7280;             // Secondary/muted text
```

**NEVER** use raw color values in components. Always use variables.

### 1.4 Spacing Rule — USE SCALE
```scss
$space-1:  4px;
$space-2:  8px;
$space-3:  12px;
$space-4:  16px;
$space-5:  24px;
$space-6:  32px;
$space-7:  48px;
$space-8:  64px;
```

### 1.5 Shadow Rule
```scss
$shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
$shadow-md: 0 4px 12px rgba(0,0,0,0.10);
$shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
```

Pick one shadow level per component type. Cards always use same shadow.

### 1.6 Border Radius Rule
```scss
$radius-sm:   4px;   // Tags, badges
$radius-md:   8px;   // Inputs, cards
$radius-lg:   12px;  // Modals, panels
$radius-full: 50px;  // Pills, rounded buttons
```

---

## RULE #2 — SCSS ARCHITECTURE (7-1 PATTERN)

```
styles/
├── abstracts/
│   ├── _variables.scss     ← Colors, fonts, spacing, radius
│   ├── _mixins.scss        ← Reusable mixins
│   └── _functions.scss     ← SCSS functions
├── base/
│   ├── _reset.scss         ← CSS reset
│   └── _typography.scss    ← Font imports, heading sizes
├── components/
│   ├── _button.scss
│   ├── _card.scss
│   ├── _input.scss
│   ├── _modal.scss
│   ├── _badge.scss
│   └── _toast.scss
├── layout/
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _sidebar.scss
│   └── _grid.scss
├── pages/
│   ├── _landing.scss
│   ├── _auth.scss
│   └── _dashboard.scss
├── themes/
│   └── _dark.scss          ← Dark mode (if needed)
└── main.scss               ← Import everything here
```

### main.scss structure:
```scss
// Abstracts
@import 'abstracts/variables';
@import 'abstracts/mixins';
@import 'abstracts/functions';

// Base
@import 'base/reset';
@import 'base/typography';

// Components
@import 'components/button';
@import 'components/card';
// ... etc

// Layout
@import 'layout/header';
// ... etc

// Pages
@import 'pages/landing';
// ... etc
```

### SCSS Rules:
- **NEVER** write styles inline in components (no `style={{}}`)
- **NEVER** use `!important` unless absolutely necessary
- Always use BEM naming: `.card__header`, `.card__body`, `.btn--primary`
- Max nesting: **3 levels deep**

---

## RULE #3 — REDUX STRUCTURE

```
store/
├── store.js          ← configureStore + persist + cache-reset middleware
├── hooks.js          ← useAppDispatch, useAppSelector (ALWAYS import from here)
├── baseQuery.js      ← fetchBaseQuery wrapper with auto-logout on 401
├── authSlice.js      ← user, token, role, isLogin
├── themeSlice.js     ← isDark toggle
services/             ← RTK Query APIs (one file per feature, NOT in store/)
├── jobApi.js
├── userApi.js
├── applicationApi.js
├── agentApi.js
├── adminApi.js
└── walletApi.js
```

### RTK Query Service Template:
```js
// services/jobApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithLogout from '../store/baseQuery';

export const jobApi = createApi({
  reducerPath: 'jobApi',
  baseQuery: baseQueryWithLogout,
  tagTypes: ['Job'],
  endpoints: (builder) => ({
    getAllJobs: builder.query({
      query: (params = {}) => ({ url: '/jobs', params }),
      providesTags: [{ type: 'Job', id: 'ALL' }],
    }),
    createJob: builder.mutation({
      query: (body) => ({ url: '/jobs', method: 'POST', body }),
      invalidatesTags: [{ type: 'Job', id: 'ALL' }],
    }),
  }),
});

export const { useGetAllJobsQuery, useCreateJobMutation } = jobApi;
```

### Redux Rules:
- **ALWAYS** import `useAppDispatch`/`useAppSelector` from `store/hooks.js` — NOT from `react-redux`
- **NEVER** call API directly in component — always through RTK Query hooks
- **ALWAYS** add RTK Query reducer + middleware in `store.js`
- **ALWAYS** reset API cache on logout (use `apiCacheResetMiddleware` pattern)
- **NEVER** store derived data in Redux — compute it with selectors

---

## RULE #4 — FRONTEND STRUCTURE (React + Vite)

```
frontend/
├── public/
├── src/
│   ├── assets/                 ← Images, vectors, illustrations
│   ├── components/
│   │   ├── [ComponentName]/    ← Each component in its own folder
│   │   │   ├── ComponentName.jsx
│   │   │   └── ComponentName.scss  ← (only if has own styles)
│   ├── config/
│   │   └── api.js              ← API_BASE_URL, ENDPOINTS
│   ├── hooks/                  ← Custom hooks (useOnline, etc.)
│   ├── pages/
│   │   ├── Auth/               ← Login, Register, Forgot, Reset, Onboarding
│   │   ├── Dashboard/
│   │   │   ├── admin/
│   │   │   ├── employer/
│   │   │   ├── worker/
│   │   │   ├── agent/
│   │   │   ├── profile/
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── Dashboard.scss
│   │   ├── LandingPage/
│   │   └── NotFound.jsx
│   ├── routes/
│   │   ├── guards.jsx          ← PrivateRoute, PublicRoute, RoleRoute, DashboardRedirect
│   │   └── index.jsx           ← Router config only (imports guards from guards.jsx)
│   ├── services/               ← RTK Query API slices (one per feature)
│   │   ├── jobApi.js
│   │   ├── userApi.js
│   │   └── ...
│   ├── store/
│   │   ├── store.js            ← configureStore + persist
│   │   ├── hooks.js            ← useAppDispatch, useAppSelector (ALWAYS use this)
│   │   ├── baseQuery.js        ← fetchBaseQuery + auto-logout on 401
│   │   ├── authSlice.js
│   │   └── themeSlice.js
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _buttons.scss
│   │   └── main.scss           ← Global entry point
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── vite.config.js
└── package.json
```

---

## RULE #5 — BACKEND STRUCTURE (Node + Express)

```
backend/
├── src/
│   ├── config/
│   │   ├── config.js           ← All env vars exported from one place
│   │   └── db.js               ← MongoDB connection
│   ├── controllers/            ← One folder per feature, each action = own file
│   │   ├── authController/
│   │   │   ├── login.js        ← exports { validator, handler }
│   │   │   ├── register.js     ← exports { validator, handler }
│   │   │   └── index.js        ← re-exports all
│   │   └── [feature]Controller/
│   ├── middlewares/
│   │   ├── authMiddleware.js   ← JWT verify → req.user
│   │   ├── roleMiddleware.js   ← requireRole('admin', 'employer')
│   │   └── errorMiddleware.js  ← Global error handler (register LAST)
│   ├── models/                 ← Mongoose schemas
│   ├── routes/
│   │   ├── index.js            ← Aggregates all routes
│   │   └── [feature]Routes.js
│   ├── utils/
│   │   ├── responseHandler.js  ← success/error/created/notFound/etc.
│   │   ├── validator.js        ← Joi-based validate(req.body/params/query)
│   │   ├── mailer.js           ← Nodemailer send helpers
│   │   └── seedAdmin.js        ← Auto-create admin on startup
│   └── server.js               ← Express app entry
├── .env
├── .env.example
└── package.json
```

### Controller Pattern (ALWAYS validator + handler):
```js
// controllers/jobController/createJob.js
import Joi from 'joi';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
  validator: validator({
    body: Joi.object({
      title: Joi.string().min(3).required(),
      salary: Joi.number().positive().required(),
    }),
  }),
  handler: async (req, res) => {
    try {
      const job = await Job.create(req.body);
      return responseHandler.created(res, 'Job posted', job);
    } catch (error) {
      return responseHandler.internalServerError(res, error);
    }
  },
};
```

### Route Pattern (ALWAYS):
```js
// routes/jobRoutes.js
router.post('/', authenticate, requireRole('employer'), createJob.validator, createJob.handler);
```

---

## RULE #6 — ENVIRONMENT VARIABLES

### Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=KaamSetu
```

### Backend `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### Rules:
- **ALWAYS** create `.env.example` with dummy values
- **NEVER** commit `.env` or `.env.local` to git
- Add both to `.gitignore` immediately
- `NEXT_PUBLIC_` prefix only for values needed in browser

---

## RULE #7 — DEPLOYMENT

> TODO: Deployment platform not decided yet. Will be finalized later.
>
> Frontend build command: `npm run build` → `dist/` folder
> Backend start command: `npm start` → `node src/server.js`
>
> **Required env vars must be set on the platform before deploy.**
> Never deploy without `.env` configured on the server.

---

## RULE #8 — COMPONENT RULES

### Button Component — ALWAYS this structure:
```tsx
// Variants: primary | secondary | outline | ghost | danger
// Sizes: sm | md | lg
// States: loading, disabled

<Button variant="primary" size="md" loading={isLoading}>
  Submit
</Button>
```

### Input Component — ALWAYS this structure:
```tsx
// Always has: label, placeholder, error message, helper text
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
  {...register('email')}
/>
```

### Card Component:
```tsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

---

## RULE #9 — RECOMMENDED LIBRARIES

| Purpose | Library |
|---|---|
| Forms | `react-hook-form` + `zod` |
| State | `@reduxjs/toolkit` + `react-redux` |
| API calls | RTK Query (`createApi`) — no axios needed |
| Icons | `react-icons` (KaamSetu uses this) — pick ONE sub-set, don't mix |
| Animation | `framer-motion` |
| Charts | `recharts` |
| Auth | `jsonwebtoken` (backend) |
| Validation | `joi` (backend) |
| DB | `mongoose` |
| Email | `nodemailer` |
| Build | `vite` |

**NEVER** mix icon sub-libraries in same project (e.g. don't use both `fi` and `md` from react-icons — pick one family).

---

## RULE #10 — NAMING CONVENTIONS

```
Components:     PascalCase        → UserCard.tsx, LoginForm.tsx
Hooks:          camelCase + use   → useAuth.ts, useDebounce.ts
Utilities:      camelCase         → formatDate.ts, apiHelpers.ts
SCSS files:     _kebab-case       → _user-card.scss
Constants:      UPPER_SNAKE_CASE  → MAX_FILE_SIZE, API_TIMEOUT
Types/Interfaces: PascalCase + I  → IUser, IJob, AuthResponse
```

---

## RULE #11 — GIT RULES

```
Branch naming:
  feature/feature-name
  fix/bug-name
  hotfix/critical-fix

Commit message format:
  feat: add login functionality
  fix: resolve token expiry bug
  style: update button hover states
  refactor: clean up auth controller
  docs: update README
```

### `.gitignore` — ALWAYS include:
```
node_modules/
.env
.env.local
.next/
dist/
build/
*.log
```

---

## RULE #12 — README TEMPLATE (Start every project with this)

```markdown
# Project Name

## Overview
[What does this project do in 2-3 lines]

## Roles
- Role 1: [what they can do]
- Role 2: [what they can do]

## Tech Stack
- Frontend: React + Vite, Redux Toolkit + RTK Query, SCSS
- Backend: Node.js, Express, MongoDB + Mongoose
- Auth: JWT + Google OAuth
- Deploy: TBD

## Project Structure
[Copy from Rule #4 and #5]

## Local Setup
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

## Environment Variables
[Copy from .env.example]

## Features Checklist
- [ ] Landing Page
- [ ] Authentication
- [ ] Role 1 Dashboard
- [ ] Role 2 Dashboard
- [ ] [Feature]

## API Endpoints
[List all routes]
```

---

## RULE #13 — PROJECT KICKOFF: CONCEPT FIRST (ANY PROJECT)

> NEVER start coding without answering these. Works for ANY project type.
> E-commerce, SaaS, Dashboard, Social App, Portfolio — same questions apply.

### Answer these 10 questions BEFORE opening VS Code:

**1. PROJECT TYPE**
What kind of app is this?
- Dashboard / Marketplace / E-commerce / Social / SaaS / Portfolio / Other

**2. ROLES**
Who uses this app? List ALL roles and what each can do.
```
Role 1 (e.g. Admin)    → can do: ...
Role 2 (e.g. Customer) → can do: ...
```

**3. CORE FEATURES (top 5)**
What are the 5 most important things the app must do?
```
1. ...
2. ...
3. ...
4. ...
5. ...
```

**4. AUTH TYPE**
- [ ] Email + Password
- [ ] Google OAuth
- [ ] Phone OTP
- [ ] Multiple (which ones?)

**5. PAYMENTS**
- [ ] No payments
- [ ] Yes — Razorpay / Stripe / Manual
- Payment flow: who pays whom? (customer → vendor? user → platform?)

**6. FILE UPLOADS**
- [ ] No uploads
- [ ] Yes — Profile pic / Product images / Documents
- Where stored? Cloudinary / AWS S3 / Local

**7. REAL-TIME**
- [ ] No real-time
- [ ] Yes — Chat / Live notifications / Live updates
- If yes: Socket.io needed

**8. DATA MODELS (top 5)**
What are the 5 main things stored in DB?
```
1. User     — fields: name, email, role...
2. Product  — fields: title, price, stock...
3. Order    — fields: items, status, total...
4. ...
5. ...
```

**9. MAIN PAGES**
List every page needed (frontend):
```
Public:    Landing, About, Contact
Auth:      Login, Register, Forgot Password
Dashboard: Overview, [Feature1], [Feature2]
```

**10. API ENDPOINTS (main ones)**
```
POST /auth/register
POST /auth/login
GET  /products
POST /orders
...
```

---

## RULE #14 — HOW TO WORK WITH AI (STEP BY STEP)

> Aa flow follow karo — ALWAYS. Kabhi direct "baki badhu tu kari de" nahi kehvu.

### The Correct Flow:

```
STEP 1 — Rules file AI ne aapvo
         "aa mara rules chhe, read kar"

STEP 2 — AI Rule #13 na 10 questions puchhe
         Tame jawab aapvo

STEP 3 — AI README banave
         Tame read karo, confirm karo ya fix karo

STEP 4 — AI design tokens suggest kare
         (brand color, font, border-radius)
         Tame approve karo

STEP 5 — AI folder structure banave
         Tame confirm karo

STEP 6 — Feature by feature kaam shuru
         Ek feature → approve → agalu feature

STEP 7 — Har feature ma:
         Backend (model → route → controller) → puchhvu
         Frontend (service → page → component) → puchhvu
```

### AI Rules (AI must follow):
- NEVER assume — always ask if unclear
- NEVER do multiple features at once without asking
- ALWAYS show what changed after each step
- ALWAYS check if concept matches MYASHBABARIYA_RULES.md
- If something in code breaks rules → point it out + suggest fix
- If user forgets something → remind them (missing validator, inline style, etc.)

### What TO ask AI:
```
Good: "landing page banav, brand color #00ABB3 chhe, font Inter"
Good: "login backend banav, email+password, JWT, 2FA nathi joitu"
Good: "aa component ma shu problem chhe?"
Good: "rules file vanchav ne project start karaav"
```

### What NOT to ask AI:
```
Bad: "badhu banavi de"              ← too vague
Bad: "frontend complete kari de"    ← no concept given
Bad: "rules follow kare chhe ke?"   ← share rules file first
```

---

## DESIGN TERMS GLOSSARY (For Reference)

| Term | Meaning |
|---|---|
| Hero Banner | Landing page no first/top section |
| CTA | Call To Action — "Sign Up", "Get Started" button |
| Header | Top nav bar |
| Footer | Bottom section of website |
| Sidebar | Left/right panel in dashboard |
| Breadcrumb | Navigation path — Home > Dashboard > Profile |
| Tooltip | Hover par aavtu small info box |
| Modal | Popup window |
| Toast | Corner ma aavtu notification |
| Skeleton | Loading placeholder (grey shimmer) |
| Accordion | Click karva par expand thatu section |
| Drawer | Side thi slide thatu panel |
| Badge | Small label/tag — "New", "3 notifications" |
| Avatar | User profile image/icon |
| Pagination | Page 1, 2, 3... navigation |

---

## RULE #15 — ZERO EMOJI RULE (JSX / CODE MA ABSOLUTE BAN)

> Aa rule add thayo: KaamSetu dashboard ma emojis buttons, headings, divs ma nakhi deva thi design break thay chhe.

### JSX ma NEVER:
```jsx
// BAD — NEVER do this:
<button>🚀 Post Job</button>
<button>🔒 Top Up Wallet to Post</button>
<button>💸 Withdraw ₹500</button>
<div>🔍</div>   ← emoji as loader/empty state
<span>⚠ Error</span>  ← emoji for error
```

### ALWAYS — Icons use karo, emojis nahi:
```jsx
// GOOD:
import { MdRocketLaunch, MdLock, MdOutlineArrowCircleDown, MdSearch, MdWarning } from 'react-icons/md';

<button><MdRocketLaunch size={16} /> Post Job</button>
<button><MdLock size={16} /> Top Up to Post</button>
<button><MdOutlineArrowCircleDown size={16} /> Withdraw</button>
```

### Exceptions (ONLY these places):
- `README.md` files → emojis allowed
- `toast.success('...')` message text → emojis allowed
- Nowhere else

---

## RULE #16 — ZERO HARDCODED COLORS (ABSOLUTE)

> Aa rule add thayo: Project ma #2980b9, #27ae60, #e74c3c, rgba(41,128,185,0.12) jeva raw colors
> theme variables ni jagye use thay chhe — dark/light mode break thay chhe.

### NEVER — Hardcoded hex / rgba:
```jsx
// BAD — NEVER:
color: '#27ae60'
color: '#e74c3c'
color: '#2980b9'
background: 'rgba(39,174,96,0.1)'
background: 'rgba(231,76,60,0.08)'
borderColor: 'rgba(41,128,185,0.3)'
```

### ALWAYS — CSS variables only:
```jsx
// GOOD (in JS inline if absolutely needed):
color: 'var(--color-success)'
color: 'var(--color-danger)'
color: 'var(--color-accent)'
background: 'var(--color-success-bg)'
```

### Approved CSS variable names for KaamSetu:
```scss
// _variables.scss ma define karo — badhe same naam vaapo
--color-accent:      #00ABB3;  // Brand teal
--color-success:     #27AE60;  // Green (paid, hired, done)
--color-success-bg:  rgba(39,174,96,0.1);
--color-danger:      #E74C3C;  // Red (error, rejected, debit)
--color-danger-bg:   rgba(231,76,60,0.08);
--color-warning:     #F59E0B;  // Yellow (pending, low balance)
--color-warning-bg:  rgba(245,158,11,0.1);
--color-info:        #2980B9;  // Blue (info, transfer)
--color-info-bg:     rgba(41,128,185,0.1);
```

**Rule: Jyare navo color joie tya — CSS variable declare karo pehla, pachhi use karo.**

---

## RULE #17 — ZERO INLINE STYLES (RULE #2 ENFORCEMENT)

> Rule #2 ma likhelu chhe pan follow nathi thatu. Aa harder enforcement chhe.

### NEVER — style={{}} in JSX:
```jsx
// BAD — real code ma joyu:
<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
<p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
<button style={{ background: 'rgba(41,128,185,0.12)', color: '#2980b9', border: '...' }}>
```

### ALWAYS — SCSS class use karo:
```jsx
// GOOD:
<div className="filter-bar">
<p className="result-count">
<button className="btn btn-transfer">
```

```scss
// Dashboard.scss ya component-specific .scss ma:
.filter-bar { display: flex; gap: $space-3; flex-wrap: wrap; align-items: center; }
.result-count { font-size: 0.82rem; color: var(--text-secondary); margin-bottom: $space-4; }
.btn--transfer { background: var(--color-info-bg); color: var(--color-info); }
```

### Only acceptable inline style:
```jsx
// Dynamic values ONLY (values that change at runtime):
<div style={{ width: `${progress}%` }}>
<img style={{ height: dynamicHeight }}>
// Static values → NEVER inline
```

---

## RULE #18 — ICON SYSTEM (CONSISTENT SIZES + LIBRARY)

> Aa rule add thayo: Code ma 12, 13, 14, 15, 16, 17, 18, 22, 26 jevi random icon sizes joyi.

### Library Rule:
- **ONLY** `react-icons/md` (Material Design) — NEVER fi, bs, hi, ai mix karo
- Exception: `react-icons/si` for brand logos only (GitHub, Google etc.)

### Size Scale (ONLY these values):
```
ICON_SM  = 14   ← Inline text ma, badge ma, small labels
ICON_MD  = 18   ← Buttons, nav items, form labels
ICON_LG  = 24   ← Section headers, modal headers
ICON_XL  = 48   ← Empty states, success screens, hero
```

```jsx
// BAD:
<MdSearch size={17} />
<MdWarning size={15} />
<MdCheckCircle size={13} />

// GOOD:
<MdSearch size={18} />
<MdWarning size={14} />
<MdCheckCircle size={14} />
```

### Constants define karo (project-wide):
```js
// config/icons.js
export const ICON_SM = 14;
export const ICON_MD = 18;
export const ICON_LG = 24;
export const ICON_XL = 48;
```

---

## RULE #19 — COMPONENT STATE HANDLING (3 STATES ALWAYS)

> Har component ma 3 states handle karvi MANDATORY.

### ALWAYS 3 states:
```jsx
// EVERY page/component that fetches data:
const { data, isLoading, isError } = useSomeQuery();

if (isLoading) return <PageLoader />;           // ← ALWAYS
if (isError)   return <ErrorState />;           // ← ALWAYS
if (!data?.length) return <EmptyState />;       // ← ALWAYS

// Then render actual content
```

### Loading State:
```jsx
// BAD:
{isLoading && <p>Loading...</p>}
{isLoading && <div>🔄 Loading jobs…</div>}

// GOOD:
if (isLoading) return <PageLoader />;
// ya agar partial loading:
{isLoading && <div className="loading-rows"><div className="skeleton-row" /><div className="skeleton-row" /></div>}
```

### Empty State:
```jsx
// BAD:
{data.length === 0 && <p>No data yet.</p>}
{data.length === 0 && <div>🔎 No jobs found</div>}

// GOOD:
{data.length === 0 && (
  <div className="empty-state">
    <MdWork size={48} className="empty-state__icon" />
    <h3 className="empty-state__title">No jobs found</h3>
    <p className="empty-state__text">Try different keywords or remove filters</p>
  </div>
)}
```

---

## RULE #20 — BUTTON TEXT RULES

> Aa rule add thayo: Buttons ma emoji nakhava thi cross-platform rendering issues thay chhe.
> Plus inconsistent UX laage chhe.

### Button Text Format:
```
[Icon Component] [Action Word]
```

### BAD vs GOOD:
```jsx
// BAD:
'🚀 Post Job'
'🔒 Top Up Wallet to Post'
'💸 Withdraw ₹500'
'✅ Applied'
'🎉 Transfer'

// GOOD:
<><MdWork size={18} /> Post Job</>
<><MdAccountBalanceWallet size={18} /> Top Up to Post</>
<><MdOutlineArrowCircleDown size={18} /> Withdraw</>
<><MdCheckCircle size={18} /> Applied</>
<><MdSend size={18} /> Send Money</>
```

### Loading state text:
```jsx
// BAD:
'Posting... 🔄'
'Please wait...'

// GOOD:
'Posting…'      ← em-dash ellipsis
'Verifying…'
'Loading…'
```

---

## RULE #21 — SPACING SCALE (NO RANDOM VALUES)

> Aa rule add thayo: Code ma 0.35rem, 0.4rem, 0.55rem, 0.65rem jeva random spacing values joyu.

### Allowed spacing values ONLY:
```
0.25rem  = 4px    ← $space-1
0.5rem   = 8px    ← $space-2
0.75rem  = 12px   ← $space-3
1rem     = 16px   ← $space-4
1.5rem   = 24px   ← $space-5
2rem     = 32px   ← $space-6
3rem     = 48px   ← $space-7
4rem     = 64px   ← $space-8
```

### BAD vs GOOD:
```jsx
// BAD:
gap: '0.35rem'
padding: '0.55rem 1.25rem'
marginTop: '0.3rem'

// GOOD:
gap: '0.25rem'     // or 0.5rem
padding: '0.5rem 1rem'
marginTop: '0.25rem'  // or 0.5rem
```

**Jyare doubt hoy → nayarnu scale value choose karo, beech nahi.**

---

## RULE #22 — DASHBOARD UI CONSISTENCY CHECKLIST

> Har dashboard page/component submit karva pehla aa checklist run karo.

```
DASHBOARD COMPONENT CHECKLIST:

[ ] 1. Koi style={{}} inline style nathi?
[ ] 2. Koi raw hex color (#xxx) ya rgba() nathi?
[ ] 3. Koi emoji JSX ma nathi? (buttons, divs, spans, headings)
[ ] 4. Icons ONLY react-icons/md? Sizes only 14/18/24/48?
[ ] 5. Loading state handle kareli? (PageLoader ya skeleton)
[ ] 6. Error state handle kareli? (error class sathe)
[ ] 7. Empty state handle kareli? (empty-state class sathe, MdIcon + text)
[ ] 8. Buttons CSS classes use kare chhe? (btn btn-primary, btn-ghost etc.)
[ ] 9. Form fields form-group class use kare chhe?
[ ] 10. Error messages field-error class use kare chhe?
[ ] 11. Spacing values scale ma chhe? (0.25/0.5/0.75/1/1.5/2rem)
[ ] 12. Responsive? (flex-wrap, min-width, max-width use karelu?)
[ ] 13. Dark mode? (CSS variables use karela, hardcoded nathi?)
[ ] 14. Table responsive? (dash-table-wrap class chhe?)
```

**Aa checklist ma koi item fail thay → fix karo pehla, submit nahi karo.**

---

## RULE #23 — AI SELF-REVIEW (BEFORE EVERY CODE SUBMISSION)

> AI mate mandatory. Har code block submit karva pehla.

```
AI MUST CHECK BEFORE SUBMITTING CODE:

1. Inline style joyu? → SCSS class ma kado
2. Hardcoded color joyu? → CSS variable use karo
3. Emoji in JSX joyu? → react-icons/md sathe replace karo
4. Icon size 14/18/24/48 sivay? → Closest scale value par fix karo
5. Spacing random value? → Nearest allowed value par fix karo
6. Loading/Error/Empty missing? → 3 states add karo
7. Button text emoji? → Icon component + text format use karo
8. Mixed icon libraries? → Only react-icons/md rakho
```

**AI: Jyare pan rules file vanchine kaam start karo, aa checklist yaad rakho.**
**User ne koi inline style, emoji, hardcoded color na code ma dikhay to POINT OUT karo before accepting.**

---

> Last Updated: 2026-03-27 (Rules #15-#23 added — enforcement rules from KaamSetu mistakes)
> Author: Ashbabariya
> Stack: React 19 + Vite | Redux Toolkit + RTK Query | SCSS | Node.js + Express | MongoDB + Mongoose | Joi | JWT
> Rule: Read this before EVERY new project or feature.
> New Rules Summary:
>   #15 — Zero Emoji in JSX
>   #16 — Zero Hardcoded Colors
>   #17 — Zero Inline Styles (Rule #2 enforcement)
>   #18 — Icon System (only md, sizes 14/18/24/48)
>   #19 — 3 State Handling (loading/error/empty always)
>   #20 — Button Text Rules (icon + text, no emoji)
>   #21 — Spacing Scale (no random values)
>   #22 — Dashboard UI Checklist (14-point)
>   #23 — AI Self-Review Checklist (8-point, mandatory before submit)
