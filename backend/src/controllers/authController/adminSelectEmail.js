import User from '../../models/userModel.js';
import responseHandler from '../../utils/responseHandler.js';
import { sendLoginVerificationEmail } from '../../utils/mailer.js';

/**
 * POST /api/v1/auth/admin-select-email
 * Body: { sessionId, emailIndex }
 * Admin selects which authorized email to send the verification code to.
 */
export default {
    handler: async (req, res) => {
        try {
            const { sessionId, emailIndex } = req.body;

            if (!sessionId || emailIndex === undefined) {
                return responseHandler.badRequest(res, 'sessionId and emailIndex are required');
            }

            const user = await User.findOne({ loginVerifySessionId: sessionId });
            if (!user) {
                return responseHandler.unauthorized(res, 'Invalid or expired session. Please login again.');
            }

            if (!user.loginVerifyExpires || user.loginVerifyExpires < new Date()) {
                user.loginVerifyCode      = null;
                user.loginVerifyExpires   = null;
                user.loginVerifySessionId = null;
                await user.save();
                return responseHandler.unauthorized(res, 'Session expired. Please login again.');
            }

            const selectedEmail = user.authorizedEmails[Number(emailIndex)];
            if (!selectedEmail) {
                return responseHandler.badRequest(res, 'Invalid email selection');
            }

            // Generate 3 unique 2-digit numbers
            const numbers = [];
            while (numbers.length < 3) {
                const n = Math.floor(Math.random() * 90) + 10; // 10–99
                if (!numbers.includes(n)) numbers.push(n);
            }
            numbers.sort(() => Math.random() - 0.5);
            const correctNumber = numbers[Math.floor(Math.random() * 3)];

            user.loginVerifyCode    = correctNumber;
            user.loginVerifyExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min
            await user.save();

            await sendLoginVerificationEmail(selectedEmail, correctNumber);

            // Mask sentTo for display: k•••u@gmail.com
            const [local, domain] = selectedEmail.split('@');
            const sentTo = (local.length > 2 ? local[0] + '•••' + local.slice(-1) : local[0] + '•••') + '@' + domain;

            return responseHandler.success(res, 'Verification code sent', {
                requiresVerification: true,
                sessionId,
                numbers,
                sentTo,
            });
        } catch (error) {
            return responseHandler.internalServerError(res, error);
        }
    },
};
