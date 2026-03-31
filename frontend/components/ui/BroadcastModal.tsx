'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Megaphone } from 'lucide-react';
import { useBusStore } from '@/store/busStore';
import GradientButton from './GradientButton';
import type { AlertSeverity } from '@/lib/types';

interface BroadcastModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BroadcastModal({ isOpen, onClose }: BroadcastModalProps) {
    const addAlert = useBusStore(s => s.addAlert);

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertSeverity>('info');

    if (!isOpen) return null;

    const handleBroadcast = () => {
        if (!title.trim() || !message.trim()) return;
        
        // Dispatch the broadcast alert
        addAlert({
            title: title.trim(),
            message: message.trim(),
            severity,
        });

        // Reset and close
        setTitle('');
        setMessage('');
        setSeverity('info');
        onClose();
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
                    <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-indigo-50 dark:bg-indigo-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Megaphone size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Broadcast Alert</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Send a system-wide announcement</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Severity Level</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(["info", "success", "warning", "critical"] as AlertSeverity[]).map(sev => (
                                    <button
                                        key={sev}
                                        onClick={() => setSeverity(sev)}
                                        className={`capitalize text-xs py-2 rounded-lg font-medium transition-all border ${
                                            severity === sev 
                                                ? sev === 'critical' ? 'bg-red-500 text-white border-red-500' :
                                                  sev === 'warning' ? 'bg-amber-500 text-white border-amber-500' :
                                                  sev === 'success' ? 'bg-emerald-500 text-white border-emerald-500' :
                                                  'bg-indigo-500 text-white border-indigo-500'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        {sev}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Alert Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Extreme Weather Warning"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message Details</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter the full alert message here..."
                                rows={4}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all outline-none resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button 
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <GradientButton 
                                variant="primary" 
                                className="flex-1 py-2.5"
                                onClick={handleBroadcast}
                                disabled={!title.trim() || !message.trim()}
                                icon={<Send size={15} />}
                            >
                                Broadcast Now
                            </GradientButton>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
