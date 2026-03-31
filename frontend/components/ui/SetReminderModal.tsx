'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Plus, Trash2 } from 'lucide-react';
import GradientButton from './GradientButton';
import { useBusStore } from '@/store/busStore';

interface Reminder {
    id: string;
    routeId: string;
    stopName: string;
    threshold: number;
}

interface SetReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SetReminderModal({ isOpen, onClose }: SetReminderModalProps) {
    const routes = useBusStore(s => s.routes);
    
    const [reminders, setReminders] = useState<Reminder[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('ezybus_reminders');
            if (saved) return JSON.parse(saved);
        }
        return [];
    });

    const [routeId, setRouteId] = useState('');
    const [stopName, setStopName] = useState('');
    const [threshold, setThreshold] = useState('5');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('ezybus_reminders', JSON.stringify(reminders));
        }
    }, [reminders]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const selectedRoute = routes.find(r => r.id === routeId);

    const handleSave = () => {
        if (!routeId || !stopName || !threshold) return;
        const newReminder: Reminder = {
            id: Date.now().toString(),
            routeId,
            stopName,
            threshold: parseInt(threshold, 10),
        };
        setReminders(prev => [...prev, newReminder]);
        setRouteId('');
        setStopName('');
        setThreshold('5');
        setShowForm(false);
    };

    const handleDelete = (id: string) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    };

    if (!isOpen) return null;

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
                    className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Smart Reminders</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Get notified before your bus arrives</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-5 overflow-y-auto flex-1">
                        {!showForm ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Active Reminders</h3>
                                    <button 
                                        onClick={() => setShowForm(true)}
                                        className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
                                    >
                                        <Plus size={16} /> New Marker
                                    </button>
                                </div>
                                
                                {reminders.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="text-4xl mb-3 opacity-50">🔔</div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">You haven't set any reminders yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {reminders.map(r => {
                                            const routeName = routes.find(rt => rt.id === r.routeId)?.name || 'Unknown Route';
                                            return (
                                                <div key={r.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white text-sm">
                                                            Alert me <span className="text-emerald-500 font-bold">{r.threshold} mins</span> before
                                                        </p>
                                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                                                            {routeName} arriving at <span className="font-semibold">{r.stopName}</span>
                                                        </p>
                                                    </div>
                                                    <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">Set New Reminder</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Route</label>
                                    <select 
                                        value={routeId} 
                                        onChange={e => { setRouteId(e.target.value); setStopName(''); }}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white transition-all shadow-sm"
                                    >
                                        <option value="">-- Choose a route --</option>
                                        {routes.map(r => (
                                            <option key={r.id} value={r.id}>{r.name} ({r.origin} → {r.destination})</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedRoute && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 mt-4">Select Target Stop</label>
                                        <select 
                                            value={stopName} 
                                            onChange={e => setStopName(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white transition-all shadow-sm"
                                        >
                                            <option value="">-- Choose a stop --</option>
                                            {selectedRoute.stops.map(s => (
                                                <option key={s.name} value={s.name}>{s.name}</option>
                                            ))}
                                        </select>
                                    </motion.div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Alert Threshold (minutes before arrival)</label>
                                    <input 
                                        type="number" 
                                        min="1" max="60"
                                        value={threshold} 
                                        onChange={e => setThreshold(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white transition-all shadow-sm"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button 
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <GradientButton 
                                        variant="success" 
                                        className="flex-1 py-2.5"
                                        onClick={handleSave}
                                        disabled={!routeId || !stopName || !threshold}
                                    >
                                        Save Reminder
                                    </GradientButton>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
