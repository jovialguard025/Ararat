/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, next) {
    console.error(`[ERROR] ${err.name}: ${err.message}`);
    
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: statusCode
        }
    });
}

module.exports = errorHandler;
