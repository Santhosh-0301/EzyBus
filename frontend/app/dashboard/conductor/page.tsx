'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, Variants } from 'framer-motion';
import BusMap from '@/components/BusMap';
import Sidebar from '@/components/Sidebar';
import FloatingButton from '@/components/ui/FloatingButton';
import StatCard from '@/components/ui/StatCard';
import Panel from '@/components/ui/Panel';
import GradientButton from '@/components/ui/GradientButton';
import { startTrip, endTrip, updateLocation } from '@/lib/apiService';
import { Navigation, Play, StopCircle, Users, MapPin, Clock } from 'lucide-react';
import RoleGuard from '@/components/RoleGuard';
import { useTripStore } from '@/store/tripStore';
import { useBusStore } from '@/store/busStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface Trip { id: string; busId: string; routeId: string; status: string; passengerCount: number; }

const STATUS_BADGES: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30',
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30',
    completed: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30',
    cancelled: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30',
};

const container: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } } };

export default function ConductorDashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const trips = useTripStore(s => s.trips);
    const activeTrip = trips.find(t => t.status === 'active') || null;
    const updateTripStatus = useTripStore(s => s.updateTripStatus);
    const updatePaxCount = useTripStore(s => s.updatePassengerCount);

    const buses = useBusStore(s => s.buses);
    const activeBus = activeTrip ? buses.find(b => b.id === activeTrip.busId) : null;
    const updateBusLoc = useBusStore(s => s.updateBusLocation);

    const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'ok' | 'err' } | null>(null);
    const [updating, setUpdating] = useState(false);
    const [localPaxCount, setLocalPaxCount] = useState(0);

    const remainingStops = activeTrip ? 5 : 0;
    const tripTime = activeTrip ? "45 mins" : "0 mins";

    useEffect(() => {
        if (!loading && !user) router.push('/login/conductor');
    }, [user, loading, router]);

    useEffect(() => {
        if (activeTrip) {
            setLocalPaxCount(activeTrip.passengerCount);
        }
    }, [activeTrip?.id, activeTrip?.passengerCount]);

    const flash = (text: string, type: 'ok' | 'err') => {
        setStatusMsg({ text, type });
        setTimeout(() => setStatusMsg(null), 3500);
    };

    const handleStartTrip = async (trip: any) => {
        setUpdating(true);
        try {
            await startTrip({ busId: trip.busId, routeId: trip.routeId, conductorId: user!.id });
        } catch {
            console.warn('Backend startTrip failed, delegating to Zustand store.');
        } finally {
            updateTripStatus(trip.id, 'active');
            flash('Trip started successfully!', 'ok');
            setUpdating(false);
        }
    };

    const handleEndTrip = async () => {
        if (!activeTrip) return;
        setUpdating(true);
        try {
            await endTrip(activeTrip.id);
        } catch {
            console.warn('Backend endTrip failed, delegating to Zustand store.');
        } finally {
            updateTripStatus(activeTrip.id, 'completed');
            flash('Trip completed!', 'ok');
            setUpdating(false);
        }
    };

    const handleSendLocation = useCallback(async () => {
        if (!activeTrip || !activeBus) { flash('No active trip.', 'err'); return; }
        if (!navigator.geolocation) { flash('Geolocation not supported.', 'err'); return; }
        navigator.geolocation.getCurrentPosition(async pos => {
            const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            try {
                await updateLocation(activeTrip.id, loc);
            } catch {
                console.warn('Backend updateLocation failed, delegating to Zustand store.');
            } finally {
                updateBusLoc(activeBus.id, loc);
                flash(`Location sent: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`, 'ok');
            }
        }, () => flash('Could not get location.', 'err'));
    }, [activeTrip, activeBus, updateBusLoc]);

    const handlePaxChange = (delta: number) => {
        if (!activeTrip) return;
        const newCount = Math.max(0, localPaxCount + delta);
        setLocalPaxCount(newCount);
        updatePaxCount(activeTrip.id, newCount);
    };

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" /></div>;

    return (
        <RoleGuard allowedRole="conductor">
            <div className="flex min-h-[calc(100vh-4rem)]">
                <Sidebar role="conductor" />

                <div className="flex-1 page-container min-w-0">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Conductor Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Welcome, <span className="text-amber-600 dark:text-amber-400">{user.name}</span></p>
                    </motion.div>

                    {/* Status flash */}
                    {statusMsg && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${statusMsg.type === 'ok' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/15 border border-red-500/30 text-red-300'}`}>
                            {statusMsg.type === 'ok' ? '✅' : '⚠️'} {statusMsg.text}
                        </motion.div>
                    )}

                    {/* Stats */}
                    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "Current Trip", value: activeTrip ? "Running" : "Idle", icon: <Navigation size={18} />, color: 'emerald' as const },
                            { label: "Passengers Onboard", value: localPaxCount, icon: <Users size={18} />, color: 'indigo' as const },
                            { label: "Stops Remaining", value: remainingStops, icon: <MapPin size={18} />, color: 'cyan' as const },
                            { label: "Trip Duration", value: tripTime, icon: <Clock size={18} />, color: 'amber' as const }
                        ].map((s: any) => (
                            <motion.div key={s.label} variants={item}><StatCard {...s} /></motion.div>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                        {/* Active Trip Panel */}
                        <div className="xl:col-span-1">
                            <Panel icon="🚌" title="Bus Status" subtitle={activeTrip ? 'Trip in progress' : 'No active trip'}>
                                {activeTrip ? (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Active</span>
                                            </div>
                                            <p className="text-slate-900 dark:text-white font-semibold">{activeTrip.busId}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">{activeTrip.routeId}</p>
                                        </div>

                                        {/* Passenger counter */}
                                        <div>
                                            <label className="text-slate-500 dark:text-slate-400 text-xs mb-2 block">Passengers aboard</label>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => handlePaxChange(-1)}
                                                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold transition-colors">−</button>
                                                <span className="text-slate-900 dark:text-white font-bold text-xl w-8 text-center">{localPaxCount}</span>
                                                <button onClick={() => handlePaxChange(1)}
                                                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold transition-colors">+</button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <GradientButton variant="danger" size="sm" className="w-full" onClick={handleEndTrip} loading={updating} icon={<StopCircle size={15} />}>
                                                End Trip
                                            </GradientButton>
                                            <GradientButton variant="primary" size="sm" className="w-full" onClick={handleSendLocation} icon={<Navigation size={15} />}>
                                                Send Location
                                            </GradientButton>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <div className="text-5xl mb-3">🚌</div>
                                        <p className="text-slate-400 text-sm">Select a scheduled trip below to start.</p>
                                    </div>
                                )}
                            </Panel>
                        </div>

                        {/* Map */}
                        <div className="xl:col-span-2">
                            <Panel icon="📍" title="Your Location" subtitle="GPS position updates on Send Location">
                                <BusMap
                                    height="320px"
                                    buses={activeBus ? [{ id: 'conductor', lat: activeBus.currentLocation.lat, lng: activeBus.currentLocation.lng, label: 'Overview' }] : []}
                                />
                            </Panel>
                        </div>
                    </div>

                    {/* Trip list */}
                    <Panel icon="📋" title="My Trips" subtitle={`${trips.length} total trips`}>
                        {trips.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">No trips assigned.</p>
                        ) : (
                            <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                                {trips.map(t => (
                                    <motion.div key={t.id} variants={item}
                                        className="flex items-center justify-between gap-4 flex-wrap p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-amber-500/30 dark:hover:border-amber-500/20 shadow-sm dark:shadow-none transition-all">
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-medium text-sm">{t.busId} · {t.routeId}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_BADGES[t.status]}`}>{t.status}</span>
                                                <span className="text-slate-500 text-xs">{t.passengerCount} pax</span>
                                            </div>
                                        </div>
                                        {t.status === 'scheduled' && (
                                            <GradientButton variant="accent" size="sm" onClick={() => handleStartTrip(t)} loading={updating && !activeTrip} icon={<Play size={14} />}>
                                                Start
                                            </GradientButton>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </Panel>
                </div>
                <FloatingButton />
            </div>
        </RoleGuard>
    );
}
