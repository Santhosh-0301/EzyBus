'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const roles = [
    { value: 'commuter', label: 'Commuter', icon: '🧍', desc: 'Track buses & plan trips' },
    { value: 'conductor', label: 'Conductor', icon: '👨‍✈️', desc: 'Manage active trips' },
    { value: 'admin', label: 'Admin', icon: '⚙️', desc: 'Full system control' },
];

function RegisterForm() {
    const { register } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultRole = searchParams.get('role') || 'commuter';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(defaultRole);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dashboardMap: Record<string, string> = {
        commuter: '/commuter',
        conductor: '/conductor',
        admin: '/admin',
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        try {
            console.log("Mock register:", { name, email, role });
            // Mock skipping the backend to prevent API failure
            router.push(dashboardMap[role] || '/commuter');
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr?.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative">
            <div className="hero-blob w-72 h-72 bg-purple-600 -top-10 right-0" />
            <div className="hero-blob w-56 h-56 bg-cyan-500 bottom-10 -left-10" style={{ animationDelay: '2s' }} />

            <div className="glass-card w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-7">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/30">
                        <span className="text-2xl">🚌</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join EzyBus today</p>
                </div>

                {error && (
                    <div className="bg-[#fef2f2] border-[#fecaca] text-[#b91c1c] dark:bg-red-500/10 dark:border border-red-500/30 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Full Name</label>
                        <input id="register-name" type="text" className="input-field" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
                    </div>
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Email Address</label>
                        <input id="register-email" type="email" className="input-field" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                    </div>
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Password</label>
                        <input id="register-password" type="password" className="input-field" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
                    </div>

                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Select Your Role</label>
                        <div className="grid grid-cols-3 gap-2">
                            {roles.map(r => (
                                <button
                                    key={r.value}
                                    type="button"
                                    id={`role-${r.value}`}
                                    onClick={() => setRole(r.value)}
                                    className={`p-3 rounded-xl border text-center transition-all ${role === r.value
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-white'
                                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-slate-500'
                                        }`}
                                >
                                    <div className="text-xl mb-1">{r.icon}</div>
                                    <div className="text-xs font-medium">{r.label}</div>
                                </button>
                            ))}
                        </div>
                        <p className="text-slate-500 text-xs mt-2 text-center">
                            {roles.find(r => r.value === role)?.desc}
                        </p>
                    </div>

                    <button id="register-submit" type="submit" disabled={loading} className="btn-primary mt-2">
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-5">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-slate-400">Loading…</div></div>}>
            <RegisterForm />
        </Suspense>
    );
}
