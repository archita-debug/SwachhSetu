# 🌿 SwachhSetu — Smart Waste Management Platform

> A full-stack web app for citizen-driven waste management, built for **Smart India Hackathon 2025** (Problem Statement 25060 — Real Life Solutions for Waste Management).

---

## 📸 Features

| Feature | Description |
|---|---|
| 🔐 Auth | JWT login/register with citizen & authority roles |
| 📊 Dashboard | Live waste stats, training progress, quick actions |
| 🚛 Live Tracking | Animated truck tracking + nearby facility locator |
| 🎮 Training & Quiz | 5-module training + quiz with real Minecoin rewards |
| 📸 Report Issue | Photo upload + GPS geo-tagging + status tracking |
| 🛒 Marketplace | Redeem Minecoins for eco-friendly products |
| 🏆 Leaderboard | Live podium from real DB points |
| 📱 Responsive | Full mobile support with bottom nav |

---

## 🗂 Project Structure

```
SwachhSetu/
├── backend/
│   ├── middleware/auth.js       # JWT middleware
│   ├── models/
│   │   ├── User.js              # User schema (bcrypt passwords)
│   │   └── Report.js            # Report schema with geo + photo
│   ├── routes/
│   │   ├── auth.js              # /api/auth/register, login, me
│   │   ├── reports.js           # /api/reports (CRUD + photo upload)
│   │   ├── quiz.js              # /api/quiz/questions + answer
│   │   ├── market.js            # /api/market/products + redeem
│   │   ├── tracking.js          # /api/tracking/trucks, facilities, leaderboard
│   │   └── user.js              # /api/user/profile
│   ├── uploads/                 # Uploaded photos stored here
│   ├── seed.js                  # Demo data seeder
│   ├── server.js                # Express entry point
│   ├── .env.example             # Copy to .env and fill in
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Sidebar + topbar + bottom nav
│   │   │   └── Layout.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── hooks/
│   │   │   └── useToast.js      # Toast notification hook
│   │   ├── pages/
│   │   │   ├── Login.jsx / Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tracking.jsx
│   │   │   ├── Training.jsx
│   │   │   ├── ReportPage.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   └── Leaderboard.jsx
│   │   ├── api.js               # Axios instance with auth interceptors
│   │   ├── App.jsx              # React Router setup
│   │   ├── main.jsx
│   │   └── index.css            # Global design tokens + utilities
│   ├── vercel.json              # SPA routing for Vercel
│   ├── vite.config.js           # Vite + proxy config
│   └── package.json
├── render.yaml                  # One-click Render deploy config
├── package.json                 # Root scripts (runs both together)
└── .gitignore
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local install **or** free MongoDB Atlas cluster)
- Git

### Step 1 — Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/SwachhSetu.git
cd SwachhSetu
```

### Step 2 — Install all dependencies
```bash
npm run install:all
```

### Step 3 — Configure the backend
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and set:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/SwachhSetu
JWT_SECRET=pick_any_long_random_string_here
NODE_ENV=development
```
> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string.

### Step 4 — Seed demo data
```bash
cd backend
node seed.js
cd ..
```
This creates demo accounts and sample reports.

### Step 5 — Run the app
```bash
npm run dev
```
- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:5000/api

### Demo Logins
| Role | Email | Password |
|---|---|---|
| Citizen | citizen@demo.com | demo1234 |
| Authority | authority@demo.com | demo1234 |

---

## 🌐 Deploying to GitHub

```bash
# From the SwachhSetu/ root folder
git init
git add .
git commit -m "feat: SwachhSetu full-stack app"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/SwachhSetu.git
git branch -M main
git push -u origin main
```

---

## ☁️ Production Deployment

### Backend → Render (Free tier)

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Configure:
   | Setting | Value |
   |---|---|
   | Root Directory | `backend` |
   | Build Command | `npm install` |
   | Start Command | `node server.js` |
4. Add **Environment Variables** in Render dashboard:
   - `MONGO_URI` → your MongoDB Atlas URI
   - `JWT_SECRET` → any long random string
   - `NODE_ENV` → `production`
5. Click **Deploy** — your API will be live at `https://SwachhSetu-backend.onrender.com`

> **Free MongoDB Atlas:** [cloud.mongodb.com](https://cloud.mongodb.com) → Create cluster → Get connection string

### Frontend → Vercel (Free tier)

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Configure:
   | Setting | Value |
   |---|---|
   | Root Directory | `frontend` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
4. Add **Environment Variable**:
   - `VITE_API_URL` → `https://SwachhSetu-backend.onrender.com`
5. Click **Deploy** — your app will be live at `https://SwachhSetu.vercel.app`

### After deploy — seed production DB
```bash
# Temporarily set your MONGO_URI to Atlas in backend/.env, then:
node backend/seed.js
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/reports` | ✅ | Get reports (own or all for authority) |
| POST | `/api/reports` | ✅ | Submit report (multipart/form-data) |
| PATCH | `/api/reports/:id/status` | ✅ | Update report status (authority) |
| GET | `/api/quiz/questions` | ✅ | Get quiz questions |
| POST | `/api/quiz/answer` | ✅ | Submit answer, earn coins |
| GET | `/api/market/products` | ✅ | Get marketplace products |
| POST | `/api/market/redeem` | ✅ | Redeem product with Minecoins |
| GET | `/api/tracking/trucks` | ✅ | Get active truck data |
| GET | `/api/tracking/facilities` | ✅ | Get nearby facilities |
| GET | `/api/tracking/leaderboard` | ✅ | Get top users by points |
| GET | `/api/user/profile` | ✅ | Get user profile |
| PATCH | `/api/user/profile` | ✅ | Update user profile |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Vite |
| Styling | Plain CSS with CSS custom properties |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| Deploy (FE) | Vercel |
| Deploy (BE) | Render |
| DB (Prod) | MongoDB Atlas |

---

## 🤝 Team

**SwachhSetu** — SIH 2025, Problem Statement 25060  
Theme: Clean & Green Technology | Category: Software
