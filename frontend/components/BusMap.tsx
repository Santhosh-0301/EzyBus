'use client';

import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBusStore, selectBusMarkers } from '@/store/busStore';

const CHENNAI = { lat: 13.0827, lng: 80.2707 };

interface BusMapProps {
    buses?: Array<{ id: string; lat: number; lng: number; label: string }>;
    center?: { lat: number; lng: number };
    zoom?: number;
    height?: string;
    showTrails?: boolean;
    showRoutes?: boolean;
    showStops?: boolean;
    selectedRouteId?: string | null;
}

export default function BusMap({
    buses: busesOverride,
    center = CHENNAI,
    zoom = 12,
    height = '500px',
    showTrails = true,
    showRoutes = true,
    showStops = true,
    selectedRouteId = null,
}: BusMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    
    // Store Leaflet layers to clean them up on updates
    const layersRef = useRef<{
        routes: L.Polyline[];
        trails: L.Polyline[];
        stops: L.Circle[];
        markers: L.Marker[];
    }>({
        routes: [],
        trails: [],
        stops: [],
        markers: [],
    });

    const storeMarkers = useBusStore(selectBusMarkers);
    const storeBuses = useBusStore(s => s.buses);
    const selectBus = useBusStore(s => s.selectBus);
    const routes = useBusStore(s => s.routes);
    const markers = busesOverride ?? storeMarkers;

    // Initialize Map
    useEffect(() => {
        if (!mapInstance.current && mapRef.current) {
            const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);
            
            // Dark map tiles
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
            });

            mapInstance.current = map;
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // Update map view if center/zoom changes
    useEffect(() => {
        if (mapInstance.current) {
            mapInstance.current.setView([center.lat, center.lng], zoom);
        }
    }, [center.lat, center.lng, zoom]);

    // Update layers when data changes
    useEffect(() => {
        const map = mapInstance.current;
        if (!map) return;

        // Clear existing layers
        layersRef.current.routes.forEach(layer => map.removeLayer(layer));
        layersRef.current.trails.forEach(layer => map.removeLayer(layer));
        layersRef.current.stops.forEach(layer => map.removeLayer(layer));
        layersRef.current.markers.forEach(layer => map.removeLayer(layer));

        layersRef.current = { routes: [], trails: [], stops: [], markers: [] };

        const displayRoutes = selectedRouteId 
            ? routes.filter(r => r.id === selectedRouteId) 
            : routes.filter(r => r.active);

        // ── Route polylines ──────────────────────────────────────────────
        if (showRoutes) {
            displayRoutes.forEach(r => {
                const pathCoords = r.path 
                    ? r.path.map(p => [p.lat, p.lng] as [number, number])
                    : r.stops.map(s => [s.location.lat, s.location.lng] as [number, number]);
                const polyline = L.polyline(pathCoords, {
                    color: r.color,
                    opacity: 0.55,
                    weight: 3,
                }).addTo(map);
                layersRef.current.routes.push(polyline);
            });
        }

        // ── Bus trails ────────────────────────────────────────
        if (showTrails) {
            storeBuses.filter(b => b.status === 'active' && b.locationHistory.length > 1 && (!selectedRouteId || b.routeId === selectedRouteId)).forEach(b => {
                const path = [b.currentLocation, ...b.locationHistory].map(p => [p.lat, p.lng] as [number, number]);
                const polyline = L.polyline(path, {
                    color: '#6366f1',
                    opacity: 0.35,
                    weight: 2,
                }).addTo(map);
                layersRef.current.trails.push(polyline);
            });
        }

        // ── Stop circles ───────────────────────────────────────────────
        if (showStops) {
            displayRoutes.forEach(r => {
                r.stops.forEach((stop, i) => {
                    const isTerminus = i === 0 || i === r.stops.length - 1;
                    const circle = L.circle([stop.location.lat, stop.location.lng], {
                        color: r.color,
                        opacity: 0.8,
                        weight: isTerminus ? 2 : 1,
                        fillColor: r.color,
                        fillOpacity: isTerminus ? 0.35 : 0.15,
                        radius: isTerminus ? 80 : 50,
                    }).addTo(map);
                    layersRef.current.stops.push(circle);
                });
            });
        }

        // ── Bus markers ────────────────────────────────────────────────
        markers.forEach(m => {
            // Create custom icon to show the label text
            const icon = L.divIcon({
                className: 'custom-bus-marker',
                html: `<div style="background-color: #6366f1; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);">🚌</div>
                       <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: #1e293b; color: #a5b4fc; font-size: 10px; padding: 2px 4px; border-radius: 4px; white-space: nowrap; border: 1px solid #334155;">${m.label}</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
            });
            const marker = L.marker([m.lat, m.lng], { icon, title: m.label }).addTo(map);
            marker.on('click', () => {
                selectBus(m.id);
            });
            layersRef.current.markers.push(marker);
        });

    }, [routes, storeBuses, markers, showRoutes, showTrails, showStops, selectedRouteId]);

    return (
        <div className="w-full rounded-xl overflow-hidden border border-slate-700/50" style={{ height }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 0 }} />
        </div>
    );
}
