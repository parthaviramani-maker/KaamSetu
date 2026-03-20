import Joi from 'joi';
import User from '../../models/userModel.js';
import Job from '../../models/jobModel.js';
import Application from '../../models/applicationModel.js';
import Placement from '../../models/placementModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        query: Joi.object({})
    }),
    handler: async (req, res) => {
        try {
            const [totalUsers, totalJobs, totalApplications, totalPlacements] = await Promise.all([
                User.countDocuments(),
                Job.countDocuments(),
                Application.countDocuments(),
                Placement.countDocuments(),
            ]);

            const [employers, workers, agents] = await Promise.all([
                User.countDocuments({ role: 'employer' }),
                User.countDocuments({ role: 'worker' }),
                User.countDocuments({ role: 'agent' }),
            ]);

            const openJobs = await Job.countDocuments({ status: 'open' });

            return responseHandler.success(res, 'Platform stats', {
                totalUsers,
                totalJobs,
                openJobs,
                totalApplications,
                totalPlacements,
                byRole: { employers, workers, agents },
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
