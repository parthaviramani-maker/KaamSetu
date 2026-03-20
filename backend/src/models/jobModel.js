import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
        },
        area: {
            type: String,
            required: [true, 'Area is required'],
            trim: true,
        },
        workType: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Daily-wage', 'Contract'],
            required: [true, 'Work type is required'],
        },
        pay: {
            type: Number,
            required: [true, 'Pay is required'],
            min: 0,
        },
        payType: {
            type: String,
            enum: ['daily', 'monthly'],
            default: 'daily',
        },
        workersNeeded: {
            type: Number,
            default: 1,
            min: 1,
        },
        deadline: {
            type: Date,
            default: null,
        },
        skills: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        contactInfo: {
            type: String,
            default: '',
            trim: true,
        },
        status: {
            type: String,
            enum: ['open', 'closed'],
            default: 'open',
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
