import User from '../../models/userModel.js';
import responseHandler from '../../utils/responseHandler.js';

/**
 * DELETE /api/v1/users/me
 * Permanently deletes the authenticated user's account.
 */
export default {
    handler: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.user.id);
            if (!user) {
                return responseHandler.notFound(res, 'User not found');
            }
            return responseHandler.success(res, 'Account deleted successfully');
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
