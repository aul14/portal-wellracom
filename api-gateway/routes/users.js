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

router.get('/', getAll);
router.get('/', getQuery);
router.get('/:id', get);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', destroy);

export default router;