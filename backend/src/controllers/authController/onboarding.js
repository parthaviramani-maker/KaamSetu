import bcrypt from 'bcrypt';
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
 * PATCH /api/v1/auth/onboarding
 * Authenticated. Called after Google sign-in for first-time users.
 * Body: { role, password? }
 */
export default {
    handler: async (req, res) => {
        try {
            const { role, password } = req.body;

            if (!role || !['worker', 'employer', 'agent'].includes(role)) {
                return responseHandler.badRequest(res, 'Please select a valid role: worker, employer, or agent');
            }

            const user = await User.findById(req.user.id);
            if (!user) return responseHandler.notFound(res, 'User not found');

            user.role       = role;
            user.isOnboarded = true;

            if (password) {
                if (password.length < 6) {
                    return responseHandler.badRequest(res, 'Password must be at least 6 characters');
                }
                user.password = await bcrypt.hash(password, 10);
            }

            await user.save();

            // Return fresh token with updated role
            const token = generateToken(user);

            return responseHandler.success(res, 'Onboarding complete', {
                token,
                user: {
                    id:     user._id,
                    name:   user.name,
                    email:  user.email,
                    role:   user.role,
                    avatar: user.avatar || null,
                },
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
