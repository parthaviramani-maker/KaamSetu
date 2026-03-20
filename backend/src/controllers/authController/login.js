import Joi from 'joi';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../config/config.js';
import validator from '../../utils/validator.js';
import responseHandler from '../../utils/responseHandler.js';
import { sendLoginVerificationEmail } from '../../utils/mailer.js';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

export default {
    validator: validator({
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    }),
    handler: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return responseHandler.notFound(res, 'No account found with this email address.');
            }

            if (!user.isActive) {
                return responseHandler.forbidden(res, 'Your account has been deactivated. Please contact support.');
            }

            if (!user.password) {
                return responseHandler.unauthorized(res, 'This account uses Google Sign-In. Please use the "Continue with Google" button.');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return responseHandler.unauthorized(res, 'Incorrect password. Please try again.');
            }

            // Admin with authorized emails — ask which email to send the code to
            if (user.role === 'admin' && user.authorizedEmails && user.authorizedEmails.length > 0) {
                const sessionId = crypto.randomBytes(32).toString('hex');
                user.loginVerifyCode      = null;
                user.loginVerifyExpires   = new Date(Date.now() + 10 * 60 * 1000); // 10 min to pick
                user.loginVerifySessionId = sessionId;
                await user.save();

                const maskEmail = (e) => {
                    const [local, domain] = e.split('@');
                    const m = local.length > 2
                        ? local[0] + '•••' + local.slice(-1)
                        : local[0] + '•••';
                    return `${m}@${domain}`;
                };

                return responseHandler.success(res, 'Select verification email', {
                    requiresEmailSelection: true,
                    sessionId,
                    emails: user.authorizedEmails.map(maskEmail),
                });
            }

            // Generate 3 unique 2-digit numbers
            const numbers = [];
            while (numbers.length < 3) {
                const n = Math.floor(Math.random() * 90) + 10; // 10–99
                if (!numbers.includes(n)) numbers.push(n);
            }
            numbers.sort(() => Math.random() - 0.5);
            const correctNumber = numbers[Math.floor(Math.random() * 3)];

            const sessionId = crypto.randomBytes(32).toString('hex');

            user.loginVerifyCode      = correctNumber;
            user.loginVerifyExpires   = new Date(Date.now() + 5 * 60 * 1000); // 5 min
            user.loginVerifySessionId = sessionId;
            await user.save();

            await sendLoginVerificationEmail(user.email, correctNumber);

            return responseHandler.success(res, 'Verification required', {
                requiresVerification: true,
                sessionId,
                numbers,
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
