'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, Variants } from 'framer-motion';
import BusMap from '@/components/BusMap';
import Sidebar from '@/components/Sidebar';
import FloatingButton from '@/components/ui/FloatingButton';
import StatCard from '@/components/ui/StatCard';
import Panel from '@/components/ui/Panel';
import GradientButton from '@/components/ui/GradientButton';
import { useBusStore } from '@/store/busStore';
import { useTripStore } from '@/store/tripStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useETAs } from '@/hooks/useETAs';
import { passengerSeverity } from '@/lib/analyticsEngine';
import { Bus, Users, Map, Activity, Bell, RefreshCw, Clock, Wrench } from 'lucide-react';
import RoleGuard from '@/components/RoleGuard';

const container: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const itemV: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } } };

const statusBadge: Record<string, string> = {
    active: 'bg-emerald-100/50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/30',
    maintenance: 'bg-amber-100/50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
};
const statusDot: Record<string, string> = {
    active: 'bg-emerald-500 dark:bg-emerald-400', inactive: 'bg-slate-400 dark:bg-slate-500', maintenance: 'bg-amber-500 dark:bg-amber-400',
};
const severityColors = {
    low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
    full: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
};

type AlertTab = 'fleet' | 'alerts' | 'eta';

export default function AdminDashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // ── Store data ─────────────────────────────────────────────────────────────
    const buses = useBusStore(s => s.buses);
    const alerts = useBusStore(s => s.alerts);
    const markAllAlertsRead = useBusStore(s => s.markAllAlertsRead);
    const markAlertRead = useBusStore(s => s.markAlertRead);
    const trips = useTripStore(s => s.trips);

    // ── Live analytics + ETAs ─────────────────────────────────────────────────
    const analytics = useAnalytics();
    const etas = useETAs();

    const activeBuses = buses.filter(b => b.status === 'active').length;
    const tripsToday = trips.length;
    const maintenanceBuses = buses.filter(b => b.status === 'maintenance').length;

    const [activeTab, setActiveTab] = React.useState<AlertTab>('fleet');

    useEffect(() => {
        if (!loading && !user) router.push('/login/admin');
        if (!loading && user && user.role !== 'admin') router.push(`/login/${user.role}`);
    }, [user, loading, router]);

    if (loading || !user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
    );

    const severityIcon: Record<string, string> = {
        critical: '🔴', warning: '⚠️', info: 'ℹ️', success: '✅',
    };

    return (
        <RoleGuard allowedRole="admin">
            <div className="flex min-h-[calc(100vh-4rem)]">
                <Sidebar role="admin" />

                <div className="flex-1 page-container min-w-0">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                                Welcome, <span className="text-purple-400">{user.name}</span>
                                {analytics.utilisation > 0 && (
                                    <span className="ml-2 text-xs text-slate-500">· Fleet utilisation: <span className="text-emerald-400">{analytics.utilisation}%</span></span>
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {alerts.filter(a => !a.read).length > 0 && (
                                <GradientButton variant="ghost" size="sm" onClick={markAllAlertsRead}>
                                    Mark all read
                                </GradientButton>
                            )}
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Live
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div variants={container} initial="hidden" animate="show"
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "Active Fleet", value: activeBuses, icon: <Bus size={18} />, color: 'indigo' as const },
                            { label: "Trips Today", value: tripsToday, icon: <Activity size={18} />, color: 'cyan' as const },
                            { label: "Maintenance", value: maintenanceBuses, icon: <Wrench size={18} />, color: 'amber' as const },
                            { label: "System Alerts", value: alerts.length, icon: <Bell size={18} />, color: alerts.length > 2 ? 'red' as const : 'emerald' as const }
                        ].map((s: any) => (
                            <motion.div key={s.label} variants={itemV}><StatCard {...s} /></motion.div>
                        ))}
                    </motion.div>

                    {/* Fleet Map */}
                    <div className="mb-6">
                        <Panel icon="🗺️" title="Fleet Monitoring Map" subtitle={`${analytics.activeBuses} active · routes visible · bus trails enabled`}>
                            <BusMap height="370px" showRoutes showTrails showStops />
                        </Panel>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-5 border-b border-slate-700/50">
                        {(['fleet', 'alerts', 'eta'] as AlertTab[]).map(tab => (
                            <button key={tab} id={`admin-dash-tab-${tab}`} onClick={() => setActiveTab(tab)}
                                className={`relative px-5 py-2.5 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                                {tab === 'fleet' ? 'Fleet' : tab === 'alerts' ? `Alerts${analytics.unreadAlerts > 0 ? ` (${analytics.unreadAlerts})` : ''}` : 'ETAs'}
                                {activeTab === tab && (
                                    <motion.div layoutId="admin-tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Fleet tab */}
                    {activeTab === 'fleet' && (
                        <motion.div variants={container} initial="hidden" animate="show"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {buses.map(b => (
                                <motion.div key={b.id} variants={itemV}
                                    className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500/30 dark:hover:border-slate-600/60 transition-all hover:-translate-y-1 shadow-xl shadow-black/5 dark:shadow-black/20">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-semibold text-sm">{b.busNumber}</p>
                                            <p className="text-slate-500 text-xs mt-0.5">{b.capacity} seats</p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${statusDot[b.status]}`} />
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusBadge[b.status]}`}>{b.status}</span>
                                        </div>
                                    </div>
                                    {b.status === 'active' && (
                                        <div className="space-y-1.5">
                                            {/* Passenger fill bar */}
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-slate-400">Passengers</span>
                                                <span className={`font-semibold ${severityColors[passengerSeverity(b.passengerCount, b.capacity)]}`}>
                                                    {b.passengerCount}/{b.capacity}
                                                </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <motion.div className="h-full rounded-full bg-indigo-500"
                                                    animate={{ width: `${Math.round((b.passengerCount / b.capacity) * 100)}%` }}
                                                    transition={{ duration: 0.5 }} />
                                            </div>
                                            <p className="text-slate-600 text-xs font-mono mt-1">{b.speed} km/h</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Alerts tab */}
                    {activeTab === 'alerts' && (
                        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                            {alerts.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No alerts.</p>
                            ) : alerts.map((a, i) => (
                                <motion.div key={a.id} variants={itemV}
                                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${a.read ? 'opacity-50' : ''} ${a.severity === 'critical' ? 'border-red-500/25 bg-red-500/6' :
                                        a.severity === 'warning' ? 'border-amber-500/25 bg-amber-500/6' :
                                            a.severity === 'success' ? 'border-emerald-500/25 bg-emerald-500/6' :
                                                'border-indigo-500/25 bg-indigo-500/6'
                                        }`}>
                                    <span className="text-lg shrink-0">{severityIcon[a.severity] ?? 'ℹ️'}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-900 dark:text-white text-sm font-medium">{a.title}</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{a.message}</p>
                                        <p className="text-slate-500 dark:text-slate-600 text-[10px] mt-1">{new Date(a.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                    {!a.read && (
                                        <button onClick={() => markAlertRead(a.id)}
                                            className="text-xs text-slate-500 hover:text-slate-300 shrink-0 transition-colors">
                                            Dismiss
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* ETA tab */}
                    {activeTab === 'eta' && (
                        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                            {etas.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">ETAs calculating…</p>
                            ) : etas.map(e => (
                                <motion.div key={e.busId} variants={itemV}
                                    className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 shadow-sm dark:shadow-none transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                                            <span className="text-sm">🚌</span>
                                        </div>
                                        <div>
                                            <p className="text-slate-900 dark:text-white text-sm font-semibold">{e.busNumber}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs">→ {e.nextStop}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${e.etaMinutes !== null && e.etaMinutes <= 3 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                            {e.etaLabel}
                                        </p>
                                        <p className="text-slate-500 text-xs">{e.distanceKm > 0 ? `${e.distanceKm} km` : ''}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
                <FloatingButton />
            </div>
        </RoleGuard>
    );
}

// We need React for useState in the component above
import React from 'react';
