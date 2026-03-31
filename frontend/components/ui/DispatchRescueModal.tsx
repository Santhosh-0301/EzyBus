'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useBusStore } from '@/store/busStore';
import GradientButton from './GradientButton';
import type { Alert } from '@/lib/types';

interface DispatchRescueModalProps {
    isOpen: boolean;
    onClose: () => void;
    alertSource: Alert | null;
}

export default function DispatchRescueModal({ isOpen, onClose, alertSource }: DispatchRescueModalProps) {
    const buses = useBusStore(s => s.buses);
    const routes = useBusStore(s => s.routes);
    const assignRoute = useBusStore(s => s.assignRoute);
    const addAlert = useBusStore(s => s.addAlert);

    const inactiveBuses = buses.filter(b => b.status === 'inactive');
    const [selectedBusId, setSelectedBusId] = useState('');

    if (!isOpen || !alertSource) return null;

    const brokenBus = buses.find(b => b.id === alertSource.busId);
    const route = routes.find(r => r.id === alertSource.routeId);

    const handleDispatch = () => {
        if (!selectedBusId || !brokenBus || !route) return;
        
        // Dispatch the rescue bus
        assignRoute(selectedBusId, route.id, brokenBus.currentLocation);

        const dispatchBus = buses.find(b => b.id === selectedBusId);
        
        // Notify network
        addAlert({
            title: `✅ Rescue Dispatched: ${dispatchBus?.busNumber}`,
            message: `Bus ${dispatchBus?.busNumber} has been dispatched to take over Route ${route.name} from Bus ${brokenBus.busNumber}.`,
            severity: 'success',
            busId: selectedBusId,
            routeId: route.id,
        });

        onClose();
        setSelectedBusId('');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                    <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-amber-50 dark:bg-amber-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-500">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dispatch Rescue Bus</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Assign a replacement to the active route</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-5 space-y-5">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Replacing: {brokenBus?.busNumber}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Route: {route?.name} ({route?.origin} → {route?.destination})</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Location: {brokenBus?.currentLocation.lat.toFixed(4)}, {brokenBus?.currentLocation.lng.toFixed(4)}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Available Inactive Buses ({inactiveBuses.length})</label>
                            {inactiveBuses.length === 0 ? (
                                <div className="p-3 text-sm text-center text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-500/20">
                                    No inactive buses available in the fleet!
                                </div>
                            ) : (
                                <select 
                                    value={selectedBusId} 
                                    onChange={e => setSelectedBusId(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all shadow-sm"
                                >
                                    <option value="">-- Select a bus to dispatch --</option>
                                    {inactiveBuses.map(b => (
                                        <option key={b.id} value={b.id}>{b.busNumber} (Capacity: {b.capacity} pax)</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button 
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <GradientButton 
                                variant="primary" 
                                className="flex-1 py-2.5"
                                onClick={handleDispatch}
                                disabled={!selectedBusId || inactiveBuses.length === 0}
                                icon={<Navigation size={15} />}
                            >
                                Dispatch Rescue
                            </GradientButton>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
