import User from '../../models/userModel.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    handler: async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return responseHandler.badRequest(res, { message: 'Email is required' });
            }
            const existing = await User.findOne({ email: email.toLowerCase().trim() });
            if (existing) {
                return responseHandler.conflict(res, 'Email already exists');
            }
            return responseHandler.success(res, 'Email is available');
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
