import express from 'express';
import {
    get,
    getAll,
    getQuery,
    create,
    update,
    destroy
} from './handler/roles/roleHandler.js';
import { checkPermissions } from '../middlewares/permissions.js';

const router = express.Router();

router.get('/', checkPermissions('manage-role'), getAll);
router.get('/query', checkPermissions('manage-role'), getQuery);
router.get('/:id', checkPermissions('manage-role'), get);
router.post('/', checkPermissions('create-role'), create);
router.put('/:id', checkPermissions('edit-role'), update);
router.delete('/:id', checkPermissions('delete-role'), destroy);

export default router;