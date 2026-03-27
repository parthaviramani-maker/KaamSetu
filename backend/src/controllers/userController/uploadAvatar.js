import User from '../../models/userModel.js';
import responseHandler from '../../utils/responseHandler.js';
import { deleteFromCloudinary } from '../../middlewares/uploadMiddleware.js';

export default {
    handler: async (req, res) => {
        try {
            if (!req.uploadedFile) {
                return responseHandler.badRequest(res, 'No image file uploaded');
            }

            const user = await User.findById(req.user.id);
            if (!user) return responseHandler.notFound(res, 'User not found');

            // Delete old Cloudinary image if it exists
            if (user.avatarPublicId) {
                await deleteFromCloudinary(user.avatarPublicId);
            }

            user.avatar        = req.uploadedFile.url;
            user.avatarPublicId = req.uploadedFile.publicId;
            await user.save();

            return responseHandler.success(res, 'Avatar uploaded successfully', {
                avatar:         user.avatar,
                avatarPublicId: user.avatarPublicId,
            });
        } catch (err) {
            console.error('[uploadAvatar] Error:', err);
            return responseHandler.internalServerError(res, err.message || 'Avatar upload failed');
        }
    },
};
