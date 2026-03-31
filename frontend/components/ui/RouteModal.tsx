'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Clock, Users, AlertTriangle, ArrowRight,
    MapPin, CheckCircle2, ChevronRight,
    Zap, Navigation,
} from 'lucide-react';
import { useBusStore } from '@/store/busStore';
import BusMap from '@/components/BusMap';
import { calculateETA } from '@/lib/etaEngine';
import type { Bus, Route, Alert } from '@/lib/types';

// ── Types ─────────────────────────────────────────────────────────────────────
interface BusWithETA {
    bus: Bus;
    etaLabel: string;
    etaMinutes: number | null;
    nextStop: string;
}

interface RouteModalProps {
    isOpen: boolean;
    onClose: () => void;
    routeId: string | null;
    userStop?: string;
}

// ── Severity helpers ───────────────────────────────────────────────────────────
const severityBg: Record<string, string> = {
    critical: 'bg-red-500/10 border-red-500/30 text-red-400',
    warning:  'bg-amber-500/10 border-amber-500/30 text-amber-400',
    info:     'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    success:  'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
};
const severityIcon: Record<string, string> = {
    critical: '🔴', warning: '⚠️', info: 'ℹ️', success: '✅',
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function RouteModal({ isOpen, onClose, routeId, userStop }: RouteModalProps) {
    const [stage, setStage]               = useState<'select' | 'track'>('select');
    const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

    const routes = useBusStore(s => s.routes);
    const buses  = useBusStore(s => s.buses);
    const alerts = useBusStore(s => s.alerts);

    const route: Route | undefined = routes.find(r => r.id === routeId);
    const routeBuses = buses.filter(b => b.routeId === routeId && b.status === 'active');

    const busesWithETA: BusWithETA[] = route
        ? routeBuses.map(bus => {
            const eta = calculateETA(bus, route);
            return { bus, etaLabel: eta.etaLabel, etaMinutes: eta.etaMinutes, nextStop: eta.nextStop };
        }).sort((a, b) => (a.etaMinutes ?? 9999) - (b.etaMinutes ?? 9999))
        : [];

    const routeAlerts: Alert[] = alerts.filter(
        a => a.routeId === routeId || routeBuses.some(b => b.id === a.busId)
    );
    const criticalAlerts = routeAlerts.filter(a => a.severity === 'critical' && !a.read);

    const trackedBus    = busesWithETA.find(b => b.bus.id === selectedBusId);
    const trackedAlerts = alerts.filter(a => a.busId === selectedBusId || a.routeId === routeId);

    // Reset when closed
    useEffect(() => {
        if (!isOpen) {
            const t = setTimeout(() => { setStage('select'); setSelectedBusId(null); }, 300);
            return () => clearTimeout(t);
        }
    }, [isOpen, routeId]);

    // Auto-select nearest bus
    useEffect(() => {
        if (stage === 'select' && busesWithETA.length > 0 && !selectedBusId) {
            setSelectedBusId(busesWithETA[0].bus.id);
        }
    }, [stage, busesWithETA.length]);

    if (!route) return null;

    const mapBuses = stage === 'track' && trackedBus
        ? [{ id: trackedBus.bus.id, lat: trackedBus.bus.currentLocation.lat, lng: trackedBus.bus.currentLocation.lng, label: trackedBus.bus.busNumber }]
        : busesWithETA.map(b => ({ id: b.bus.id, lat: b.bus.currentLocation.lat, lng: b.bus.currentLocation.lng, label: b.bus.busNumber }));

    const mapCenter = stage === 'track' && trackedBus ? trackedBus.bus.currentLocation : undefined;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/70 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                        onClick={e => e.stopPropagation()}
                        className="w-full sm:max-w-xl bg-slate-900 sm:rounded-3xl rounded-t-3xl shadow-2xl border border-slate-800 flex flex-col max-h-[94vh] sm:max-h-[88vh] overflow-hidden"
                    >
                        {/* ── Header ───────────────────────────────────────── */}
                        <div className="flex-none px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4 border-b border-slate-800 flex justify-between items-start gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-md border border-indigo-500/30">
                                        {route.name}
                                    </span>
                                    {stage === 'track' && (
                                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            Live Tracking
                                        </span>
                                    )}
                                    {criticalAlerts.length > 0 && (
                                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                                            <Zap size={10} /> {criticalAlerts.length} Emergency
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-white font-bold text-base sm:text-lg flex items-center gap-2 flex-wrap">
                                    <MapPin size={13} className="text-emerald-400 shrink-0" />
                                    <span className="truncate">{route.origin}</span>
                                    <ArrowRight size={13} className="text-slate-500 shrink-0" />
                                    <MapPin size={13} className="text-red-400 shrink-0" />
                                    <span className="truncate">{route.destination}</span>
                                </h2>
                                {userStop && (
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <Navigation size={10} /> Your stop: <span className="text-indigo-400">{userStop}</span>
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors shrink-0"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* ── Emergency banner ─────────────────────────────── */}
                        {criticalAlerts.length > 0 && (
                            <div className="flex-none px-4 sm:px-5 py-3 bg-red-500/10 border-b border-red-500/20">
                                {criticalAlerts.map(a => (
                                    <div key={a.id} className="flex items-start gap-2 text-red-400">
                                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold">{a.title}</p>
                                            <p className="text-xs opacity-80">{a.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ── Scrollable body ───────────────────────────────── */}
                        <div className="flex-1 overflow-y-auto">

                            {/* Map */}
                            <div className="w-full h-44 sm:h-56 bg-slate-950 border-b border-slate-800">
                                <BusMap
                                    buses={mapBuses}
                                    height="100%"
                                    selectedRouteId={route.id}
                                    zoom={stage === 'track' ? 15 : 12}
                                    center={mapCenter}
                                />
                            </div>

                            {/* ── STAGE: SELECT ─────────────────────────────── */}
                            {stage === 'select' && (
                                <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        {busesWithETA.length} Bus{busesWithETA.length !== 1 ? 'es' : ''} on this route · tap to select
                                    </p>

                                    {busesWithETA.length === 0 ? (
                                        <p className="text-center py-10 text-slate-500 text-sm">No active buses on this route right now.</p>
                                    ) : (
                                        <div className="space-y-2 sm:space-y-3">
                                            {busesWithETA.map(({ bus, etaLabel, nextStop }, idx) => {
                                                const hasAlert  = alerts.some(a => a.busId === bus.id);
                                                const freeSeats = bus.capacity - bus.passengerCount;
                                                const isSelected = selectedBusId === bus.id;
                                                return (
                                                    <motion.div
                                                        key={bus.id}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setSelectedBusId(bus.id)}
                                                        className={`relative p-3 sm:p-4 rounded-2xl border cursor-pointer transition-all select-none ${
                                                            isSelected
                                                                ? 'border-indigo-500 bg-indigo-500/10'
                                                                : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                                                        }`}
                                                    >
                                                        {idx === 0 && (
                                                            <span className="absolute top-3 right-3 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                                Nearest
                                                            </span>
                                                        )}
                                                        <div className="flex items-center gap-3 pr-14">
                                                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 text-lg ${idx === 0 ? 'bg-emerald-500/15' : 'bg-slate-700'}`}>
                                                                🚌
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-white text-sm">{bus.busNumber}</p>
                                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                                                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                                                        <Clock size={11} />
                                                                        <span className="font-medium text-white">{etaLabel}</span>
                                                                        {nextStop && <span>· {nextStop}</span>}
                                                                    </span>
                                                                    <span className={`flex items-center gap-1 text-xs ${freeSeats < 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                                        <Users size={11} /> {freeSeats} seats
                                                                    </span>
                                                                    {hasAlert && (
                                                                        <span className="flex items-center gap-1 text-xs text-amber-400">
                                                                            <AlertTriangle size={11} /> Alert
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-700'}`}>
                                                            {isSelected && <CheckCircle2 size={12} className="text-white" />}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <button
                                        disabled={!selectedBusId}
                                        onClick={() => setStage('track')}
                                        className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                            selectedBusId
                                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                        }`}
                                    >
                                        Confirm &amp; Track Bus <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}

                            {/* ── STAGE: TRACK ──────────────────────────────── */}
                            {stage === 'track' && trackedBus && (
                                <div className="p-4 sm:p-5 space-y-4">

                                    {/* Bus status card */}
                                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-800">
                                        <div className="flex items-start justify-between gap-4 flex-wrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-full bg-indigo-500/15 flex items-center justify-center text-xl shrink-0">🚌</div>
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-0.5">Tracking bus</p>
                                                    <p className="font-bold text-white">{trackedBus.bus.busNumber}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setStage('select')}
                                                className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg transition-colors shrink-0"
                                            >
                                                Change bus
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800">
                                            <div className="text-center">
                                                <p className="text-slate-500 text-xs mb-1 flex items-center justify-center gap-1"><Clock size={10} /> ETA</p>
                                                <p className="font-bold text-white text-sm">{trackedBus.etaLabel}</p>
                                                <p className="text-slate-500 text-[10px] truncate">{trackedBus.nextStop}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-slate-500 text-xs mb-1 flex items-center justify-center gap-1"><Users size={10} /> Seats</p>
                                                <p className={`font-bold text-sm ${(trackedBus.bus.capacity - trackedBus.bus.passengerCount) < 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    {trackedBus.bus.capacity - trackedBus.bus.passengerCount}
                                                </p>
                                                <p className="text-slate-500 text-[10px]">of {trackedBus.bus.capacity}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-slate-500 text-xs mb-1 flex items-center justify-center gap-1"><Navigation size={10} /> Speed</p>
                                                <p className="font-bold text-white text-sm">{trackedBus.bus.speed} km/h</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alerts for this bus */}
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Live Notifications</p>
                                        {trackedAlerts.length === 0 ? (
                                            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                                                <CheckCircle2 size={15} />
                                                <span className="text-sm font-medium">Bus operating normally — no alerts</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {trackedAlerts.map(a => (
                                                    <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${severityBg[a.severity] || severityBg.info}`}>
                                                        <span className="shrink-0 mt-0.5">{severityIcon[a.severity] || 'ℹ️'}</span>
                                                        <div>
                                                            <p className="font-bold text-xs mb-0.5">{a.title}</p>
                                                            <p className="text-xs opacity-80">{a.message}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Route stops */}
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Route Stops</p>
                                        <div className="space-y-2">
                                            {route.stops.map((stop, i) => (
                                                <div key={stop.name} className="flex items-center gap-3">
                                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                                        i === 0 ? 'bg-emerald-400' :
                                                        i === route.stops.length - 1 ? 'bg-red-400' : 'bg-slate-600'
                                                    }`} />
                                                    <span className={`text-sm ${stop.name === userStop ? 'text-indigo-300 font-bold' : 'text-slate-400'}`}>
                                                        {stop.name}
                                                        {stop.name === userStop && (
                                                            <span className="ml-2 text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded">Your Stop</span>
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-600 text-center pb-2">Bus location updates every 3 seconds</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
