import Joi from 'joi';
import Placement from '../../models/placementModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        query: Joi.object({})
    }),
    handler: async (req, res) => {
        try {
            const placements = await Placement.find({ agentId: req.user.id });

            const totalCommission = placements.reduce((sum, p) => sum + (p.commission || 0), 0);
            const activePlacements = placements.filter((p) => p.status === 'active').length;
            const completedPlacements = placements.filter((p) => p.status === 'completed').length;

            return responseHandler.success(res, 'Commission summary', {
                totalCommission,
                totalPlacements: placements.length,
                activePlacements,
                completedPlacements,
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
