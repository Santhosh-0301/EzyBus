import api from './api';

// ── Bus endpoints ────────────────────────────────────────────────────────────

/** Fetch all registered buses */
export async function getBuses() {
    const res = await api.get('/buses');
    return res.data.buses as Array<{
        id: string;
        busNumber: string;
        capacity: number;
        status: string;
        currentLocation?: { lat: number; lng: number };
    }>;
}

// ── Trip endpoints ───────────────────────────────────────────────────────────

/**
 * Start a trip.
 * Calls POST http://localhost:5000/api/v1/trips
 */
export async function startTrip(payload: {
    busId: string;
    routeId: string;
    conductorId: string;
    startTime?: string;
}) {
    const res = await api.post('/trips', payload);
    return res.data.trip;
}

/**
 * End (complete) a trip.
 * Calls PUT http://localhost:5000/api/v1/trips/:id/status  { status: 'completed' }
 */
export async function endTrip(tripId: string) {
    const res = await api.put(`/trips/${tripId}/status`, { status: 'completed' });
    return res.data.trip;
}

// ── Location endpoint ────────────────────────────────────────────────────────

/**
 * Send conductor / bus location update.
 * Calls PUT http://localhost:5000/api/v1/trips/:id/status with currentLocation
 */
export async function updateLocation(
    tripId: string,
    location: { lat: number; lng: number }
) {
    const res = await api.put(`/trips/${tripId}/status`, {
        status: 'active',
        currentLocation: location,
    });
    return res.data.trip;
}

// ── Route endpoints ──────────────────────────────────────────────────────────

export async function getRoutes() {
    const res = await api.get('/routes');
    return res.data.routes;
}

// ── User endpoints ───────────────────────────────────────────────────────────

export async function getUsers() {
    const res = await api.get('/users');
    return res.data.users;
}
