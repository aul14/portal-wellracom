import express from 'express';
import { approved, getByUser, not_approved } from '../controllers/ApprovalCuti.js';

const router = express.Router();

router.get('/approved-waiting/by-user/:userId', getByUser);
router.post('/approved-waiting/approved', approved);
router.post('/approved-waiting/not-approved', not_approved);

export default router;