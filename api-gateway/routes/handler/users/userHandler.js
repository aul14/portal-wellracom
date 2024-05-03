import apiAdapter from '../../apiAdapter.js';
import dotenv from 'dotenv';
dotenv.config()

const {
    URL_SERVICE_PORTAL
} = process.env;

const api = apiAdapter(URL_SERVICE_PORTAL);

export const getAll = async (req, res) => {
    try {
        const users = await api.get(`/users`);
        res.json(users.data)
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({
                status: 'error',
                message: 'service unavailable!'
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
                message: 'An unexpected error occurred.'
            });
        }
    }
}
export const getQuery = async (req, res) => {
    try {

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({
                status: 'error',
                message: 'service unavailable!'
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
                message: 'An unexpected error occurred.'
            });
        }
    }
}
export const get = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await api.get(`/users/${id}`);
        res.json(user.data)
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({
                status: 'error',
                message: 'service unavailable!'
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
                message: 'An unexpected error occurred.'
            });
        }
    }
}
export const create = async (req, res) => {
    try {
        // Create FormData object to handle multipart/form-data
        const formData = new FormData();

        // Append user data fields to FormData
        formData.append('name', req.body.name);
        formData.append('username', req.body.username);
        formData.append('email', req.body.email);
        formData.append('password', req.body.password);
        formData.append('confPassword', req.body.confPassword);
        formData.append('roleId', req.body.roleId);
        if (req.body.dateStart) {
            const dateStart = new Date(req.body.dateStart);
            if (!isNaN(dateStart)) {
                formData.append('dateStart', dateStart.toISOString());
            } else {
                console.error('Invalid date format for dateStart:', req.body.dateStart);
            }
        }
        if (req.body.dateEnd) {
            formData.append('dateEnd', new Date(req.body.dateEnd).toISOString());
        }
        if (req.body.telegramId) {
            formData.append('telegramId', req.body.telegramId);
        }

        // Append avatar file if available
        if (req.files && req.files.file) {
            const file = req.files.file;

            if (file.data instanceof Buffer) {
                const blob = new Blob([file.data], { type: file.mimetype });
                formData.append('file', blob, file.name);
            } else {
                formData.append('file', file.data, file.name);
            }
        }


        const user = await api.post(`/users`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        res.json(user.data)
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({
                status: 'error',
                message: 'service unavailable!'
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
                message: 'An unexpected error occurred.'
            });
        }
    }
}
export const update = async (req, res) => {
    try {

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({
                status: 'error',
                message: 'service unavailable!'
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
                message: 'An unexpected error occurred.'
            });
        }
    }
}
export const destroy = async (req, res) => {
    try {

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({
                status: 'error',
                message: 'service unavailable!'
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
                message: 'An unexpected error occurred.'
            });
        }
    }
}