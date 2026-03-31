'use client';

import { useState, useEffect } from 'react';
import { useBusStore } from '@/store/busStore';
import { useTripStore } from '@/store/tripStore';
import { computeAnalytics, type AnalyticsSnapshot } from '@/lib/analyticsEngine';
import { eventBus } from '@/lib/eventBus';

const DEFAULT_SNAPSHOT: AnalyticsSnapshot = {
    activeBuses: 0, maintenanceBuses: 0, totalBuses: 0, utilisation: 0,
    alertsToday: 0, unreadAlerts: 0, avgPassengers: 0, totalPassengers: 0,
    peakPassengers: 0, activeTrips: 0, completedToday: 0,
    generatedAt: new Date().toISOString(),
};

/**
 * Hook that returns a live-updating AnalyticsSnapshot.
 * Re-computes on every analytics:snapshot event emitted by the simulator.
 */
export function useAnalytics(): AnalyticsSnapshot {
    const buses = useBusStore(s => s.buses);
    const alerts = useBusStore(s => s.alerts);
    const trips = useTripStore(s => s.trips);

    const [snapshot, setSnapshot] = useState<AnalyticsSnapshot>(() =>
        computeAnalytics(buses, trips, alerts)
    );

    // Recompute whenever the simulator emits a snapshot event
    useEffect(() => {
        const unsub = eventBus.on('analytics:snapshot', () => {
            const current = useBusStore.getState();
            const currentTrips = useTripStore.getState().trips;
            setSnapshot(computeAnalytics(current.buses, currentTrips, current.alerts));
        });
        return unsub;
    }, []);

    return snapshot;
}
