'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, Variants } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Panel from '@/components/ui/Panel';
import ThemeToggle from '@/components/ThemeToggle';
import GradientButton from '@/components/ui/GradientButton';
import { Settings, User, Bell, Shield, LogOut, CheckCircle2 } from 'lucide-react';

const container: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } } };

export default function SettingsDashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push('/login/commuter');
    }, [user, loading, router]);

    if (loading || !user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        </div>
    );

    return (
        <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900/50">
            <Sidebar role={user.role as 'commuter' | 'conductor' | 'admin'} />

            <div className="flex-1 page-container min-w-0 py-8 px-4 sm:px-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Settings className="text-indigo-500" /> System Settings
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account preferences, theme, and application settings.</p>
                </motion.div>

                <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left Column: Navigation or smaller blocks */}
                    <div className="md:col-span-1 space-y-6">
                        <Panel title="Profile Overview" icon={<User size={18} />}>
                            <div className="text-center py-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/30 mb-4">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{user.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 capitalize bg-slate-100 dark:bg-slate-800 inline-block px-3 py-1 rounded-full mt-2 border border-slate-200 dark:border-slate-700">
                                    {user.role} Role
                                </p>
                            </div>
                        </Panel>

                        <Panel title="Quick Actions" icon={<Shield size={18} />}>
                            <div className="space-y-3">
                                <GradientButton 
                                    variant="danger" 
                                    className="w-full flex justify-center py-2" 
                                    onClick={() => {
                                        logout();
                                        router.push('/');
                                    }}
                                >
                                    <LogOut size={16} className="mr-2" /> Sign Out
                                </GradientButton>
                            </div>
                        </Panel>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="md:col-span-2 space-y-6">
                        
                        <motion.div variants={item}>
                            <Panel title="Appearance" icon={<ThemeToggle />} subtitle="Customize the interface">
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                                    <div>
                                        <h4 className="font-medium text-slate-900 dark:text-white">Color Theme</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Switch between dark, light, or system settings using the toggle in the panel header.</p>
                                    </div>
                                    <div className="scale-125 ml-4">
                                        <ThemeToggle />
                                    </div>
                                </div>
                            </Panel>
                        </motion.div>

                        <motion.div variants={item}>
                            <Panel title="Notifications" icon={<Bell size={18} />} subtitle="Manage your alert preferences">
                                <div className="space-y-3">
                                    {[
                                        { label: "Push Notifications", desc: "Receive real-time alerts on bus delays", defaultChecked: true },
                                        { label: "Email Summaries", desc: "Daily digest of your trips and alerts", defaultChecked: false },
                                        { label: "Sound Alerts", desc: "Play a sound when critical notifications arrive", defaultChecked: true }
                                    ].map((opt, i) => (
                                        <label key={i} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 cursor-pointer hover:border-indigo-500/30 transition-colors group">
                                            <div className="flex-1 mt-0.5">
                                                <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">{opt.label}</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{opt.desc}</p>
                                            </div>
                                            <input type="checkbox" defaultChecked={opt.defaultChecked} className="w-5 h-5 mt-1 accent-indigo-500 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer" />
                                        </label>
                                    ))}
                                    
                                    <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-end">
                                        <GradientButton 
                                            variant="primary" 
                                            size="sm" 
                                            onClick={() => {
                                                setSaved(true);
                                                setTimeout(() => setSaved(false), 3000);
                                            }}
                                            icon={saved ? <CheckCircle2 size={16} /> : undefined}
                                            className={saved ? "from-emerald-600 to-emerald-500" : ""}
                                        >
                                            {saved ? 'Preferences Saved' : 'Save Preferences'}
                                        </GradientButton>
                                    </div>
                                </div>
                            </Panel>
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}
