import User from '../models/UserModel.js';
import RefreshToken from '../models/RefreshTokenModel.js';
import argon2 from 'argon2';
import Validator from 'fastest-validator';
const v = new Validator();

export const Login = async (req, res) => {
    try {
        const schema = {
            username: 'string|empty:false',
            password: 'string|empty:false'
        }

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        }

        const user = await User.findOne({
            where: {
                username: req.body.username
            },
        });


        if (!user) {
            return res.status(400).json({
                status: 'error',
                msg: 'Login failed'
            })
        }

        const match = await argon2.verify(user.password, req.body.password);
        if (!match) {
            return res.status(400).json({
                status: 'error',
                msg: 'Login failed'
            })
        }

        const res_user = {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            urlAvatar: user.url_avatar
        }

        res.json({
            status: 'success',
            msg: 'Login successfully',
            data: res_user
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const Logout = async (req, res) => {
    try {
        const schema = {
            userId: 'number|empty:false',
        }

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        }

        const user = await User.findByPk(req.body.userId);

        if (!user) {
            return res.status(400).json({
                status: 'error',
                msg: 'User not found'
            })
        }

        await RefreshToken.destroy({
            where: {
                userId: req.body.userId
            }
        })

        res.json({
            status: 'success',
            msg: 'Logout successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}