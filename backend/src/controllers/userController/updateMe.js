import Joi from 'joi';
import User from '../../models/userModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        body: Joi.object({
            name: Joi.string().min(2).max(100).optional(),
            phone: Joi.string().allow('', null).optional(),
        }),
    }),
    handler: async (req, res) => {
        try {
            const { name, phone } = req.body;
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { name, phone },
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return responseHandler.notFound(res, 'User not found');
            }
            return responseHandler.success(res, 'Profile updated', user);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
