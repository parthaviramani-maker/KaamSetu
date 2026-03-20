import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: false, // null for Google OAuth users
            minlength: 6,
        },
        googleId: {
            type: String,
            default: null,
            sparse: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        phone: {
            type: String,
            default: null,
            trim: true,
        },
        role: {
            type: String,
            enum: ['employer', 'worker', 'agent', 'admin'],
            required: [true, 'Role is required'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isOnboarded: {
            type: Boolean,
            default: true, // false for new Google users until they complete onboarding
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpires: {
            type: Date,
            default: null,
        },
        loginVerifyCode: {
            type: Number,
            default: null,
        },
        loginVerifyExpires: {
            type: Date,
            default: null,
        },
        loginVerifySessionId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
