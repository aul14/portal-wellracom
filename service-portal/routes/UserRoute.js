import express from 'express';
import {
    getUserById,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUsersQuery
} from '../controllers/Users.js';

const router = express.Router();

router.get('/users/query', getUsersQuery);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;