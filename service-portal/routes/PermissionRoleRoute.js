import express from 'express';
import {
    attachPermission, detachPermission
} from '../controllers/PermissionsRoles.js';

const router = express.Router();

router.post('/attach_permission', attachPermission);
router.post('/detach_permission', detachPermission);

export default router;