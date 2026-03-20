import User from '../../models/userModel.js';
import responseHandler from '../../utils/responseHandler.js';

/**
 * GET /api/v1/users/me/authorized-emails
 * Admin only — fetch their list of authorized 2FA emails
 */
export default {
    handler: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('authorizedEmails');
            if (!user) return responseHandler.notFound(res, 'User not found');
            return responseHandler.success(res, 'Authorized emails fetched', {
                emails: user.authorizedEmails || [],
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
