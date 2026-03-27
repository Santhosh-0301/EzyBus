'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, Variants } from 'framer-motion';
import BusMap from '@/components/BusMap';
import Sidebar from '@/components/Sidebar';
import FloatingButton from '@/components/ui/FloatingButton';
import StatCard from '@/components/ui/StatCard';
import Panel from '@/components/ui/Panel';
import { useBusStore } from '@/store/busStore';
import { Bus, Map, Clock, AlertTriangle } from 'lucide-react';
import RoleGuard from '@/components/RoleGuard';



const container: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } } };


export default function CommuterDashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');

    // ── Data from Zustand store (live-updated by simulator) ─────────────────
    const buses = useBusStore(s => s.buses);
    const routes = useBusStore(s => s.routes);
    const alerts = useBusStore(s => s.alerts);
    const activeBuses = buses.filter(b => b.status === 'active');
    const unreadAlerts = alerts.filter(a => !a.read).length;

    useEffect(() => {
        if (!loading && !user) router.push('/login/commuter');
    }, [user, loading, router]);

    if (loading || !user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        </div>
    );

    const filtered = routes.filter(r =>
        [r.name, r.origin, r.destination].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    );
    const busMarkers = buses.filter(b => b.currentLocation)
        .map(b => ({ id: b.id, lat: b.currentLocation!.lat, lng: b.currentLocation!.lng, label: b.busNumber }));
    // const activeCount = buses.filter(b => b.status === 'active').length || 12; // Replaced by activeBuses.length

    return (
        <RoleGuard allowedRole="commuter">
            <div className="flex min-h-[calc(100vh-4rem)]">
                <Sidebar role="commuter" />

                <div className="flex-1 page-container min-w-0">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Commuter Dashboard</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user.name}</span></p>
                        </div>
                        <input
                            id="commuter-route-search"
                            type="text"
                            placeholder="Search routes, stops…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-field w-56 text-sm"
                        />
                    </motion.div>

                    {/* Stats */}
                    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Active Buses Nearby', value: buses.length, icon: <Bus size={18} />, color: 'indigo' as const },
                            { label: 'Available Routes', value: routes.length, icon: <Map size={18} />, color: 'cyan' as const },
                            { label: 'Service Alerts', value: alerts.length, icon: <AlertTriangle size={18} />, color: 'red' as const },
                            { label: 'Avg Waiting Time', value: '6 min', icon: <Clock size={18} />, color: 'amber' as const },
                        ].map((s: any) => (
                            <motion.div key={s.label} variants={item}>
                                <StatCard {...s} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Main grid: map + routes side by side on large screens */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
                        {/* Map — large */}
                        <div className="xl:col-span-3">
                            <Panel title="Live Bus Tracking" icon="🗺️" subtitle={`${activeBuses.length} buses active · refreshes every 3s`}>
                                <BusMap buses={busMarkers} height="420px" />
                            </Panel>
                        </div>

                        {/* Route list */}
                        <div className="xl:col-span-2">
                            <Panel title="Available Routes" icon="🛣️" subtitle={`${filtered.length} routes found`}>
                                <motion.div variants={container} initial="hidden" animate="show" className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                                    {filtered.length === 0
                                        ? <p className="text-slate-400 text-center py-8">No routes found.</p>
                                        : filtered.map(r => (
                                            <motion.div key={r.id} variants={item}
                                                className="group p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-sm dark:shadow-none">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-slate-900 dark:text-white font-semibold text-sm">{r.name}</span>
                                                    <span className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 border dark:border-emerald-500/25 text-xs px-2 py-0.5 rounded-full">{r.estimatedDuration}m</span>
                                                </div>
                                                <p className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
                                                    <span className="text-emerald-400">●</span> {r.origin}
                                                    <span className="text-slate-600 mx-1">→</span>
                                                    <span className="text-red-400">●</span> {r.destination}
                                                </p>
                                            </motion.div>
                                        ))}
                                </motion.div>
                            </Panel>
                        </div>
                    </div>

                    {/* Alerts — from store */}
                    <Panel title="Live Alerts" icon="🔔" subtitle={`${alerts.filter(a => !a.read).length} unread`}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {alerts.slice(0, 3).map((a, i) => (
                                <motion.div key={a.id}
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                    className={`flex items-start gap-3 p-4 rounded-xl border ${a.severity === 'warning' ? 'bg-amber-500/8 border-amber-500/20' :
                                        a.severity === 'critical' ? 'bg-red-500/8 border-red-500/20' :
                                            a.severity === 'success' ? 'bg-emerald-500/8 border-emerald-500/20' :
                                                'bg-indigo-500/8 border-indigo-500/20'
                                        }`}>
                                    <span className="text-base">{a.severity === 'warning' ? '⚠️' : a.severity === 'critical' ? '🔴' : a.severity === 'success' ? '✅' : 'ℹ️'}</span>
                                    <div>
                                        <p className="text-slate-900 dark:text-white text-xs font-semibold mb-0.5">{a.title}</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs">{a.message}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Panel>
                </div>

                {/* FAB */}
                <FloatingButton />
            </div>
        </RoleGuard>
    );
}
