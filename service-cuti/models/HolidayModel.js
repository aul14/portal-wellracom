import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Holiday = db.define('holiday', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
            isInt: true,
            min: 1900, // You can set this to a reasonable minimum year value
            max: new Date().getFullYear() // Ensures the year isn't in the future
        }
    },
    holiday_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    holiday_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_national_holiday: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
}, {
    freezeTableName: true
})

export default Holiday