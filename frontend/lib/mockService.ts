/**
 * Mock data service — simulates backend API responses.
 * All data is in-memory. Swap with real API calls when backend is ready.
 */

import type { Bus, Route, Trip, Alert, User } from './types';

// ── Chennai-centered coordinates ─────────────────────────────────────────────
const CHENNAI = { lat: 13.0827, lng: 80.2707 };

const jitter = (base: number, range: number) =>
    base + (Math.random() - 0.5) * range;

// ── Mock Users ───────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Arjun Commuter', email: 'arjun@ezybus.com', role: 'commuter', createdAt: '2025-01-10T00:00:00Z', updatedAt: '2025-01-10T00:00:00Z' },
    { id: 'u2', name: 'Priya Commuter', email: 'priya@ezybus.com', role: 'commuter', createdAt: '2025-01-12T00:00:00Z', updatedAt: '2025-01-12T00:00:00Z' },
    { id: 'u3', name: 'Ravi Conductor', email: 'ravi@ezybus.com', role: 'conductor', createdAt: '2025-02-01T00:00:00Z', updatedAt: '2025-02-01T00:00:00Z' },
    { id: 'u4', name: 'Kavya Conductor', email: 'kavya@ezybus.com', role: 'conductor', createdAt: '2025-02-05T00:00:00Z', updatedAt: '2025-02-05T00:00:00Z' },
    { id: 'u5', name: 'Admin User', email: 'admin@ezybus.com', role: 'admin', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
];

// ── Mock Routes ──────────────────────────────────────────────────────────────
export const MOCK_ROUTES: Route[] = [
    {
        id: 'r1', name: 'Route 101', origin: 'Chennai Central', destination: 'Chennai Airport',
        estimatedDuration: 45, distance: 22, active: true, color: '#6366f1',
        stops: [
            { name: 'Chennai Central', location: { lat: 13.0827, lng: 80.2707 } },
            { name: 'Egmore', location: { lat: 13.0732, lng: 80.2609 } },
            { name: 'Royapettah', location: { lat: 13.0524, lng: 80.2606 } },
            { name: 'Guindy', location: { lat: 13.0068, lng: 80.2206 } },
            { name: 'Chennai Airport', location: { lat: 12.9941, lng: 80.1709 } },
        ],
    },
    {
        id: 'r2', name: 'Route 202', origin: 'T. Nagar', destination: 'Guindy',
        estimatedDuration: 30, distance: 12, active: true, color: '#06b6d4',
        stops: [
            { name: 'T. Nagar', location: { lat: 13.0408, lng: 80.2337 } },
            { name: 'Ashok Nagar', location: { lat: 13.0294, lng: 80.2186 } },
            { name: 'Guindy', location: { lat: 13.0068, lng: 80.2206 } },
        ],
    },
    {
        id: 'r3', name: 'Route 303', origin: 'Anna Nagar', destination: 'Tambaram',
        estimatedDuration: 55, distance: 28, active: true, color: '#10b981',
        stops: [
            { name: 'Anna Nagar', location: { lat: 13.0892, lng: 80.2102 } },
            { name: 'Vadapalani', location: { lat: 13.0511, lng: 80.2124 } },
            { name: 'Ashok Nagar', location: { lat: 13.0294, lng: 80.2186 } },
            { name: 'Chrompet', location: { lat: 12.9516, lng: 80.1462 } },
            { name: 'Tambaram', location: { lat: 12.9249, lng: 80.1000 } },
        ],
    },
    {
        id: 'r4', name: 'Route 404', origin: 'Adyar', destination: 'Velachery',
        estimatedDuration: 25, distance: 10, active: true, color: '#f59e0b',
        stops: [
            { name: 'Adyar', location: { lat: 13.0012, lng: 80.2565 } },
            { name: 'Kotturpuram', location: { lat: 13.0014, lng: 80.2397 } },
            { name: 'Velachery', location: { lat: 12.9788, lng: 80.2209 } },
        ],
    },
    {
        id: 'r5', name: 'Route 505', origin: 'Porur', destination: 'T. Nagar',
        estimatedDuration: 40, distance: 18, active: false, color: '#8b5cf6',
        stops: [
            { name: 'Porur', location: { lat: 13.0349, lng: 80.1553 } },
            { name: 'Vadapalani', location: { lat: 13.0511, lng: 80.2124 } },
            { name: 'T. Nagar', location: { lat: 13.0408, lng: 80.2337 } },
        ],
    },
];

