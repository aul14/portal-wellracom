import express from 'express';
import { created, getAll, getById, getByJenis, getByUser, destroy, updated, getQuery } from '../controllers/PengajuanCuti.js';

const router = express.Router();

router.get('/pengajuan-cuti/query', getQuery);
router.get('/pengajuan-cuti', getAll);
router.get('/pengajuan-cuti/:id', getById);
router.put('/pengajuan-cuti/:id', updated);
router.delete('/pengajuan-cuti/:id', destroy);
router.get('/pengajuan-cuti/by-user/:userId', getByUser);
router.get('/pengajuan-cuti/by-jenis-cuti/:jenisCutiId', getByJenis);
router.post('/pengajuan-cuti', created);

export default router;