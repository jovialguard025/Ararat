const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const ALERT_THRESHOLD_HIGH = parseFloat(process.env.ALERT_THRESHOLD_HIGH || '0.7');
const ALERT_THRESHOLD_CRITICAL = parseFloat(process.env.ALERT_THRESHOLD_CRITICAL || '0.85');

let alerts = [];
const MAX_ALERTS = 100;

/**
 * Evaluate predictions and generate alerts
 * @param {Array} predictions - Array of prediction objects
 */
function checkAndGenerateAlerts(predictions) {
    predictions.forEach(p => {
        if (p.risk_score >= ALERT_THRESHOLD_HIGH) {
            // Check if an alert already exists for this nearby location to prevent spam
            const exists = alerts.some(a => 
                !a.acknowledged && 
                Math.abs(a.lat - p.lat) < 0.05 && 
                Math.abs(a.lng - p.lng) < 0.05
            );

            if (!exists) {
                const level = p.risk_score >= ALERT_THRESHOLD_CRITICAL ? 'CRITICAL' : 'HIGH';
                const newAlert = {
                    id: uuidv4(),
                    lat: p.lat,
                    lng: p.lng,
                    risk_score: p.risk_score,
                    risk_level: level,
                    message: `Landslide risk is ${level} in this area (score: ${(p.risk_score * 100).toFixed(1)}%).`,
                    created_at: new Date().toISOString(),
                    acknowledged: false
                };
                
                alerts.unshift(newAlert);
                
                if (alerts.length > MAX_ALERTS) {
                    alerts.pop();
                }
                
                console.log(`[ALERT] Generated ${level} alert for [${p.lat}, ${p.lng}]`);
            }
        }
    });
}

/**
 * Get all alerts
 * @returns {Array} Array of alerts
 */
function getAllAlerts() {
    return alerts;
}

/**
 * Get active (unacknowledged) alerts
 * @returns {Array} Array of active alerts
 */
function getActiveAlerts() {
    return alerts.filter(a => !a.acknowledged);
}

/**
 * Acknowledge an alert
 * @param {string} id - Alert ID
 * @returns {boolean} True if found and updated, false otherwise
 */
function acknowledgeAlert(id) {
    const alert = alerts.find(a => a.id === id);
    if (alert) {
        alert.acknowledged = true;
        return true;
    }
    return false;
}

module.exports = {
    checkAndGenerateAlerts,
    getAllAlerts,
    getActiveAlerts,
    acknowledgeAlert
};
