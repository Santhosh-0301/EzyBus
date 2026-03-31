'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import GradientButton from './GradientButton';

export default function PlanJourneyModal({ isOpen, onClose, onSearch }: { isOpen: boolean, onClose: () => void, onSearch: (query: string) => void }) {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const handleSearch = () => {
        const query = `${from} ${to}`.trim();
        onSearch(query);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div 
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        onClick={e => e.stopPropagation()}
                        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Plan Your Journey</h2>
                                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">From</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <MapPin size={16} className="text-emerald-500" />
                                        </div>
                                        <input 
                                            value={from}
                                            onChange={e => setFrom(e.target.value)}
                                            placeholder="Current location or stop" 
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-all dark:text-white dark:placeholder-slate-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">To</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <MapPin size={16} className="text-red-500" />
                                        </div>
                                        <input 
                                            value={to}
                                            onChange={e => setTo(e.target.value)}
                                            placeholder="Where do you want to go?" 
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-all dark:text-white dark:placeholder-slate-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <GradientButton onClick={handleSearch} className="w-full" icon={<Search size={18} />}>
                                    Find Routes
                                </GradientButton>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
