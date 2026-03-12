'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: ReactNode;
    trend?: { direction: 'up' | 'down' | 'neutral'; value: string };
    color?: 'indigo' | 'cyan' | 'amber' | 'emerald' | 'purple' | 'red';
    className?: string;
}

const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
    indigo: { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', glow: 'hover:shadow-indigo-500/10' },
    cyan: { text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', glow: 'hover:shadow-cyan-500/10' },
    amber: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'hover:shadow-amber-500/10' },
    emerald: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'hover:shadow-emerald-500/10' },
    purple: { text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', glow: 'hover:shadow-purple-500/10' },
    red: { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', glow: 'hover:shadow-red-500/10' },
};

const trendColors = { up: 'text-emerald-600 dark:text-emerald-400', down: 'text-red-600 dark:text-red-400', neutral: 'text-slate-500 dark:text-slate-400' };
const trendIcons = { up: '↑', down: '↓', neutral: '→' };

export default function StatCard({ label, value, icon, trend, color = 'indigo', className = '' }: StatCardProps) {
    const c = colorMap[color];
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`
        relative rounded-2xl p-5 border border-slate-200 dark:border-transparent backdrop-blur-xl
        bg-white/95 dark:bg-slate-900/60 shadow-xl shadow-black/5 dark:shadow-black/20
        transition-shadow duration-300
        ${c.border} ${c.glow}
        ${className}
      `}
        >
            {/* Background tint */}
            <div className={`absolute inset-0 rounded-2xl ${c.bg} opacity-50`} />

            <div className="relative">
                {/* Icon */}
                {icon && (
                    <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
                        <span className={`${c.text} text-xl`}>{icon}</span>
                    </div>
                )}

                {/* Value */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-3xl font-bold tracking-tight ${c.text} mb-1`}
                >
                    {value}
                </motion.div>

                {/* Label + trend */}
                <div className="flex items-center justify-between">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
                    {trend && (
                        <span className={`text-xs font-semibold ${trendColors[trend.direction]}`}>
                            {trendIcons[trend.direction]} {trend.value}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
