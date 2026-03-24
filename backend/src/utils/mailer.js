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
 * Send a withdrawal success alert email.
 * @param {string} to           Recipient email
 * @param {string} name         Recipient name
 * @param {number} amount       Amount withdrawn
 * @param {number} balanceAfter Remaining wallet balance
 * @param {object} [bankDetails] Optional saved bank details
 */
export const sendWithdrawalEmail = async (to, name, amount, balanceAfter, bankDetails = null) => {
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

    // Build bank account row if details are saved
    const hasBankDetails = bankDetails?.accountNumber;
    const maskedAccount  = hasBankDetails
        ? 'XXXX XXXX ' + String(bankDetails.accountNumber).slice(-4)
        : null;
    const bankRow = hasBankDetails
        ? `
                    <div style="margin-top:12px;padding-top:12px;border-top:1px solid #fed7d7;">
                        <p style="color:#718096;font-size:13px;margin:0 0 6px;">💳 Credited to Bank Account:</p>
                        <div style="background:#f7fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-size:13px;">
                            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                                <span style="color:#718096;">Account Holder</span>
                                <strong style="color:#2d3748;">${bankDetails.accountHolderName || name}</strong>
                            </div>
                            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                                <span style="color:#718096;">Account No.</span>
                                <strong style="color:#2d3748;">${maskedAccount}</strong>
                            </div>
                            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                                <span style="color:#718096;">IFSC Code</span>
                                <strong style="color:#2d3748;">${bankDetails.ifscCode || '—'}</strong>
                            </div>
                            <div style="display:flex;justify-content:space-between;">
                                <span style="color:#718096;">Bank</span>
                                <strong style="color:#2d3748;">${bankDetails.bankName || '—'}</strong>
                            </div>
                        </div>
                    </div>`
        : `<p style="color:#e53e3e;font-size:12px;margin-top:10px;">⚠️ No bank account saved. Please add bank details in your profile to receive funds.</p>`;

    await transporter.sendMail({
        from: `"KaamSetu" <${EMAIL_USER}>`,
        to,
        subject: `KaamSetu — ₹${amount} Withdrawn from your Wallet`,
        html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
                <h2 style="color:#00ABB3;margin-bottom:8px;">KaamSetu</h2>
                <h3 style="margin-bottom:4px;">Wallet Withdrawal Alert 💸</h3>
                <p style="color:#4a5568;margin-top:4px;">Hi <strong>${name}</strong>,</p>
                <p style="color:#4a5568;">A withdrawal was made from your KaamSetu wallet:</p>
                <div style="background:#fff5f5;border:1px solid #feb2b2;border-radius:10px;padding:20px;margin:16px 0;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                        <span style="color:#718096;font-size:14px;">Amount Withdrawn</span>
                        <strong style="color:#e53e3e;font-size:18px;">-₹${amount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                        <span style="color:#718096;font-size:14px;">Remaining Balance</span>
                        <strong style="color:#2d3748;font-size:16px;">₹${balanceAfter.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                        <span style="color:#718096;font-size:14px;">Date &amp; Time (IST)</span>
                        <span style="color:#2d3748;font-size:13px;">${now}</span>
                    </div>
                    ${bankRow}
                </div>
                <p style="color:#718096;font-size:13px;">If you did not make this withdrawal, please change your password immediately and contact support.</p>
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
