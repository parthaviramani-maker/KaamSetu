import Joi from 'joi';
import Job from '../../models/jobModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        params: Joi.object({
            id: Joi.string().required(),
        }),
    }),
    handler: async (req, res) => {
        try {
            const job = await Job.findOne({ _id: req.params.id, postedBy: req.user.id });
            if (!job) {
                return responseHandler.notFound(res, 'Job not found or access denied');
            }
            job.status = 'closed';
            await job.save();
            return responseHandler.success(res, 'Job closed', job);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
