import apiAdapter from '../../apiAdapter.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config()

const {
    URL_SERVICE_PORTAL,
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED,
    JWT_REFRESH_TOKEN_EXPIRED,
    SECURE_COOKIE
} = process.env;

const api = apiAdapter(URL_SERVICE_PORTAL);

export const login = async (req, res) => {
    try {
        const user = await api.post('/login', req.body);
        const data = user.data.data;

        const accessToken = jwt.sign({ data }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
        const refreshToken = jwt.sign({ data }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRED });

        // cek refresh token dari service-portal refres token
        await api.post('/refresh_tokens', { refreshToken: refreshToken, userId: data.id });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: SECURE_COOKIE
        })

        res.json({
            status: 'success',
            data: {
                accessToken
            }
        })
    } catch (error) {
        console.log(error.message);
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
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(403).json({
                status: 'error',
                msg: 'You are out token!'
            })
        }
        const id = req.user.data.id;
        const user = await api.post(`/logout`, { userId: id });
        res.clearCookie('refreshToken');
        res.json(user.data);
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