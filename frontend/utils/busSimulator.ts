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
    heading: number;
    turnRate: number;
    turnTimer: number;
    lastStopIndex: number;   // stop index last visited (to detect arrivals)
}

let intervalId: ReturnType<typeof setInterval> | null = null;
const simStates = new Map<string, SimState>();

const initSimState = (): SimState => ({
    heading: Math.random() * 360,
    turnRate: (Math.random() - 0.5) * 30,
    turnTimer: Math.floor(Math.random() * 5) + 3,
    lastStopIndex: -1,
});

const drift = (loc: GeoLocation, heading: number): GeoLocation => {
    const r = (heading * Math.PI) / 180;
    const noise = (Math.random() - 0.5) * SPEED_DEG * 0.3;
    return {
        lat: Math.min(13.15, Math.max(13.00, loc.lat + Math.cos(r) * SPEED_DEG + noise)),
        lng: Math.min(80.35, Math.max(80.18, loc.lng + Math.sin(r) * SPEED_DEG + noise)),
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

        if (!simStates.has(bus.id)) simStates.set(bus.id, initSimState());
        const state = simStates.get(bus.id)!;

        // ── 1. Move bus ──────────────────────────────────────────────────────────
        state.turnTimer -= 1;
        if (state.turnTimer <= 0) {
            state.heading += (Math.random() - 0.5) * 90 + state.turnRate;
            state.heading = ((state.heading % 360) + 360) % 360;
            state.turnRate = (Math.random() - 0.5) * 30;
            state.turnTimer = Math.floor(Math.random() * 8) + 4;
        }
        const newLocation = drift(bus.currentLocation, state.heading);

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
        if (bus.routeId) {
            const route = routeMap.get(bus.routeId);
            if (route) {
                const nearest = nearestStop(newLocation, route);
                if (nearest.distanceKm <= ARRIVAL_RADIUS_KM && nearest.index !== state.lastStopIndex) {
                    state.lastStopIndex = nearest.index;
                    eventBus.emit('bus:arrived', {
                        busId: bus.id,
                        routeId: bus.routeId,
                        stopName: nearest.stop.name,
                        stopIndex: nearest.index,
                    });
                }
            }
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
    const { buses } = useBusStore.getState();
    buses.filter(b => b.status === 'active').forEach(b => simStates.set(b.id, initSimState()));

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
