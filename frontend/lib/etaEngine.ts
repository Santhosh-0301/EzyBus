/**
 * ETA Engine — calculates arrival time estimates for buses to upcoming stops.
 * Uses speed (km/h) and Haversine distances.
 */

import type { Bus, Route } from './types';
import { haversineKm, approachingStop } from './routeEngine';
import { eventBus } from './eventBus';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ETAResult {
    busId: string;
    busNumber: string;
    nextStop: string;
    distanceKm: number;
    /** Speed in km/h used for this calculation */
    speedKmh: number;
    /** Estimated minutes to arrival (null if speed = 0 or no next stop) */
    etaMinutes: number | null;
    /** Human-readable string, e.g. "~4 min" */
    etaLabel: string;
    calculatedAt: string;
}

// ── Calculation ───────────────────────────────────────────────────────────────
const MIN_SPEED_KMH = 5;   // below this we treat bus as stopped
const TRAFFIC_FACTOR = 1.3; // multiply travel time to simulate real-world slowdown

/**
 * Calculate ETA for a single bus to its next approaching stop.
 * Emits 'bus:eta' on the eventBus.
 */
export function calculateETA(bus: Bus, route: Route): ETAResult {
    const approaching = approachingStop(bus.currentLocation, route);

    if (!approaching) {
        const result: ETAResult = {
            busId: bus.id, busNumber: bus.busNumber,
            nextStop: 'End of route', distanceKm: 0,
            speedKmh: bus.speed, etaMinutes: null, etaLabel: 'At terminus',
            calculatedAt: new Date().toISOString(),
        };
        return result;
    }

    const distanceKm = haversineKm(bus.currentLocation, approaching.stop.location);
    const effectiveSpeed = Math.max(bus.speed, MIN_SPEED_KMH);
    const rawMinutes = (distanceKm / effectiveSpeed) * 60 * TRAFFIC_FACTOR;
    const etaMinutes = Math.round(rawMinutes);
    const etaLabel = bus.speed < MIN_SPEED_KMH ? 'Stopped' : `~${etaMinutes} min`;

    const result: ETAResult = {
        busId: bus.id,
        busNumber: bus.busNumber,
        nextStop: approaching.stop.name,
        distanceKm: Math.round(distanceKm * 100) / 100,
        speedKmh: bus.speed,
        etaMinutes,
        etaLabel,
        calculatedAt: new Date().toISOString(),
    };

    // Emit to event bus so dashboards can react
    eventBus.emit('bus:eta', {
        busId: bus.id,
        nextStop: approaching.stop.name,
        etaMinutes,
    });

    return result;
}

/**
 * Calculate ETAs for all active buses.
 * Call this on every simulator tick.
 */
export function calculateAllETAs(
    buses: Bus[],
    routeMap: Map<string, Route>
): ETAResult[] {
    return buses
        .filter(b => b.status === 'active' && b.routeId)
        .map(b => {
            const route = routeMap.get(b.routeId!);
            if (!route) return null;
            return calculateETA(b, route);
        })
        .filter((x): x is ETAResult => x !== null);
}
