import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Role from './RoleModel.js';
import Permission from './PermissionModel.js';

const { DataTypes } = Sequelize;

const PermissionRole = db.define('permission_role', {
    permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
}, {
    freezeTableName: true,
});

// Define associations
Permission.belongsToMany(Role, { through: PermissionRole, foreignKey: 'permission_id' });
Role.belongsToMany(Permission, { through: PermissionRole, foreignKey: 'role_id' });

export default PermissionRole;
