# 🚌 EzyBus

A full-stack bus management and commuter tracking platform supporting three user roles: **Commuter**, **Conductor**, and **Admin**.

## Tech Stack

| Layer      | Technology                              |
|------------|----------------------------------------|
| Frontend   | Next.js 14 (App Router), TailwindCSS   |
| Backend    | Node.js, Express.js, JWT Auth          |
| Database   | Firebase Firestore                     |
| Auth       | JWT + Firebase Admin SDK               |

## Project Structure

```
ezybus/
├── frontend/          # Next.js app (port 3000)
├── backend/           # Express REST API (port 5000)
├── shared/            # Shared types & constants
└── package.json       # Root workspace config
```

## Getting Started

### 1. Prerequisites
- Node.js >= 18
- npm >= 9
- Firebase project (for Firestore)

### 2. Clone & Install

```bash
git clone <repo-url>
cd ezybus
npm run install:all
```

### 3. Configure Environment Variables

**Backend** — copy `backend/.env.example` to `backend/.env` and fill in:
```
PORT=5000
JWT_SECRET=your_super_secret_key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Frontend** — copy `frontend/.env.local.example` to `frontend/.env.local` and fill in:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

### 4. Run Development Servers

```bash
# From root — starts both frontend and backend concurrently
npm run dev

# Or individually:
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:3000
```

## User Roles

| Role      | Description                                          |
|-----------|-----------------------------------------------------|
| Commuter  | Browse routes, track buses, view trip status        |
| Conductor | Manage active trips, update status, log passengers  |
| Admin     | Full access: users, buses, routes, trips, analytics |

## API Overview

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint              | Role         | Description          |
|--------|-----------------------|--------------|----------------------|
| POST   | /auth/register        | Public       | Register new user    |
| POST   | /auth/login           | Public       | Login & get JWT      |
| GET    | /auth/me              | Any          | Get current user     |
| GET    | /buses                | Any          | List all buses       |
| POST   | /buses                | Admin        | Create bus           |
| GET    | /routes               | Any          | List all routes      |
| POST   | /routes               | Admin        | Create route         |
| GET    | /trips                | Any          | List trips           |
| PUT    | /trips/:id/status     | Conductor    | Update trip status   |
| GET    | /users                | Admin        | List all users       |
| PUT    | /users/:id/role       | Admin        | Change user role     |
