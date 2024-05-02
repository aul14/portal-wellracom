import PermissionRole from '../models/PermissionRoleModel.js';
import Permission from '../models/PermissionModel.js';
import Role from '../models/RoleModel.js';
import Validator from 'fastest-validator';
import { Op } from 'sequelize'
const v = new Validator();

export const attachPermission = async (req, res) => {
    const { roleId, permissionId } = req.body;
    try {
        const schema = {
            roleId: 'number|empty:false',
            permissionId: 'number|empty:false',
        }

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        }

        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({
                status: 'error',
                msg: 'Role is not found'
            });
        }

        const permission = await Permission.findByPk(permissionId);
        if (!permission) {
            return res.status(404).json({
                status: 'error',
                msg: 'Permission is not found'
            });
        }

        // Check if permission role already exists
        const existingPermissionRole = await PermissionRole.findOne({
            where: {
                [Op.and]: [{ role_id: role.id }, { permission_id: permission.id }]
            },
        });
        if (existingPermissionRole) {
            return res.status(409).json({
                status: 'error',
                msg: 'Permission role already exists'
            });
        }

        await PermissionRole.create({
            role_id: role.id,
            permission_id: permission.id
        })

        res.status(201).json({
            status: 'success',
            msg: 'Permission role attach succesfully'
        })

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}

export const detachPermission = async (req, res) => {
    const { roleId, permissionId } = req.body;
    try {
        const schema = {
            roleId: 'number|empty:false',
            permissionId: 'number|empty:false',
        }

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                message: validate
            })
        }

        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({
                status: 'error',
                msg: 'Role not found'
            });
        }

        const permission = await Permission.findByPk(permissionId);
        if (!permission) {
            return res.status(404).json({
                status: 'error',
                msg: 'Permission not found'
            });
        }

        const permission_role = await PermissionRole.findOne({
            where: {
                [Op.and]: [{ role_id: role.id }, { permission_id: permission.id }]
            },
        })

        if (!permission_role) {
            return res.status(404).json({
                status: 'error',
                msg: 'Permission role not found'
            });
        }

        await PermissionRole.destroy({
            where: {
                [Op.and]: [{ role_id: role.id }, { permission_id: permission.id }]
            },
        });

        res.status(201).json({
            status: 'success',
            msg: 'Permission role detach succesfully'
        })

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}