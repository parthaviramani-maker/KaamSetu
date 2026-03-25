import Joi from 'joi';
import bcrypt from 'bcrypt';
import User from '../../models/userModel.js';
import Transaction from '../../models/transactionModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';
import { sendTransferEmail } from '../../utils/mailer.js';

export default {
    validator: validator({
        body: Joi.object({
            receiverEmail: Joi.string().email().required()
                .messages({ 'string.email': 'Enter a valid email address', 'any.required': 'Receiver email is required' }),
            amount: Joi.number().min(1).max(100000).required()
                .messages({ 'number.min': 'Minimum transfer is ₹1', 'number.max': 'Maximum transfer is ₹1,00,000' }),
            password: Joi.string().required()
                .messages({ 'any.required': 'Password is required for verification' }),
        }),
    }),
    handler: async (req, res) => {
        try {
            const { receiverEmail, amount, password } = req.body;

            // Fetch sender with sensitive fields
            const sender = await User.findById(req.user.id).select('password walletBalance name email role');
            if (!sender) return responseHandler.notFound(res, 'Sender not found');

            // Cannot transfer to yourself
            if (sender.email === receiverEmail.toLowerCase()) {
                return responseHandler.badRequest(res, 'You cannot transfer money to yourself');
            }

            // Google OAuth users must have a password set
            if (!sender.password) {
                return responseHandler.badRequest(res, {
                    message: 'Google login users cannot use password verification. Please set a password first.',
                    code: 'NO_PASSWORD_SET',
                });
            }

            // Verify sender password
            const isMatch = await bcrypt.compare(password, sender.password);
            if (!isMatch) {
                return responseHandler.unauthorized(res, 'Incorrect password. Transfer cancelled.');
            }

            // Check sufficient balance
            if (sender.walletBalance < amount) {
                return responseHandler.badRequest(
                    res,
                    `Insufficient balance. Available: ₹${sender.walletBalance}, Requested: ₹${amount}`
                );
            }

            // Find receiver
            const receiver = await User.findOne({ email: receiverEmail.toLowerCase() }).select('walletBalance name email role');
            if (!receiver) {
                return responseHandler.notFound(res, 'No user found with that email address');
            }

            // ── Perform transfer ──
            const senderBefore   = sender.walletBalance;
            const senderAfter    = senderBefore - amount;
            const receiverBefore = receiver.walletBalance;
            const receiverAfter  = receiverBefore + amount;

            sender.walletBalance   = senderAfter;
            receiver.walletBalance = receiverAfter;

            await Promise.all([sender.save(), receiver.save()]);

            // Create 2 transaction records
            await Transaction.insertMany([
                {
                    userId:        sender._id,
                    type:          'debit',
                    amount,
                    description:   `Wallet transfer sent to ${receiver.name} (${receiver.email})`,
                    category:      'transfer_sent',
                    refId:         receiver._id,
                    balanceBefore: senderBefore,
                    balanceAfter:  senderAfter,
                },
                {
                    userId:        receiver._id,
                    type:          'credit',
                    amount,
                    description:   `Wallet transfer received from ${sender.name} (${sender.email})`,
                    category:      'transfer_received',
                    refId:         sender._id,
                    balanceBefore: receiverBefore,
                    balanceAfter:  receiverAfter,
                },
            ]);

            // Fire emails (non-blocking)
            sendTransferEmail(sender.email, sender.name, sender.role, receiver.name, receiver.role, receiver.email, amount, senderAfter, 'sent')
                .catch(err => console.error('[mailer] sendTransferEmail (sender) failed:', err.message));
            sendTransferEmail(receiver.email, receiver.name, receiver.role, sender.name, sender.role, sender.email, amount, receiverAfter, 'received')
                .catch(err => console.error('[mailer] sendTransferEmail (receiver) failed:', err.message));

            return responseHandler.success(res, `₹${amount} transferred to ${receiver.name} successfully! 🎉`, {
                balance:      senderAfter,
                transferred:  amount,
                receiverName: receiver.name,
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
