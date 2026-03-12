const db = require('../config/firebase');

const USERS_COLLECTION = 'users';
const VALID_ROLES = ['commuter', 'conductor', 'admin'];

/**
 * GET /api/v1/users
 */
const getUsers = async (req, res) => {
    try {
        const snapshot = await db.collection(USERS_COLLECTION).get();
        const users = snapshot.docs.map(doc => {
            const { password, ...user } = doc.data();
            return user;
        });
        res.status(200).json({ success: true, count: users.length, users });
    } catch (err) {
        console.error('GetUsers error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    }
};

/**
 * GET /api/v1/users/:id
 */
const getUserById = async (req, res) => {
    try {
        const doc = await db.collection(USERS_COLLECTION).doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'User not found.' });
        const { password, ...user } = doc.data();
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch user.' });
    }
};

/**
 * PUT /api/v1/users/:id/role
 */
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!VALID_ROLES.includes(role)) {
            return res.status(400).json({ success: false, message: `Invalid role. Must be: ${VALID_ROLES.join(', ')}` });
        }

        const userRef = db.collection(USERS_COLLECTION).doc(req.params.id);
        const doc = await userRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'User not found.' });

        await userRef.update({ role, updatedAt: new Date().toISOString() });
        res.status(200).json({ success: true, message: `User role updated to ${role}.` });
    } catch (err) {
        console.error('UpdateUserRole error:', err);
        res.status(500).json({ success: false, message: 'Failed to update user role.' });
    }
};

/**
 * DELETE /api/v1/users/:id
 */
const deleteUser = async (req, res) => {
    try {
        const userRef = db.collection(USERS_COLLECTION).doc(req.params.id);
        const doc = await userRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'User not found.' });
        await userRef.delete();
        res.status(200).json({ success: true, message: 'User deleted.' });
    } catch (err) {
        console.error('DeleteUser error:', err);
        res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
};

module.exports = { getUsers, getUserById, updateUserRole, deleteUser };
