import User from '../../models/userModel.js';
import { sendSignupOTPEmail } from '../../utils/mailer.js';
import responseHandler from '../../utils/responseHandler.js';

// In-memory OTP store: email -> { otp, expiresAt, name }
// (cleared after successful registration or expiry)
export const signupOtpStore = new Map();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

const generateOTP = () =>
    String(Math.floor(100000 + Math.random() * 900000));

export default {
    handler: async (req, res) => {
        try {
            const { email, name } = req.body;
            if (!email || !name) {
                return responseHandler.badRequest(res, { message: 'Email and name are required' });
            }

            const normalizedEmail = email.toLowerCase().trim();

            // Double-check email is not already registered
            const existing = await User.findOne({ email: normalizedEmail });
            if (existing) {
                return responseHandler.conflict(res, 'Email already exists');
            }

            const otp = generateOTP();
            signupOtpStore.set(normalizedEmail, {
                otp,
                name,
                expiresAt: Date.now() + OTP_TTL_MS,
            });

            await sendSignupOTPEmail(normalizedEmail, name, otp);

            return responseHandler.success(res, 'OTP sent to your email');
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
