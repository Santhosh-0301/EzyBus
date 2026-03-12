const db = require('../config/firebase');

const ROUTES_COLLECTION = 'routes';

/**
 * GET /api/v1/routes
 */
const getRoutes = async (req, res) => {
    try {
        const snapshot = await db.collection(ROUTES_COLLECTION).get();
        const routes = snapshot.docs.map(doc => doc.data());
        res.status(200).json({ success: true, count: routes.length, routes });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch routes.' });
    }
};

/**
 * GET /api/v1/routes/:id
 */
const getRouteById = async (req, res) => {
    try {
        const doc = await db.collection(ROUTES_COLLECTION).doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Route not found.' });
        res.status(200).json({ success: true, route: doc.data() });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch route.' });
    }
};

/**
 * POST /api/v1/routes
 */
const createRoute = async (req, res) => {
    try {
        const { name, origin, destination, stops = [], estimatedDuration } = req.body;
        if (!name || !origin || !destination) {
            return res.status(400).json({ success: false, message: 'name, origin, and destination are required.' });
        }

        const now = new Date().toISOString();
        const routeRef = db.collection(ROUTES_COLLECTION).doc();
        const route = { id: routeRef.id, name, origin, destination, stops, estimatedDuration: estimatedDuration || 0, createdAt: now, updatedAt: now };
        await routeRef.set(route);

        res.status(201).json({ success: true, message: 'Route created.', route });
    } catch (err) {
        console.error('CreateRoute error:', err);
        res.status(500).json({ success: false, message: 'Failed to create route.' });
    }
};

/**
 * PUT /api/v1/routes/:id
 */
const updateRoute = async (req, res) => {
    try {
        const routeRef = db.collection(ROUTES_COLLECTION).doc(req.params.id);
        const doc = await routeRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Route not found.' });
        const updates = { ...req.body, updatedAt: new Date().toISOString() };
        delete updates.id;
        await routeRef.update(updates);
        res.status(200).json({ success: true, message: 'Route updated.', route: { ...doc.data(), ...updates } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update route.' });
    }
};

/**
 * DELETE /api/v1/routes/:id
 */
const deleteRoute = async (req, res) => {
    try {
        const routeRef = db.collection(ROUTES_COLLECTION).doc(req.params.id);
        const doc = await routeRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Route not found.' });
        await routeRef.delete();
        res.status(200).json({ success: true, message: 'Route deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete route.' });
    }
};

module.exports = { getRoutes, getRouteById, createRoute, updateRoute, deleteRoute };
