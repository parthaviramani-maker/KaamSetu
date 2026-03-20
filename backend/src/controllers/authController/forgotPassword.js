import crypto from 'crypto';
import User from '../../models/userModel.js';
import { sendPasswordResetEmail } from '../../utils/mailer.js';
import responseHandler from '../../utils/responseHandler.js';

/**
 * POST /api/v1/auth/forgot-password
 * Body: { email }
 */
export default {
    handler: async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return responseHandler.badRequest(res, 'Email is required');
            }

            const user = await User.findOne({ email: email.toLowerCase().trim() });

            if (!user) {
                return responseHandler.notFound(res, 'No account found with this email address.');
            }

            // Generate secure token
            const token  = crypto.randomBytes(32).toString('hex');
            const hashed = crypto.createHash('sha256').update(token).digest('hex');

            user.resetPasswordToken   = hashed;
            user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
            await user.save();

            await sendPasswordResetEmail(user.email, token);

            return responseHandler.success(res, 'If this email is registered, a reset link has been sent.');
        } catch (error) {
            console.error('Forgot password error:', error.message);
            return responseHandler.internalServerError(res, error);
        }
    },
};
