'use client';

import { useBusStore } from '@/store/busStore';
import { useTripStore } from '@/store/tripStore';

export default function DebugPanel() {
    const activeBuses = useBusStore(s => s.buses.filter(b => b.status === 'active').length);
    const alerts = useBusStore(s => s.alerts.length);
    const activeTrips = useTripStore(s => s.trips.filter(t => t.status === 'active').length);

    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 shadow-2xl shadow-black/50 flex flex-col gap-1 text-[10px] font-mono text-slate-400">
            <div className="flex items-center justify-between gap-4">
                <span>Active Buses:</span>
                <span className="text-emerald-400 font-bold">{activeBuses}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
                <span>Active Trips:</span>
                <span className="text-indigo-400 font-bold">{activeTrips}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
                <span>Total Alerts:</span>
                <span className="text-amber-400 font-bold">{alerts}</span>
            </div>
        </div>
    );
}
