const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const buses = [
    { id: "bus1", lat: 10.7905, lng: 78.7047 },
    { id: "bus2", lat: 10.7920, lng: 78.7060 },
    { id: "bus3", lat: 10.7950, lng: 78.7090 },
    { id: "bus4", lat: 10.7980, lng: 78.7120 },
    { id: "bus5", lat: 10.7850, lng: 78.7000 },
];

setInterval(async () => {
    for (let bus of buses) {
        bus.lat += (Math.random() - 0.5) * 0.001;
        bus.lng += (Math.random() - 0.5) * 0.001;

        await db.collection("buses").doc(bus.id).update({
            lat: bus.lat,
            lng: bus.lng,
            timestamp: Date.now(),
        });

        console.log(`Updated ${bus.id}`);
    }
}, 3000);