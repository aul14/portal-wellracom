import express from 'express';
import {
    attachPermission, detachPermission
} from './handler/permissionsRoles/permissionsRolesHandler.js';
import { checkPermissions } from '../middlewares/permissions.js';

const router = express.Router();

router.post('/attach_permission', checkPermissions('manage-role-access'), attachPermission);
router.post('/detach_permission', checkPermissions('manage-role-access'), detachPermission);

export default router;