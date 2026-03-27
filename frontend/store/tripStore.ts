import { create } from 'zustand';
import type { Trip, TripStatus } from '@/lib/types';
import { MOCK_TRIPS } from '@/lib/mockService';

interface TripState {
    trips: Trip[];
    activeTrip: Trip | null;

    // ── Actions ─────────────────────────────────────────────────────────────
    hydrate: (trips: Trip[]) => void;
    setActiveTrip: (trip: Trip | null) => void;
    updateTripStatus: (id: string, status: TripStatus) => void;
    updatePassengerCount: (id: string, count: number) => void;
    addTrip: (trip: Trip) => void;
}

export const useTripStore = create<TripState>()((set) => ({
    trips: MOCK_TRIPS,
    activeTrip: MOCK_TRIPS.find(t => t.status === 'active') ?? null,

    hydrate: (trips) =>
        set({ trips, activeTrip: trips.find(t => t.status === 'active') ?? null }),

    setActiveTrip: (trip) => set({ activeTrip: trip }),

    updateTripStatus: (id, status) =>
        set(state => {
            const updated = state.trips.map(t =>
                t.id === id
                    ? { ...t, status, ...(status === 'completed' ? { endTime: new Date().toISOString() } : {}) }
                    : t
            );
            return {
                trips: updated,
                activeTrip: state.activeTrip?.id === id
                    ? (status === 'active' ? { ...state.activeTrip!, status } : null)
                    : state.activeTrip,
            };
        }),

    updatePassengerCount: (id, count) =>
        set(state => ({
            trips: state.trips.map(t => t.id === id ? { ...t, passengerCount: count } : t),
            activeTrip: state.activeTrip?.id === id
                ? { ...state.activeTrip!, passengerCount: count }
                : state.activeTrip,
        })),

    addTrip: (trip) =>
        set(state => ({ trips: [trip, ...state.trips] })),
}));

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectTripsByStatus = (status: TripStatus) => (s: TripState) =>
    s.trips.filter(t => t.status === status);

export const selectTripsByConductor = (conductorId: string) => (s: TripState) =>
    s.trips.filter(t => t.conductorId === conductorId);
