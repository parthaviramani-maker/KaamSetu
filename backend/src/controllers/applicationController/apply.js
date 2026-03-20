import Joi from 'joi';
import Application from '../../models/applicationModel.js';
import Job from '../../models/jobModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        body: Joi.object({
            jobId: Joi.string().required(),
        }),
    }),
    handler: async (req, res) => {
        try {
            const { jobId } = req.body;

            const job = await Job.findById(jobId);
            if (!job) return responseHandler.notFound(res, 'Job not found');
            if (job.status === 'closed') return responseHandler.badRequest(res, 'This job is no longer accepting applications');

            const existing = await Application.findOne({ jobId, workerId: req.user.id });
            if (existing) return responseHandler.conflict(res, 'You have already applied for this job');

            const application = await Application.create({ jobId, workerId: req.user.id });

            return responseHandler.created(res, 'Application submitted successfully', application);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
