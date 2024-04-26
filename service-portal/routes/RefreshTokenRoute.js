import express from 'express';
import {
    getToken, createToken
} from '../controllers/RefreshTokens.js';

const router = express.Router();

router.get('/refresh_tokens', getToken);
router.post('/refresh_tokens', createToken);

export default router;