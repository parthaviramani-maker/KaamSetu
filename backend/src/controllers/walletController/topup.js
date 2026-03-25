import Joi from 'joi';
import bcrypt from 'bcrypt';
import User from '../../models/userModel.js';
import Transaction from '../../models/transactionModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';
import { sendTopupEmail } from '../../utils/mailer.js';

export default {
    validator: validator({
        body: Joi.object({
            amount:   Joi.number().min(1).max(100000).required()
                        .messages({ 'number.min': 'Minimum top-up is ₹1', 'number.max': 'Maximum top-up is ₹1,00,000' }),
            password: Joi.string().required().messages({ 'any.required': 'Password is required for verification' }),
        }),
    }),
    handler: async (req, res) => {
        try {
            const { amount, password } = req.body;

            // Fetch user — explicitly include both fields in inclusive projection
            const user = await User.findById(req.user.id).select('password walletBalance bankDetails');
            if (!user) return responseHandler.notFound(res, 'User not found');

            // Bank account must be linked before any wallet transaction
            if (!user.bankDetails?.accountNumber) {
                return responseHandler.badRequest(res, {
                    message: 'Please link your bank account before adding money to your wallet.',
                    code: 'NO_BANK_ACCOUNT',
                });
            }

            // Google OAuth users may not have a password
            if (!user.password) {
                return responseHandler.badRequest(res, {
                    message: 'Google login users cannot use password verification. Please set a password first.',
                    code: 'NO_PASSWORD_SET',
                });
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return responseHandler.unauthorized(res, 'Incorrect password. Top-up cancelled.');
            }

            const balanceBefore = user.walletBalance;
            const balanceAfter  = balanceBefore + amount;

            // Update wallet
            user.walletBalance = balanceAfter;
            await user.save();

            // Record transaction
            await Transaction.create({
                userId:        user._id,
                type:          'credit',
                amount,
                description:   `Wallet top-up via QR`,
                category:      'topup',
                refId:         null,
                balanceBefore,
                balanceAfter,
            });

            // Fire top-up confirmation email (non-blocking)
            const fullUser = await User.findById(req.user.id).select('email name');
            if (fullUser) {
                sendTopupEmail(fullUser.email, fullUser.name, amount, balanceAfter)
                    .catch(err => console.error('[mailer] sendTopupEmail failed:', err.message));
            }

            return responseHandler.success(res, `₹${amount} added to wallet successfully!`, {
                balance: balanceAfter,
                added: amount,
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
