/**
 * Bus position simulator — extended with intelligence layer.
 * Every tick:
 *   1. Moves buses along smooth heading-based paths
 *   2. Emits bus:moved events
 *   3. Calculates ETAs for all active buses
 *   4. Evaluates alert rules
 *   5. Updates passenger counts with realistic fluctuation
 *   6. Emits analytics:snapshot via analyticsEngine
 */

import { useBusStore } from '@/store/busStore';
import { useTripStore } from '@/store/tripStore';
import type { GeoLocation } from '@/lib/types';
import { eventBus } from '@/lib/eventBus';
import { evaluateAlerts, resetAlertEngine } from '@/lib/alertEngine';
import { calculateAllETAs } from '@/lib/etaEngine';
import { computeAnalytics } from '@/lib/analyticsEngine';
import { ARRIVAL_RADIUS_KM, nearestStop } from '@/lib/routeEngine';

// ── Constants ────────────────────────────────────────────────────────────────
const TICK_MS = 3000;
const SPEED_DEG = 0.0008;   // ~88 m per tick
const HISTORY_MAX = 20;

// ── Per-bus simulator state ──────────────────────────────────────────────────
interface SimState {
    targetStopIndex: number;
    direction: number; // 1 for forward, -1 for backward
    lastStopIndex: number;   // stop index last visited (to detect arrivals)
}

let intervalId: ReturnType<typeof setInterval> | null = null;
const simStates = new Map<string, SimState>();

const initSimState = (busLocation?: GeoLocation, waypoints?: GeoLocation[]): SimState => {
    if (!busLocation || !waypoints || waypoints.length < 2) {
        return { targetStopIndex: 1, direction: 1, lastStopIndex: -1 };
    }
    // Find the closest waypoint to the bus's current location
    let closestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < waypoints.length; i++) {
        const d = Math.pow(waypoints[i].lat - busLocation.lat, 2) + Math.pow(waypoints[i].lng - busLocation.lng, 2);
        if (d < minDist) { minDist = d; closestIdx = i; }
    }
    let targetStopIndex = closestIdx + 1;
    let direction = 1;
    if (targetStopIndex >= waypoints.length) {
        targetStopIndex = waypoints.length - 2;
        direction = -1;
    }
    return { targetStopIndex, direction, lastStopIndex: closestIdx };
};

const moveTowards = (loc: GeoLocation, target: GeoLocation, speedDeg: number): { newLoc: GeoLocation, reached: boolean } => {
    const dLat = target.lat - loc.lat;
    const dLng = target.lng - loc.lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist <= speedDeg) {
        return { newLoc: target, reached: true };
    }
    const ratio = speedDeg / dist;
    return {
        newLoc: { lat: loc.lat + dLat * ratio, lng: loc.lng + dLng * ratio },
        reached: false
    };
};

/** Realistic passenger count fluctuation: +/- 0–3 per tick near stops */
const fluctuatePassengers = (count: number, capacity: number): number => {
    const delta = Math.floor((Math.random() - 0.4) * 4); // slight upward bias
    return Math.min(capacity, Math.max(0, count + delta));
};

