import Joi from 'joi';
import Job from '../../models/jobModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        query: Joi.object({
            search: Joi.string().allow('').optional(),
            city: Joi.string().allow('').optional(),
            workType: Joi.string().valid('Full-time', 'Part-time', 'Daily-wage', 'Contract').optional(),
            page: Joi.number().min(1).optional(),
            limit: Joi.number().min(1).optional(),
        })
    }),
    handler: async (req, res) => {
        try {
            const { search, city, workType } = req.query;
            const filter = { status: 'open' };

            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { company: { $regex: search, $options: 'i' } },
                    { skills: { $regex: search, $options: 'i' } },
                ];
            }
            if (city) filter.city = { $regex: city, $options: 'i' };
            if (workType) filter.workType = workType;

            const jobs = await Job.find(filter)
                .populate('postedBy', 'name email')
                .sort({ createdAt: -1 });

            return responseHandler.success(res, 'Jobs fetched', jobs);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
