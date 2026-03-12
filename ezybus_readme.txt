🚍 EzyBus

Smart Urban Bus Tracking & Transit Intelligence Platform

EzyBus is a real-time public transportation management system designed
to improve urban mobility, passenger experience, and operational
efficiency.

It connects commuters, bus conductors, and transport administrators
through a single intelligent platform that enables live bus tracking,
route planning, and fleet management.

------------------------------------------------------------------------

🌍 Problem

Public transportation in many cities suffers from:

❌ No real-time bus location visibility ❌ Long and uncertain waiting
times ❌ Poor coordination between drivers and transport authorities ❌
Limited data for transit planning ❌ Passenger frustration due to lack
of updates

These issues reduce public trust in transportation systems.

------------------------------------------------------------------------

💡 Solution

EzyBus introduces a smart digital ecosystem for public bus transport.

The platform enables:

🚍 Live Bus Tracking Passengers can see bus locations in real time on an
interactive map.

🧭 Smart Route Planning Find the fastest routes and estimate arrival
times.

👨‍✈️ Conductor Trip Management Bus staff can update trip status and share
live location.

⚙️ Admin Fleet Dashboard Transport authorities monitor buses, routes,
alerts, and analytics.

🔔 Instant Passenger Alerts Notify users about delays, disruptions, and
arrivals.

------------------------------------------------------------------------

🧠 Innovation

EzyBus introduces several smart concepts:

🚍 Real-Time Fleet Visibility

Dynamic bus tracking updates the system continuously.

🧭 Route Intelligence

Optimized routes help commuters choose faster travel options.

📡 Simulation-Driven Development

A built-in bus simulator allows real-time testing without GPS hardware.

🧑‍💻 Role-Based System

Separate dashboards for: - Commuters - Conductors - Administrators

------------------------------------------------------------------------

🖥 Platform Overview

Role | Key Capabilities Commuter | Track buses, search routes, receive
alerts Conductor | Manage trips, update location, passenger counts Admin
| Monitor fleet, manage routes, system analytics

------------------------------------------------------------------------

🏗 System Architecture

Frontend - Next.js 16 (React) - TypeScript - TailwindCSS - Framer
Motion - Zustand State Management

Backend - Node.js - Express REST API - JWT Authentication

Database - Firebase Firestore

------------------------------------------------------------------------

🧪 Bus Simulation Engine

To demonstrate real-time tracking without physical GPS devices, the
platform includes a bus simulation system that:

-   Generates realistic bus movement
-   Updates positions every few seconds
-   Simulates fleet movement across a city grid

This enables testing and visualization during development and demos.

------------------------------------------------------------------------

🎨 UI / UX Design

The platform is built with production-level UI design principles.

Features include: - Dark / Light mode - Animated dashboards -
Glassmorphism UI cards - Custom cursor interactions - Responsive
layouts - Interactive map visualization

------------------------------------------------------------------------

📂 Project Structure

EzyBus - frontend - app - components - store - utils - styles -
backend - controllers - routes - middleware - config - shared -
README.md

------------------------------------------------------------------------

⚙️ Installation

Clone Repository

git clone https://github.com/yourusername/ezybus.git cd ezybus

Install Dependencies

Frontend cd frontend npm install

Backend cd backend npm install

Environment Setup

Backend .env

PORT=5000 JWT_SECRET=your_secret FIREBASE_PROJECT_ID=your_project
FIREBASE_CLIENT_EMAIL=your_email FIREBASE_PRIVATE_KEY=your_private_key

Frontend .env.local

NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key

Run the Application

Backend npm run dev

Frontend npm run dev

Open: http://localhost:3000

------------------------------------------------------------------------

📊 Dashboards

Commuter Dashboard - Live bus map - Route search - Service alerts

Conductor Dashboard - Trip management - Passenger tracking - Location
updates

Admin Dashboard - Fleet monitoring - System alerts - Route analytics

------------------------------------------------------------------------

🌱 Future Improvements

-   AI-based bus arrival prediction
-   Traffic-aware routing
-   Mobile application
-   IoT GPS integration
-   Urban transit analytics

------------------------------------------------------------------------

🌏 Impact

EzyBus can help cities: - Reduce commuter waiting time - Improve transit
reliability - Increase public transport adoption - Enable data-driven
transport planning

------------------------------------------------------------------------

👨‍💻 Author

Nandhini R

Computer Science & Engineering AI • Systems • Product Development

------------------------------------------------------------------------

⭐ Support the Project

If you like this project: - Star the repository - Fork it - Build upon
it

------------------------------------------------------------------------

Hackathon Tip

Add these 3 things to your GitHub repo to impress judges instantly:

1.  Architecture Diagram
2.  Demo GIF of the dashboard
3.  Screenshots of each role dashboard
