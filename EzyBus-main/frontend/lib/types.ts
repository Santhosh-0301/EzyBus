// ─── EzyBus Shared TypeScript Types ─────────────────────────────────────────

export type UserRole = 'commuter' | 'conductor' | 'admin';
export type BusStatus = 'active' | 'inactive' | 'maintenance';
export type TripStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';

// ── GeoLocation ──────────────────────────────────────────────────────────────
export interface GeoLocation {
    lat: number;
    lng: number;
}

// ── User ─────────────────────────────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}

// ── Bus ──────────────────────────────────────────────────────────────────────
export interface Bus {
    id: string;
    busNumber: string;
    capacity: number;
    status: BusStatus;
    currentLocation: GeoLocation;
    /** previous positions for trail rendering */
    locationHistory: GeoLocation[];
    conductorId?: string;
    routeId?: string;
    speed: number;          // km/h
    passengerCount: number;
    lastUpdated: string;    // ISO timestamp
}

// ── Route ─────────────────────────────────────────────────────────────────────
export interface RouteStop {
    name: string;
    location: GeoLocation;
    estimatedArrival?: string;
}

export interface Route {
    id: string;
    name: string;
    origin: string;
    destination: string;
    stops: RouteStop[];
    path?: GeoLocation[];
    estimatedDuration: number;  // minutes
    distance: number;           // km
    active: boolean;
    color: string;              // hex, for map polyline
}

// ── Trip ─────────────────────────────────────────────────────────────────────
export interface Trip {
    id: string;
    busId: string;
    routeId: string;
    conductorId: string;
    status: TripStatus;
    passengerCount: number;
    startTime?: string;
    endTime?: string;
    currentLocation?: GeoLocation;
    createdAt: string;
}

// ── Alert ─────────────────────────────────────────────────────────────────────
export interface Alert {
    id: string;
    severity: AlertSeverity;
    title: string;
    message: string;
    busId?: string;
    routeId?: string;
    tripId?: string;
    read: boolean;
    createdAt: string;
}
