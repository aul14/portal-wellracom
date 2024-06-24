import express from 'express';
import {
    create,
    destroy,
    get,
    getAll,
    getByJenis,
    getByUser,
    getQuery,
    update
} from './handler/pengajuanCuti/pengajuanCutiHandler.js';
import { checkPermissions } from '../middlewares/permissions.js';

const router = express.Router();

router.get('/', checkPermissions('manage-pengajuan-cuti'), getAll);
router.get('/query', checkPermissions('manage-pengajuan-cuti'), getQuery);
router.get('/:id', checkPermissions('manage-pengajuan-cuti'), get);
router.get('/by-jenis-cuti/:jenisCutiId', checkPermissions('manage-pengajuan-cuti'), getByJenis);
router.get('/by-user/:userId', checkPermissions('manage-pengajuan-cuti'), getByUser);
router.post('/', checkPermissions('create-pengajuan-cuti'), create);
router.put('/:id', checkPermissions('edit-pengajuan-cuti'), update);
router.delete('/:id', checkPermissions('delete-pengajuan-cuti'), destroy);

export default router;