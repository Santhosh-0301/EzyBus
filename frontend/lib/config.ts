/**
 * Frontend environment configuration with validation.
 *
 * Import this module instead of accessing process.env directly.
 * If a required variable is missing the app will throw at module-load time
 * with a clear message pointing to the .env.local.example file.
 */

interface EnvVar {
    key: string;
    desc: string;
    required: boolean;
}

const VARS: EnvVar[] = [
    { key: 'NEXT_PUBLIC_API_URL', required: true, desc: 'Backend API base URL (e.g. http://localhost:5000/api/v1)' },
    { key: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', required: true, desc: 'Google Maps JavaScript API key (Maps JavaScript API must be enabled)' },
    { key: 'NEXT_PUBLIC_FIREBASE_API_KEY', required: false, desc: 'Firebase web app API key' },
    { key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', required: false, desc: 'Firebase auth domain' },
    { key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', required: false, desc: 'Firebase project ID' },
    { key: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', required: false, desc: 'Firebase storage bucket' },
    { key: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', required: false, desc: 'Firebase messaging sender ID' },
    { key: 'NEXT_PUBLIC_FIREBASE_APP_ID', required: false, desc: 'Firebase web app ID' },
];

function validate(): void {
    // Only run full validation on the server side to avoid hydration issues.
    // Client-side missing-key errors will surface naturally when the feature is used.
    if (typeof window !== 'undefined') return;

    const missing = VARS.filter(({ key, required }) => {
        if (!required) return false;
        const val = process.env[key];
        return !val || val.trim() === '';
    });

    if (missing.length === 0) return;

    const lines = missing.map(({ key, desc }) => `  • ${key}\n      ${desc}`);

    throw new Error(
        `\n\n❌  EzyBus Frontend — Missing Required Environment Variables\n` +
        `${'─'.repeat(64)}\n` +
        lines.join('\n') + '\n' +
        `${'─'.repeat(64)}\n` +
        `  Copy frontend/.env.local.example → frontend/.env.local and fill in the values.\n`
    );
}

// Run validation at module load time
validate();

const config = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL as string,

    maps: {
        googleApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    },

    firebase: {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    },
} as const;

export default config;
