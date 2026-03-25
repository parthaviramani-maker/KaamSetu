import User from '../../models/userModel.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    handler: async (req, res) => {
        try {
            const users = await User
                .find({ _id: { $ne: req.user.id }, isActive: true })
                .select('name email role avatar')
                .sort({ name: 1 })
                .lean();

            return responseHandler.success(res, 'Users fetched', users);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
