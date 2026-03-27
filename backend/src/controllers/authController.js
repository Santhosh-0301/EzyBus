const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/firebase');

const USERS_COLLECTION = 'users';

/**
 * Generate a JWT token for a user
 */
const signToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

/**
 * POST /api/v1/auth/register
 */
const register = async (req, res) => {
    try {
        const { name, email, password, role = 'commuter' } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
        }

        const validRoles = ['commuter', 'conductor', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role.' });
        }

        // Check if email already exists
        const existingSnapshot = await db.collection(USERS_COLLECTION)
            .where('email', '==', email).limit(1).get();

        if (!existingSnapshot.empty) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const now = new Date().toISOString();

        const userRef = db.collection(USERS_COLLECTION).doc();
        const userData = {
            id: userRef.id,
            name,
            email,
            password: hashedPassword,
            role,
            createdAt: now,
            updatedAt: now,
        };

        await userRef.set(userData);

        const token = signToken(userData);
        const { password: _, ...userWithoutPassword } = userData;

        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            token,
            user: userWithoutPassword,
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, message: 'Registration failed.' });
    }
};

/**
 * POST /api/v1/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const snapshot = await db.collection(USERS_COLLECTION)
            .where('email', '==', email).limit(1).get();

        if (snapshot.empty) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const userData = snapshot.docs[0].data();
        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const token = signToken(userData);
        const { password: _, ...userWithoutPassword } = userData;

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            user: userWithoutPassword,
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Login failed.' });
    }
};

/**
 * GET /api/v1/auth/me
 */
const getMe = async (req, res) => {
    try {
        const userDoc = await db.collection(USERS_COLLECTION).doc(req.user.id).get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const { password: _, ...userWithoutPassword } = userDoc.data();
        res.status(200).json({ success: true, user: userWithoutPassword });
    } catch (err) {
        console.error('GetMe error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch user.' });
    }
};

module.exports = { register, login, getMe };
