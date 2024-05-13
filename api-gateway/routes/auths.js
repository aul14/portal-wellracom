import express from 'express';
import {
    login,
    logout
} from './handler/auth/authHandler.js';

import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', verifyToken, logout);

export default router;