import Joi from 'joi';
import Placement from '../../models/placementModel.js';
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
            const placements = await Placement.find({ agentId: req.user.id })
                .populate('workerId', 'name email phone')
                .populate('jobId', 'title company')
                .sort({ createdAt: -1 });

            const workerMap = new Map();
            placements.forEach((p) => {
                if (p.workerId && !workerMap.has(p.workerId._id.toString())) {
                    workerMap.set(p.workerId._id.toString(), p.workerId);
                }
            });

            return responseHandler.success(res, 'Workers fetched', {
                workers: Array.from(workerMap.values()),
                total: workerMap.size,
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
