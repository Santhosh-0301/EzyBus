const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUserRole, deleteUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

// All user management routes require admin role
// GET /api/v1/users
router.get('/', authenticate, requireRole('admin'), getUsers);

// GET /api/v1/users/:id
router.get('/:id', authenticate, requireRole('admin'), getUserById);

// PUT /api/v1/users/:id/role
router.put('/:id/role', authenticate, requireRole('admin'), updateUserRole);

// DELETE /api/v1/users/:id
router.delete('/:id', authenticate, requireRole('admin'), deleteUser);

module.exports = router;
