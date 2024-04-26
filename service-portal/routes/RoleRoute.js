import express from 'express';
import {
    getRoleById,
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    getRolesQuery
} from '../controllers/Roles.js';

const router = express.Router();

router.get('/roles/query', getRolesQuery);
router.get('/roles', getRoles);
router.get('/roles/:id', getRoleById);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

export default router;