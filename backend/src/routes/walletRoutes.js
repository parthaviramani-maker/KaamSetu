import express from 'express';
import { getBalance, topup, getTransactions } from '../controllers/walletController/index.js';
import authenticateUser from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/balance',       getBalance.validator,      getBalance.handler);
router.post('/topup',        topup.validator,           topup.handler);
router.get('/transactions',  getTransactions.validator, getTransactions.handler);

export default router;
