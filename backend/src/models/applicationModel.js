import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        workerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

// Ek worker ek job mate ekaj vaar apply kari shake
applicationSchema.index({ jobId: 1, workerId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
