import express from 'express';
import { register, login, googleAuth, googleCallback, onboarding, forgotPassword, resetPassword, verifyLogin, checkEmail, sendSignupOtp, adminSelectEmail } from '../controllers/authController/index.js';
import authenticateUser from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/check-email',              checkEmail.handler);
router.post('/send-signup-otp',          sendSignupOtp.handler);
router.post('/register',                 register.validator,  register.handler);
router.post('/login',                    login.validator,     login.handler);
router.post('/verify-login',             verifyLogin.handler);
router.post('/admin-select-email',       adminSelectEmail.handler);
router.get('/google',                    googleAuth.handler);
router.get('/google/callback',           googleCallback.handler);
router.patch('/onboarding',              authenticateUser,    onboarding.handler);
router.post('/forgot-password',          forgotPassword.handler);
router.post('/reset-password/:token',    resetPassword.handler);

export default router;
