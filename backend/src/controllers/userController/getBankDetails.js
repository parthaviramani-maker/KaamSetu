import Joi from 'joi';
import User from '../../models/userModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({ query: Joi.object({}) }),
    handler: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('bankDetails');
            if (!user) return responseHandler.notFound(res, 'User not found');

            return responseHandler.success(res, 'Bank details fetched', user.bankDetails || {});
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
