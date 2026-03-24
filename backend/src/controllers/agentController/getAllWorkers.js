import Joi from 'joi';
import User from '../../models/userModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        query: Joi.object({}),
    }),
    handler: async (req, res) => {
        try {
            const workers = await User.find({ role: 'worker', isActive: true })
                .select('name email phone')
                .sort({ name: 1 });

            return responseHandler.success(res, 'All workers fetched', {
                workers,
                total: workers.length,
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
