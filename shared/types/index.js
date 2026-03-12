/**
 * @fileoverview Shared type definitions for EzyBus platform
 * Used by both frontend and backend for consistency.
 */

/**
 * @typedef {'commuter' | 'conductor' | 'admin'} UserRole
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {string} [phone]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} GeoLocation
 * @property {number} lat
 * @property {number} lng
 */

/**
 * @typedef {'active' | 'inactive' | 'maintenance'} BusStatus
 *
 * @typedef {Object} Bus
 * @property {string} id
 * @property {string} busNumber
 * @property {number} capacity
 * @property {BusStatus} status
 * @property {GeoLocation} [currentLocation]
 * @property {string} [currentTripId]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Stop
 * @property {string} name
 * @property {GeoLocation} location
 * @property {number} order
 */

/**
 * @typedef {Object} Route
 * @property {string} id
 * @property {string} name
 * @property {string} origin
 * @property {string} destination
 * @property {Stop[]} stops
 * @property {number} estimatedDuration  minutes
 * @property {string} createdAt
 */

/**
 * @typedef {'scheduled' | 'active' | 'completed' | 'cancelled'} TripStatus
 *
 * @typedef {Object} Trip
 * @property {string} id
 * @property {string} busId
 * @property {string} routeId
 * @property {string} conductorId
 * @property {TripStatus} status
 * @property {number} passengerCount
 * @property {string} startTime
 * @property {string} [endTime]
 * @property {GeoLocation} [currentLocation]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} userId
 * @property {string} title
 * @property {string} message
 * @property {boolean} read
 * @property {string} createdAt
 */

module.exports = {};
