import User from '../../models/userModel.js';
import responseHandler from '../../utils/responseHandler.js';
import { deleteFromCloudinary } from '../../middlewares/uploadMiddleware.js';

export default {
    handler: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) return responseHandler.notFound(res, 'User not found');

            if (!user.avatarPublicId && !user.avatar) {
                return responseHandler.badRequest(res, 'No avatar to remove');
            }

            // Delete from Cloudinary
            if (user.avatarPublicId) {
                await deleteFromCloudinary(user.avatarPublicId);
            }

            user.avatar        = null;
            user.avatarPublicId = null;
            await user.save();

            return responseHandler.success(res, 'Avatar removed successfully');
        } catch (err) {
            console.error('[removeAvatar] Error:', err);
            return responseHandler.internalServerError(res, err.message || 'Avatar removal failed');
        }
    },
};
