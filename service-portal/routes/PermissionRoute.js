import express from 'express';
import {
    getPermissionById,
    getPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    getPermissionsQuery
} from '../controllers/Permissions.js';

const router = express.Router();

router.get('/permissions/query', getPermissionsQuery);
router.get('/permissions', getPermissions);
router.get('/permissions/:id', getPermissionById);
router.post('/permissions', createPermission);
router.put('/permissions/:id', updatePermission);
router.delete('/permissions/:id', deletePermission);

export default router;