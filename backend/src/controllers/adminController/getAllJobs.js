import Joi from 'joi';
import Job from '../../models/jobModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        query: Joi.object({
            page: Joi.number().min(1).optional(),
            limit: Joi.number().min(1).optional(),
        })
    }),
    handler: async (req, res) => {
        try {
            const jobs = await Job.find()
                .populate('postedBy', 'name email')
                .sort({ createdAt: -1 });
            return responseHandler.success(res, 'Jobs fetched', jobs);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
