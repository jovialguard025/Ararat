/**
 * Simple hash function to generate deterministic values based on coords
 */
function hashCoords(lat, lng) {
    const str = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; 
    }
    return Math.abs(hash);
}

/**
 * Get pseudo-random number between 0 and 1 based on seed
 */
function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function generateMockPrediction(lat, lng) {
    const seed = hashCoords(lat, lng);
    const risk_score = seededRandom(seed) * 0.95; // Max 0.95
    const susceptibility_score = seededRandom(seed + 1) * 0.8 + 0.2; // 0.2 to 1.0

    let risk_level = 'LOW';
    if (risk_score >= 0.85) risk_level = 'CRITICAL';
    else if (risk_score >= 0.7) risk_level = 'HIGH';
    else if (risk_score >= 0.4) risk_level = 'MODERATE';

    return {
        lat,
        lng,
        risk_score,
        risk_level,
        susceptibility_score,
        advisory: `Calculated advisory for ${risk_level} risk level.`,
        explanation: {
            shap_values: {
                rainfall_3day: seededRandom(seed + 2) * 0.2,
                slope: seededRandom(seed + 3) * 0.15,
                soil_moisture: seededRandom(seed + 4) * 0.1
            }
        },
        timestamp: new Date().toISOString()
    };
}

function generateMockRiskMap(bounds, resolution) {
    const points = [];
    const stepsLat = Math.max(1, Math.floor(Math.abs(bounds.north - bounds.south) / resolution));
    const stepsLng = Math.max(1, Math.floor(Math.abs(bounds.east - bounds.west) / resolution));
    
    // Limit total points to avoid memory issues
    const maxPoints = 5000;
    const totalDesired = stepsLat * stepsLng;
    let stepRatio = 1;
    
    if (totalDesired > maxPoints) {
        stepRatio = Math.sqrt(totalDesired / maxPoints);
    }
    
    const latStep = resolution * stepRatio;
    const lngStep = resolution * stepRatio;

    for (let lat = Math.min(bounds.south, bounds.north); lat <= Math.max(bounds.north, bounds.south); lat += latStep) {
        for (let lng = Math.min(bounds.west, bounds.east); lng <= Math.max(bounds.east, bounds.west); lng += lngStep) {
            points.push(generateMockPrediction(lat, lng));
        }
    }
    return points;
}

function generateMockRainfall(lat, lng) {
    const seed = hashCoords(lat, lng);
    return {
        lat,
        lng,
        rainfall_current: seededRandom(seed) * 50,
        rainfall_3day: seededRandom(seed + 1) * 150,
        rainfall_7day: seededRandom(seed + 2) * 300,
        soil_moisture_index: seededRandom(seed + 3),
        timestamp: new Date().toISOString()
    };
}

module.exports = {
    generateMockPrediction,
    generateMockRiskMap,
    generateMockRainfall
};
