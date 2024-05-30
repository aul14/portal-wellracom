import express from 'express';
import {
    get,
    getAll,
    getQuery,
    create,
    update,
    destroy,
    getWithPermissions
} from './handler/modules/moduleHandler.js';
import { checkPermissions } from '../middlewares/permissions.js';

const router = express.Router();

router.get('/withpermissions', getWithPermissions);
router.get('/', checkPermissions('manage-module'), getAll);
router.get('/query', checkPermissions('manage-module'), getQuery);
router.get('/:id', checkPermissions('manage-module'), get);
router.post('/', checkPermissions('create-module'), create);
router.put('/:id', checkPermissions('edit-module'), update);
router.delete('/:id', checkPermissions('delete-module'), destroy);

export default router;