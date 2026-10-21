# PlacementPro — Full-Stack Campus Placement Preparation Portal

A production-ready, full-stack Placement Preparation Portal designed for college engineering students preparing for campus recruitment drives, tech assessments, and corporate hiring interviews.

---

## 🌟 Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS, Lucide React Icons, React Router v6, Axios |
| **Backend** | Node.js (ES Modules), Express.js, JWT, Bcrypt.js, Helmet, Express Rate Limit, Morgan, CORS |
| **Database** | MongoDB Atlas with Mongoose (with zero-config in-memory fallback for instant local testing) |
| **Testing** | Node.js Test Runner (`node --test`), Supertest, 100% test pass rate |
| **Hosting** | **Frontend**: Vercel (SPA with `vercel.json` rewrites) <br/> **Backend**: Render (Node.js Web Service) |

---

## 🔑 Demo Accounts (Pre-Seeded & 1-Click Ready)

The portal comes pre-seeded with realistic questions, mock exams, active campus hiring drives, coding sheets, and demo accounts:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `student@placementportal.edu` | `Student@123` | Aptitude drills, timed mock tests, test scorecards, DSA problem tracking, job applications, application tracker, student profile |
| **Demo Admin** | `admin@placementportal.edu` | `Admin@123` | Training & Placement Officer portal (`/admin`), platform analytics, user role management, question bank CRUD, mock test creation, job drive postings, applicant review |

> **Pro-Tip**: The navigation bar and sign-in page both include **1-click Demo buttons** (`Demo Student` and `Demo Admin`) for instant evaluation without typing credentials.

---

## 🚀 Key Modules & Features

### 1. 🎓 Student Experience
- **Student Dashboard**: Real-time stats (tests completed, average score %, DSA problems solved, job applications count, saved drives), visual SVG test performance trend bar charts with cutoff benchmark indicators, recent test attempts, and active applications.
- **Aptitude Practice Arena**: Filter by category (*Quantitative Aptitude*, *Logical Reasoning*, *Verbal Ability*, *Core CS Fundamentals*), topic, and difficulty (*Easy*, *Medium*, *Hard*). Interactive option selection, instant answer verification, and detailed step-by-step pedagogical explanation drawers with speed formula tips.
- **Timed Mock Assessments**: Simulates actual recruitment exams (*TCS NQT Comprehensive Mock*, *Infosys Specialist Programmer Drill*, *Core CS Benchmark*). Features live countdown timer (with critical time alerts), interactive Question Palette (Answered, Unanswered, Marked for Review), answer clearing, auto-submit on timeout, and confirmation modal.
- **Comprehensive Scorecards & Results**: Total score, accuracy percentage, time taken, passing status against cutoff, category-by-category accuracy breakdown, and question-by-question review showing selected option vs correct option with detailed explanations.
- **Curated DSA Coding Sheet**: Placement coding roadmap spanning Arrays & Hashing, Two Pointers, Linked Lists, Trees, Dynamic Programming, and Graphs. Includes problem difficulty badges, company tags (*Google*, *Amazon*, *Microsoft*, *Adobe*), direct external links to LeetCode/GeeksForGeeks, expandable approach hints, and synchronized "Solved" toggle states.
- **Campus Hiring Board**: Discover engineering roles and internships, filter by type (*Full-time*, *Internship*), location, and salary/stipend (*₹28 - ₹34 LPA*). Features job saving/bookmarking and a 1-click application modal that pre-fills resume and portfolio links from the student profile.
- **Application Tracker Kanban**: Stage-by-stage tracker (*Applied* &rarr; *Shortlisted* &rarr; *Interviewing* &rarr; *Offered* &rarr; *Rejected*). Includes personal candidate prep notes and interview follow-up logs.
- **Student Profile**: Academic tracking (*College*, *Branch*, *Graduation Year*, *CGPA*), target dream companies tag chips, technical skills tag chips, resume URL, GitHub, LinkedIn, and career objective.
- **Core CS Cheatsheets & Placement Roadmaps**: High-yield revision summaries for DBMS (ACID, Normalization 1NF to BCNF, SQL Joins), Operating Systems (Process vs Thread, Deadlock conditions, Paging), Computer Networks (OSI 7 Layers, TCP 3-Way Handshake), OOP (SOLID Principles), ATS Resume Master Checklist, and HR Behavioral Interview STAR Strategy.

### 2. 🛡️ Training & Placement (T&P) Admin Portal (`/admin`)
- **Platform Analytics**: Aggregate metrics on total students, total placement officers, questions in bank, active tests, test attempts, active campus drives, and total applications submitted.
- **User Management (`/admin/users`)**: Search candidates, inspect academic CGPA and branch, promote/demote user roles between Student and Admin, and delete user profiles.
- **Question Bank CRUD (`/admin/questions`)**: Create, edit, and delete aptitude and technical questions with options, correct answer keys, explanation text, and speed formulas.
- **Mock Test Management (`/admin/tests`)**: Assemble new mock exams, configure time duration in minutes, define passing cutoff percentage, and select questions from the repository.
- **Campus Drives & Applicant Review (`/admin/jobs`)**: Post new campus recruitment drives, manage active/closed status, and inspect applicants per job (view candidate CGPA, resume URL, portfolio link, cover note, and update hiring stage from *Applied* to *Shortlisted* / *Interviewing* / *Offered*).

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js** v18+ (tested on Node v26)
- **npm** v9+

