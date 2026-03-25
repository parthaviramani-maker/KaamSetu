import express from 'express';
import { getBalance, topup, withdraw, transfer, getTransactions } from '../controllers/walletController/index.js';
import authenticateUser from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/balance',       getBalance.validator,      getBalance.handler);
router.post('/topup',        topup.validator,           topup.handler);
router.post('/withdraw',     withdraw.validator,        withdraw.handler);
router.post('/transfer',     transfer.validator,        transfer.handler);
router.get('/transactions',  getTransactions.validator, getTransactions.handler);

export default router;
