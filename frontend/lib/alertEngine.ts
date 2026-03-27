/**
 * Alert Engine — generates contextual alerts based on simulator state.
 * Reads bus/trip state, evaluates rules, pushes new alerts to busStore.
 */

import type { Bus, Alert, AlertSeverity } from './types';
import { eventBus } from './eventBus';
import { useBusStore } from '@/store/busStore';

// ── Alert rule thresholds ─────────────────────────────────────────────────────
const HIGH_PASSENGER_THRESHOLD = 0.9; // 90% capacity
const LOW_SPEED_THRESHOLD_KMH = 5;
const STOPPED_ALERT_INTERVAL = 90;  // seconds before "bus stopped" alert
const ALERT_COOLDOWN_MS = 60_000; // min gap between same-type alerts per bus

/** Last alert time per bus per alert-type key */
const lastAlertTime = new Map<string, number>();

function canAlert(key: string): boolean {
    const last = lastAlertTime.get(key) ?? 0;
    if (Date.now() - last < ALERT_COOLDOWN_MS) return false;
    lastAlertTime.set(key, Date.now());
    return true;
}

function makeAlert(
    title: string,
    message: string,
    severity: AlertSeverity,
    busId?: string
): Alert {
    const id = `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    return {
        id, title, message, severity,
        busId, read: false,
        createdAt: new Date().toISOString(),
    };
}

// ── Rule evaluators ───────────────────────────────────────────────────────────

function checkOvercrowding(bus: Bus): Alert | null {
    if (bus.capacity === 0) return null;
    const occupancy = bus.passengerCount / bus.capacity;
    if (occupancy < HIGH_PASSENGER_THRESHOLD) return null;
    const key = `overcrowd:${bus.id}`;
    if (!canAlert(key)) return null;
    return makeAlert(
        'Bus Near Full Capacity',
        `${bus.busNumber} is at ${Math.round(occupancy * 100)}% occupancy (${bus.passengerCount}/${bus.capacity} passengers).`,
        'warning', bus.id
    );
}

function checkStopped(bus: Bus, stoppedFor: number): Alert | null {
    if (bus.speed > LOW_SPEED_THRESHOLD_KMH) return null;
    if (stoppedFor < STOPPED_ALERT_INTERVAL) return null;
    const key = `stopped:${bus.id}`;
    if (!canAlert(key)) return null;
    return makeAlert(
        'Bus Stopped Unexpectedly',
        `${bus.busNumber} has been stationary for over ${Math.round(stoppedFor)}s on its route.`,
        'warning', bus.id
    );
}

// ── Stopped timer per bus ─────────────────────────────────────────────────────
const stoppedSince = new Map<string, number>(); // busId → timestamp

/** Main evaluation — call on every simulator tick */
export function evaluateAlerts(buses: Bus[]): void {
    const newAlerts: Alert[] = [];

    for (const bus of buses) {
        if (bus.status !== 'active') continue;

        // Track stopped time
        if (bus.speed < LOW_SPEED_THRESHOLD_KMH) {
            if (!stoppedSince.has(bus.id)) stoppedSince.set(bus.id, Date.now());
        } else {
            stoppedSince.delete(bus.id);
        }
        const stoppedFor = stoppedSince.has(bus.id)
            ? (Date.now() - stoppedSince.get(bus.id)!) / 1000
            : 0;

        const overcrowdAlert = checkOvercrowding(bus);
        if (overcrowdAlert) newAlerts.push(overcrowdAlert);

        const stoppedAlert = checkStopped(bus, stoppedFor);
        if (stoppedAlert) newAlerts.push(stoppedAlert);
    }

    if (newAlerts.length === 0) return;

    // Push to store
    const { alerts, hydrate, buses: storeBuses, routes } = useBusStore.getState();
    useBusStore.setState({ alerts: [...newAlerts, ...alerts].slice(0, 50) });

    // Emit events
    for (const alert of newAlerts) {
        eventBus.emit('alert:created', {
            id: alert.id,
            severity: alert.severity,
            title: alert.title,
            message: alert.message,
            busId: alert.busId,
        });
    }
}

/** Reset cooldowns (useful when reinitialising the simulator) */
export function resetAlertEngine(): void {
    lastAlertTime.clear();
    stoppedSince.clear();
}
