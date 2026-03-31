import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Bus, Route, Alert, GeoLocation } from '@/lib/types';
import { MOCK_BUSES, MOCK_ROUTES, MOCK_ALERTS } from '@/lib/mockService';

const HISTORY_MAX = 20;

interface BusState {
    /** All buses */
    buses: Bus[];
    /** All routes */
    routes: Route[];
    /** System alerts */
    alerts: Alert[];
    /** Currently selected bus ID (e.g. for info panel) */
    selectedBusId: string | null;
    /** Whether the simulator is running */
    simulatorActive: boolean;
    /** Data freshness timestamp */
    lastUpdated: string;

    // ── Actions ─────────────────────────────────────────────────────────────
    /** Seed with mock (or real API) data */
    hydrate: (buses: Bus[], routes: Route[], alerts: Alert[]) => void;
    /** Move a single bus to a new location */
    updateBusLocation: (id: string, location: GeoLocation) => void;
    /** Select a bus for detail view */
    selectBus: (id: string | null) => void;
    /** Mark an alert as read */
    markAlertRead: (id: string) => void;
    /** Mark all alerts as read */
    markAllAlertsRead: () => void;
    /** Add a new alert to the system */
    addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'read'>) => void;
    /** Update a bus status */
    updateBusStatus: (id: string, status: Bus['status']) => void;
    /** Assign a bus to a route and location (for dispatching rescue) */
    assignRoute: (id: string, routeId: string, location: GeoLocation) => void;
    /** Set simulator active flag */
    setSimulatorActive: (active: boolean) => void;
}

export const useBusStore = create<BusState>()(
    subscribeWithSelector((set) => ({
        buses: MOCK_BUSES,
        routes: MOCK_ROUTES,
        alerts: MOCK_ALERTS,
        selectedBusId: null,
        simulatorActive: false,
        lastUpdated: new Date().toISOString(),

        hydrate: (buses, routes, alerts) =>
            set({ buses, routes, alerts, lastUpdated: new Date().toISOString() }),

        updateBusLocation: (id, location) =>
            set(state => ({
                buses: state.buses.map(b => {
                    if (b.id !== id) return b;
                    const history = [b.currentLocation, ...b.locationHistory].slice(0, HISTORY_MAX);
                    return {
                        ...b,
                        currentLocation: location,
                        locationHistory: history,
                        lastUpdated: new Date().toISOString(),
                    };
                }),
                lastUpdated: new Date().toISOString(),
            })),

        selectBus: (id) => set({ selectedBusId: id }),

        markAlertRead: (id) =>
            set(state => ({
                alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a),
            })),

        markAllAlertsRead: () =>
            set(state => ({
                alerts: state.alerts.map(a => ({ ...a, read: true })),
            })),

        addAlert: (alertInput) =>
            set(state => {
                const newAlert: Alert = {
                    ...alertInput,
                    id: `alert-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    read: false,
                };
                return { alerts: [newAlert, ...state.alerts] };
            }),

        updateBusStatus: (id, status) =>
            set(state => ({
                buses: state.buses.map(b => b.id === id ? { ...b, status } : b),
            })),

        assignRoute: (id, routeId, location) =>
            set(state => ({
                buses: state.buses.map(b => b.id === id ? { 
                    ...b, 
                    status: 'active', 
                    routeId, 
                    currentLocation: location,
                    locationHistory: [location] 
                } : b),
            })),

        setSimulatorActive: (active) => set({ simulatorActive: active }),
    }))
);

// ── Derived selectors ────────────────────────────────────────────────────────

/** Get bus by id */
export const selectBusById = (id: string) => (s: BusState) =>
    s.buses.find(b => b.id === id);

/** Map markers from active buses */
const markerCache = new Map<string, Array<{ id: string; lat: number; lng: number; label: string }>>();

export const selectBusMarkers = (s: BusState) => {
    const activeBuses = s.buses.filter(b => b.status === 'active');
    const key = activeBuses.map(b => b.id + b.currentLocation.lat + b.currentLocation.lng).join("-");

    if (markerCache.has(key)) return markerCache.get(key)!;

    const markers = activeBuses.map(b => ({
        id: b.id,
        lat: b.currentLocation.lat,
        lng: b.currentLocation.lng,
        label: b.busNumber,
    }));

    markerCache.set(key, markers);
    return markers;
};
