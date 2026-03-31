const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Assign simple waypoints to each bus so they move in lines rather than randomly drifting
const buses = [
    { id: "bus1", lat: 10.7905, lng: 78.7047, waypoints: [{lat: 10.7905, lng: 78.7047}, {lat: 10.8000, lng: 78.7100}], targetIdx: 1 },
    { id: "bus2", lat: 10.7920, lng: 78.7060, waypoints: [{lat: 10.7920, lng: 78.7060}, {lat: 10.7800, lng: 78.6900}], targetIdx: 1 },
    { id: "bus3", lat: 10.7950, lng: 78.7090, waypoints: [{lat: 10.7950, lng: 78.7090}, {lat: 10.8100, lng: 78.7200}], targetIdx: 1 },
    { id: "bus4", lat: 10.7980, lng: 78.7120, waypoints: [{lat: 10.7980, lng: 78.7120}, {lat: 10.7900, lng: 78.7300}], targetIdx: 1 },
    { id: "bus5", lat: 10.7850, lng: 78.7000, waypoints: [{lat: 10.7850, lng: 78.7000}, {lat: 10.7700, lng: 78.6800}], targetIdx: 1 },
];

const SPEED = 0.001;

setInterval(async () => {
    for (let bus of buses) {
        let target = bus.waypoints[bus.targetIdx];
        
        const dLat = target.lat - bus.lat;
        const dLng = target.lng - bus.lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        
        if (dist < SPEED) {
            bus.lat = target.lat;
            bus.lng = target.lng;
            bus.targetIdx = (bus.targetIdx + 1) % bus.waypoints.length;
        } else {
            const ratio = SPEED / dist;
            bus.lat += dLat * ratio;
            bus.lng += dLng * ratio;
        }

        await db.collection("buses").doc(bus.id).update({
            lat: bus.lat,
            lng: bus.lng,
            timestamp: Date.now(),
        });

        console.log(`Updated ${bus.id} to lat: ${bus.lat.toFixed(4)}, lng: ${bus.lng.toFixed(4)}`);
    }
}, 3000);