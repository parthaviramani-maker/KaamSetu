import Joi from 'joi';
import Job from '../../models/jobModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        body: Joi.object({
            title: Joi.string().min(2).max(200).required(),
            company: Joi.string().min(2).max(200).required(),
            city: Joi.string().required(),
            area: Joi.string().required(),
            workType: Joi.string().valid('Full-time', 'Part-time', 'Daily-wage', 'Contract').required(),
            pay: Joi.number().min(0).required(),
            payType: Joi.string().valid('daily', 'monthly').default('daily'),
            workersNeeded: Joi.number().min(1).default(1),
            deadline: Joi.date().allow(null, '').optional(),
            skills: Joi.array().items(Joi.string()).default([]),
            description: Joi.string().allow('').optional(),
            contactInfo: Joi.string().allow('').optional(),
        }),
    }),
    handler: async (req, res) => {
        try {
            const job = await Job.create({ ...req.body, postedBy: req.user.id });
            return responseHandler.created(res, 'Job posted successfully', job);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