// ── Main tick handler ────────────────────────────────────────────────────────
function tick() {
    const { buses, routes, updateBusLocation } = useBusStore.getState();
    const { trips } = useTripStore.getState();

    // Build route lookup
    const routeMap = new Map(routes.map(r => [r.id, r]));

    const updatedBuses = [...buses];

    for (let i = 0; i < updatedBuses.length; i++) {
        const bus = updatedBuses[i];
        if (bus.status !== 'active') continue;

        const route = bus.routeId ? routeMap.get(bus.routeId) : undefined;
        const waypoints: GeoLocation[] = route
            ? (route.path && route.path.length > 0 ? route.path : route.stops.map(s => s.location))
            : [];

        // Initialise sim state the first time we see this bus, snapping to its nearest waypoint
        if (!simStates.has(bus.id)) {
            simStates.set(bus.id, initSimState(bus.currentLocation, waypoints));
        }
        const state = simStates.get(bus.id)!;

        // ── 1. Move bus along route ──────────────────────────────────────────────
        let newLocation = bus.currentLocation;
        let arrivedNow = false;
        let arrivedStopName = '';
        let arrivedStopIndex = -1;

        if (route) {
            // waypoints already resolved above; use them to drive the bus
            
            if (waypoints.length > 1) {
                // Determine next target waypoint
                if (state.targetStopIndex >= waypoints.length) {
                    state.targetStopIndex = waypoints.length - 2;
                    if (state.targetStopIndex < 0) state.targetStopIndex = 0;
                    state.direction = -1;
                }
                let targetLoc = waypoints[state.targetStopIndex];
                
                const moveResult = moveTowards(bus.currentLocation, targetLoc, SPEED_DEG * 1.5);
                newLocation = moveResult.newLoc;
                
                if (moveResult.reached) {
                    // Reached the current waypoint
                    state.lastStopIndex = state.targetStopIndex;
                    
                    // Check if this waypoint corresponds to a real stop to emit arrival
                    const isActualStop = route.stops.find(s => 
                        Math.abs(s.location.lat - targetLoc.lat) < 0.0001 && Math.abs(s.location.lng - targetLoc.lng) < 0.0001
                    );
                    if (isActualStop) {
                        arrivedNow = true;
                        arrivedStopName = isActualStop.name;
                        arrivedStopIndex = route.stops.indexOf(isActualStop);
                    }
                    
                    // Point to the next waypoint
                    state.targetStopIndex += state.direction;
                    
                    // Reverse if hit ends
                    if (state.targetStopIndex >= waypoints.length) {
                        state.targetStopIndex = waypoints.length - 2;
                        if (state.targetStopIndex < 0) state.targetStopIndex = 0;
                        state.direction = -1;
                    } else if (state.targetStopIndex < 0) {
                        state.targetStopIndex = 1;
                        if (state.targetStopIndex >= waypoints.length) state.targetStopIndex = 0;
                        state.direction = 1;
                    }
                }
            }
        }

        // ── 2. Update location in store ──────────────────────────────────────────
        updateBusLocation(bus.id, newLocation);

        // Update local copy for downstream calculations this tick
        const history = [bus.currentLocation, ...bus.locationHistory].slice(0, HISTORY_MAX);
        updatedBuses[i] = { ...bus, currentLocation: newLocation, locationHistory: history };

        // ── 3. Emit bus:moved ────────────────────────────────────────────────────
        eventBus.emit('bus:moved', {
            busId: bus.id, lat: newLocation.lat, lng: newLocation.lng, speed: bus.speed,
        });

        // ── 4. Check stop arrival ────────────────────────────────────────────────
        if (arrivedNow && bus.routeId) {
            eventBus.emit('bus:arrived', {
                busId: bus.id,
                routeId: bus.routeId,
                stopName: arrivedStopName,
                stopIndex: arrivedStopIndex,
            });
        }

        // ── 5. Fluctuate passenger count ─────────────────────────────────────────
        const newCount = fluctuatePassengers(bus.passengerCount, bus.capacity);
        if (newCount !== bus.passengerCount) {
            updatedBuses[i] = { ...updatedBuses[i], passengerCount: newCount };
            useBusStore.setState(state => ({
                buses: state.buses.map(b => b.id === bus.id ? { ...b, passengerCount: newCount } : b),
            }));
            eventBus.emit('bus:passengers', { busId: bus.id, count: newCount, delta: newCount - bus.passengerCount });
        }
    }

    // ── 6. ETAs for all active buses ──────────────────────────────────────────
    calculateAllETAs(updatedBuses, routeMap);

    // ── 7. Alert evaluation ──────────────────────────────────────────────────
    evaluateAlerts(updatedBuses);

    // ── 8. Analytics snapshot ────────────────────────────────────────────────
    const { alerts } = useBusStore.getState();
    const snapshot = computeAnalytics(updatedBuses, trips, alerts);

    eventBus.emit('analytics:snapshot', {
        activeBuses: snapshot.activeBuses,
        alertsToday: snapshot.alertsToday,
        avgPassengers: snapshot.avgPassengers,
        totalPassengers: snapshot.totalPassengers,
    });
}

// ── Public API ───────────────────────────────────────────────────────────────

export function startBusSimulator(): () => void {
    if (intervalId !== null) return () => stopBusSimulator();

    // Init sim state for all active buses
    const { buses, routes } = useBusStore.getState();
    const routeMap = new Map(routes.map(r => [r.id, r]));
    buses.filter(b => b.status === 'active').forEach(b => {
        const route = b.routeId ? routeMap.get(b.routeId) : undefined;
        const waypoints: GeoLocation[] = route
            ? (route.path && route.path.length > 0 ? route.path : route.stops.map(s => s.location))
            : [];
        simStates.set(b.id, initSimState(b.currentLocation, waypoints));
    });

    useBusStore.getState().setSimulatorActive(true);
    intervalId = setInterval(tick, TICK_MS);

    return () => stopBusSimulator();
}

export function stopBusSimulator() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        simStates.clear();
        resetAlertEngine();
        useBusStore.getState().setSimulatorActive(false);
    }
}
