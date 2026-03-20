import Joi from 'joi';
import User from '../../models/userModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        query: Joi.object({
            role: Joi.string().valid('employer', 'worker', 'agent').optional(),
            search: Joi.string().allow('').optional(),
            page: Joi.number().min(1).optional(),
            limit: Joi.number().min(1).optional(),
        })
    }),
    handler: async (req, res) => {
        try {
            const { role, search } = req.query;
            const filter = {};
            if (role) filter.role = role;
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ];
            }
            const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
            return responseHandler.success(res, 'Users fetched', users);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
