import Joi from 'joi';
import Placement from '../../models/placementModel.js';
import Job from '../../models/jobModel.js';
import User from '../../models/userModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        body: Joi.object({
            workerId:   Joi.string().required(),
            employerId: Joi.string().required(),
            jobId:      Joi.string().required(),
            commission: Joi.number().min(0).default(0),
        }),
    }),
    handler: async (req, res) => {
        try {
            const { workerId, employerId, jobId, commission } = req.body;
            const agentId = req.user.id;

            // Verify worker exists and has role 'worker'
            const worker = await User.findOne({ _id: workerId, role: 'worker', isActive: true });
            if (!worker) return responseHandler.notFound(res, 'Worker not found');

            // Verify employer exists
            const employer = await User.findOne({ _id: employerId, role: 'employer', isActive: true });
            if (!employer) return responseHandler.notFound(res, 'Employer not found');

            // Verify job exists and belongs to that employer
            const job = await Job.findOne({ _id: jobId, postedBy: employerId });
            if (!job) return responseHandler.notFound(res, 'Job not found for this employer');

            // Prevent duplicate active placements for same worker+job
            const existing = await Placement.findOne({ workerId, jobId, status: 'active' });
            if (existing) {
                return responseHandler.badRequest(res, 'An active placement already exists for this worker and job');
            }

            const placement = await Placement.create({
                workerId,
                employerId,
                jobId,
                agentId,
                commission,
            });

            await placement.populate([
                { path: 'workerId',   select: 'name email' },
                { path: 'employerId', select: 'name email' },
                { path: 'jobId',      select: 'title company city' },
            ]);

            return responseHandler.created(res, 'Placement created successfully', placement);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
