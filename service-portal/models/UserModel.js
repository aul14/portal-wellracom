import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Role from './RoleModel.js';

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 150]
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    url_avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date_start: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    date_end: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
})

Role.hasMany(Users)
Users.belongsTo(Role, { foreignKey: 'roleId' })

export default Users