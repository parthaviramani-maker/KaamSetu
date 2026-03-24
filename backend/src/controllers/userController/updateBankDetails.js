import Joi from 'joi';
import User from '../../models/userModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        body: Joi.object({
            accountHolderName: Joi.string().min(2).max(100).required()
                .messages({ 'any.required': 'Account holder name is required' }),
            accountNumber: Joi.string()
                .pattern(/^\d{9,18}$/)
                .required()
                .messages({
                    'any.required': 'Account number is required',
                    'string.pattern.base': 'Enter a valid account number (9–18 digits)',
                }),
            ifscCode: Joi.string()
                .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
                .required()
                .messages({
                    'any.required': 'IFSC code is required',
                    'string.pattern.base': 'Enter a valid 11-character IFSC code (e.g. SBIN0001234)',
                }),
            bankName: Joi.string().min(2).max(100).required()
                .messages({ 'any.required': 'Bank name is required' }),
            upiId: Joi.string().allow('', null).max(50).optional(),
        }),
    }),
    handler: async (req, res) => {
        try {
            const { accountHolderName, accountNumber, ifscCode, bankName, upiId } = req.body;

            const user = await User.findByIdAndUpdate(
                req.user.id,
                {
                    bankDetails: {
                        accountHolderName,
                        accountNumber,
                        ifscCode: ifscCode.toUpperCase(),
                        bankName,
                        upiId: upiId || null,
                    },
                },
                { new: true, runValidators: true }
            ).select('bankDetails');

            if (!user) return responseHandler.notFound(res, 'User not found');

            return responseHandler.success(res, 'Bank details saved successfully', user.bankDetails);
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
