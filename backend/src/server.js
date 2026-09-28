const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

const riskRoutes = require('./routes/riskRoutes');
const rainfallRoutes = require('./routes/rainfallRoutes');
const alertRoutes = require('./routes/alertRoutes');
const fieldReportRoutes = require('./routes/fieldReportRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', riskRoutes);
app.use('/api', rainfallRoutes);
app.use('/api', alertRoutes);
app.use('/api', fieldReportRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`[SERVER] ARARAT Backend running on port ${PORT}`);
    console.log(`[SERVER] Alert Thresholds - HIGH: ${process.env.ALERT_THRESHOLD_HIGH || 0.7}, CRITICAL: ${process.env.ALERT_THRESHOLD_CRITICAL || 0.85}`);
});
