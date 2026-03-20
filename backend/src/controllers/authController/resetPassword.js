import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../../models/userModel.js';
import responseHandler from '../../utils/responseHandler.js';

/**
 * POST /api/v1/auth/reset-password/:token
 * Body: { password }
 */
export default {
    handler: async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            if (!password || password.length < 6) {
                return responseHandler.badRequest(res, 'Password must be at least 6 characters');
            }

            const hashed = crypto.createHash('sha256').update(token).digest('hex');

            const user = await User.findOne({
                resetPasswordToken:   hashed,
                resetPasswordExpires: { $gt: Date.now() },
            });

            if (!user) {
                return responseHandler.badRequest(res, 'Reset link is invalid or has expired. Please request a new one.');
            }

            user.password             = await bcrypt.hash(password, 10);
            user.resetPasswordToken   = null;
            user.resetPasswordExpires = null;
            await user.save();

            return responseHandler.success(res, 'Password reset successfully. You can now log in.');
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
