import express from 'express';
import {
    get,
    getAll,
    getQuery,
    create,
    update,
    destroy
} from './handler/permissions/permissionHandler.js';
import { checkPermissions } from '../middlewares/permissions.js';

const router = express.Router();

router.get('/', checkPermissions('manage-permission'), getAll);
router.get('/query', checkPermissions('manage-permission'), getQuery);
router.get('/:id', checkPermissions('manage-permission'), get);
router.post('/', checkPermissions('create-permission'), create);
router.put('/:id', checkPermissions('edit-permission'), update);
router.delete('/:id', checkPermissions('delete-permission'), destroy);

export default router;