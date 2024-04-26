import { Sequelize } from 'sequelize';
import User from '../models/UserModel.js';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const RefreshTokens = db.define('refresh_tokens', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    freezeTableName: true
})

User.hasMany(RefreshTokens);
RefreshTokens.belongsTo(User, { foreignKey: 'userId' })

export default RefreshTokens