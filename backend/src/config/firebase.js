const admin = require("firebase-admin");

// Load Firebase service account credentials from JSON file
// Get this file from: Firebase Console > Project Settings > Service Accounts > Generate new private key
const serviceAccount = require("../../serviceAccountKey.json");

const isMock = serviceAccount.project_id === 'ezy-bus-2' && serviceAccount.private_key.includes('MOCK');
let db;

if (isMock) {
    console.warn("⚠️  Mock Firebase Credentials Detected. Using in-memory database mock to prevent API crashes.");
    // Deep-mock Firestore to prevent 500 errors on the frontend
    const createMockRef = (id) => ({
        id,
        get: async () => ({ exists: true, data: () => ({ id, mock: true }) }),
        set: async (val) => val,
        update: async (val) => val,
        delete: async () => true,
    });

    db = {
        collection: (colName) => ({
            doc: (docId = `mock-id-${Date.now()}`) => createMockRef(docId),
            get: async () => ({
                empty: false,
                docs: [{ data: () => ({ id: 'mock-1', name: 'Mock Data', password: '$2a$12$ZqMockHashQZMockHashQZMockHashQZMockHashQZMockHashQZMockH' }) }] // A valid bcrypt hash
            }),
            where: function () { return this; },
            limit: function () { return this; },
            add: async (val) => createMockRef(`mock-id-${Date.now()}`)
        })
    };
} else {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
    db = admin.firestore();
}

module.exports = db;