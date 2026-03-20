import responseHandler from '../utils/responseHandler.js';

// Usage: requireRole('employer')  or  requireRole('admin', 'employer')
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return responseHandler.unauthorized(res, 'Authentication required');
    }
    if (!roles.includes(req.user.role)) {
        return responseHandler.forbidden(
            res,
            `Access restricted. Required role: ${roles.join(' or ')}`
        );
    }
    next();
};

export default requireRole;
