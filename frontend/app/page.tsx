import Link from 'next/link';

const features = [
  {
    icon: '🗺️',
    title: 'Live Bus Tracking',
    desc: 'Real-time GPS tracking of buses on interactive maps with arrival predictions.',
    color: 'from-indigo-500/20 to-indigo-600/5',
    border: 'border-indigo-500/20',
  },
  {
    icon: '🎫',
    title: 'Smart Route Search',
    desc: 'Find the fastest routes between stops with real-time schedule updates.',
    color: 'from-cyan-500/20 to-cyan-600/5',
    border: 'border-cyan-500/20',
  },
  {
    icon: '👨‍✈️',
    title: 'Conductor Tools',
    desc: 'Manage active trips, update statuses, and track passenger counts in real-time.',
    color: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/20',
  },
  {
    icon: '⚙️',
    title: 'Admin Dashboard',
    desc: 'Full control over users, buses, routes, and operational analytics.',
    color: 'from-purple-500/20 to-purple-600/5',
    border: 'border-purple-500/20',
  },
  {
    icon: '🔔',
    title: 'Instant Alerts',
    desc: 'Push notifications for delays, stop arrivals, and service disruptions.',
    color: 'from-emerald-500/20 to-emerald-600/5',
    border: 'border-emerald-500/20',
  },
  {
    icon: '🔒',
    title: 'Secure & Role-Based',
    desc: 'JWT authentication with strict role-based access for all three user types.',
    color: 'from-rose-500/20 to-rose-600/5',
    border: 'border-rose-500/20',
  },
];

const stats = [
  { value: '3', label: 'User Roles' },
  { value: 'REST', label: 'API Architecture' },
  { value: 'JWT', label: 'Authentication' },
  { value: '🔥', label: 'Firebase Powered' },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="hero-blob w-96 h-96 bg-indigo-600 top-20 -left-32" />
      <div className="hero-blob w-80 h-80 bg-cyan-500 top-40 right-0" style={{ animationDelay: '2s' }} />
      <div className="hero-blob w-64 h-64 bg-purple-600 bottom-20 left-1/3" style={{ animationDelay: '4s' }} />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
          Real-time Bus Management Platform
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-none">
          <span className="text-slate-900 dark:text-white">Smarter</span>{' '}
          <span className="gradient-text">Transit</span>
          <br />
          <span className="text-slate-900 dark:text-white">For Everyone</span>
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          EzyBus connects commuters, conductors, and administrators in one unified platform.
          Track buses live, manage routes, and keep your city moving.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#roles"
            id="hero-get-started"
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-8 py-4 rounded-xl text-base shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all"
          >
            Choose Your Role
          </Link>
          <Link
            href="/login/commuter"
            id="hero-sign-in"
            className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold px-8 py-4 rounded-xl text-base transition-all hover:-translate-y-0.5"
          >
            Sign In →
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-4 text-center stat-card">
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-slate-400 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Everything You Need
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            A complete toolkit for modern public transportation management.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`glass-card p-6 block cursor-default transition-transform hover:-translate-y-1 hover:scale-[1.02] bg-gradient-to-br ${f.color} border ${f.border}`}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role CTA Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="glass-card p-10 text-center bg-gradient-to-br from-indigo-600/10 to-cyan-600/5 border border-indigo-500/20">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Choose Your Role</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">EzyBus is built for everyone in the transit ecosystem.</p>
          <div id="roles" className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { role: 'Commuter', icon: '🧍', desc: 'Track buses & plan trips', color: 'bg-emerald-600' },
              { role: 'Conductor', icon: '👨‍✈️', desc: 'Manage active trips', color: 'bg-amber-500' },
              { role: 'Admin', icon: '⚙️', desc: 'Full system control', color: 'bg-purple-600' },
            ].map((r) => (
              <Link
                key={r.role}
                href={`/login/${r.role.toLowerCase()}`}
                className="block p-5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-500/50 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-2">{r.icon}</div>
                <div className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full text-white mb-2 ${r.color}`}>{r.role}</div>
                <p className="text-slate-300 dark:text-slate-400 text-sm">{r.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
