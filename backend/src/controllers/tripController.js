const db = require('../config/firebase');

const TRIPS_COLLECTION = 'trips';
const VALID_STATUSES = ['scheduled', 'active', 'completed', 'cancelled'];

/**
 * GET /api/v1/trips
 */
const getTrips = async (req, res) => {
    try {
        let query = db.collection(TRIPS_COLLECTION);

        // Conductors can only see their own trips
        if (req.user.role === 'conductor') {
            query = query.where('conductorId', '==', req.user.id);
        }

        const snapshot = await query.orderBy('createdAt', 'desc').get();
        const trips = snapshot.docs.map(doc => doc.data());
        res.status(200).json({ success: true, count: trips.length, trips });
    } catch (err) {
        console.error('GetTrips error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch trips.' });
    }
};

/**
 * GET /api/v1/trips/:id
 */
const getTripById = async (req, res) => {
    try {
        const doc = await db.collection(TRIPS_COLLECTION).doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Trip not found.' });
        res.status(200).json({ success: true, trip: doc.data() });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch trip.' });
    }
};

/**
 * POST /api/v1/trips
 */
const createTrip = async (req, res) => {
    try {
        const { busId, routeId, conductorId, startTime } = req.body;
        if (!busId || !routeId || !conductorId) {
            return res.status(400).json({ success: false, message: 'busId, routeId, conductorId are required.' });
        }

        const now = new Date().toISOString();
        const tripRef = db.collection(TRIPS_COLLECTION).doc();
        const trip = {
            id: tripRef.id, busId, routeId, conductorId,
            status: 'scheduled', passengerCount: 0,
            startTime: startTime || now, createdAt: now, updatedAt: now,
        };
        await tripRef.set(trip);
        res.status(201).json({ success: true, message: 'Trip created.', trip });
    } catch (err) {
        console.error('CreateTrip error:', err);
        res.status(500).json({ success: false, message: 'Failed to create trip.' });
    }
};

/**
 * PUT /api/v1/trips/:id/status
 */
const updateTripStatus = async (req, res) => {
    try {
        const { status, passengerCount, currentLocation } = req.body;

        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
        }

        const tripRef = db.collection(TRIPS_COLLECTION).doc(req.params.id);
        const doc = await tripRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Trip not found.' });

        const tripData = doc.data();

        // Conductors can only update their own trips
        if (req.user.role === 'conductor' && tripData.conductorId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this trip.' });
        }

        const updates = {
            status,
            updatedAt: new Date().toISOString(),
            ...(passengerCount !== undefined && { passengerCount }),
            ...(currentLocation && { currentLocation }),
            ...(status === 'completed' && { endTime: new Date().toISOString() }),
        };

        await tripRef.update(updates);
        res.status(200).json({ success: true, message: 'Trip status updated.', trip: { ...tripData, ...updates } });
    } catch (err) {
        console.error('UpdateTripStatus error:', err);
        res.status(500).json({ success: false, message: 'Failed to update trip status.' });
    }
};

module.exports = { getTrips, getTripById, createTrip, updateTripStatus };
