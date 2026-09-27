const express = require('express');
const router = express.Router();
const mockData = require('../services/mockData');

/**
 * GET /api/rainfall
 * Returns rainfall data for a specific location
 */
router.get('/rainfall', (req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);

        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ error: 'Valid latitude and longitude are required.' });
        }

        const rainfallData = mockData.generateMockRainfall(lat, lng);
        res.json(rainfallData);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/rainfall/summary
 * Returns region-wide rainfall summary
 */
router.get('/rainfall/summary', (req, res, next) => {
    try {
        // Return a static mock summary for demo purposes
        res.json({
            region: "NE India",
            average_24h: 45.2,
            average_3day: 120.5,
            average_7day: 210.0,
            status: "elevated",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
