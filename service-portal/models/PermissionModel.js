import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Modules from './ModuleModel.js';

const { DataTypes } = Sequelize;

const Permissions = db.define('permissions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    keyName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    module_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
})

Modules.hasMany(Permissions, { foreignKey: 'module_id' });
Permissions.belongsTo(Modules, { foreignKey: 'module_id' });

export default Permissions