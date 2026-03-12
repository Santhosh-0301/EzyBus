/**
 * @fileoverview Shared constants for the EzyBus platform
 */

// ── User Roles ──────────────────────────────────────────────────────────────
const ROLES = Object.freeze({
    COMMUTER: 'commuter',
    CONDUCTOR: 'conductor',
    ADMIN: 'admin',
});

// ── Trip Status ──────────────────────────────────────────────────────────────
const TRIP_STATUS = Object.freeze({
    SCHEDULED: 'scheduled',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
});

// ── Bus Status ───────────────────────────────────────────────────────────────
const BUS_STATUS = Object.freeze({
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    MAINTENANCE: 'maintenance',
});

// ── API Base Path ────────────────────────────────────────────────────────────
const API_VERSION = 'v1';
const API_BASE = `/api/${API_VERSION}`;

module.exports = {
    ROLES,
    TRIP_STATUS,
    BUS_STATUS,
    API_VERSION,
    API_BASE,
};
