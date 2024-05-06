import express from 'express';
import {
    attachPermission, detachPermission
} from './handler/permissionsRoles/permissionsRolesHandler.js'

const router = express.Router();

router.post('/attach_permission', attachPermission);
router.post('/detach_permission', detachPermission);

export default router;