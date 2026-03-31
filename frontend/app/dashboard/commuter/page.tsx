'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, Variants } from 'framer-motion';
import BusMap from '@/components/BusMap';
import Sidebar, { SidebarHandle } from '@/components/Sidebar';
import FloatingButton from '@/components/ui/FloatingButton';
import StatCard from '@/components/ui/StatCard';
import Panel from '@/components/ui/Panel';
import PlanJourneyModal from '@/components/ui/PlanJourneyModal';
import SetReminderModal from '@/components/ui/SetReminderModal';
import RouteModal from '@/components/ui/RouteModal';
import { useBusStore } from '@/store/busStore';
import {
    Bus, Map, Clock, AlertTriangle,
    Search, MapPin, ArrowRight, Menu,
} from 'lucide-react';
import RoleGuard from '@/components/RoleGuard';

const container: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item: Variants     = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } } };

export default function CommuterDashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const sidebarRef = useRef<SidebarHandle>(null);

    // ── Search ───────────────────────────────────────────────────────────────
    const [fromStop, setFromStop] = useState('');
    const [toStop,   setToStop]   = useState('');

    // ── Modals ───────────────────────────────────────────────────────────────
    const [isPlanModalOpen,     setIsPlanModalOpen]     = useState(false);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [routeModalId,        setRouteModalId]        = useState<string | null>(null);

    // ── Store ────────────────────────────────────────────────────────────────
    const buses  = useBusStore(s => s.buses);
    const routes = useBusStore(s => s.routes);
    const alerts = useBusStore(s => s.alerts);
    const activeBuses = buses.filter(b => b.status === 'active');

    useEffect(() => {
        if (!loading && !user) router.push('/login/commuter');
    }, [user, loading, router]);

    if (loading || !user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        </div>
    );

    // ── Route filter ─────────────────────────────────────────────────────────
    const filtered = routes.filter(r => {
        const from = fromStop.toLowerCase().trim();
        const to   = toStop.toLowerCase().trim();
        const stops = r.stops.map(s => s.name.toLowerCase());
        const matchFrom = !from || r.origin.toLowerCase().includes(from) || stops.some(s => s.includes(from));
        const matchTo   = !to   || r.destination.toLowerCase().includes(to) || stops.some(s => s.includes(to));
        return matchFrom && matchTo;
    });

    const busMarkers = activeBuses
        .filter(b => b.currentLocation)
        .map(b => ({ id: b.id, lat: b.currentLocation!.lat, lng: b.currentLocation!.lng, label: b.busNumber }));

    return (
        <RoleGuard allowedRole="commuter">
            <div className="flex min-h-[calc(100vh-4rem)]">
                <Sidebar ref={sidebarRef} role="commuter" />

                <div className="flex-1 min-w-0 flex flex-col">

                    {/* ── Mobile top-bar (hamburger + title) ─────────────── */}
                    <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-slate-900/95 backdrop-blur border-b border-slate-800">
                        <button
                            onClick={() => sidebarRef.current?.open()}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <span className="text-white font-semibold text-sm">Commuter Dashboard</span>
                    </div>

                    {/* ── Main content ────────────────────────────────────── */}
                    <div className="flex-1 page-container">

                        {/* Page title (desktop only) */}
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="hidden md:flex items-start justify-between mb-6"
                        >
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Commuter Dashboard</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                                    Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user.name}</span>
                                </p>
                            </div>
                        </motion.div>

                        {/* Mobile welcome */}
                        <motion.p
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="md:hidden text-slate-500 dark:text-slate-400 text-xs mb-4"
                        >
                            Welcome, <span className="text-indigo-400">{user.name}</span>
                        </motion.p>

                        {/* ── Journey Search ────────────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="mb-5 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-3 sm:p-4 shadow-sm"
                        >
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                {/* From */}
                                <div className="flex items-center gap-2 flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5">
                                    <MapPin size={14} className="text-emerald-500 shrink-0" />
                                    <input
                                        id="commuter-from-search"
                                        placeholder="From stop"
                                        value={fromStop}
                                        onChange={e => setFromStop(e.target.value)}
                                        className="flex-1 bg-transparent text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 min-w-0"
                                    />
                                </div>

                                <ArrowRight size={14} className="text-slate-400 shrink-0 hidden sm:block" />

                                {/* To */}
                                <div className="flex items-center gap-2 flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5">
                                    <MapPin size={14} className="text-red-500 shrink-0" />
                                    <input
                                        id="commuter-to-search"
                                        placeholder="To destination"
                                        value={toStop}
                                        onChange={e => setToStop(e.target.value)}
                                        className="flex-1 bg-transparent text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 min-w-0"
                                    />
                                </div>

                                <button className="flex items-center justify-center h-10 w-full sm:w-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0">
                                    <Search size={15} />
                                </button>
                            </div>
                        </motion.div>

                        {/* ── Stats ──────────────────────────────────────── */}
                        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
                            {[
                                { label: 'Active Buses',    value: activeBuses.length, icon: <Bus size={16} />,           color: 'indigo' as const, onClick: () => document.getElementById('live-bus-tracking')?.scrollIntoView({ behavior: 'smooth' }) },
                                { label: 'Routes',          value: routes.length,      icon: <Map size={16} />,           color: 'cyan'   as const, onClick: () => document.getElementById('available-routes')?.scrollIntoView({ behavior: 'smooth' }) },
                                { label: 'Alerts',          value: alerts.length,      icon: <AlertTriangle size={16} />, color: 'red'    as const, onClick: () => document.getElementById('live-alerts')?.scrollIntoView({ behavior: 'smooth' }) },
                                { label: 'Avg Wait',        value: '6 min',            icon: <Clock size={16} />,         color: 'amber'  as const },
                            ].map((s: any) => (
                                <motion.div key={s.label} variants={item}>
                                    <StatCard {...s} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* ── Map + Routes ───────────────────────────────── */}
                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6 mb-5" id="live-bus-tracking">
                            {/* Map */}
                            <div className="xl:col-span-3">
                                <Panel title="Live Bus Tracking" icon="🗺️" subtitle={`${activeBuses.length} active · updates every 3s`} padding="sm">
                                    <BusMap buses={busMarkers} height="320px" />
                                </Panel>
                            </div>

                            {/* Route list */}
                            <div className="xl:col-span-2" id="available-routes">
                                <Panel
                                    title="Available Routes"
                                    icon="🛣️"
                                    subtitle={(fromStop || toStop) ? `${filtered.length} found` : `${routes.length} routes`}
                                    padding="sm"
                                >
                                    <motion.div variants={container} initial="hidden" animate="show" className="space-y-2 max-h-[292px] overflow-y-auto pr-0.5">
                                        {filtered.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-slate-400 text-sm">No routes found</p>
                                                <p className="text-slate-500 text-xs mt-1">Try different stop names</p>
                                            </div>
                                        ) : filtered.map(r => (
                                            <motion.div
                                                key={r.id}
                                                variants={item}
                                                onClick={() => setRouteModalId(r.id)}
                                                className="group p-3 sm:p-4 rounded-xl cursor-pointer transition-all border bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 active:scale-[0.98]"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-slate-900 dark:text-white font-semibold text-sm">{r.name}</span>
                                                    <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/25 text-xs px-2 py-0.5 rounded-full shrink-0 ml-2">
                                                        {r.estimatedDuration}m
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
                                                    <span className="text-emerald-400">●</span> {r.origin}
                                                    <span className="text-slate-600 mx-1">→</span>
                                                    <span className="text-red-400">●</span> {r.destination}
                                                </p>
                                                <p className="text-xs text-indigo-400 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Tap to view buses →
                                                </p>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </Panel>
                            </div>
                        </div>

                        {/* ── Alerts ─────────────────────────────────────── */}
                        <div id="live-alerts">
                            <Panel title="Live Alerts" icon="🔔" subtitle={`${alerts.filter(a => !a.read).length} unread`} padding="sm">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {alerts.slice(0, 3).map((a, i) => (
                                        <motion.div
                                            key={a.id}
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                            className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl border ${
                                                a.severity === 'warning'  ? 'bg-amber-500/8 border-amber-500/20'    :
                                                a.severity === 'critical' ? 'bg-red-500/8 border-red-500/20'        :
                                                a.severity === 'success'  ? 'bg-emerald-500/8 border-emerald-500/20':
                                                'bg-indigo-500/8 border-indigo-500/20'
                                            }`}
                                        >
                                            <span className="text-sm shrink-0">
                                                {a.severity === 'warning' ? '⚠️' : a.severity === 'critical' ? '🔴' : a.severity === 'success' ? '✅' : 'ℹ️'}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-slate-900 dark:text-white text-xs font-semibold mb-0.5 truncate">{a.title}</p>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{a.message}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </Panel>
                        </div>

                        {/* Bottom padding for FAB */}
                        <div className="h-20" />
                    </div>
                </div>

                {/* ── Floating actions ─────────────────────────────────── */}
                <FloatingButton actions={[
                    { icon: Map,           label: 'Plan Journey',  color: 'bg-indigo-600 hover:bg-indigo-500', shadow: 'shadow-indigo-500/40', onClick: () => setIsPlanModalOpen(true) },
                    { icon: Clock,         label: 'Set Reminders', color: 'bg-emerald-500 hover:bg-emerald-400', shadow: 'shadow-emerald-500/40', onClick: () => setIsReminderModalOpen(true) },
                    { icon: AlertTriangle, label: 'Report Issue',  color: 'bg-red-500 hover:bg-red-400', shadow: 'shadow-red-500/40', onClick: () => alert('Report issue coming soon!') },
                ]} />

                {/* ── Modals ───────────────────────────────────────────── */}
                <PlanJourneyModal
                    isOpen={isPlanModalOpen}
                    onClose={() => setIsPlanModalOpen(false)}
                    onSearch={query => {
                        const parts = query.split(' to ');
                        if (parts.length > 1) { setFromStop(parts[0].trim()); setToStop(parts[1].trim()); }
                        else { setToStop(query.trim()); }
                    }}
                />
                <SetReminderModal
                    isOpen={isReminderModalOpen}
                    onClose={() => setIsReminderModalOpen(false)}
                />
                <RouteModal
                    isOpen={!!routeModalId}
                    onClose={() => setRouteModalId(null)}
                    routeId={routeModalId}
                    userStop={fromStop || undefined}
                />
            </div>
        </RoleGuard>
    );
}
