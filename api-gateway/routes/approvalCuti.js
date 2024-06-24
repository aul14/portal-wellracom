import express from 'express';
import { approved, getByUser, not_approved } from './handler/approvalCuti/approvalCutiHandler.js';
import { checkPermissions } from '../middlewares/permissions.js';

const router = express.Router();

router.get('/:userId', checkPermissions('manage-approval-cuti'), getByUser);
router.post('/approved', checkPermissions('approved-cuti'), approved);
router.post('/not-approved', checkPermissions('not-approved-cuti'), not_approved);

export default router;