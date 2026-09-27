const express = require('express');
const router = express.Router();
const mlBridge = require('../services/mlBridge');
const alertEngine = require('../services/alertEngine');

/**
 * GET /api/risk-map
 * Generates a grid of risk scores for a bounding box
 */
router.get('/risk-map', async (req, res, next) => {
    try {
        const { north, south, east, west, resolution = 0.01 } = req.query;

        if (!north || !south || !east || !west) {
            return res.status(400).json({ error: 'Bounding box coordinates (north, south, east, west) are required.' });
        }

        const bounds = {
            north: parseFloat(north),
            south: parseFloat(south),
            east: parseFloat(east),
            west: parseFloat(west)
        };
        const resValue = parseFloat(resolution);

        const predictions = await mlBridge.runGridPrediction(bounds, resValue);
        
        // Check for alerts based on new predictions
        alertEngine.checkAndGenerateAlerts(predictions);

        const features = predictions.map(p => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [p.lng, p.lat]
            },
            properties: {
                risk_score: p.risk_score,
                risk_level: p.risk_level,
                susceptibility_score: p.susceptibility_score
            }
        }));

        res.json({
            type: 'FeatureCollection',
            features
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/risk/:lat/:lng
 * Point-based risk query
 */
router.get('/risk/:lat/:lng', async (req, res, next) => {
    try {
        const lat = parseFloat(req.params.lat);
        const lng = parseFloat(req.params.lng);
        
        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ error: 'Valid latitude and longitude are required.' });
        }

        const rainfallFeatures = req.query;
        const prediction = await mlBridge.runPrediction(lat, lng, rainfallFeatures);
        
        alertEngine.checkAndGenerateAlerts([prediction]);

        res.json(prediction);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/predict
 * Full prediction with body payload
 */
router.post('/predict', async (req, res, next) => {
    try {
        const { lat, lng, rainfallFeatures, terrainFeatures } = req.body;
        
        if (lat === undefined || lng === undefined) {
            return res.status(400).json({ error: 'Latitude and longitude are required.' });
        }

        // Merge features to pass to the ML bridge
        const features = { ...rainfallFeatures, ...terrainFeatures };
        const prediction = await mlBridge.runPrediction(parseFloat(lat), parseFloat(lng), features);
        
        alertEngine.checkAndGenerateAlerts([prediction]);

        res.json(prediction);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
