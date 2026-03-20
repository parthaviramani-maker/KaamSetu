import Joi from 'joi';
import Application from '../../models/applicationModel.js';
import Job from '../../models/jobModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        params: Joi.object({
            jobId: Joi.string().required(),
        }),
    }),
    handler: async (req, res) => {
        try {
            const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user.id });
            if (!job) return responseHandler.notFound(res, 'Job not found or access denied');

            const applicants = await Application.find({ jobId: req.params.jobId })
                .populate('workerId', 'name email phone')
                .sort({ createdAt: -1 });

            return responseHandler.success(res, 'Applicants fetched', applicants);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
