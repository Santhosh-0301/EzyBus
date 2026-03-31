'use client';

import { motion } from 'framer-motion';
import { HTMLAttributes, forwardRef } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    glow?: boolean;
    gradient?: 'none' | 'primary' | 'accent';
    padding?: 'sm' | 'md' | 'lg';
}

const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
const gradients = {
    none: '',
    primary: 'bg-gradient-to-br from-indigo-600/10 to-cyan-500/5',
    accent: 'bg-gradient-to-br from-purple-600/10 to-indigo-500/5',
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className = '', hover = true, glow = false, gradient = 'none', padding = 'md', ...props }, ref) => {
        const base = `
      relative rounded-2xl
      bg-white dark:bg-slate-900/60 
      dark:backdrop-blur-xl
      border border-[#e2e8f0] dark:border-slate-700/50
      shadow-[0_10px_25px_rgba(0,0,0,0.05)] dark:shadow-xl dark:shadow-black/20
      ${gradients[gradient]}
      ${paddings[padding]}
      ${glow ? 'dark:shadow-indigo-500/10 dark:border-indigo-500/20' : ''}
      ${className}
    `;

        if (!hover) {
            return <div ref={ref} className={base} {...props}>{children}</div>;
        }

        return (
            <motion.div
                ref={ref as React.Ref<HTMLDivElement>}
                whileHover={{ y: -3, boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={base}
                {...(props as Record<string, unknown>)}
            >
                {children}
            </motion.div>
        );
    }
);

GlassCard.displayName = 'GlassCard';
export default GlassCard;
