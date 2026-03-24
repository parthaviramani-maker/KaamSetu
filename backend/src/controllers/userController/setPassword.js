import Joi from 'joi';
import bcrypt from 'bcrypt';
import User from '../../models/userModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        body: Joi.object({
            newPassword: Joi.string().min(6).required()
                .messages({
                    'string.min':    'Password must be at least 6 characters',
                    'any.required':  'New password is required',
                }),
        }),
    }),
    handler: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('+password');
            if (!user) return responseHandler.notFound(res, 'User not found');

            // Only allow if the user has no existing password
            if (user.password) {
                return responseHandler.badRequest(res, {
                    message: 'You already have a password. Enter it in the top-up form to proceed.',
                    code: 'ALREADY_HAS_PASSWORD',
                });
            }

            const { newPassword } = req.body;
            user.password = await bcrypt.hash(newPassword, 12);
            await user.save({ validateBeforeSave: false });

            return responseHandler.success(res, 'Password set successfully! You can now use wallet top-up.');
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
