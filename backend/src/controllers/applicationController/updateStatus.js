import Joi from 'joi';
import Application from '../../models/applicationModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        params: Joi.object({
            id: Joi.string().required(),
        }),
        body: Joi.object({
            status: Joi.string().valid('approved', 'rejected').required(),
        }),
    }),
    handler: async (req, res) => {
        try {
            const { status } = req.body;
            const application = await Application.findById(req.params.id).populate('jobId');
            if (!application) return responseHandler.notFound(res, 'Application not found');

            if (application.jobId.postedBy.toString() !== req.user.id) {
                return responseHandler.forbidden(res, 'Access denied');
            }

            application.status = status;
            await application.save();

            return responseHandler.success(res, `Application ${status}`, application);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
