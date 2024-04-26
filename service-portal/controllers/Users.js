import User from '../models/UserModel.js';
import Role from '../models/RoleModel.js';
import { Op } from 'sequelize'
import argon2 from 'argon2';
import Validator from 'fastest-validator';
import path from 'path';
import fs from 'fs';
import { checkUniqueness } from '../helpers/checkUnique.js';
const v = new Validator();

export const getUsersQuery = async (req, res) => {
    const { draw, start, length, search, order } = req.query;

    try {
        const searchData = search ? {
            [Op.or]: [
                { username: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { '$Role.name$': { [Op.like]: `%${search}%` } },
            ]
        } : {};

        const sortOrder = order[0].dir === 'asc' ? 'ASC' : 'DESC';

        const userData = await User.findAndCountAll({
            where: searchData,
            order: [['id', sortOrder]],
            limit: parseInt(length),
            offset: parseInt(start),
            attributes: ['id', 'name', 'username', 'email', 'avatar', 'date_start', 'date_end', 'createdAt', 'updatedAt'],
            include: [{
                model: Role,
                attributes: ['id', 'name'],
                where: search ? { name: { [Op.like]: `%${search}%` } } : {}, // Apply search to Role model
                required: false // Use 'required: false' to perform a LEFT JOIN
            }],
        });

        const responseData = {
            draw: parseInt(draw),
            recordsTotal: userData.count,
            recordsFiltered: userData.rows.length,
            data: userData.rows
        };

        res.json(responseData);

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['id', 'name', 'username', 'email', 'avatar', 'date_start', 'date_end', 'telegram_id', 'createdAt', 'updatedAt'],
            include: [{
                model: Role,
                attributes: ['id', 'name', 'description']
            }]
        });

        res.status(200).json({
            status: 'success',
            data: response
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: ['id', 'name', 'username', 'email', 'avatar', 'date_start', 'date_end', 'telegram_id', 'createdAt', 'updatedAt'],
            where: {
                id: req.params.id
            },
            include: [{
                model: Role,
                attributes: ['id', 'name', 'description']
            }]
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                msg: 'User is not found'
            })
        }

        res.status(200).json({
            status: 'success',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const createUser = async (req, res) => {
    try {
        const schema = {
            name: 'string|empty:false',
            username: 'string|empty:false|min:3|max:100',
            email: 'email|empty:false',
            password: 'string|empty:false|min:6',
            roleId: 'any|empty:false',
            dateStart: 'date|optional',
            dateEnd: 'date|optional',
            telegramId: 'any|optional',
        }

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        }

        const { name, username, email, password, confPassword, roleId, dateStart, dateEnd, telegramId } = req.body;

        if (password !== confPassword) {
            return res.status(400).json({
                status: 'error',
                msg: "Password and confirm password not same"
            })
        }

        if (await checkUniqueness(User, 'username', req.body.username)) {
            return res.status(400).json({
                status: 'error',
                msg: 'Username is already exist'
            });
        }

        if (await checkUniqueness(User, 'email', req.body.email)) {
            return res.status(400).json({
                status: 'error',
                msg: 'Email is already exist'
            });
        }

        if (req.body.roleId) {
            const checkRole = await Role.findOne({
                where: {
                    id: req.body.roleId
                }
            });

            if (!checkRole) {
                return res.status(404).json({
                    status: 'error',
                    msg: 'Role is not found'
                })
            }
        }

        const hashPassword = await argon2.hash(password);

        let fileName, url;
        if (req.files === null) {
            fileName = null;
            url = null;
        } else {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            fileName = file.md5 + ext;
            url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
            const allowedType = ['.png', '.jpg', '.jpeg'];

            // Check if the file type is allowed
            if (!allowedType.includes(ext.toLowerCase())) {
                return res.status(422).json({
                    status: 'error',
                    msg: "Invalid Image Type"
                });
            }

            // Validate file size
            if (fileSize > 2000000) {
                return res.status(422).json({
                    status: 'error',
                    msg: "Image must be less than 2 MB"
                });
            }

            // Move the file to the desired location
            file.mv(`./public/images/${fileName}`, async (err) => {
                if (err) {
                    return res.status(500).json({ status: 'error', msg: err.message });
                }
            });
        }

        const user = await User.create({
            username: username,
            name: name,
            email: email,
            password: hashPassword,
            roleId: roleId,
            date_start: dateStart,
            date_end: dateEnd,
            telegram_id: telegramId,
            avatar: fileName,
            url_avatar: url,
        });

        res.status(201).json({
            status: 'success',
            msg: 'User created',
            data: user
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const updateUser = async (req, res) => {
    try {
        const schema = {
            name: 'string|optional',
            username: 'string|optional|min:3|max:100',
            email: 'email|optional',
            password: 'string|optional|min:6',
            roleId: 'any|optional',
            dateStart: 'date|optional',
            dateEnd: 'date|optional',
            telegramId: 'any|optional',
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
                id: req.params.id
            }
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                msg: 'User not found'
            })
        }

        const { name, username, email, password, confPassword, roleId, dateStart, dateEnd, telegramId } = req.body;

        let hashPassword;
        if (password === "" || password == null) {
            hashPassword = user.password;
        } else {
            hashPassword = await argon2.hash(password);
        }

        if (password !== confPassword) {
            return res.status(400).json({
                status: 'error',
                msg: "Password and confirm password not same"
            })
        }

        if (req.body.username) {
            if (await checkUniqueness(User, 'username', req.body.username) && req.body.username !== user.username) {
                return res.status(400).json({
                    status: 'error',
                    msg: 'Username is already exist'
                });

            }
        }

        if (req.body.email) {
            if (await checkUniqueness(User, 'email', req.body.email) && req.body.email !== user.email) {
                return res.status(400).json({
                    status: 'error',
                    msg: 'Email is already exist'
                });

            }
        }

        if (req.body.roleId) {
            const checkRole = await Role.findOne({
                where: {
                    id: req.body.roleId
                }
            });

            if (!checkRole) {
                return res.status(404).json({
                    status: 'error',
                    msg: 'Role is not found'
                })
            }
        }

        let fileName, url;
        if (req.files === null) {
            fileName = user.avatar;
            url = user.url_avatar;
        } else {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            fileName = file.md5 + ext;
            url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
            const allowedType = ['.png', '.jpg', '.jpeg'];

            // Check if the file type is allowed
            if (!allowedType.includes(ext.toLowerCase())) {
                return res.status(422).json({
                    status: 'error',
                    msg: "Invalid Image Type"
                });
            }

            // Validate file size
            if (fileSize > 2000000) {
                return res.status(422).json({
                    status: 'error',
                    msg: "Image must be less than 2 MB"
                });
            }

            if (user.avatar) {
                const filepath = `./public/images/${user.avatar}`;
                fs.unlinkSync(filepath);
            }

            // Move the file to the desired location
            file.mv(`./public/images/${fileName}`, async (err) => {
                if (err) {
                    return res.status(500).json({ status: 'error', msg: err.message });
                }
            });
        }

        const response_user = await user.update({
            username: username,
            name: name,
            email: email,
            password: hashPassword,
            roleId: roleId,
            date_start: dateStart,
            date_end: dateEnd,
            telegram_id: telegramId,
            avatar: fileName,
            url_avatar: url,
        });

        res.status(200).json({
            status: 'success',
            msg: 'User updated',
            data: response_user
        })

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                msg: 'User not found'
            })
        }

        if (user.avatar) {
            const filepath = `./public/images/${user.avatar}`;
            fs.unlinkSync(filepath);
        }

        await user.destroy();

        res.status(200).json({
            status: 'success',
            msg: 'User deleted'
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
