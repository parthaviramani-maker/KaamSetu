import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../config/config.js';
import responseHandler from '../../utils/responseHandler.js';

const generateToken = (user) =>
    jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar || null },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

/**
 * POST /api/v1/auth/verify-login
 * Body: { sessionId, selectedNumber }
 */
export default {
    handler: async (req, res) => {
        try {
            const { sessionId, selectedNumber } = req.body;

            if (!sessionId || selectedNumber === undefined) {
                return responseHandler.badRequest(res, 'Session ID and selected number are required');
            }

            const user = await User.findOne({ loginVerifySessionId: sessionId });
            if (!user) {
                return responseHandler.unauthorized(res, 'Invalid or expired session. Please login again.');
            }

            if (!user.loginVerifyExpires || user.loginVerifyExpires < new Date()) {
                // Clear stale session
                user.loginVerifyCode      = null;
                user.loginVerifyExpires   = null;
                user.loginVerifySessionId = null;
                await user.save();
                return responseHandler.unauthorized(res, 'Verification code expired. Please login again.');
            }

            if (user.loginVerifyCode !== Number(selectedNumber)) {
                return responseHandler.unauthorized(res, 'Incorrect number. Please try again.');
            }

            // Clear verification fields
            user.loginVerifyCode      = null;
            user.loginVerifyExpires   = null;
            user.loginVerifySessionId = null;
            await user.save();

            const token = generateToken(user);

            return responseHandler.success(res, 'Login successful', {
                token,
                user: {
                    id:     user._id,
                    name:   user.name,
                    email:  user.email,
                    phone:  user.phone,
                    role:   user.role,
                    avatar: user.avatar || null,
                },
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
