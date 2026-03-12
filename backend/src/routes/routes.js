const express = require('express');
const router = express.Router();
const { getRoutes, getRouteById, createRoute, updateRoute, deleteRoute } = require('../controllers/routeController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

// GET /api/v1/routes — all authenticated users
router.get('/', authenticate, getRoutes);

// GET /api/v1/routes/:id
router.get('/:id', authenticate, getRouteById);

// POST /api/v1/routes — admin only
router.post('/', authenticate, requireRole('admin'), createRoute);

// PUT /api/v1/routes/:id — admin only
router.put('/:id', authenticate, requireRole('admin'), updateRoute);

// DELETE /api/v1/routes/:id — admin only
router.delete('/:id', authenticate, requireRole('admin'), deleteRoute);

module.exports = router;
