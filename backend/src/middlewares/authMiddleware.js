import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';
import responseHandler from '../utils/responseHandler.js';

const authenticateUser = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith('Bearer ')) {
            return responseHandler.unauthorized(res, 'Invalid authorization header format');
        }

        token = token.split(' ')[1];
        token = token.replace(/^"|"$/g, '');

        if (!token) {
            return responseHandler.unauthorized(res, 'Authorization token is required');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, name, email, role }
        next();
    } catch (error) {
        return responseHandler.unauthorized(res, error?.message || 'Invalid token');
    }
};

export default authenticateUser;
