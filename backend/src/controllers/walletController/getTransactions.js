import Joi from 'joi';
import Transaction from '../../models/transactionModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

export default {
    validator: validator({
        query: Joi.object({
            page:     Joi.number().min(1).default(1),
            limit:    Joi.number().min(1).max(100).default(20),
            category: Joi.string().valid('topup', 'job_payment', 'commission', 'platform_fee').optional(),
        }),
    }),
    handler: async (req, res) => {
        try {
            const page     = Number(req.query.page)  || 1;
            const limit    = Number(req.query.limit) || 20;
            const skip     = (page - 1) * limit;
            const filter   = { userId: req.user.id };

            if (req.query.category) filter.category = req.query.category;

            const [transactions, total] = await Promise.all([
                Transaction.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Transaction.countDocuments(filter),
            ]);

            return responseHandler.success(res, 'Transactions fetched', {
                transactions,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
