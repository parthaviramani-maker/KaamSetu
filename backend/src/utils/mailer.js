import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS, FRONTEND_URL } from '../config/config.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

/**
 * Send a login number-verification email.
 * @param {string} to      Recipient email
 * @param {number} number  The correct number to show
 */
export const sendLoginVerificationEmail = async (to, number) => {
    await transporter.sendMail({
        from: `"KaamSetu" <${EMAIL_USER}>`,
        to,
        subject: 'KaamSetu — Login Verification',
        html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
                <h2 style="color:#00ABB3;margin-bottom:8px;">KaamSetu</h2>
                <h3 style="margin-bottom:16px;">Confirm your login</h3>
                <p style="color:#4a5568;">Someone is signing in to your account. Select <strong>this number</strong> on the screen to confirm it&rsquo;s you:</p>
                <div style="font-size:52px;font-weight:800;color:#00ABB3;text-align:center;padding:24px;background:#f0fdfe;border-radius:12px;margin:20px 0;letter-spacing:6px;">
                    ${number}
                </div>
                <p style="color:#718096;font-size:13px;">This code expires in <strong>5 minutes</strong>. If you did not attempt to sign in, please change your password immediately.</p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
                <p style="color:#a0aec0;font-size:12px;">KaamSetu &middot; Indian Labour Marketplace</p>
            </div>
        `,
    });
};

/**
 * Send a signup OTP verification email.
 * @param {string} to    Recipient email
 * @param {string} name  Recipient name
 * @param {string} otp   6-digit OTP
 */
export const sendSignupOTPEmail = async (to, name, otp) => {
    await transporter.sendMail({
        from: `"KaamSetu" <${EMAIL_USER}>`,
        to,
        subject: 'KaamSetu — Verify your email',
        html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
                <h2 style="color:#00ABB3;margin-bottom:8px;">KaamSetu</h2>
                <h3 style="margin-bottom:4px;">Verify your email address</h3>
                <p style="color:#4a5568;margin-top:4px;">Hi <strong>${name}</strong>, use the code below to complete your signup:</p>
                <div style="font-size:44px;font-weight:800;color:#00ABB3;text-align:center;padding:24px;background:#f0fdfe;border-radius:12px;margin:20px 0;letter-spacing:10px;">
                    ${otp}
                </div>
                <p style="color:#718096;font-size:13px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
                <p style="color:#a0aec0;font-size:12px;">KaamSetu &middot; Indian Labour Marketplace</p>
            </div>
        `,
    });
};

/**
 * Send a password reset email with a reset link.
 * @param {string} to   Recipient email
 * @param {string} token  Reset token
 */
export const sendPasswordResetEmail = async (to, token) => {
    const frontendBase = FRONTEND_URL.split(',')[0].trim();
    const resetUrl = `${frontendBase}/auth/reset-password?token=${token}`;

    await transporter.sendMail({
        from: `"KaamSetu" <${EMAIL_USER}>`,
        to,
        subject: 'Reset your KaamSetu password',
        html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
                <h2 style="color:#00ABB3;margin-bottom:8px;">KaamSetu</h2>
                <h3 style="margin-bottom:16px;">Password Reset Request</h3>
                <p>We received a request to reset your password. Click the button below to set a new password.</p>
                <a href="${resetUrl}"
                   style="display:inline-block;margin:20px 0;padding:12px 28px;background:#00ABB3;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
                    Reset Password
                </a>
                <p style="color:#718096;font-size:13px;">This link expires in <strong>1 hour</strong>. If you did not request a reset, you can ignore this email.</p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
                <p style="color:#a0aec0;font-size:12px;">KaamSetu · Indian Labour Marketplace</p>
            </div>
        `,
    });
};
