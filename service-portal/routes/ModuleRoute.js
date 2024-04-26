import express from 'express';
import {
    getModuleById,
    getModules,
    createModule,
    updateModule,
    deleteModule,
    getModulesQuery
} from '../controllers/Modules.js';

const router = express.Router();

router.get('/modules/query', getModulesQuery);
router.get('/modules', getModules);
router.get('/modules/:id', getModuleById);
router.post('/modules', createModule);
router.put('/modules/:id', updateModule);
router.delete('/modules/:id', deleteModule);

export default router;