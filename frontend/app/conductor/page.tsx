'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import MapView from '@/components/MapView';

interface Trip {
    id: string;
    busId: string;
    routeId: string;
    status: string;
    passengerCount: number;
    startTime: string;
}

const STATUS_COLORS: Record<string, string> = {
    scheduled: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    completed: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function ConductorDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [tripsLoading, setTripsLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) router.push('/login');
        if (!loading && user && user.role === 'commuter') router.push('/commuter');
    }, [user, loading, router]);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await api.get('/trips');
                setTrips(res.data.trips || []);
            } catch {
                // Placeholder data when API isn't connected
                setTrips([
                    { id: 'trip-1', busId: 'B001', routeId: 'R101', status: 'active', passengerCount: 23, startTime: new Date().toISOString() },
                    { id: 'trip-2', busId: 'B004', routeId: 'R202', status: 'scheduled', passengerCount: 0, startTime: new Date(Date.now() + 3600000).toISOString() },
                ]);
            } finally {
                setTripsLoading(false);
            }
        };
        if (user) fetchTrips();
    }, [user]);

    const updateStatus = async (tripId: string, newStatus: string) => {
        setUpdating(tripId);
        try {
            await api.put(`/trips/${tripId}/status`, { status: newStatus });
            setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: newStatus } : t));
        } catch {
            alert('Failed to update trip status. Check if backend is running.');
        } finally {
            setUpdating(null);
        }
    };

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="text-slate-400 animate-pulse">Loading…</div></div>;

    const activeTrip = trips.find(t => t.status === 'active');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center text-xl">👨‍✈️</div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Conductor Panel</h1>
                    <p className="text-slate-400 text-sm">Welcome, {user.name}</p>
                </div>
            </div>

            {/* Active Trip Banner */}
            {activeTrip ? (
                <div className="glass-card p-6 border border-emerald-500/30 bg-emerald-500/5 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-emerald-400 text-sm font-semibold">ACTIVE TRIP</span>
                            </div>
                            <h2 className="text-white font-bold text-lg">Bus {activeTrip.busId} · Route {activeTrip.routeId}</h2>
                            <p className="text-slate-400 text-sm">{activeTrip.passengerCount} passengers aboard</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => updateStatus(activeTrip.id, 'completed')}
                                disabled={updating === activeTrip.id}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {updating === activeTrip.id ? 'Updating…' : '✓ Complete Trip'}
                            </button>
                            <button
                                onClick={() => updateStatus(activeTrip.id, 'cancelled')}
                                disabled={updating === activeTrip.id}
                                className="bg-red-600/80 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-card p-6 border border-slate-700/50 mb-6 text-center">
                    <div className="text-4xl mb-2">🚌</div>
                    <p className="text-slate-300 font-medium">No Active Trip</p>
                    <p className="text-slate-500 text-sm">You have no active trips right now.</p>
                </div>
            )}

            {/* Map */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-3">Your Location</h2>
                <MapView height="260px" markers={activeTrip ? [{ lat: 20.59, lng: 78.97, label: `Bus ${activeTrip.busId}` }] : []} />
            </div>

            {/* All Trips */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">My Trips</h2>
                {tripsLoading ? <div className="text-slate-400 text-center py-8">Loading trips…</div> : (
                    <div className="space-y-3">
                        {trips.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">No trips assigned.</p>
                        ) : (
                            trips.map(t => (
                                <div key={t.id} className="glass-card p-5 border border-slate-700/50 flex items-center justify-between flex-wrap gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-white font-medium text-sm">Bus {t.busId}</span>
                                            <span className="text-slate-600">·</span>
                                            <span className="text-slate-400 text-sm">Route {t.routeId}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase ${STATUS_COLORS[t.status] || STATUS_COLORS.scheduled}`}>{t.status}</span>
                                            <span className="text-slate-500 text-xs">{t.passengerCount} passengers</span>
                                        </div>
                                    </div>
                                    {t.status === 'scheduled' && (
                                        <button
                                            onClick={() => updateStatus(t.id, 'active')}
                                            disabled={!!activeTrip || updating === t.id}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
                                        >
                                            {updating === t.id ? 'Starting…' : '▶ Start Trip'}
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
