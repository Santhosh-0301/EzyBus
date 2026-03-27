'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MapView from '@/components/MapView';
import api from '@/lib/api';

interface Route {
    id: string;
    name: string;
    origin: string;
    destination: string;
    estimatedDuration: number;
}

export default function CommuterDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [routes, setRoutes] = useState<Route[]>([]);
    const [routesLoading, setRoutesLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading, router]);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await api.get('/routes');
                setRoutes(res.data.routes || []);
            } catch {
                // API not connected yet — show placeholder data
                setRoutes([
                    { id: '1', name: 'Route 101', origin: 'City Center', destination: 'Airport', estimatedDuration: 45 },
                    { id: '2', name: 'Route 202', origin: 'University', destination: 'Bus Stand', estimatedDuration: 30 },
                    { id: '3', name: 'Route 303', origin: 'Market', destination: 'Hospital', estimatedDuration: 20 },
                ]);
            } finally {
                setRoutesLoading(false);
            }
        };
        if (user) fetchRoutes();
    }, [user]);

    if (loading || !user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-slate-400 animate-pulse">Loading…</div>
        </div>
    );

    const filtered = routes.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.origin.toLowerCase().includes(search.toLowerCase()) ||
        r.destination.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-xl">🧍</div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Welcome, {user.name}!</h1>
                        <p className="text-slate-400 text-sm">Commuter Dashboard</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Active Buses', value: '12', icon: '🚌', color: 'text-indigo-400' },
                    { label: 'Routes', value: routes.length.toString(), icon: '🗺️', color: 'text-cyan-400' },
                    { label: 'Avg Wait', value: '8 min', icon: '⏱️', color: 'text-amber-400' },
                    { label: 'On Time', value: '94%', icon: '✅', color: 'text-emerald-400' },
                ].map(s => (
                    <div key={s.label} className="glass-card p-5 stat-card">
                        <div className="text-2xl mb-2">{s.icon}</div>
                        <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Map */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-3">Live Bus Map</h2>
                <MapView
                    height="320px"
                    markers={[
                        { lat: 20.59, lng: 78.97, label: 'Bus 101' },
                        { lat: 20.61, lng: 78.94, label: 'Bus 202' },
                    ]}
                />
            </div>

            {/* Route Search */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Available Routes</h2>
                    <input
                        id="route-search"
                        type="text"
                        placeholder="Search routes…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field w-56 text-sm"
                    />
                </div>

                {routesLoading ? (
                    <div className="text-slate-400 text-center py-8">Loading routes…</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.length === 0 ? (
                            <p className="text-slate-400 col-span-3 text-center py-8">No routes found.</p>
                        ) : (
                            filtered.map(r => (
                                <div key={r.id} className="glass-card p-5 stat-card border border-slate-700/50 hover:border-indigo-500/30 cursor-pointer">
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-indigo-400 font-semibold text-sm">{r.name}</span>
                                        <span className="bg-indigo-500/15 text-indigo-300 text-xs px-2 py-0.5 rounded-full">{r.estimatedDuration} min</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <span className="text-emerald-400">📍</span> {r.origin}
                                        <span className="text-slate-600 mx-1">→</span>
                                        <span className="text-red-400">📍</span> {r.destination}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
