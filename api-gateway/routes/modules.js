import express from 'express';
import {
    get,
    getAll,
    getQuery,
    create,
    update,
    destroy
} from './handler/modules/moduleHandler.js';

const router = express.Router();

router.get('/', getAll);
router.get('/query', getQuery);
router.get('/:id', get);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', destroy);

export default router;