/**
 * Route Engine — pure functions for geospatial route calculations.
 * No side effects. All distances in kilometres.
 */

import type { GeoLocation, Route, RouteStop } from './types';

// ── Haversine distance ────────────────────────────────────────────────────────
const RAD = Math.PI / 180;

export function haversineKm(a: GeoLocation, b: GeoLocation): number {
    const dLat = (b.lat - a.lat) * RAD;
    const dLng = (b.lng - a.lng) * RAD;
    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);
    const c =
        sinDLat * sinDLat +
        Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * sinDLng * sinDLng;
    return 6371 * 2 * Math.asin(Math.sqrt(c));
}

// ── Stop proximity ────────────────────────────────────────────────────────────
/** Radius in km within which a bus is considered "at" a stop */
export const ARRIVAL_RADIUS_KM = 0.15;

export interface NearestStopResult {
    stop: RouteStop;
    index: number;
    distanceKm: number;
}

/** Returns the stop closest to the bus location */
export function nearestStop(
    busLocation: GeoLocation,
    route: Route
): NearestStopResult {
    let nearest = { stop: route.stops[0], index: 0, distanceKm: Infinity };
    for (let i = 0; i < route.stops.length; i++) {
        const d = haversineKm(busLocation, route.stops[i].location);
        if (d < nearest.distanceKm) nearest = { stop: route.stops[i], index: i, distanceKm: d };
    }
    return nearest;
}

/** Returns the next stop after the given index (null if last stop) */
export function nextStop(route: Route, currentIndex: number): RouteStop | null {
    return currentIndex < route.stops.length - 1
        ? route.stops[currentIndex + 1]
        : null;
}

/** Returns the stop a bus is approaching (first stop it hasn't yet reached) */
export function approachingStop(
    busLocation: GeoLocation,
    route: Route
): NearestStopResult | null {
    // Find all stops ahead (farther than arrival radius)
    const candidates = route.stops
        .map((stop, index) => ({ stop, index, distanceKm: haversineKm(busLocation, stop.location) }))
        .filter(s => s.distanceKm > ARRIVAL_RADIUS_KM)
        .sort((a, b) => a.distanceKm - b.distanceKm);
    return candidates[0] ?? null;
}

/** Ordered list of stops with distances from bus */
export function stopsWithDistances(busLocation: GeoLocation, route: Route) {
    return route.stops.map((stop, index) => ({
        stop,
        index,
        distanceKm: Math.round(haversineKm(busLocation, stop.location) * 100) / 100,
    }));
}

/** Rough route progress (0–1) based on distance from start vs total length */
export function routeProgress(busLocation: GeoLocation, route: Route): number {
    if (route.stops.length < 2) return 0;
    const start = route.stops[0].location;
    const end = route.stops[route.stops.length - 1].location;
    const total = haversineKm(start, end);
    const done = haversineKm(start, busLocation);
    return Math.min(1, Math.max(0, done / total));
}
