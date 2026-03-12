'use client';

import { useEffect, useMemo } from 'react';
import { LoadScript, GoogleMap, Marker, Polyline, Circle } from '@react-google-maps/api';
import { useBusStore, selectBusMarkers } from '@/store/busStore';

const mapContainerStyle = { width: '100%', height: '100%' };

const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
    { elementType: 'geometry', stylers: [{ color: '#1a1f2e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8b949e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1f2e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d3748' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a1f2e' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3d4a6b' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e2535' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1e2a3a' }] },
];

const CHENNAI = { lat: 13.0827, lng: 80.2707 };

interface BusMapProps {
    buses?: Array<{ id: string; lat: number; lng: number; label: string }>;
    center?: google.maps.LatLngLiteral;
    zoom?: number;
    height?: string;
    showTrails?: boolean;
    showRoutes?: boolean;
    showStops?: boolean;
}

export default function BusMap({
    buses: busesOverride,
    center = CHENNAI,
    zoom = 12,
    height = '500px',
    showTrails = true,
    showRoutes = true,
    showStops = true,
}: BusMapProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const storeMarkers = useBusStore(selectBusMarkers);
    const storeBuses = useBusStore(s => s.buses);
    const routes = useBusStore(s => s.routes);
    const markers = busesOverride ?? storeMarkers;

    // ── Route polylines (active routes only) ──────────────────────────────────
    const routePolylines = useMemo(
        () =>
            showRoutes
                ? routes
                    .filter(r => r.active)
                    .map(r => ({
                        id: r.id,
                        color: r.color,
                        path: r.stops.map(s => ({ lat: s.location.lat, lng: s.location.lng })),
                    }))
                : [],
        [routes, showRoutes]
    );

    // ── Stop markers (circles at each stop) ───────────────────────────────────
    const stopCircles = useMemo(
        () =>
            showStops
                ? routes.flatMap(r =>
                    r.stops.map((stop, i) => ({
                        key: `${r.id}-${i}`,
                        position: { lat: stop.location.lat, lng: stop.location.lng },
                        isTerminus: i === 0 || i === r.stops.length - 1,
                        color: r.color,
                        name: stop.name,
                    }))
                )
                : [],
        [routes, showStops]
    );

    // ── Bus trails (location history polylines) ────────────────────────────────
    const trails = useMemo(
        () =>
            showTrails
                ? storeBuses
                    .filter(b => b.status === 'active' && b.locationHistory.length > 1)
                    .map(b => ({
                        id: b.id,
                        path: [b.currentLocation, ...b.locationHistory].map(p => ({
                            lat: p.lat,
                            lng: p.lng,
                        })),
                    }))
                : [],
        [storeBuses, showTrails]
    );

    // A real Google Maps API key typically starts with "AIza" and is ~39 chars
    const isInvalidKey = !apiKey || apiKey.includes('your-google-maps') || apiKey.length < 20;

    // ── API key fallback ───────────────────────────────────────────────────────
    if (isInvalidKey) {
        return (
            <div
                className="w-full bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 relative overflow-hidden"
                style={{ height }}
            >
                {/* Simulated route lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300" preserveAspectRatio="none">
                    {routePolylines.map((r, i) => (
                        <polyline
                            key={r.id}
                            points={r.path.map((_, j) => `${50 + j * 70},${80 + i * 40 + (j % 2) * 20}`).join(' ')}
                            fill="none" stroke={r.color} strokeWidth="2"
                        />
                    ))}
                </svg>

                {/* Animated bus pins */}
                {markers.map((m, i) => (
                    <div key={m.id}
                        className="absolute flex items-center justify-center"
                        style={{ top: `${20 + (i * 22) % 60}%`, left: `${15 + (i * 19) % 70}%` }}>
                        <div className="w-8 h-8 rounded-full bg-indigo-500/40 border border-indigo-400/60 flex items-center justify-center text-xs font-bold text-white animate-pulse"
                            style={{ animationDelay: `${i * 0.5}s`, animationDuration: '3s' }}>
                            🚌
                        </div>
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 text-indigo-300 text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap">
                            {m.label}
                        </div>
                    </div>
                ))}

                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 rounded-xl px-4 py-2 text-center">
                        <p className="text-slate-400 text-xs mb-1">
                            <span className="text-indigo-400 font-mono text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span> not set
                        </p>
                        <div className="flex flex-wrap justify-center gap-1.5">
                            {markers.slice(0, 5).map(m => (
                                <span key={m.id} className="bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                                    {m.label}
                                </span>
                            ))}
                            {markers.length > 5 && (
                                <span className="text-slate-500 text-[10px]">+{markers.length - 5}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full rounded-xl overflow-hidden border border-slate-700/50" style={{ height }}>
            <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={zoom}
                    options={{
                        disableDefaultUI: false, zoomControl: true,
                        streetViewControl: false, mapTypeControl: false,
                        styles: DARK_MAP_STYLES,
                    }}
                >
                    {/* ── Route polylines ────────────────────────────────────────────── */}
                    {routePolylines.map(r => (
                        <Polyline key={r.id} path={r.path}
                            options={{ strokeColor: r.color, strokeOpacity: 0.55, strokeWeight: 3, geodesic: true }} />
                    ))}

                    {/* ── Bus trail polylines ──────────────────────────────────────── */}
                    {trails.map(t => (
                        <Polyline key={`trail-${t.id}`} path={t.path}
                            options={{ strokeColor: '#6366f1', strokeOpacity: 0.35, strokeWeight: 2, geodesic: true }} />
                    ))}

                    {/* ── Stop circles ─────────────────────────────────────────────── */}
                    {stopCircles.map(s => (
                        <Circle key={s.key} center={s.position}
                            options={{
                                strokeColor: s.color, strokeOpacity: 0.8, strokeWeight: s.isTerminus ? 2 : 1,
                                fillColor: s.color, fillOpacity: s.isTerminus ? 0.35 : 0.15,
                                radius: s.isTerminus ? 80 : 50,
                                clickable: true,
                            }}
                        />
                    ))}

                    {/* ── Bus markers ──────────────────────────────────────────────── */}
                    {markers.map(m => (
                        <Marker key={m.id}
                            position={{ lat: m.lat, lng: m.lng }}
                            label={{ text: m.label, color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                            title={m.label}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
