import apiAdapter from '../../apiAdapter.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const {
    URL_SERVICE_PORTAL,
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED,
} = process.env;

const api = apiAdapter(URL_SERVICE_PORTAL);

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                status: 'error',
                msg: 'Invalid token',
            })
        }

        // cek refresh token dari service-user refres token
        await api.get('/refresh_tokens', { params: { refreshToken: refreshToken } });

        jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    status: 'error',
                    msg: err.message
                })
            }

            const accessToken = jwt.sign({ data: decoded.data }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });

            res.json({
                status: 'success',
                data: {
                    accessToken
                }
            })
        });
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({
                status: 'error',
                msg: 'service unavailable!'
            })
        }

        if (error.response) {
            // If error.response exists, destructure properties from it
            const { status, data } = error.response;
            return res.status(status).json(data);
        } else {
            // If error.response is undefined, handle the error accordingly
            return res.status(500).json({
                status: 'error',
                msg: 'An unexpected error occurred.'
            });
        }
    }
}