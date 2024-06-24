import apiAdapter from '../../apiAdapter.js';
import dotenv from 'dotenv';
dotenv.config()

const {
    URL_SERVICE_CUTI
} = process.env;

const api = apiAdapter(URL_SERVICE_CUTI);

export const getByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await api.get(`/approved-waiting/by-user/${userId}`);
        res.json(response.data);
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
export const approved = async (req, res) => {
    try {
        const response = await api.post(`/approved-waiting/approved`, req.body);
        res.json(response.data);
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
export const not_approved = async (req, res) => {
    try {
        const response = await api.post(`/approved-waiting/not-approved`, req.body);
        res.json(response.data);
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