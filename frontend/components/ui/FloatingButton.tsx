'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Play, AlertTriangle, Navigation } from 'lucide-react';

export interface FloatingAction {
    icon: React.ElementType;
    label: string;
    color: string;
    shadow: string;
    onClick?: () => void;
}

const defaultActions: FloatingAction[] = [
    { icon: Play, label: 'Start Trip', color: 'bg-indigo-600 hover:bg-indigo-500', shadow: 'shadow-indigo-500/40' },
    { icon: AlertTriangle, label: 'Report Delay', color: 'bg-amber-500 hover:bg-amber-400', shadow: 'shadow-amber-500/40' },
    { icon: Navigation, label: 'Emergency Alert', color: 'bg-red-600 hover:bg-red-500', shadow: 'shadow-red-500/40' },
];

export default function FloatingButton({ actions = defaultActions }: { actions?: FloatingAction[] }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 flex flex-col-reverse items-end gap-3 z-40">
            {/* Action buttons (expand upward) */}
            <AnimatePresence>
                {open && actions.map((a, i) => {
                    const Icon = a.icon;
                    return (
                        <motion.div
                            key={a.label}
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 20 }}
                            transition={{ delay: i * 0.06, type: 'spring', stiffness: 400, damping: 22 }}
                            className="flex items-center gap-3"
                        >
                            {/* Label bubble */}
                            <motion.span
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 12 }}
                                transition={{ delay: i * 0.06 + 0.05 }}
                                className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap"
                            >
                                {a.label}
                            </motion.span>

                            {/* Circular button */}
                            <motion.button
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.92 }}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl ${a.shadow} ${a.color} transition-colors`}
                                onClick={() => {
                                    setOpen(false);
                                    if (a.onClick) a.onClick();
                                }}
                            >
                                <Icon size={18} />
                            </motion.button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Main FAB */}
            <motion.button
                onClick={() => setOpen(o => !o)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/40 ring-2 ring-indigo-500/30"
            >
                {open ? <X size={22} /> : <Plus size={22} />}
            </motion.button>
        </div>
    );
}
