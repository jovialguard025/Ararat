const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory store for field reports
const fieldReports = [];

/**
 * GET /api/field-reports
 * List all submitted reports
 */
router.get('/field-reports', (req, res, next) => {
    try {
        res.json(fieldReports);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/field-reports
 * Submit a new field report
 */
router.post('/field-reports', (req, res, next) => {
    try {
        const { lat, lng, description, severity, reporter_name } = req.body;

        if (lat === undefined || lng === undefined || !description || severity === undefined) {
            return res.status(400).json({ error: 'Missing required fields: lat, lng, description, severity.' });
        }

        const sev = parseInt(severity, 10);
        if (isNaN(sev) || sev < 1 || sev > 5) {
            return res.status(400).json({ error: 'Severity must be an integer between 1 and 5.' });
        }

        const newReport = {
            id: uuidv4(),
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            description,
            severity: sev,
            reporter_name: reporter_name || 'Anonymous',
            timestamp: new Date().toISOString()
        };

        fieldReports.push(newReport);

        // Limit the size of in-memory store
        if (fieldReports.length > 500) {
            fieldReports.shift();
        }

        res.status(201).json(newReport);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
