import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import JenisCuti from './JenisCutiModel.js';

const { DataTypes } = Sequelize;

const PengajuanCuti = db.define('pengajuan_cuti', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    jenis_cuti_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tgl_awal: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tgl_akhir: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    file_pendukung: {
        type: DataTypes.STRING,
        allowNull: true
    },
    url_file_pendukung: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'disetujui', 'tidak-disetujui'],
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    freezeTableName: true
})

JenisCuti.hasMany(PengajuanCuti, { foreignKey: 'jenis_cuti_id' })
PengajuanCuti.belongsTo(JenisCuti, { foreignKey: 'jenis_cuti_id' })

export default PengajuanCuti