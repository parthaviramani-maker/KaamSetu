import Joi from 'joi';
import Application from '../../models/applicationModel.js';
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
            const applications = await Application.find({ workerId: req.user.id })
                .populate('jobId', 'title company city area workType pay payType status')
                .sort({ createdAt: -1 });
            return responseHandler.success(res, 'Applications fetched', applications);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
