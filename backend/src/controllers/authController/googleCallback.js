import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    BACKEND_URL,
    FRONTEND_URL,
} from '../../config/config.js';

const generateToken = (user) =>
    jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar || null },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

export default {
    handler: async (req, res) => {
        // Use the first URL from FRONTEND_URL (comma-separated support)
        const frontendBase = FRONTEND_URL.split(',')[0].trim();

        let isNewUser = false;

        try {
            const { code } = req.query;
            if (!code) {
                return res.redirect(`${frontendBase}/auth?error=no_code`);
            }

            // 1. Exchange authorization code → access token
            const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    client_id: GOOGLE_CLIENT_ID,
                    client_secret: GOOGLE_CLIENT_SECRET,
                    redirect_uri: `${BACKEND_URL}/api/v1/auth/google/callback`,
                    grant_type: 'authorization_code',
                }),
            });

            const tokenData = await tokenRes.json();

            if (!tokenRes.ok || tokenData.error) {
                console.error('Google token exchange error:', tokenData);
                return res.redirect(`${frontendBase}/auth?error=token_exchange_failed`);
            }

            // 2. Get user profile from Google
            const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });

            const profile = await profileRes.json();

            if (!profileRes.ok || !profile.email) {
                return res.redirect(`${frontendBase}/auth?error=profile_fetch_failed`);
            }

            const { id: googleId, email, name, picture: avatar } = profile;

            // 3. Find or create user in MongoDB
            let user = await User.findOne({ googleId });

            if (!user) {
                // Maybe the user registered with email/password before — link accounts
                user = await User.findOne({ email });
                if (user) {
                    user.googleId = googleId;
                    if (avatar && !user.avatar) user.avatar = avatar;
                    await user.save();
                }
            }

            if (!user) {
                // Brand-new Google user — create with default role 'worker', mark as not onboarded
                user = await User.create({
                    name,
                    email,
                    googleId,
                    avatar: avatar || null,
                    role: 'worker',
                    isOnboarded: false,
                });
                isNewUser = true;
            }

            if (!user.isActive) {
                return res.redirect(`${frontendBase}/auth?error=account_deactivated`);
            }

            // 4. Issue JWT and redirect frontend
            const token = generateToken(user);
            // isOnboarded check: if not onboarded OR freshly created, send to onboarding
            const needsOnboarding = !user.isOnboarded || isNewUser;
            return res.redirect(
                `${frontendBase}/auth/callback?token=${token}&role=${user.role}&isNewUser=${needsOnboarding}`
            );
        } catch (error) {
            console.error('Google OAuth callback error:', error.message);
            return res.redirect(`${frontendBase}/auth?error=google_failed`);
        }
    },
};
