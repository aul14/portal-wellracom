import Permission from '../models/PermissionModel.js';
import Module from '../models/ModuleModel.js';
import { checkUniqueness } from '../helpers/checkUnique.js'
import { Op } from 'sequelize'
import Validator from 'fastest-validator';
const v = new Validator();

export const getPermissionsQuery = async (req, res) => {
    const { draw, start, length, search, order } = req.query;

    try {
        const searchData = search ? {
            [Op.or]: [
                { keyName: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { '$Module.name$': { [Op.like]: `%${search}%` } },
            ]
        } : {};

        const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

        const permissionData = await Permission.findAndCountAll({
            where: searchData,
            order: [['id', sortOrder]],
            limit: parseInt(length),
            offset: parseInt(start),
            include: [{
                model: Module,
                attributes: ['id', 'name'],
                where: search ? { name: { [Op.like]: `%${search}%` } } : {}, // Apply search to Role model
                required: false // Use 'required: false' to perform a LEFT JOIN
            }],
        });

        const responseData = {
            draw: parseInt(draw),
            recordsTotal: permissionData.count,
            recordsFiltered: permissionData.rows.length,
            data: permissionData.rows
        };

        res.json(responseData);

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}

export const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.findAll({
            include: [{
                model: Module
            }]
        })

        res.status(200).json({
            status: 'success',
            data: permissions
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const getPermissionById = async (req, res) => {
    try {
        const permission = await Permission.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Module
            }]
        });

        if (!permission) {
            return res.status(404).json({
                status: 'error',
                msg: 'Permission not found'
            })
        }

        res.status(200).json({
            status: 'success',
            data: permission
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const createPermission = async (req, res) => {
    try {
        const { keyName, name, description, moduleId } = req.body;
        const schema = {
            keyName: 'string|empty:false|min:3|max:150',
            name: 'string|empty:false',
            moduleId: 'any|empty:false',
        }

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        }

        if (await checkUniqueness(Permission, 'keyName', keyName)) {
            return res.status(400).json({
                status: 'error',
                msg: 'Key name is already exist'
            });
        }

        if (moduleId) {
            const check_module = await Module.findOne({
                where: {
                    id: moduleId
                }
            });

            if (!check_module) {
                return res.status(404).json({
                    status: 'error',
                    msg: 'Module is not found'
                });
            }
        }

        const permission = await Permission.create({
            keyName: keyName,
            name: name,
            description: description,
            moduleId: moduleId
        });

        res.status(201).json({
            status: 'success',
            msg: 'Permission created',
            data: permission
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const updatePermission = async (req, res) => {
    try {
        const schema = {
            keyName: 'string|optional|min:3|max:150',
            name: 'string|optional',
            moduleId: 'any|optional',
        }

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        }

        const permission = await Permission.findOne({
            where: {
                id: req.params.id
            },
        });

        if (!permission) {
            return res.status(404).json({
                status: 'error',
                msg: 'Permission not found'
            })
        }

        const { keyName, name, description, moduleId } = req.body;

        if (keyName) {
            if (await checkUniqueness(Permission, 'keyName', keyName) && keyName !== permission.keyName) {
                return res.status(400).json({
                    status: 'error',
                    msg: 'Key name is already exist'
                });
            }
        }

        if (moduleId) {
            const check_module = await Module.findOne({
                where: {
                    id: moduleId
                }
            });

            if (!check_module) {
                return res.status(404).json({
                    status: 'error',
                    msg: 'Module is not found'
                });
            }
        }

        const response_permission = await permission.update({
            keyName: keyName,
            name: name,
            description: description,
            moduleId: moduleId
        });

        res.status(200).json({
            status: 'success',
            msg: 'Permission updated',
            data: response_permission
        })

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const deletePermission = async (req, res) => {
    try {
        const permission = await Permission.findOne({
            where: {
                id: req.params.id
            },
        });

        if (!permission) {
            return res.status(404).json({
                status: 'error',
                msg: 'Permission not found'
            })
        }

        await permission.destroy();

        res.status(200).json({
            status: 'success',
            msg: 'Permission deleted',
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}