'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, Users, Activity, Clock, MapPin } from 'lucide-react';
import { useBusStore } from '@/store/busStore';

export default function BusDetailsModal() {
    const selectedBusId = useBusStore(s => s.selectedBusId);
    const selectBus = useBusStore(s => s.selectBus);
    const buses = useBusStore(s => s.buses);
    const routes = useBusStore(s => s.routes);

    if (!selectedBusId) return null;

    const bus = buses.find(b => b.id === selectedBusId);
    if (!bus) return null;

    const route = routes.find(r => r.id === bus.routeId);
    
    const passengerPercent = Math.round((bus.passengerCount / bus.capacity) * 100);
    const getFillColor = () => {
        if (passengerPercent > 90) return 'bg-red-500';
        if (passengerPercent > 60) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => selectBus(null)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative h-24 bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-end p-5">
                        <button 
                            onClick={() => selectBus(null)} 
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors"
                        >
                            <X size={18} />
                        </button>
                        <div className="flex items-center gap-3 text-white">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-2xl shadow-lg">
                                🚌
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{bus.busNumber}</h2>
                                <p className="text-white/80 text-sm font-medium">{route ? route.name : 'Off Route'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 space-y-5">
                        {/* Status pills */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                                bus.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30' :
                                bus.status === 'inactive' ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-500/30' :
                                'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                            }`}>
                                • {bus.status.toUpperCase()}
                            </span>
                            <span className="px-2.5 py-1 text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-500/20 flex items-center gap-1">
                                <Activity size={12} /> {bus.speed.toFixed(0)} km/h
                            </span>
                        </div>

                        {/* Route Info */}
                        {route && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Journey Details</h3>
                                <div className="relative pl-6 space-y-4">
                                    <div className="absolute left-[11px] top-1.5 bottom-1.5 w-0.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                    
                                    <div className="relative">
                                        <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-50 dark:ring-slate-800/50" />
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{route.origin}</p>
                                        <p className="text-xs text-slate-500">Origin</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-slate-50 dark:ring-slate-800/50" />
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{route.destination}</p>
                                        <p className="text-xs text-slate-500">Destination</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                                    <Users size={14} />
                                    <span className="text-xs font-medium">Occupancy</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">{bus.passengerCount} <span className="text-sm font-normal text-slate-500">/ {bus.capacity}</span></p>
                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all ${getFillColor()}`} style={{ width: `${passengerPercent}%` }} />
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                                    <Clock size={14} />
                                    <span className="text-xs font-medium">Last Update</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                                    {new Date(bus.lastUpdated).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
