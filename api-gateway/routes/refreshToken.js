import express from 'express';
import {
    refreshToken
} from './handler/refreshTokens/refreshTokenHandler.js';

const router = express.Router();

router.post('/', refreshToken);

export default router;