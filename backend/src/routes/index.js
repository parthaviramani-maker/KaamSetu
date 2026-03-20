import express from 'express';
import authRoutes        from './authRoutes.js';
import userRoutes        from './userRoutes.js';
import jobRoutes         from './jobRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import agentRoutes       from './agentRoutes.js';
import adminRoutes       from './adminRoutes.js';

const router = express.Router();

router.use('/auth',         authRoutes);
router.use('/users',        userRoutes);
router.use('/jobs',         jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/agents',       agentRoutes);
router.use('/admin',        adminRoutes);

export default router;
