import Joi from 'joi';
import Placement from '../../models/placementModel.js';
import Job from '../../models/jobModel.js';
import User from '../../models/userModel.js';
import Transaction from '../../models/transactionModel.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';
import { PLATFORM_FEE_PERCENT } from '../../config/config.js';

export default {
    validator: validator({
        body: Joi.object({
            workerId:        Joi.string().required(),
            employerId:      Joi.string().required(),
            jobId:           Joi.string().required(),
            commissionType:  Joi.string().valid('fixed', 'percent').default('fixed'),
            commissionValue: Joi.number().min(0).default(0),
        }),
    }),
    handler: async (req, res) => {
        try {
            const { workerId, employerId, jobId, commissionType, commissionValue } = req.body;
            const agentId = req.user.id;

            // Verify worker exists
            const worker = await User.findOne({ _id: workerId, role: 'worker', isActive: true });
            if (!worker) return responseHandler.notFound(res, 'Worker not found');

            // Verify employer exists
            const employer = await User.findOne({ _id: employerId, role: 'employer', isActive: true });
            if (!employer) return responseHandler.notFound(res, 'Employer not found');

            // Verify agent exists
            const agent = await User.findById(agentId);
            if (!agent) return responseHandler.notFound(res, 'Agent not found');

            // Verify job exists and belongs to that employer
            const job = await Job.findOne({ _id: jobId, postedBy: employerId });
            if (!job) return responseHandler.notFound(res, 'Job not found for this employer');

            // Prevent duplicate active placements
            const existing = await Placement.findOne({ workerId, jobId, status: 'active' });
            if (existing) {
                return responseHandler.badRequest(res, 'An active placement already exists for this worker and job');
            }

            // ── Calculate payment amounts ──────────────────────────────────────
            const jobPay = job.pay;

            // Agent commission
            const commission = commissionType === 'percent'
                ? Math.round(jobPay * commissionValue / 100)
                : commissionValue;

            // Platform fee (10% of job pay)
            const platformFee  = Math.round(jobPay * PLATFORM_FEE_PERCENT / 100);
            const workerPaid   = jobPay - platformFee;
            const employerCost = jobPay + commission;

            // ── Check employer has enough balance ─────────────────────────────
            if (employer.walletBalance < employerCost) {
                return responseHandler.badRequest(
                    res,
                    `Employer has insufficient wallet balance. Required: ₹${employerCost}, Available: ₹${employer.walletBalance}`
                );
            }

            // ── Wallet transactions ───────────────────────────────────────────
            // 1. Deduct from employer
            const empBalBefore = employer.walletBalance;
            employer.walletBalance -= employerCost;
            await employer.save();

            // 2. Credit worker
            const workerBalBefore = worker.walletBalance;
            worker.walletBalance += workerPaid;
            await worker.save();

            // 3. Credit agent
            const agentBalBefore = agent.walletBalance;
            agent.walletBalance += commission;
            await agent.save();

            // ── Create placement record ───────────────────────────────────────
            const placement = await Placement.create({
                workerId,
                employerId,
                jobId,
                agentId,
                commission,
                commissionType,
                commissionValue,
                platformFee,
                workerPaid,
            });

            // ── Record all 4 transactions ─────────────────────────────────────
            await Transaction.insertMany([
                {
                    userId:        employer._id,
                    type:          'debit',
                    amount:        employerCost,
                    description:   `Job Payment — ${job.title} (${job.company})`,
                    category:      'job_payment',
                    refId:         placement._id,
                    balanceBefore: empBalBefore,
                    balanceAfter:  employer.walletBalance,
                },
                {
                    userId:        worker._id,
                    type:          'credit',
                    amount:        workerPaid,
                    description:   `Earned — ${job.title} at ${job.company}`,
                    category:      'job_payment',
                    refId:         placement._id,
                    balanceBefore: workerBalBefore,
                    balanceAfter:  worker.walletBalance,
                },
                {
                    userId:        agent._id,
                    type:          'credit',
                    amount:        commission,
                    description:   `Commission — Placed ${worker.name} at ${job.company}`,
                    category:      'commission',
                    refId:         placement._id,
                    balanceBefore: agentBalBefore,
                    balanceAfter:  agent.walletBalance,
                },
                {
                    userId:        employer._id,   // track platform fee against employer
                    type:          'debit',
                    amount:        platformFee,
                    description:   `Platform fee — ${PLATFORM_FEE_PERCENT}% of ₹${jobPay}`,
                    category:      'platform_fee',
                    refId:         placement._id,
                    balanceBefore: employer.walletBalance + platformFee,
                    balanceAfter:  employer.walletBalance,
                },
            ]);

            await placement.populate([
                { path: 'workerId',   select: 'name email' },
                { path: 'employerId', select: 'name email' },
                { path: 'jobId',      select: 'title company city pay' },
            ]);

            return responseHandler.created(res, 'Placement created & payments processed!', {
                placement,
                paymentSummary: {
                    jobPay,
                    commission,
                    commissionType,
                    platformFee,
                    workerPaid,
                    employerDeducted: employerCost,
                },
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
