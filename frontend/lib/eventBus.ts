/**
 * EventBus — lightweight typed pub/sub system.
 * Decouples engines from each other and from components.
 * No external dependencies required.
 */

// ── Event Catalogue ──────────────────────────────────────────────────────────
export interface EzyBusEvents {
    /** Bus moved to a new GPS position */
    'bus:moved': { busId: string; lat: number; lng: number; speed: number };
    /** Bus arrived at or near a stop (within ARRIVAL_RADIUS_KM) */
    'bus:arrived': { busId: string; routeId: string; stopName: string; stopIndex: number };
    /** Bus departed from a stop */
    'bus:departed': { busId: string; stopName: string };
    /** Passenger count changed */
    'bus:passengers': { busId: string; count: number; delta: number };
    /** ETA calculated for a bus to its next stop */
    'bus:eta': { busId: string; nextStop: string; etaMinutes: number };
    /** Alert generated */
    'alert:created': { id: string; severity: string; title: string; message: string; busId?: string };
    /** Alert dismissed */
    'alert:dismissed': { id: string };
    /** Analytics snapshot ready */
    'analytics:snapshot': { activeBuses: number; alertsToday: number; avgPassengers: number; totalPassengers: number };
}

type EventKey = keyof EzyBusEvents;
type Listener<K extends EventKey> = (payload: EzyBusEvents[K]) => void;

// ── EventBus implementation ──────────────────────────────────────────────────
class EventBus {
    private listeners = new Map<EventKey, Set<Listener<EventKey>>>();

    on<K extends EventKey>(event: K, listener: Listener<K>): () => void {
        if (!this.listeners.has(event)) this.listeners.set(event, new Set());
        this.listeners.get(event)!.add(listener as Listener<EventKey>);
        // Return unsubscribe function
        return () => this.off(event, listener);
    }

    off<K extends EventKey>(event: K, listener: Listener<K>) {
        this.listeners.get(event)?.delete(listener as Listener<EventKey>);
    }

    emit<K extends EventKey>(event: K, payload: EzyBusEvents[K]) {
        this.listeners.get(event)?.forEach(l => {
            try { l(payload); }
            catch (err) { console.error(`[EventBus] Error in ${event} handler:`, err); }
        });
    }

    /** Remove all listeners (useful in tests or cleanup) */
    clear() { this.listeners.clear(); }
}

/** Singleton event bus — import this everywhere */
export const eventBus = new EventBus();