### 1. Clone & Install Dependencies
Run from the root directory:
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```
Or install in each directory individually:
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Environment Configuration
The project is configured to run locally out-of-the-box using the provided `.env.example` templates:

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=dev_jwt_secret_placement_portal_2026_dev_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173,http://localhost:3000
```
*(Note: If `MONGODB_URI` is left blank, the server automatically boots an isolated in-memory MongoDB instance for seamless zero-config local testing!)*

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers
From the root directory:
```bash
# Terminal 1: Run Backend REST API Server (port 5000)
npm run dev:server

# Terminal 2: Run Frontend Client (port 5173)
npm run dev:client
```
Access the application in your browser at: **`http://localhost:5173`**

### 4. Seed Demo Data
To re-seed fresh demo data at any time:
```bash
npm run seed
```

### 5. Run Automated Tests
Execute the backend test suite:
```bash
npm test
```
*Result: 16 passing integration tests covering health check, JWT auth, question bank, test taking, scoring engine, job applications, and admin role authorization.*

---

## ☁️ Production Deployment Guide

### A. Database: MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Network Access**, add IP address `0.0.0.0/0` (Allow access from anywhere).
3. Under **Database Access**, create a database user (e.g., `placement_admin`) with a secure password.
4. Click **Connect** &rarr; **Drivers** &rarr; copy your connection URI string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/placement_portal?retryWrites=true&w=majority
   ```

---

### B. Backend: Render (Node.js Web Service)
1. Sign in to [Render](https://render.com/) and click **New +** &rarr; **Web Service**.
2. Connect your Git repository.
3. Configure the service settings:
   - **Name**: `placement-portal-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add the following:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or leave default, Render sets `PORT` automatically)
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET`: `<A strong random secret string, min 32 characters>`
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: `https://<YOUR-VERCEL-APP-NAME>.vercel.app` *(add both your production Vercel domain and preview domains)*
5. Click **Create Web Service**.
6. Once deployed, note down your Render base URL (e.g., `https://placement-portal-api.onrender.com`).
7. Verify the service health by opening: `https://placement-portal-api.onrender.com/api/health`

---

### C. Frontend: Vercel
1. Sign in to [Vercel](https://vercel.com/) and click **Add New...** &rarr; **Project**.
2. Select your Git repository.
3. In the project configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://placement-portal-api.onrender.com/api` *(Your Render backend URL with `/api` path)*
5. Click **Deploy**.
6. The frontend is automatically wired with `client/vercel.json` to handle client-side SPA routing (`/*` rewrite to `/index.html`).
7. Copy your deployed Vercel domain (e.g., `https://placement-portal.vercel.app`) and ensure it is listed in the `CLIENT_URL` environment variable on Render.

---

## 📡 API Reference Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System status and uptime monitor |
| `POST` | `/api/auth/register` | Public | Student account registration |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Protected | Current user session profile |
| `GET` | `/api/users/profile` | Protected | Get student profile with populated drives |
| `PUT` | `/api/users/profile` | Protected | Update academic info, skills, and resume link |
| `GET` | `/api/users/dashboard-stats` | Protected | Dashboard metrics & performance history |
| `POST` | `/api/users/toggle-problem/:id` | Protected | Toggle solved state of DSA problem |
| `POST` | `/api/users/toggle-save-job/:id` | Protected | Bookmark / save job posting |
| `GET` | `/api/questions` | Public | Filterable aptitude & technical questions |
| `GET` | `/api/mock-tests` | Public | List active mock exams |
| `GET` | `/api/mock-tests/:id` | Protected | Fetch exam questions (sanitizes answers for students) |
| `POST` | `/api/test-attempts/submit` | Protected | Grade exam submission and generate scorecard |
| `GET` | `/api/test-attempts/my-attempts` | Protected | Student's past test scorecard history |
| `GET` | `/api/jobs` | Public | Search campus job and internship drives |
| `POST` | `/api/applications/apply/:jobId` | Protected | Submit 1-click application |
| `GET` | `/api/applications/my-applications` | Protected | Student's application tracker |
| `GET` | `/api/interview-questions` | Public | Company interview questions with answers |
| `POST` | `/api/interview-questions/:id/upvote` | Public | Upvote interview answer |
| `GET` | `/api/coding-problems` | Public | Curated placement DSA sheet |
| `GET` | `/api/admin/stats` | Admin | Platform-wide placement analytics |
| `GET` | `/api/admin/users` | Admin | User management directory |
| `PUT` | `/api/admin/users/:id/role` | Admin | Promote / demote role |
| `POST` | `/api/questions` | Admin | Create aptitude question |
| `POST` | `/api/mock-tests` | Admin | Assemble mock test |
| `POST` | `/api/jobs` | Admin | Post campus recruitment drive |
| `GET` | `/api/applications/admin/job/:jobId` | Admin | View applicants for a specific drive |
| `PUT` | `/api/applications/admin/:id/status` | Admin | Advance candidate status (Applied &rarr; Shortlisted &rarr; Interviewing &rarr; Offered) |

---

## 🔒 Security & Best Practices Implemented
- **Zero Exposed Secrets**: Environment variables cleanly separated into `.env.example`.
- **JWT Authentication**: Configurable expiration and token verification middleware.
- **Bcrypt Password Hashing**: Passwords stored using 10 salt rounds with pre-save hashing.
- **Role-Based Authorization**: Distinct `student` and `admin` permissions guards.
- **Question Sanitization**: Test questions hide `correctOption` and `explanation` from students during active exam taking to prevent inspect-element cheating.
- **Dynamic CORS**: Whitelist validation supporting localhost development and production Vercel domains.
- **Rate Limiting**: Brute-force protection on auth endpoints and standard rate limiting across all API routes.
- **Security Headers**: Standard Helmet security headers.
