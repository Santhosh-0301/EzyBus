const express = require('express');
const router = express.Router();
const { getBuses, getBusById, createBus, updateBus, deleteBus } = require('../controllers/busController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

// GET /api/v1/buses — all authenticated users
router.get('/', authenticate, getBuses);

// GET /api/v1/buses/:id
router.get('/:id', authenticate, getBusById);

// POST /api/v1/buses — admin only
router.post('/', authenticate, requireRole('admin'), createBus);

// PUT /api/v1/buses/:id — admin only
router.put('/:id', authenticate, requireRole('admin'), updateBus);

// DELETE /api/v1/buses/:id — admin only
router.delete('/:id', authenticate, requireRole('admin'), deleteBus);

module.exports = router;
