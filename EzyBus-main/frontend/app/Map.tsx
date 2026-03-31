"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function Map() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        const loadMap = async () => {
            const L = await import("leaflet"); // ✅ dynamic import

            if (!mapInstance.current && mapRef.current) {
                const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "&copy; OpenStreetMap contributors",
                }).addTo(map);

                mapInstance.current = map;
            }
        };

        loadMap();
    }, []);

    return <div ref={mapRef} style={{ height: "500px", width: "100%" }} />;
}