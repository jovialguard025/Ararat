const express = require('express');
const router = express.Router();
const alertEngine = require('../services/alertEngine');

/**
 * GET /api/alerts
 * Returns all active and acknowledged alerts
 */
router.get('/alerts', (req, res, next) => {
    try {
        res.json(alertEngine.getAllAlerts());
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/alerts/active
 * Returns only unresolved (unacknowledged) alerts
 */
router.get('/alerts/active', (req, res, next) => {
    try {
        res.json(alertEngine.getActiveAlerts());
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/alerts/acknowledge/:id
 * Acknowledge an alert
 */
router.post('/alerts/acknowledge/:id', (req, res, next) => {
    try {
        const id = req.params.id;
        const success = alertEngine.acknowledgeAlert(id);
        
        if (success) {
            res.json({ success: true, message: 'Alert acknowledged successfully.' });
        } else {
            res.status(404).json({ error: 'Alert not found.' });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
