'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="w-9 h-9" />;

    const cycle = () => {
        if (theme === 'dark') setTheme('light');
        else if (theme === 'light') setTheme('system');
        else setTheme('dark');
    };

    const icons = { dark: Moon, light: Sun, system: Monitor };
    const labels = { dark: 'Dark', light: 'Light', system: 'System' };
    const Icon = icons[(theme as keyof typeof icons) ?? 'dark'] ?? Moon;

    return (
        <motion.button
            onClick={cycle}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            title={`Theme: ${labels[(theme as keyof typeof labels) ?? 'dark']}`}
            aria-label="Toggle theme"
            className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all shadow-sm dark:shadow-none"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                    transition={{ duration: 0.18 }}
                    className="absolute"
                >
                    <Icon size={16} />
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
}
