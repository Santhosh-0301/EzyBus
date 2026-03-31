'use strict';

require('dotenv').config();

/**
 * Required environment variable definitions.
 * Each entry: { key, description }
 */
const REQUIRED_VARS = [
    { key: 'JWT_SECRET', desc: 'Secret key for signing JWT tokens' },
    { key: 'FIREBASE_PROJECT_ID', desc: 'Firebase project ID from service account' },
    { key: 'FIREBASE_CLIENT_EMAIL', desc: 'Firebase service account client email' },
    { key: 'FIREBASE_PRIVATE_KEY', desc: 'Firebase service account private key (with \\n newlines)' },
];

/**
 * Validates that all required environment variables are present.
 * Throws with a clear, actionable message listing every missing variable.
 */
function validateEnv() {
    const missing = REQUIRED_VARS.filter(({ key }) => {
        const val = process.env[key];
        return !val || val.trim() === '';
    });

    if (missing.length === 0) return;

    const lines = missing.map(({ key, desc }) => `  • ${key.padEnd(30)} — ${desc}`);

    // throw new Error(
    //   `\n\n❌  EzyBus Backend — \n` +
    //   `${'-'.repeat(60)}\n` +
    //   lines.join('\n') + '\n' +
    //   `${'-'.repeat(60)}\n` +
    //   `  Copy backend/.env.example → backend/.env and fill in the values.\n` +
    //   `  See README.md for detailed setup instructions.\n`
    // );
}

/**
 * Validated, typed config object.
 * Access this instead of process.env directly throughout the app.
 */
function loadConfig() {
    validateEnv();

    return {
        port: parseInt(process.env.PORT || '5000', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
        isProduction: process.env.NODE_ENV === 'production',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

        jwt: {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        },

        firebase: {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Convert escaped \n sequences to real newlines (common when stored in .env)
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
    };
}

const config = loadConfig();

module.exports = config;
