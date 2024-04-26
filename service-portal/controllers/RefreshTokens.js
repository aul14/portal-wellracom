import RefreshToken from '../models/RefreshTokenModel.js';
import User from '../models/UserModel.js';
import Validator from 'fastest-validator';
const v = new Validator();

export const getToken = async (req, res) => {
    try {
        const refreshToken = req.query.refreshToken;

        const token = await RefreshToken.findOne({
            where: {
                token: refreshToken
            }
        })

        if (!token) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid token!'
            })
        }

        res.json({
            status: 'success',
            data: token
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}

export const createToken = async (req, res) => {
    try {
        const { userId, refreshToken } = req.body;

        const schema = {
            refreshToken: 'string',
            userId: 'number'
        }

        const validate = v.validate(req.body, schema);
        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            })
        }

        const response_refreshToken = await RefreshToken.create({
            token: refreshToken,
            userId: userId
        });

        res.status(201).json({
            status: 'success',
            msg: 'Refresh token created',
            data: response_refreshToken
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}