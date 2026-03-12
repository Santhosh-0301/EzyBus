'use client';

// MapView placeholder — ready for Leaflet or Google Maps integration
// To integrate Leaflet: npm install leaflet react-leaflet @types/leaflet
// Then replace this component with a proper LeafletMap component

interface MapViewProps {
    center?: { lat: number; lng: number };
    zoom?: number;
    height?: string;
    markers?: Array<{ lat: number; lng: number; label: string; type?: 'bus' | 'stop' | 'user' }>;
}

export default function MapView({
    center = { lat: 20.5937, lng: 78.9629 },
    height = '400px',
    markers = [],
}: MapViewProps) {
    return (
        <div
            className="relative w-full rounded-2xl overflow-hidden border border-slate-700/50"
            style={{ height }}
            id="map-view-container"
        >
            {/* Grid background simulating a map */}
            <div className="absolute inset-0 bg-slate-800"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Road lines overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300" preserveAspectRatio="none">
                <line x1="0" y1="120" x2="400" y2="120" stroke="#6366f1" strokeWidth="3" />
                <line x1="200" y1="0" x2="200" y2="300" stroke="#6366f1" strokeWidth="3" />
                <line x1="0" y1="60" x2="400" y2="200" stroke="#22d3ee" strokeWidth="1.5" />
                <line x1="80" y1="0" x2="320" y2="300" stroke="#22d3ee" strokeWidth="1.5" />
                <circle cx="200" cy="120" r="25" stroke="#6366f1" strokeWidth="1.5" fill="none" />
                <circle cx="200" cy="120" r="50" stroke="#6366f1" strokeWidth="0.8" fill="none" strokeDasharray="4,4" />
            </svg>

            {/* Center marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-5 h-5 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50 border-2 border-white animate-pulse" />
            </div>

            {/* Simulated bus markers */}
            {markers.map((m, i) => (
                <div
                    key={i}
                    className="absolute"
                    style={{ left: `${30 + i * 20}%`, top: `${25 + i * 15}%` }}
                    title={m.label}
                >
                    <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg shadow-amber-500/40 border border-amber-300 whitespace-nowrap">
                        🚌 {m.label}
                    </div>
                </div>
            ))}

            {/* Integration notice */}
            <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-slate-300 text-xs">
                        Live Map — Connect Leaflet or Google Maps via <code className="text-indigo-400">components/MapView.tsx</code>
                    </p>
                </div>
            </div>

            {/* Coords display */}
            <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 py-1.5">
                <p className="text-slate-400 text-xs font-mono">
                    {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                </p>
            </div>
        </div>
    );
}
