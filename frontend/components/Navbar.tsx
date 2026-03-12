'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const roleColors: Record<string, string> = {
    admin: 'bg-purple-600',
    conductor: 'bg-amber-500',
    commuter: 'bg-emerald-600',
};

const roleDashboard: Record<string, string> = {
    admin: '/dashboard/admin',
    conductor: '/dashboard/conductor',
    commuter: '/dashboard/commuter',
};

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard/commuter', label: 'Commuter' },
    { href: '/dashboard/conductor', label: 'Conductor' },
    { href: '/dashboard/admin', label: 'Admin' },
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => { logout(); router.push('/'); setUserMenuOpen(false); };

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    const visibleLinks = navLinks.filter(link => {
        if (link.href === '/') return true;
        if (!user) return false;
        return link.href === `/dashboard/${user.role}`;
    });

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-[#e2e8f0] dark:border-slate-700/40 shadow-sm dark:shadow-xl dark:shadow-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="relative w-32 h-14 flex items-center justify-center overflow-hidden"
                            style={{ margin: '-10px 0' }}
                        >
                            <Image 
                                src="/ezybus-logo.png" 
                                alt="EzyBus Logo" 
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {visibleLinks.map(link => {
                            const active = isActive(link.href);
                            return (
                                <Link key={link.href} href={link.href} id={`nav-${link.label.toLowerCase()}`}>
                                    <motion.div
                                        whileHover={{ y: -1 }}
                                        className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                    >
                                        {active && (
                                            <motion.div
                                                layoutId="nav-active-pill"
                                                className="absolute inset-0 bg-indigo-50 dark:bg-slate-700/70 rounded-lg"
                                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative">{link.label}</span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right section */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setUserMenuOpen(o => !o)}
                                    className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-xl hover:bg-slate-700/50 transition-colors"
                                >
                                    {/* Avatar */}
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                        {user.name?.[0]?.toUpperCase() ?? 'U'}
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300 text-sm max-w-[100px] truncate">{user.name}</span>
                                    <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                        <ChevronDown size={14} className="text-slate-500" />
                                    </motion.div>
                                </motion.button>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden"
                                        >
                                            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700/50">
                                                <p className="text-slate-900 dark:text-white text-sm font-medium truncate">{user.name}</p>
                                                <p className="text-slate-500 text-xs truncate">{user.email}</p>
                                            </div>
                                            <div className="p-1.5">
                                                <Link href={roleDashboard[user.role] || '/'} onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 text-sm transition-colors">
                                                    Dashboard
                                                </Link>
                                                <button onClick={handleLogout} id="logout-btn"
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-sm transition-colors">
                                                    Sign out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/#roles" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium px-3 py-2 transition-colors">
                                    Roles
                                </Link>
                                <Link href="/login/commuter" id="navbar-sign-in">
                                    <motion.span
                                        whileHover={{ scale: 1.04, y: -1 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="inline-block bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-500/25 transition-colors"
                                    >
                                        Sign In
                                    </motion.span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={menuOpen ? 'close' : 'open'}
                                initial={{ opacity: 0, rotate: -30 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 30 }}
                                transition={{ duration: 0.15 }}
                            >
                                {menuOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.span>
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        className="md:hidden border-t border-slate-200 dark:border-slate-700/50 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
                    >
                        <div className="p-3 space-y-1">
                            {visibleLinks.map(link => (
                                <Link key={link.href} href={link.href}
                                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(link.href) ? 'bg-indigo-50 dark:bg-slate-700/70 text-indigo-700 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}
                                    onClick={() => setMenuOpen(false)}>
                                    {link.label}
                                </Link>
                            ))}
                            <div className="border-t border-slate-700/50 pt-2 mt-1 flex items-center justify-between px-4 py-2">
                                {user ? (
                                    <button onClick={handleLogout} className="text-sm text-red-400">Sign out</button>
                                ) : (
                                    <Link href="/login/commuter" className="text-sm text-indigo-400" onClick={() => setMenuOpen(false)}>Sign In</Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
