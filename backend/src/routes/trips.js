const express = require('express');
const router = express.Router();
const { getTrips, getTripById, createTrip, updateTripStatus } = require('../controllers/tripController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

// GET /api/v1/trips — all authenticated (conductors see own trips only)
router.get('/', authenticate, getTrips);

// GET /api/v1/trips/:id
router.get('/:id', authenticate, getTripById);

// POST /api/v1/trips — admin and conductor
router.post('/', authenticate, requireRole('admin', 'conductor'), createTrip);

// PUT /api/v1/trips/:id/status — conductor and admin
router.put('/:id/status', authenticate, requireRole('admin', 'conductor'), updateTripStatus);

module.exports = router;
