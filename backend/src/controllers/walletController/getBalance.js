import Joi from 'joi';
import User from '../../models/userModel.js';
import Transaction from '../../models/transactionModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({ query: Joi.object({}) }),
    handler: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('walletBalance name');
            if (!user) return responseHandler.notFound(res, 'User not found');

            const recentTransactions = await Transaction.find({ userId: req.user.id })
                .sort({ createdAt: -1 })
                .limit(10);

            return responseHandler.success(res, 'Wallet balance fetched', {
                balance: user.walletBalance,
                recentTransactions,
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
