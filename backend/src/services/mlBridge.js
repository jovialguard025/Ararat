const { execFile } = require('child_process');
const mockData = require('./mockData');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const PYTHON_PATH = process.env.PYTHON_PATH || 'python';
const ML_PIPELINE_PATH = process.env.ML_PIPELINE_PATH || '../ml-pipeline';

/**
 * Run ML prediction for a single point
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Object} features - Additional features
 * @returns {Promise<Object>} Prediction result
 */
function runPrediction(lat, lng, features = {}) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, '..', '..', ML_PIPELINE_PATH, 'predict.py');
        const args = [scriptPath, '--lat', lat.toString(), '--lng', lng.toString(), '--features', JSON.stringify(features)];

        execFile(PYTHON_PATH, args, { timeout: 30000 }, (error, stdout, stderr) => {
            if (error) {
                console.warn(`[ML-Bridge] Python execution failed or timed out: ${error.message}. Falling back to mock data.`);
                return resolve(mockData.generateMockPrediction(lat, lng));
            }

            try {
                // Try to parse the last line of stdout as JSON
                const lines = stdout.trim().split('\n');
                const lastLine = lines[lines.length - 1];
                const result = JSON.parse(lastLine);
                resolve(result);
            } catch (parseError) {
                console.warn(`[ML-Bridge] Failed to parse Python output: ${parseError.message}. Falling back to mock data.`);
                resolve(mockData.generateMockPrediction(lat, lng));
            }
        });
    });
}

/**
 * Run ML prediction for a grid
 * @param {Object} bounds - Bounding box {north, south, east, west}
 * @param {number} resolution - Grid resolution
 * @returns {Promise<Array>} Array of prediction results
 */
function runGridPrediction(bounds, resolution = 0.01) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, '..', '..', ML_PIPELINE_PATH, 'predict_grid.py');
        const args = [
            scriptPath,
            '--bounds', JSON.stringify(bounds),
            '--resolution', resolution.toString()
        ];

        execFile(PYTHON_PATH, args, { timeout: 30000 }, (error, stdout, stderr) => {
            if (error) {
                console.warn(`[ML-Bridge] Python grid execution failed: ${error.message}. Falling back to mock data.`);
                return resolve(mockData.generateMockRiskMap(bounds, resolution));
            }

            try {
                const lines = stdout.trim().split('\n');
                const lastLine = lines[lines.length - 1];
                const result = JSON.parse(lastLine);
                resolve(result);
            } catch (parseError) {
                console.warn(`[ML-Bridge] Failed to parse Python grid output. Falling back to mock data.`);
                resolve(mockData.generateMockRiskMap(bounds, resolution));
            }
        });
    });
}

module.exports = {
    runPrediction,
    runGridPrediction
};
