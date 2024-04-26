import Role from '../models/RoleModel.js';
import Validator from 'fastest-validator';
import { Op } from 'sequelize';
const v = new Validator();

export const getRolesQuery = async (req, res) => {
    const { draw, start, length, search, order } = req.query;

    try {
        const searchData = search ? {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ]
        } : {};

        const sortOrder = order[0].dir === 'asc' ? 'ASC' : 'DESC';

        const roleData = await Role.findAndCountAll({
            where: searchData,
            order: [['id', sortOrder]],
            limit: parseInt(length),
            offset: parseInt(start),
        });

        const responseData = {
            draw: parseInt(draw),
            recordsTotal: roleData.count,
            recordsFiltered: roleData.rows.length,
            data: roleData.rows
        };

        res.json(responseData);

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}

export const getRoles = async (req, res) => {
    try {
        const response = await Role.findAll();

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
export const getRoleById = async (req, res) => {
    try {
        const role = await Role.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!role) {
            return res.status(404).json({
                status: 'error',
                msg: 'Role not found!'
            })
        }

        res.status(200).json({
            status: 'success',
            data: role
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const createRole = async (req, res) => {
    try {
        const schema = {
            name: 'string|empty:false',
        }

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        }

        const { name, description } = req.body;

        const response = await Role.create({
            name: name,
            description: description
        });
        res.status(201).json({
            status: 'success',
            msg: 'Role created',
            data: response
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const updateRole = async (req, res) => {
    try {
        const schema = {
            name: 'string|optional',
        }

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        }

        const role = await Role.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!role) {
            return res.status(404).json({
                status: 'error',
                msg: 'Role not found!'
            })
        }

        const { name, description } = req.body;

        const roleUpdate = await role.update({
            name: name,
            description: description
        })

        res.status(200).json({
            status: 'success',
            msg: 'Role updated',
            data: roleUpdate
        })

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }

}
export const deleteRole = async (req, res) => {
    try {
        const role = await Role.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!role) {
            return res.status(404).json({
                status: 'error',
                msg: 'Role not found!'
            })
        }

        await Role.destroy({
            where: {
                id: role.id
            }
        })
        res.status(200).json({
            status: 'status',
            msg: 'Role deleted'
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}