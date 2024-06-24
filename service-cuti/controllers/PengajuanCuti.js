import PengajuanCuti from '../models/PengajuanCutiModel.js';
import JenisCuti from '../models/JenisCutiModel.js';
import ApprovalCuti from '../models/ApprovalCutiModel.js';
import db from '../config/Database.js';
import apiAdapter from '../helpers/apiAdapter.js';
import dotenv from 'dotenv';
import Validator from 'fastest-validator';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
const v = new Validator();
dotenv.config();

const { URL_SERVICE_PORTAL } = process.env;

const api = apiAdapter(URL_SERVICE_PORTAL);

export const getQuery = async (req, res) => {
    const { draw, start, length, search, order, status, user_id } = req.query;

    try {
        const searchData = {
            ...search ? {
                [Op.or]: [
                    { keterangan: { [Op.like]: `%${search}%` } },
                    { status: { [Op.like]: `%${search}%` } },
                    { tgl_awal: { [Op.like]: `%${search}%` } },
                    { tgl_akhir: { [Op.like]: `%${search}%` } },
                    { '$jenis_cuti.name$': { [Op.like]: `%${search}%` } },
                ]
            } : {},
            ...status ? { status: status } : {},
            ...user_id ? { user_id: user_id } : {}
        };

        const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

        const cutiData = await PengajuanCuti.findAndCountAll({
            where: searchData,
            order: [['id', sortOrder]],
            limit: parseInt(length),
            offset: parseInt(start),
            include: [{
                model: JenisCuti,
                attributes: ['id', 'name'],
                where: search ? { name: { [Op.like]: `%${search}%` } } : {}, // Apply search to Role model
                required: false // Use 'required: false' to perform a LEFT JOIN
            }]
        });

        const arrayColumn = cutiData.rows.map(item => item['user_id'])

        // get name users from service portal.
        const nameUserResponse = await api.get(`/users`, {
            params: {
                userIds: arrayColumn.join(",")
            }
        })

        // Convert nameUserResponse to a map for easier lookup
        const nameUserMap = nameUserResponse.data.data.reduce((map, user) => {
            map[user.id] = user.name;
            return map;
        }, {});

        // Combine response with nameUser
        const combinedResponse = cutiData.rows.map(item => {
            return {
                ...item.toJSON(),  // Convert sequelize model instance to plain object
                pengajuan_cuti_username: nameUserMap[item.user_id] // Add the user name from nameUserMap
            };
        });

        const responseData = {
            draw: parseInt(draw),
            recordsTotal: cutiData.count,
            recordsFiltered: cutiData.rows.length,
            data: combinedResponse
        };

        res.json(responseData);

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const response = await PengajuanCuti.findAll({
            include: [{
                model: JenisCuti,
                attributes: ['id', 'name'],
            }]
        });

        const arrayColumn = response.map(item => item['user_id'])

        // get name users from service portal.
        const nameUserResponse = await api.get(`/users`, {
            params: {
                userIds: arrayColumn.join(",")
            }
        })

        // Convert nameUserResponse to a map for easier lookup
        const nameUserMap = nameUserResponse.data.data.reduce((map, user) => {
            map[user.id] = user.name;
            return map;
        }, {});

        // Combine response with nameUser
        const combinedResponse = response.map(item => {
            return {
                ...item.toJSON(),  // Convert sequelize model instance to plain object
                pengajuan_cuti_username: nameUserMap[item.user_id] // Add the user name from nameUserMap
            };
        });

        return res.json({
            status: 'success',
            data: combinedResponse
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}

export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await PengajuanCuti.findOne({
            where: {
                id: id
            },
            include: [{
                model: JenisCuti,
                attributes: ['id', 'name'],
            }]
        })

        if (!response) {
            return res.status(404).json({
                status: 'error',
                msg: 'Pengajuan cuti not found'
            })
        }

        res.json({
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

export const getByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await PengajuanCuti.findAll({
            where: {
                user_id: userId
            },
            include: [{
                model: JenisCuti,
                attributes: ['id', 'name'],
            }]
        })


        res.json({
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

export const getByJenis = async (req, res) => {
    try {
        const { jenisCutiId } = req.params;
        const response = await PengajuanCuti.findAll({
            where: {
                jenis_cuti_id: jenisCutiId
            },
            include: [{
                model: JenisCuti,
                attributes: ['id', 'name'],
            }]
        })


        res.json({
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

export const created = async (req, res) => {
    const trx = await db.transaction();
    try {
        const schema = {
            userId: { type: 'any', empty: false },
            jenisCutiId: { type: 'any', empty: false },
            keterangan: { type: 'string', empty: false },
            tglAwal: { type: 'string', empty: false },
            tglAkhir: { type: 'string', empty: false },
        };

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            await trx.rollback();

            return res.status(400).json({
                status: 'error',
                msg: validate
            })
        }

        const { userId, jenisCutiId, keterangan, tglAwal, tglAkhir, approvalCutiId } = req.body;

        // check user by id di service portal
        const checkUser = (await api.get(`/users/${userId}`)).data;

        if (jenisCutiId) {
            const checkJenis = await JenisCuti.findOne({
                where: {
                    id: jenisCutiId
                }
            })

            if (!checkJenis) {
                await trx.rollback();

                return res.status(404).json({
                    status: 'error',
                    msg: 'Jenis cuti not found'
                })
            }
        }

        let fileName, url;
        if (req.files === null) {
            fileName = null;
            url = null;
        } else {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            fileName = file.md5 + ext;
            url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
            const allowedType = ['.png', '.jpg', '.jpeg'];

            // Check if the file type is allowed
            if (!allowedType.includes(ext.toLowerCase())) {
                await trx.rollback();

                return res.status(422).json({
                    status: 'error',
                    msg: "Invalid Image Type"
                });
            }

            // Validate file size
            if (fileSize > 2000000) {
                await trx.rollback();

                return res.status(422).json({
                    status: 'error',
                    msg: "Image must be less than 2 MB"
                });
            }

            // Move the file to the desired location
            file.mv(`./public/images/${fileName}`, async (err) => {
                if (err) {
                    return res.status(500).json({ status: 'error', msg: err.message });
                }
            });
        }

        if (!approvalCutiId) {
            await trx.rollback();
            return res.status(404).json({
                status: 'error',
                msg: 'Field approvalCutiId kosong. Silahkan diisi user yang boleh approval cuti ini!'
            })
        }

        // check approval users yang sudah di pilih di service portal.
        await api.get(`/users`, {
            params: {
                userIds: approvalCutiId
            }
        })

        if (!checkUser.data.have_cuti) {
            await trx.rollback();

            return res.status(400).json({
                status: 'error',
                msg: `User ${checkUser.data.name}, belum memilki cuti`
            })
        }

        const pengajuanCuti = await PengajuanCuti.create({
            user_id: userId,
            jenis_cuti_id: jenisCutiId,
            keterangan: keterangan,
            tgl_awal: tglAwal,
            tgl_akhir: tglAkhir,
            file_pendukung: fileName,
            url_file_pendukung: url,
            status: 'pending'
        }, { transaction: trx })

        const pengajuanCutiId = pengajuanCuti.id

        const approvalCutiData = approvalCutiId.split(',').map(userId => ({
            pengajuan_cuti_id: pengajuanCutiId,
            user_id: userId,
            status: 'pending'
        }))

        await ApprovalCuti.bulkCreate(approvalCutiData, { transaction: trx })

        await trx.commit()

        res.status(201).json({
            status: 'success',
            msg: 'Pengajuan Cuti created successfully'
        });
    } catch (error) {
        await trx.rollback();

        if (error.response) {
            // If error.response exists, destructure properties from it
            const { status, data } = error.response;
            return res.status(status).json(data);
        } else {
            // If error.response is undefined, handle the error accordingly
            return res.status(500).json({
                status: 'error',
                msg: error.message
            })
        }

    }
}

export const updated = async (req, res) => {
    const trx = await db.transaction();
    try {
        const schema = {
            userId: { type: 'any', optional: true },
            jenisCutiId: { type: 'any', optional: true },
            keterangan: { type: 'string', optional: true },
            tglAwal: { type: 'string', optional: true },
            tglAkhir: { type: 'string', optional: true },
        };

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                msg: validate
            })
        }

        const { userId, jenisCutiId, keterangan, tglAwal, tglAkhir, approvalCutiId } = req.body;

        const { id } = req.params;

        const checkPengajuanCuti = await PengajuanCuti.findOne({
            where: {
                id: id
            }
        })

        if (!checkPengajuanCuti) {
            await trx.rollback()

            return res.status(404).json({
                status: 'error',
                msg: 'Pengajuan cuti not found'
            })
        }

        // check user by id di service portal
        const checkUser = (await api.get(`/users/${userId}`)).data;

        if (jenisCutiId) {
            const checkJenis = await JenisCuti.findOne({
                where: {
                    id: jenisCutiId
                }
            })

            if (!checkJenis) {
                await trx.rollback()

                return res.status(404).json({
                    status: 'error',
                    msg: 'Jenis cuti not found'
                })
            }
        }

        let fileName, url;
        if (req.files === null) {
            fileName = checkPengajuanCuti.file_pendukung;
            url = checkPengajuanCuti.url_file_pendukung;
        } else {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            fileName = file.md5 + ext;
            url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
            const allowedType = ['.png', '.jpg', '.jpeg'];

            // Check if the file type is allowed
            if (!allowedType.includes(ext.toLowerCase())) {
                await trx.rollback();

                return res.status(422).json({
                    status: 'error',
                    msg: "Invalid Image Type"
                });
            }

            // Validate file size
            if (fileSize > 2000000) {
                await trx.rollback();

                return res.status(422).json({
                    status: 'error',
                    msg: "Image must be less than 2 MB"
                });
            }

            if (checkPengajuanCuti.file_pendukung) {
                const filepath = `./public/images/${checkPengajuanCuti.file_pendukung}`;
                fs.unlinkSync(filepath);
            }

            // Move the file to the desired location
            file.mv(`./public/images/${fileName}`, async (err) => {
                if (err) {
                    return res.status(500).json({ status: 'error', msg: err.message });
                }
            });
        }

        if (!approvalCutiId) {
            await trx.rollback();

            return res.status(404).json({
                status: 'error',
                msg: 'Field approvalCutiId kosong. Silahkan diisi user yang boleh approval cuti ini!'
            })
        }

        // check approval users yang sudah di pilih di service portal.
        await api.get(`/users`, {
            params: {
                userIds: approvalCutiId
            }
        })

        if (!checkUser.data.have_cuti) {
            await trx.rollback();

            return res.status(400).json({
                status: 'error',
                msg: `User ${checkUser.data.name}, belum memilki cuti`
            })
        }

        // check status pengajuan cuti jika masih pending boleh di update
        if (checkPengajuanCuti.status !== 'pending') {
            await trx.rollback();

            return res.status(400).json({
                status: 'error',
                msg: `Pengajuan cuti ini tidak bisa di edit, karena sudah di proses!`
            })
        }

        await checkPengajuanCuti.update({
            user_id: userId,
            jenis_cuti_id: jenisCutiId,
            keterangan: keterangan,
            tgl_awal: tglAwal,
            tgl_akhir: tglAkhir,
            file_pendukung: fileName,
            url_file_pendukung: url,
            status: 'pending'
        }, { transaction: trx })

        // delete approval cutis
        const approvalCutis = await ApprovalCuti.findAll({
            where: {
                pengajuan_cuti_id: checkPengajuanCuti.id
            },
            transaction: trx
        });

        if (approvalCutis.length > 0) {
            await Promise.all(approvalCutis.map(approvalCuti => approvalCuti.destroy({ transaction: trx })));
        }

        const approvalCutiData = approvalCutiId.split(',').map(userId => ({
            pengajuan_cuti_id: checkPengajuanCuti.id,
            user_id: userId,
            status: 'pending'
        }))

        await ApprovalCuti.bulkCreate(approvalCutiData, { transaction: trx })

        await trx.commit()

        res.json({
            status: 'success',
            msg: 'Pengajuan Cuti updated successfully'
        });
    } catch (error) {
        await trx.rollback();

        if (error.response) {
            // If error.response exists, destructure properties from it
            const { status, data } = error.response;
            return res.status(status).json(data);
        } else {
            // If error.response is undefined, handle the error accordingly
            return res.status(500).json({
                status: 'error',
                msg: error.message
            })
        }

    }
}

export const destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await PengajuanCuti.findOne({
            where: {
                id: id
            }
        })

        if (!response) {
            return res.status(404).json({
                status: 'error',
                msg: 'Pengajuan cuti not found'
            })
        }

        if (response.file_pendukung) {
            const filepath = `./public/images/${response.file_pendukung}`;
            fs.unlinkSync(filepath);
        }

        await response.destroy();

        res.json({
            status: 'success',
            msg: 'Pengajuan Cuti deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}