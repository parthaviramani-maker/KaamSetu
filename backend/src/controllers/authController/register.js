import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../config/config.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';
import { signupOtpStore } from './sendSignupOtp.js';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar || null },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

export default {
    validator: validator({
        body: Joi.object({
            name: Joi.string().min(2).max(100).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            phone: Joi.string().allow('', null).optional(),
            role: Joi.string().valid('employer', 'worker', 'agent').required(),
            otp: Joi.string().length(6).required(),
        }),
    }),
    handler: async (req, res) => {
        try {
            const { name, email, password, phone, role, otp } = req.body;
            const normalizedEmail = email.toLowerCase().trim();

            // Verify OTP
            const record = signupOtpStore.get(normalizedEmail);
            if (!record) {
                return responseHandler.badRequest(res, { message: 'OTP not found. Please request a new one.' });
            }
            if (Date.now() > record.expiresAt) {
                signupOtpStore.delete(normalizedEmail);
                return responseHandler.badRequest(res, { message: 'OTP has expired. Please request a new one.' });
            }
            if (record.otp !== otp) {
                return responseHandler.badRequest(res, { message: 'Incorrect OTP. Please try again.' });
            }
            // OTP is valid — remove it
            signupOtpStore.delete(normalizedEmail);

            const existing = await User.findOne({ email: normalizedEmail });
            if (existing) {
                return responseHandler.conflict(res, 'Email already registered');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email: normalizedEmail,
                password: hashedPassword,
                phone: phone || null,
                role,
            });

            const token = generateToken(user);

            return responseHandler.created(res, 'Account created successfully', {
                token,
                user: {
                    id:     user._id,
                    name:   user.name,
                    email:  user.email,
                    phone:  user.phone,
                    role:   user.role,
                    avatar: user.avatar || null,
                },
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
