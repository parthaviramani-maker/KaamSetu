import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema(
    {
        workerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        employerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        agentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        commission: {
            type: Number,
            default: 0,
            min: 0,
        },
        commissionType: {
            type: String,
            enum: ['fixed', 'percent'],
            default: 'fixed',
        },
        commissionValue: {
            type: Number,
            default: 0,
            min: 0,
        },
        platformFee: {
            type: Number,
            default: 0,
            min: 0,
        },
        workerPaid: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ['active', 'completed'],
            default: 'active',
        },
    },
    { timestamps: true }
);

const Placement = mongoose.model('Placement', placementSchema);
export default Placement;
