'use client';

import { useState, useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { calculateAllETAs, type ETAResult } from '@/lib/etaEngine';
import { useBusStore } from '@/store/busStore';

/**
 * Hook that returns live ETA results for all active buses.
 * Updates on each bus:eta event (i.e., every 3s simulator tick).
 */
export function useETAs(): ETAResult[] {
    const [etas, setEtas] = useState<ETAResult[]>([]);

    useEffect(() => {
        // Initial computation
        const { buses, routes } = useBusStore.getState();
        const routeMap = new Map(routes.map(r => [r.id, r]));
        setEtas(calculateAllETAs(buses, routeMap));

        // Update on every bus:eta event (one per bus per tick)
        const updates = new Map<string, ETAResult>();
        const unsub = eventBus.on('bus:eta', ({ busId, nextStop, etaMinutes }) => {
            const { buses: b } = useBusStore.getState();
            const bus = b.find(x => x.id === busId);
            if (bus) {
                updates.set(busId, {
                    busId, busNumber: bus.busNumber,
                    nextStop, distanceKm: 0, speedKmh: bus.speed,
                    etaMinutes, etaLabel: `~${etaMinutes} min`,
                    calculatedAt: new Date().toISOString(),
                });
                setEtas(Array.from(updates.values()));
            }
        });
        return unsub;
    }, []);

    return etas;
}
