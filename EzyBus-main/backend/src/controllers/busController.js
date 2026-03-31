const db = require('../config/firebase');

const BUSES_COLLECTION = 'buses';

/**
 * GET /api/v1/buses
 */
const getBuses = async (req, res) => {
    try {
        const snapshot = await db.collection(BUSES_COLLECTION).get();
        const buses = snapshot.docs.map(doc => doc.data());
        res.status(200).json({ success: true, count: buses.length, buses });
    } catch (err) {
        console.error('GetBuses error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch buses.' });
    }
};

/**
 * GET /api/v1/buses/:id
 */
const getBusById = async (req, res) => {
    try {
        const doc = await db.collection(BUSES_COLLECTION).doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Bus not found.' });
        }
        res.status(200).json({ success: true, bus: doc.data() });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch bus.' });
    }
};

/**
 * POST /api/v1/buses
 */
const createBus = async (req, res) => {
    try {
        const { busNumber, capacity } = req.body;
        if (!busNumber || !capacity) {
            return res.status(400).json({ success: false, message: 'busNumber and capacity are required.' });
        }

        const now = new Date().toISOString();
        const busRef = db.collection(BUSES_COLLECTION).doc();
        const bus = { id: busRef.id, busNumber, capacity, status: 'inactive', createdAt: now, updatedAt: now };
        await busRef.set(bus);

        res.status(201).json({ success: true, message: 'Bus created.', bus });
    } catch (err) {
        console.error('CreateBus error:', err);
        res.status(500).json({ success: false, message: 'Failed to create bus.' });
    }
};

/**
 * PUT /api/v1/buses/:id
 */
const updateBus = async (req, res) => {
    try {
        const busRef = db.collection(BUSES_COLLECTION).doc(req.params.id);
        const doc = await busRef.get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Bus not found.' });
        }

        const updates = { ...req.body, updatedAt: new Date().toISOString() };
        delete updates.id;
        await busRef.update(updates);

        res.status(200).json({ success: true, message: 'Bus updated.', bus: { ...doc.data(), ...updates } });
    } catch (err) {
        console.error('UpdateBus error:', err);
        res.status(500).json({ success: false, message: 'Failed to update bus.' });
    }
};

/**
 * DELETE /api/v1/buses/:id
 */
const deleteBus = async (req, res) => {
    try {
        const busRef = db.collection(BUSES_COLLECTION).doc(req.params.id);
        const doc = await busRef.get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Bus not found.' });
        }
        await busRef.delete();
        res.status(200).json({ success: true, message: 'Bus deleted.' });
    } catch (err) {
        console.error('DeleteBus error:', err);
        res.status(500).json({ success: false, message: 'Failed to delete bus.' });
    }
};

module.exports = { getBuses, getBusById, createBus, updateBus, deleteBus };