// ── Mock Buses ───────────────────────────────────────────────────────────────
export const MOCK_BUSES: Bus[] = [
    {
        id: 'b1', busNumber: 'TN-01-AB-1234', capacity: 50, status: 'active',
        currentLocation: { lat: jitter(CHENNAI.lat, 0.05), lng: jitter(CHENNAI.lng, 0.05) },
        locationHistory: [],
        conductorId: 'u3', routeId: 'r1',
        speed: 32, passengerCount: 28, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b2', busNumber: 'TN-01-CD-5678', capacity: 45, status: 'active',
        currentLocation: { lat: jitter(CHENNAI.lat, 0.05), lng: jitter(CHENNAI.lng, 0.05) },
        locationHistory: [],
        conductorId: 'u4', routeId: 'r2',
        speed: 24, passengerCount: 15, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b3', busNumber: 'TN-01-EF-9012', capacity: 40, status: 'active',
        currentLocation: { lat: jitter(CHENNAI.lat, 0.05), lng: jitter(CHENNAI.lng, 0.05) },
        locationHistory: [],
        routeId: 'r3',
        speed: 18, passengerCount: 37, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b4', busNumber: 'TN-02-GH-3456', capacity: 52, status: 'active',
        currentLocation: { lat: jitter(CHENNAI.lat, 0.05), lng: jitter(CHENNAI.lng, 0.05) },
        locationHistory: [],
        routeId: 'r4',
        speed: 41, passengerCount: 8, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b5', busNumber: 'TN-02-IJ-7890', capacity: 48, status: 'maintenance',
        currentLocation: { lat: 13.0500, lng: 80.2000 },
        locationHistory: [],
        speed: 0, passengerCount: 0, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b6', busNumber: 'TN-03-KL-2345', capacity: 42, status: 'inactive',
        currentLocation: { lat: 13.0200, lng: 80.2800 },
        locationHistory: [],
        speed: 0, passengerCount: 0, lastUpdated: new Date().toISOString(),
    },
];

// ── Mock Trips ───────────────────────────────────────────────────────────────
export const MOCK_TRIPS: Trip[] = [
    {
        id: 't1', busId: 'b1', routeId: 'r1', conductorId: 'u3',
        status: 'active', passengerCount: 28,
        startTime: new Date(Date.now() - 25 * 60000).toISOString(),
        currentLocation: MOCK_BUSES[0].currentLocation,
        createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    },
    {
        id: 't2', busId: 'b2', routeId: 'r2', conductorId: 'u4',
        status: 'active', passengerCount: 15,
        startTime: new Date(Date.now() - 12 * 60000).toISOString(),
        currentLocation: MOCK_BUSES[1].currentLocation,
        createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    },
    {
        id: 't3', busId: 'b3', routeId: 'r3', conductorId: 'u3',
        status: 'completed', passengerCount: 44,
        startTime: new Date(Date.now() - 90 * 60000).toISOString(),
        endTime: new Date(Date.now() - 35 * 60000).toISOString(),
        createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    },
    {
        id: 't4', busId: 'b4', routeId: 'r4', conductorId: 'u4',
        status: 'scheduled', passengerCount: 0,
        createdAt: new Date().toISOString(),
    },
];

// ── Mock Alerts ──────────────────────────────────────────────────────────────
export const MOCK_ALERTS: Alert[] = [
    {
        id: 'a1', severity: 'critical',
        title: 'Bus Breakdown',
        message: 'Bus TN-01-AB-1234 reported a breakdown near Guindy. Conductor notified.',
        busId: 'b1', routeId: 'r1', read: false,
        createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
        id: 'a2', severity: 'warning',
        title: 'Heavy Traffic',
        message: 'Heavy traffic on Route 202 near T. Nagar. Expect 15 min delay.',
        routeId: 'r2', read: false,
        createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
    },
    {
        id: 'a3', severity: 'info',
        title: 'New Route Available',
        message: 'Route 505 (Porur → T. Nagar) launches tomorrow.',
        routeId: 'r5', read: true,
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
        id: 'a4', severity: 'success',
        title: 'All Systems Operational',
        message: 'All backend services and 4 buses are running normally.',
        read: true,
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    },
];

// ── Service helpers ──────────────────────────────────────────────────────────
/** Simulates API latency */
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
    getBuses: async (): Promise<Bus[]> => { await delay(200); return [...MOCK_BUSES]; },
    getRoutes: async (): Promise<Route[]> => { await delay(180); return [...MOCK_ROUTES]; },
    getTrips: async (): Promise<Trip[]> => { await delay(220); return [...MOCK_TRIPS]; },
    getAlerts: async (): Promise<Alert[]> => { await delay(150); return [...MOCK_ALERTS]; },
    getUsers: async (): Promise<User[]> => { await delay(200); return [...MOCK_USERS]; },
    getBusById: async (id: string): Promise<Bus | undefined> => {
        await delay(100);
        return MOCK_BUSES.find(b => b.id === id);
    },
};
