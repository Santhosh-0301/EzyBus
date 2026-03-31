'use client';

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Bus, Map, Bell, Settings,
    ChevronLeft, ChevronRight, X,
} from 'lucide-react';

const items = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/commuter' },
    { icon: Bus, label: 'Live Buses', href: '/dashboard/commuter' },
    { icon: Map, label: 'Routes', href: '/dashboard/commuter' },
    { icon: Bell, label: 'Alerts', href: '/dashboard/commuter' },
    { icon: Settings, label: 'Settings', href: '/dashboard/commuter' },
];

interface SidebarProps {
    role?: 'commuter' | 'conductor' | 'admin';
}

export interface SidebarHandle {
    open: () => void;
}

const roleBase: Record<string, string> = {
    commuter: '/dashboard/commuter',
    conductor: '/dashboard/conductor',
    admin: '/dashboard/admin',
};

const roleItems = (role: string) => {
    const base = roleBase[role] || '/dashboard/commuter';
    if (role === 'admin') {
        return [
            { icon: LayoutDashboard, label: 'Overview',   href: base, targetId: null },
            { icon: Bus,             label: 'Live Fleet', href: base, targetId: 'fleet-map' },
            { icon: Bell,            label: 'Alerts',     href: base, targetId: 'admin-tabs-section' },
            { icon: Settings,        label: 'Settings',   href: '/dashboard/settings', targetId: null },
        ];
    }
    if (role === 'conductor') {
        return [
            { icon: LayoutDashboard, label: 'Overview',      href: base, targetId: null },
            { icon: Bus,             label: 'Current Trip',  href: base, targetId: 'active-trip-panel' },
            { icon: Map,             label: 'My Trips',      href: base, targetId: 'my-trips-panel' },
            { icon: Settings,        label: 'Settings',      href: '/dashboard/settings', targetId: null },
        ];
    }
    // commuter default
    return [
        { icon: LayoutDashboard, label: 'Overview',    href: base, targetId: null },
        { icon: Bus,             label: 'Live Buses',  href: base, targetId: 'live-bus-tracking' },
        { icon: Map,             label: 'Routes',      href: base, targetId: 'available-routes' },
        { icon: Bell,            label: 'Alerts',      href: base, targetId: 'live-alerts' },
        { icon: Settings,        label: 'Settings',    href: '/dashboard/settings', targetId: null },
    ];
};

const Sidebar = forwardRef<SidebarHandle, SidebarProps>(function Sidebar({ role = 'commuter' }, ref) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const nav = roleItems(role);

    // Expose open() to parent via ref
    useImperativeHandle(ref, () => ({ open: () => setMobileOpen(true) }), []);

    // Initialize active label based on current exact pathname, fallback to Overview
    const [activeLabel, setActiveLabel] = useState(() => {
        const match = nav.find(n => n.href === pathname);
        return match ? match.label : 'Overview';
    });

    useEffect(() => {
        const match = nav.find(n => n.href === pathname);
        if (match) setActiveLabel(match.label);
    }, [pathname, nav]);

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <AnimatePresence initial={false}>
                    {!collapsed && (
                        <motion.span
                            key="label"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="text-xs font-semibold text-slate-500 uppercase tracking-widest"
                        >
                            Navigation
                        </motion.span>
                    )}
                </AnimatePresence>
                {/* Mobile close */}
                <button onClick={() => setMobileOpen(false)} className="md:hidden text-slate-500 hover:text-white">
                    <X size={16} />
                </button>
                {/* Desktop collapse */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title={collapsed ? 'Expand' : 'Collapse'}
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {nav.map(({ icon: Icon, label, href, targetId }) => {
                    const active = activeLabel === label;

                    const handleClick = (e: React.MouseEvent) => {
                        setActiveLabel(label);
                        setMobileOpen(false);
                        if (targetId && pathname === href) {
                            e.preventDefault();
                            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else if (pathname === href && !targetId) {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    };

                    return (
                        <Link key={label} href={href} onClick={handleClick}>
                            <motion.div
                                whileHover={{ x: collapsed ? 0 : 4 }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${active
                                    ? 'bg-indigo-600/20 border border-indigo-500/30 text-white'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                                    }`}
                            >
                                {/* Icon */}
                                <div className={`shrink-0 w-5 h-5 flex items-center justify-center ${active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`}>
                                    <Icon size={17} />
                                </div>

                                {/* Label */}
                                <AnimatePresence initial={false}>
                                    {!collapsed && (
                                        <motion.span
                                            key={label}
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                        >
                                            {label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Active dot */}
                                {active && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer role badge */}
            {!collapsed && (
                <div className="p-4 border-t border-slate-800">
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-full text-white text-center uppercase tracking-wider ${role === 'admin' ? 'bg-purple-600/60' : role === 'conductor' ? 'bg-amber-500/60' : 'bg-emerald-600/60'
                        }`}>
                        {role}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.aside
                        initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed left-0 top-0 h-full w-64 bg-slate-900 backdrop-blur-xl border-r border-slate-800 z-50 md:hidden"
                    >
                        {sidebarContent}
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 64 : 220 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden md:block shrink-0 h-full bg-slate-900 backdrop-blur-xl border-r border-slate-800 overflow-hidden"
                style={{ minHeight: '100%' }}
            >
                {sidebarContent}
            </motion.aside>
        </>
    );
});

export default Sidebar;
