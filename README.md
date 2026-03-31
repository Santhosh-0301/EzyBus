# 🚌 EzyBus

🚀 Smart Urban Transit Intelligence Platform  
🌍 Built for FOSS Hack using OpenStreetMap

EzyBus is a real-time public transportation system designed to improve urban mobility using open-source technologies.

It connects commuters, conductors, and administrators into a unified platform for live tracking, route intelligence, and fleet management.

## Tech Stack

| Layer      | Technology                              |
|------------|----------------------------------------|
| Frontend   | Next.js 14 (App Router), TailwindCSS   |
| Backend    | Node.js, Express.js, JWT Auth          |
| Database   | Firebase Firestore                     |
| Auth       | JWT + Firebase Admin SDK               |
| Maps       | OpenStreetMap + Leaflet.js             |

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

Smart Urban Bus Tracking & Transit Intelligence Platform

EzyBus is a real-time public transportation management system designed
to improve urban mobility, passenger experience, and operational
efficiency.

It connects commuters, bus conductors, and transport administrators
through a single intelligent platform that enables live bus tracking,
route planning, and fleet management.

------------------------------------------------------------------------

## 🌍 Open Source Focus

EzyBus is built with a strong commitment to open-source principles:

- 🗺 Uses OpenStreetMap (OSM) instead of proprietary map services
- 💸 Eliminates dependency on paid APIs like Google Maps
- 🔓 Fully open-source and reusable
- 🌱 Ideal for deployment in developing cities

This makes EzyBus a scalable and cost-effective smart transit solution.

------------------------------------------------------------------------

## 🌍 Problem

Public transportation in many cities suffers from:

❌ No real-time bus location visibility ❌ Long and uncertain waiting
times ❌ Poor coordination between drivers and transport authorities ❌
Limited data for transit planning ❌ Passenger frustration due to lack
of updates

These issues reduce public trust in transportation systems.

------------------------------------------------------------------------

## 💡 Solution

EzyBus introduces a smart digital ecosystem for public bus transport.

The platform enables:

🌍 Open-Source Mapping Integration (OSM)

🚍 Live Bus Tracking Passengers can see bus locations in real time on an
interactive map.

🧭 Smart Route Planning Find the fastest routes and estimate arrival
times.

👨‍✈️ Conductor Trip Management Bus staff can update the trip status and share
live location.

⚙️ Admin Fleet Dashboard Transport authorities monitor buses, routes,
alerts, and analytics.

🔔 Instant Passenger Alerts: Notify users about delays, disruptions, and
arrivals.

------------------------------------------------------------------------

## 🧠 Innovation

EzyBus introduces several smart concepts:

🚍 Real-Time Fleet Visibility

Dynamic bus tracking updates the system continuously.

🧭 Route Intelligence

Optimized routes help commuters choose faster travel options.

📡 Simulation-Driven Development

A built-in bus simulator allows real-time testing without GPS hardware.

🧑‍💻 Role-Based System

Separate dashboards for: - Commuters - Conductors - Administrators

🌍 Open-Source Mapping Integration (OSM)

Uses OpenStreetMap (OSM) instead of proprietary map services

------------------------------------------------------------------------

## 🖥 Platform Overview

Role | Key Capabilities Commuter | Track buses, search routes, receive
alerts Conductor | Manage trips, update location, passenger counts Admin
| Monitor fleet, manage routes, and system analytics

------------------------------------------------------------------------

## 🏗 System Architecture

Frontend - Next.js 16 (React) - TypeScript - TailwindCSS - Framer
Motion - Zustand State Management

Backend - Node.js - Express REST API - JWT Authentication

Database - Firebase Firestore

<img width="1665" height="942" alt="Architecture Diagram" src="https://github.com/user-attachments/assets/a053f7f5-22ba-47cd-9ac0-a164c240bb05" />



```text
Frontend
│
├── Next.js 16 (React)
├── TypeScript
├── TailwindCSS
├── Framer Motion
├── Zustand State Management
│
Backend
│
├── Node.js
├── Express REST API
├── JWT Authentication
│
Database
│
└── Firebase Firestore
```

------------------------------------------------------------------------



## 📂 Project Structure

```text
EzyBus
│
├── frontend
│   ├── app
│   ├── components
│   ├── store
│   ├── utils
│   └── styles
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   └── config
│
├── shared
│
└── README.md
```

------------------------------------------------------------------------

## 🧪 Bus Simulation Engine

To demonstrate real-time tracking without physical GPS devices,
The platform includes a bus simulation system that:

-   Generates realistic bus movement
-   Updates positions every few seconds
-   Simulates fleet movement across a city grid

This enables testing and visualization during development and demos.

------------------------------------------------------------------------

## 🎨 UI / UX Design

- Dark-themed professional dashboard
- Glassmorphism-based UI components
- Smooth animations using Framer Motion
- Custom cursor interactions
- Responsive layouts across devices
- Interactive OpenStreetMap visualization

------------------------------------------------------------------------

## 📊 Dashboards

Commuter Dashboard - Live bus map - Route search - Service alerts

Conductor Dashboard - Trip management - Passenger tracking - Location
updates

Admin Dashboard - Fleet monitoring - System alerts - Route analytics

------------------------------------------------------------------------

## 📡 API Integration

The backend is fully structured with RESTful endpoints.

API integration is designed and ready, and can be connected seamlessly for real-time deployment.

------------------------------------------------------------------------

## 🔐 Security

- JWT-based authentication
- Role-based access control
- Protected routes for each dashboard

------------------------------------------------------------------------

## 📜 License

This project is licensed under the MIT License  
© 2026 Team - 404 BNF

------------------------------------------------------------------------

## 🌱 Future Improvements

-   AI-based bus arrival prediction
-   Traffic-aware routing
-   Mobile application
-   IoT GPS integration
-   Urban transit analytics

------------------------------------------------------------------------

## 🌏 Impact

EzyBus can help cities: - Reduce commuter waiting time - Improve transit
reliability - Increase public transport adoption - Enable data-driven
transport planning

------------------------------------------------------------------------

## 🎥 Demo

🔗 Live Demo: (https://ezybus-frontend.vercel.app/)
🎬 Demo Video:(https://drive.google.com/file/d/1LQA-AsDlJ88I_8NaRi8xbFzauqnfXNLz/view)

------------------------------------------------------------------------

## 👨‍💻 Authors

Nandhini R, Santhosh R, Gokul S, Darshana Ganesh
B.Tech Computer Science and Engineering, 
SRM Institute of Science and Technology,
Tiruchirappalli

------------------------------------------------------------------------
