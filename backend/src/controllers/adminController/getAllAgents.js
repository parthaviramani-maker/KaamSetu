import Joi from 'joi';
import User from '../../models/userModel.js';
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
            const agents = await User.find({ role: 'agent' }).select('-password');

            const agentsWithStats = await Promise.all(
                agents.map(async (agent) => {
                    const placements = await Placement.find({ agentId: agent._id });
                    const totalCommission = placements.reduce((sum, p) => sum + (p.commission || 0), 0);
                    return {
                        ...agent.toObject(),
                        totalPlacements: placements.length,
                        totalCommission,
                    };
                })
            );

            return responseHandler.success(res, 'Agents fetched', agentsWithStats);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
