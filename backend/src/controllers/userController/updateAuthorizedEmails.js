import User from '../../models/userModel.js';
import responseHandler from '../../utils/responseHandler.js';

/**
 * PUT /api/v1/users/me/authorized-emails
 * Admin only — update their list of trusted 2FA emails (max 5)
 */
export default {
    handler: async (req, res) => {
        try {
            const { emails } = req.body;

            if (!Array.isArray(emails)) {
                return responseHandler.badRequest(res, 'emails must be an array');
            }
            if (emails.length > 5) {
                return responseHandler.badRequest(res, 'Maximum 5 authorized emails allowed');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const invalid = emails.filter(e => !emailRegex.test(String(e).trim()));
            if (invalid.length > 0) {
                return responseHandler.badRequest(res, `Invalid email(s): ${invalid.join(', ')}`);
            }

            const cleanEmails = [...new Set(emails.map(e => String(e).toLowerCase().trim()))];

            const updated = await User.findByIdAndUpdate(
                req.user.id,
                { $set: { authorizedEmails: cleanEmails } },
                { new: true, select: 'authorizedEmails', runValidators: false }
            );
            if (!updated) return responseHandler.notFound(res, 'User not found');

            return responseHandler.success(res, 'Authorized emails updated', {
                emails: updated.authorizedEmails,
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
