import Joi from 'joi';
import Placement from '../../models/placementModel.js';
import Transaction from '../../models/transactionModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default {
    validator: validator({
        query: Joi.object({}),
    }),
    handler: async (req, res) => {
        try {
            const now   = new Date();
            const year  = now.getFullYear();
            const month = now.getMonth(); // 0-indexed

            // Build last-6-months date range
            const sixMonthsAgo = new Date(year, month - 5, 1); // first day of (current - 5) month

            // ── Monthly placements aggregate ──
            const placementsAgg = await Placement.aggregate([
                { $match: { createdAt: { $gte: sixMonthsAgo } } },
                {
                    $group: {
                        _id: {
                            year:  { $year:  '$createdAt' },
                            month: { $month: '$createdAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
            ]);

            // ── Monthly platform revenue aggregate ──
            const revenueAgg = await Transaction.aggregate([
                { $match: { category: 'platform_fee', createdAt: { $gte: sixMonthsAgo } } },
                {
                    $group: {
                        _id: {
                            year:  { $year:  '$createdAt' },
                            month: { $month: '$createdAt' },
                        },
                        revenue: { $sum: '$amount' },
                    },
                },
            ]);

            // Build lookup maps
            const placementMap = {};
            placementsAgg.forEach(({ _id, count }) => {
                placementMap[`${_id.year}-${_id.month}`] = count;
            });

            const revenueMap = {};
            revenueAgg.forEach(({ _id, revenue }) => {
                revenueMap[`${_id.year}-${_id.month}`] = revenue;
            });

            // Build ordered 6-month array (oldest → newest)
            const monthly = [];
            for (let i = 5; i >= 0; i--) {
                const d   = new Date(year, month - i, 1);
                const y   = d.getFullYear();
                const m   = d.getMonth() + 1; // $month is 1-indexed
                const key = `${y}-${m}`;

                monthly.push({
                    month:      MONTH_NAMES[d.getMonth()],
                    year:       y,
                    placements: placementMap[key] || 0,
                    revenue:    revenueMap[key]    || 0,
                });
            }

            return responseHandler.success(res, 'Monthly reports', { monthly });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
