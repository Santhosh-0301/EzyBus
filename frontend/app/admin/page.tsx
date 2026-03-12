'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Stats {
    users: number;
    buses: number;
    routes: number;
    trips: number;
    activeTrips: number;
}

interface User { id: string; name: string; email: string; role: string; createdAt: string; }
interface Bus { id: string; busNumber: string; capacity: number; status: string; }

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<Stats>({ users: 0, buses: 0, routes: 0, trips: 0, activeTrips: 0 });
    const [users, setUsers] = useState<User[]>([]);
    const [buses, setBuses] = useState<Bus[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'buses' | 'routes'>('users');
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) router.push('/login');
        if (!loading && user && user.role !== 'admin') router.push(`/${user.role}`);
    }, [user, loading, router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, busesRes, routesRes, tripsRes] = await Promise.allSettled([
                    api.get('/users'),
                    api.get('/buses'),
                    api.get('/routes'),
                    api.get('/trips'),
                ]);

                const u = usersRes.status === 'fulfilled' ? usersRes.value.data : { users: [], count: 0 };
                const b = busesRes.status === 'fulfilled' ? busesRes.value.data : { buses: [], count: 0 };
                const r = routesRes.status === 'fulfilled' ? routesRes.value.data : { count: 0 };
                const t = tripsRes.status === 'fulfilled' ? tripsRes.value.data : { trips: [], count: 0 };

                setUsers(u.users || []);
                setBuses(b.buses || []);

                const activeTrips = (t.trips || []).filter((trip: { status: string }) => trip.status === 'active').length;
                setStats({ users: u.count || 0, buses: b.count || 0, routes: r.count || 0, trips: t.count || 0, activeTrips });
            } catch {
                // Use placeholder data
                setUsers([
                    { id: '1', name: 'Alice Commuter', email: 'alice@ezybus.com', role: 'commuter', createdAt: new Date().toISOString() },
                    { id: '2', name: 'Bob Conductor', email: 'bob@ezybus.com', role: 'conductor', createdAt: new Date().toISOString() },
                ]);
                setBuses([
                    { id: '1', busNumber: 'KA-01-1234', capacity: 50, status: 'active' },
                    { id: '2', busNumber: 'KA-01-5678', capacity: 45, status: 'inactive' },
                ]);
                setStats({ users: 2, buses: 2, routes: 3, trips: 5, activeTrips: 1 });
            } finally {
                setDataLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    const changeUserRole = async (userId: string, newRole: string) => {
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch {
            alert('Failed to update role. Ensure backend is running.');
        }
    };

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="text-slate-400 animate-pulse">Loading…</div></div>;

    const statCards = [
        { label: 'Total Users', value: stats.users, icon: '👥', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
        { label: 'Buses', value: stats.buses, icon: '🚌', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
        { label: 'Routes', value: stats.routes, icon: '🗺️', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        { label: 'Total Trips', value: stats.trips, icon: '📋', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        { label: 'Active Trips', value: stats.activeTrips, icon: '🟢', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    ];

    const roleBadge: Record<string, string> = {
        admin: 'bg-purple-600',
        conductor: 'bg-amber-500',
        commuter: 'bg-emerald-600',
    };

    const busStatusBadge: Record<string, string> = {
        active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        inactive: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
        maintenance: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-xl">⚙️</div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-slate-400 text-sm">Welcome, {user.name} · Full System Access</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {statCards.map(s => (
                    <div key={s.label} className={`glass-card p-5 stat-card border ${s.bg}`}>
                        <div className="text-2xl mb-2">{s.icon}</div>
                        <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-slate-400 text-xs mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-slate-700/50">
                {(['users', 'buses', 'routes'] as const).map(tab => (
                    <button
                        key={tab}
                        id={`admin-tab-${tab}`}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab
                                ? 'border-indigo-500 text-indigo-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {dataLoading ? (
                <div className="text-slate-400 text-center py-12">Loading data…</div>
            ) : (
                <>
                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500 text-xs uppercase tracking-wider border-b border-slate-700/50">
                                        <th className="pb-3 pr-6">Name</th>
                                        <th className="pb-3 pr-6">Email</th>
                                        <th className="pb-3 pr-6">Role</th>
                                        <th className="pb-3">Change Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="py-3.5 pr-6 text-white font-medium">{u.name}</td>
                                            <td className="py-3.5 pr-6 text-slate-400">{u.email}</td>
                                            <td className="py-3.5 pr-6">
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${roleBadge[u.role] || 'bg-slate-600'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-3.5">
                                                <select
                                                    value={u.role}
                                                    onChange={e => changeUserRole(u.id, e.target.value)}
                                                    className="bg-slate-800 border border-slate-600 text-slate-200 text-xs px-2 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
                                                >
                                                    <option value="commuter">Commuter</option>
                                                    <option value="conductor">Conductor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Buses Tab */}
                    {activeTab === 'buses' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {buses.map(b => (
                                <div key={b.id} className="glass-card p-5 stat-card border border-slate-700/50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="text-white font-semibold">{b.busNumber}</div>
                                            <div className="text-slate-400 text-xs mt-0.5">Capacity: {b.capacity} seats</div>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${busStatusBadge[b.status] || busStatusBadge.inactive}`}>
                                            {b.status}
                                        </span>
                                    </div>
                                    <div className="text-slate-600 text-xs">ID: {b.id}</div>
                                </div>
                            ))}
                            {buses.length === 0 && <p className="text-slate-400 col-span-3 text-center py-8">No buses registered.</p>}
                        </div>
                    )}

                    {/* Routes Tab */}
                    {activeTab === 'routes' && (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-3">🗺️</div>
                            <p className="text-slate-300 font-medium mb-1">Routes Management</p>
                            <p className="text-slate-500 text-sm">Routes are managed via the REST API. Use <code className="text-indigo-400 text-xs">POST /api/v1/routes</code> to create routes.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
