'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PanelProps {
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    padding?: 'sm' | 'md' | 'lg';
}

const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' };

export default function Panel({ title, subtitle, icon, action, children, className = '', padding = 'md' }: PanelProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={`rounded-2xl bg-white/95 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden ${className}`}
        >
            {/* Header */}
            {(title || action) && (
                <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700/40">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-sm">
                                {icon}
                            </div>
                        )}
                        <div>
                            {title && <h2 className="text-slate-900 dark:text-white font-semibold text-sm">{title}</h2>}
                            {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
                        </div>
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}
            {/* Body */}
            <div className={paddings[padding]}>{children}</div>
        </motion.section>
    );
}
