/**
 * Analytics Engine — computes dashboard metrics from Zustand store state.
 * All functions are pure (given the store snapshot) and synchronous.
 */

import type { Bus, Trip, Alert } from './types';
import { eventBus } from './eventBus';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface AnalyticsSnapshot {
    /** Buses with status === 'active' */
    activeBuses: number;
    /** Buses with status === 'maintenance' */
    maintenanceBuses: number;
    /** Total fleet size */
    totalBuses: number;
    /** Fleet utilisation (active / total) */
    utilisation: number;
    /** Alerts created today (since midnight) */
    alertsToday: number;
    /** Unread alert count */
    unreadAlerts: number;
    /** Average passengers across active buses */
    avgPassengers: number;
    /** Total passengers across all active buses */
    totalPassengers: number;
    /** Peak passenger count recorded on a single bus */
    peakPassengers: number;
    /** Active trips count */
    activeTrips: number;
    /** Completed trips today */
    completedToday: number;
    /** Snapshot timestamp */
    generatedAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const todayStart = (): Date => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

// ── Computation ───────────────────────────────────────────────────────────────

export function computeAnalytics(
    buses: Bus[],
    trips: Trip[],
    alerts: Alert[]
): AnalyticsSnapshot {
    const activeBuses = buses.filter(b => b.status === 'active');
    const maintenance = buses.filter(b => b.status === 'maintenance');
    const today = todayStart();

    const totalPassengers = activeBuses.reduce((s, b) => s + b.passengerCount, 0);
    const avgPassengers = activeBuses.length
        ? Math.round(totalPassengers / activeBuses.length)
        : 0;
    const peakPassengers = activeBuses.length
        ? Math.max(...activeBuses.map(b => b.passengerCount))
        : 0;

    const alertsToday = alerts.filter(a => new Date(a.createdAt) >= today).length;
    const unreadAlerts = alerts.filter(a => !a.read).length;

    const activeTrips = trips.filter(t => t.status === 'active').length;
    const completedToday = trips.filter(
        t => t.status === 'completed' && t.endTime && new Date(t.endTime) >= today
    ).length;

    const utilisation = buses.length
        ? Math.round((activeBuses.length / buses.length) * 100)
        : 0;

    const snapshot: AnalyticsSnapshot = {
        activeBuses: activeBuses.length,
        maintenanceBuses: maintenance.length,
        totalBuses: buses.length,
        utilisation,
        alertsToday,
        unreadAlerts,
        avgPassengers,
        totalPassengers,
        peakPassengers,
        activeTrips,
        completedToday,
        generatedAt: new Date().toISOString(),
    };

    return snapshot;
}

// ── Trend helpers ─────────────────────────────────────────────────────────────

/** Fleet utilisation as a formatted percent string */
export function utilisationLabel(snapshot: AnalyticsSnapshot): string {
    return `${snapshot.utilisation}%`;
}

/** Passenger load severity for a single bus */
export function passengerSeverity(
    count: number,
    capacity: number
): 'low' | 'medium' | 'high' | 'full' {
    if (capacity === 0) return 'low';
    const r = count / capacity;
    if (r < 0.5) return 'low';
    if (r < 0.75) return 'medium';
    if (r < 0.9) return 'high';
    return 'full';
}
