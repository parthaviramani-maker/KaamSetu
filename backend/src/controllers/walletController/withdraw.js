import Joi from 'joi';
import bcrypt from 'bcrypt';
import User from '../../models/userModel.js';
import Transaction from '../../models/transactionModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';
import { sendWithdrawalEmail } from '../../utils/mailer.js';

export default {
    validator: validator({
        body: Joi.object({
            amount:   Joi.number().min(1).max(100000).required()
                        .messages({ 'number.min': 'Minimum withdrawal is ₹1', 'number.max': 'Maximum withdrawal is ₹1,00,000' }),
            password: Joi.string().required().messages({ 'any.required': 'Password is required for verification' }),
        }),
    }),
    handler: async (req, res) => {
        try {
            const { amount, password } = req.body;

            // Fetch user with password, balance, email, name and bank details
            const user = await User.findById(req.user.id).select('password walletBalance email name bankDetails');
            if (!user) return responseHandler.notFound(res, 'User not found');

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
                return responseHandler.unauthorized(res, 'Incorrect password. Withdrawal cancelled.');
            }

            // Check sufficient balance
            if (user.walletBalance < amount) {
                return responseHandler.badRequest(
                    res,
                    `Insufficient balance. Available: ₹${user.walletBalance}, Requested: ₹${amount}`
                );
            }

            const balanceBefore = user.walletBalance;
            const balanceAfter  = balanceBefore - amount;

            // Deduct from wallet
            user.walletBalance = balanceAfter;
            await user.save();

            // Build transaction description — mention bank if details are saved
            const bd = user.bankDetails;
            const hasBankDetails = bd?.accountNumber;
            const txnDesc = hasBankDetails
                ? `Wallet withdrawal to ${bd.bankName || 'bank'} account ending ${String(bd.accountNumber).slice(-4)}`
                : 'Wallet withdrawal';

            // Record transaction
            await Transaction.create({
                userId:        user._id,
                type:          'debit',
                amount,
                description:   txnDesc,
                category:      'withdrawal',
                refId:         null,
                balanceBefore,
                balanceAfter,
            });

            // Fire withdrawal email (non-blocking)
            sendWithdrawalEmail(user.email, user.name, amount, balanceAfter, hasBankDetails ? bd : null)
                .catch(err => console.error('[mailer] sendWithdrawalEmail failed:', err.message));

            return responseHandler.success(res, `₹${amount} withdrawn successfully!`, {
                balance:   balanceAfter,
                withdrawn: amount,
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
