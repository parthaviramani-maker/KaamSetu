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
                .populate('workerId', 'name email')
                .populate('employerId', 'name email')
                .populate('jobId', 'title company city')
                .sort({ createdAt: -1 });

            return responseHandler.success(res, 'Placements fetched', placements);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
