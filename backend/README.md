# KaamSetu — Backend API

> Indian Labour Marketplace — REST API (Node.js + Express + MongoDB)

---

## Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Runtime     | Node.js (ES Modules)          |
| Framework   | Express.js                    |
| Database    | MongoDB + Mongoose            |
| Auth        | JWT (jsonwebtoken) + bcrypt   |
| Validation  | Joi                           |
| Dev Tool    | Nodemon                       |

---

## Roles

| Role       | Hindi Name   | Can Do                                              |
|------------|--------------|-----------------------------------------------------|
| `employer` | Kaam Saheb   | Post jobs, view applicants, approve/reject          |
| `worker`   | Kaam Saathi  | Find jobs, apply, track applications & earnings     |
| `agent`    | Kaam Setu    | Manage workers, track placements & commission       |
| `admin`    | Admin        | View all users, jobs, agents, platform stats        |

---

## Auth Flow

```
1. User signs up   → POST /api/v1/auth/register  (name, email, password, phone, role)
2. Server hashes password (bcrypt), saves User in MongoDB
3. Server returns JWT token + user object + role
4. User logs in    → POST /api/v1/auth/login     (email, password)
5. Server verifies password → returns JWT token + user + role
6. Frontend stores token in Redux (redux-persist → localStorage)
7. Every protected request sends:  Authorization: Bearer <token>
8. authMiddleware verifies JWT → sets req.user = { id, role, email }
9. roleMiddleware checks req.user.role against allowed roles
```

---

## Folder Structure

```
backend/
  src/
    config/
      config.js          → env vars (PORT, MONGO_URI, JWT_SECRET...)
      db.js              → MongoDB connect via Mongoose
    models/
      userModel.js       → User (name, email, password, phone, role, isActive)
      jobModel.js        → Job (title, company, city, area, workType, pay, status, postedBy)
      applicationModel.js→ Application (jobId, workerId, status)
      placementModel.js  → Placement (workerId, employerId, jobId, agentId, commission)
    middlewares/
      authMiddleware.js  → JWT verify → sets req.user
      roleMiddleware.js  → requireRole(...roles) → checks req.user.role
    validators/
      authValidator.js   → Joi schemas: register, login
      jobValidator.js    → Joi schemas: createJob
      applicationValidator.js → Joi schemas: apply, updateStatus
    controllers/
      authController.js        → register, login
      userController.js        → getMe, updateMe
      jobController.js         → createJob, getAllJobs, getMyJobs, closeJob
      applicationController.js → apply, getMyApplications, getJobApplicants, updateStatus
      agentController.js       → getWorkers, getPlacements, getCommission
      adminController.js       → getStats, getAllUsers, getAllJobs, getAllAgents
    routes/
      index.js           → mounts all route groups
      authRoutes.js
      userRoutes.js
      jobRoutes.js
      applicationRoutes.js
      agentRoutes.js
      adminRoutes.js
    utils/
      responseHandler.js → standard success/error/notFound/forbidden... responses
      validator.js       → Joi middleware wrapper
  server.js              → app setup, cors, startServer()
  .env                   → local env vars (not committed)
  .env.example           → template for env vars
  .gitignore
  package.json
```

---

## Setup & Run

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Create `.env` file
```bash
cp .env.example .env
```
Fill in your values (MongoDB URI, JWT secret, etc.)

### 3. Start MongoDB
Make sure MongoDB is running locally (or use MongoDB Atlas URI in `.env`)

### 4. Run dev server
```bash
npm run dev
```
Server starts at: `http://localhost:5000`

---

## API Endpoints

### Auth — `/api/v1/auth`
| Method | Endpoint    | Body                                      | Auth | Description        |
|--------|-------------|-------------------------------------------|------|--------------------|
| POST   | `/register` | name, email, password, phone?, role       | ❌   | Register new user  |
| POST   | `/login`    | email, password                           | ❌   | Login, get token   |

### Users — `/api/v1/users`
| Method | Endpoint | Body               | Auth | Role    | Description        |
|--------|----------|--------------------|------|---------|--------------------|
| GET    | `/me`    | —                  | ✅   | Any     | Get own profile    |
| PUT    | `/me`    | name?, phone?      | ✅   | Any     | Update own profile |

### Jobs — `/api/v1/jobs`
| Method | Endpoint      | Body / Params | Auth | Role              | Description              |
|--------|---------------|---------------|------|-------------------|--------------------------|
| POST   | `/`           | job fields    | ✅   | employer          | Post a new job           |
| GET    | `/`           | —             | ✅   | worker, agent     | Browse all open jobs     |
| GET    | `/my`         | —             | ✅   | employer          | My posted jobs           |
| PUT    | `/:id/close`  | —             | ✅   | employer          | Close a job              |

### Applications — `/api/v1/applications`
| Method | Endpoint          | Body / Params      | Auth | Role     | Description                  |
|--------|-------------------|--------------------|------|----------|------------------------------|
| POST   | `/`               | jobId              | ✅   | worker   | Apply for a job              |
| GET    | `/my`             | —                  | ✅   | worker   | My applications              |
| GET    | `/job/:jobId`     | —                  | ✅   | employer | Applicants for my job        |
| PUT    | `/:id/status`     | status             | ✅   | employer | Approve / Reject applicant   |

### Agents — `/api/v1/agents`
| Method | Endpoint       | Auth | Role  | Description                  |
|--------|----------------|------|-------|------------------------------|
| GET    | `/workers`     | ✅   | agent | Workers placed by this agent |
| GET    | `/placements`  | ✅   | agent | All placements               |
| GET    | `/commission`  | ✅   | agent | Commission summary           |

### Admin — `/api/v1/admin`
| Method | Endpoint   | Auth | Role  | Description              |
|--------|------------|------|-------|--------------------------|
| GET    | `/stats`   | ✅   | admin | Platform counts          |
| GET    | `/users`   | ✅   | admin | All users                |
| GET    | `/jobs`    | ✅   | admin | All jobs                 |
| GET    | `/agents`  | ✅   | admin | All agents with stats    |

---

## Response Format

All responses follow this format:

**Success:**
```json
{ "success": true, "message": "...", "data": { ... } }
```

**Error:**
```json
{ "success": false, "message": "...", "error": "...", "statusCode": 400 }
```

---

## Environment Variables

See `.env.example` for full list.

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/kaamsetu
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```
