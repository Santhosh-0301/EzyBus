'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes } from 'react';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'accent' | 'success' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

const variants = {
    primary: 'from-indigo-600 to-cyan-500 shadow-indigo-500/30 hover:shadow-indigo-500/50',
    accent: 'from-purple-600 to-indigo-500 shadow-purple-500/30 hover:shadow-purple-500/50',
    success: 'from-emerald-600 to-teal-500 shadow-emerald-500/30 hover:shadow-emerald-500/50',
    danger: 'from-red-600 to-rose-500 shadow-red-500/30 hover:shadow-red-500/50',
    ghost: 'from-slate-700 to-slate-600 shadow-black/20 hover:shadow-black/30',
};

const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3.5 text-base gap-2.5',
};

export default function GradientButton({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    className = '',
    disabled,
    ...props
}: GradientButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: disabled || loading ? 1 : 1.03, y: disabled || loading ? 0 : -1 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            disabled={disabled || loading}
            className={`
        relative inline-flex items-center justify-center font-semibold rounded-xl text-white
        bg-gradient-to-r ${variants[variant]}
        shadow-lg transition-shadow duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]}
        ${className}
      `}
            {...(props as Record<string, unknown>)}
        >
            {/* Glow overlay */}
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />

            {loading ? (
                <>
                    <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="relative">Loading…</span>
                </>
            ) : (
                <>
                    {icon && <span className="relative shrink-0">{icon}</span>}
                    <span className="relative">{children}</span>
                </>
            )}
        </motion.button>
    );
}
