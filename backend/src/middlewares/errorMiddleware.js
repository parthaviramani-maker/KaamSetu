import responseHandler from '../utils/responseHandler.js';

// =============================================================================
// KAAMSETU — GLOBAL ERROR HANDLER MIDDLEWARE
// Register LAST in server.js: app.use(errorMiddleware)
// Catches any error passed via next(error) from any route/controller
// =============================================================================

const errorMiddleware = (err, req, res, next) => {
    // Mongoose — validation error (missing required field, wrong type, etc.)
    if (err.name === 'ValidationError') {
        return responseHandler.validationError(res, err);
    }

    // Mongoose — duplicate key (unique index violation)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        const value = err.keyValue?.[field] || '';
        return responseHandler.conflict(res, `${field} '${value}' already exists`);
    }

    // Mongoose — bad ObjectId format
    if (err.name === 'CastError') {
        return responseHandler.badRequest(res, `Invalid ${err.path}: ${err.value}`);
    }

    // JWT — invalid token
    if (err.name === 'JsonWebTokenError') {
        return responseHandler.unauthorized(res, 'Invalid token. Please log in again.');
    }

    // JWT — expired token
    if (err.name === 'TokenExpiredError') {
        return responseHandler.unauthorized(res, 'Token expired. Please log in again.');
    }

    // CORS — blocked origin
    if (err.message === 'Not allowed by CORS') {
        return responseHandler.forbidden(res, 'CORS policy: this origin is not allowed.');
    }

    // Payload too large
    if (err.type === 'entity.too.large') {
        return responseHandler.error(res, 'Request payload is too large.', 413);
    }

    // Fallback — unexpected server error
    return responseHandler.internalServerError(res, err);
};

export default errorMiddleware;
