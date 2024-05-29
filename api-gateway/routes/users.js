import express from 'express';
import {
    get,
    getAll,
    getQuery,
    create,
    update,
    destroy
} from './handler/users/userHandler.js'

const router = express.Router();

import { checkPermissions } from '../middlewares/permissions.js';

router.get('/', checkPermissions('manage-user'), getAll);
router.get('/query', checkPermissions('manage-user'), getQuery);
router.get('/:id', checkPermissions('manage-user'), get);
router.post('/', checkPermissions('create-user'), create);
router.put('/:id', checkPermissions('edit-user'), update);
router.delete('/:id', checkPermissions('delete-user'), destroy);

export default router;