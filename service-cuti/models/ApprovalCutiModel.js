import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import PengajuanCuti from './PengajuanCutiModel.js';

const { DataTypes } = Sequelize;

const ApprovalCuti = db.define('approval_cuti', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    pengajuan_cuti_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'disetujui', 'tidak-disetujui'],
        allowNull: false,
        defaultValue: 'pending'
    },
    tgl_approval: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    freezeTableName: true
})

PengajuanCuti.hasMany(ApprovalCuti, { foreignKey: 'pengajuan_cuti_id' })
ApprovalCuti.belongsTo(PengajuanCuti, { foreignKey: 'pengajuan_cuti_id' })

export default ApprovalCuti