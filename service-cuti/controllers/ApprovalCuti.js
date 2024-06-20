import ApprovalCuti from '../models/ApprovalCutiModel.js';
import PengajuanCuti from '../models/PengajuanCutiModel.js';
import apiAdapter from '../helpers/apiAdapter.js';
import db from '../config/Database.js';
import { Op } from 'sequelize';
import Validator from 'fastest-validator';
import dotenv from 'dotenv';
dotenv.config();

const v = new Validator();

const { URL_SERVICE_PORTAL } = process.env;

const api = apiAdapter(URL_SERVICE_PORTAL);

export const getByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const response = await ApprovalCuti.findAll({
            where: {
                user_id: userId
            },
            include: [{
                model: PengajuanCuti
            }]
        });

        const arrayColumn = response.map(item => item['pengajuan_cuti']['user_id'])

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
                pengajuan_cuti_username: nameUserMap[item.pengajuan_cuti.user_id] // Add the user name from nameUserMap
            };
        });


        res.json({
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

export const approved = async (req, res) => {
    const trx = await db.transaction();

    try {
        const { userId, pengajuanCutiId, keterangan } = req.body;

        const schema = {
            userId: { type: 'any', empty: false },
            pengajuanCutiId: { type: 'any', empty: false },
        };

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            await trx.rollback();

            return res.status(400).json({
                status: 'error',
                msg: validate
            })
        }

        const checkApprovalCuti = await ApprovalCuti.findOne({
            where: {
                [Op.and]: [
                    { pengajuan_cuti_id: pengajuanCutiId },
                    { user_id: userId },
                ]
            },
            transaction: trx
        })

        if (!checkApprovalCuti) {
            await trx.rollback();

            return res.status(400).json({
                status: 'error',
                msg: 'Pengajuan cuti tidak tersedia atau anda tidak memiliki akses untuk approve pengajuan cuti ini!'
            })
        }

        if (checkApprovalCuti.status !== 'pending') {
            await trx.rollback();

            return res.status(400).json({
                status: 'error',
                msg: 'Proses approval hanya bisa dilakukan sekali!'
            })
        }

        await checkApprovalCuti.update({
            status: 'disetujui',
            tgl_approval: new Date,
            keterangan: keterangan
        }, { transaction: trx })


        // Check semuanya pengajuan cuti tersebut sudah di approve atau tidak.
        let approvedAll = true;
        let hasRejected = false;

        const checkAllApprovedCuti = await ApprovalCuti.findAll({
            where: {
                pengajuan_cuti_id: pengajuanCutiId
            },
            transaction: trx
        })

        checkAllApprovedCuti.forEach(item => {
            if (item.status === 'tidak-disetujui') {
                hasRejected = true;
                approvedAll = false;
            } else if (item.status === 'pending') {
                approvedAll = false;
            }
        })

        const getStatusCuti = await PengajuanCuti.findOne({
            where: {
                id: pengajuanCutiId
            },
            transaction: trx
        })

        if (hasRejected) {
            //update status pengajuan cuti menjadi tidak-disetujui
            await getStatusCuti.update({
                status: 'tidak-disetujui'
            }, { transaction: trx })

        } else if (approvedAll) {
            //update status pengajuan cuti menjadi disetujui
            await getStatusCuti.update({
                status: 'disetujui'
            }, { transaction: trx })
        }

        await trx.commit();

        res.json({
            status: 'success',
            msg: 'Pengajuan cuti successfully approved'
        })

    } catch (error) {
        await trx.rollback();

        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}

export const not_approved = async (req, res) => {
    try {
        const trx = await db.transaction();

        try {
            const { userId, pengajuanCutiId, keterangan } = req.body;

            const schema = {
                userId: { type: 'any', empty: false },
                pengajuanCutiId: { type: 'any', empty: false },
            };

            const validate = v.validate(req.body, schema);

            if (validate.length) {
                await trx.rollback();

                return res.status(400).json({
                    status: 'error',
                    msg: validate
                })
            }

            const checkNotApprovalCuti = await ApprovalCuti.findOne({
                where: {
                    [Op.and]: [
                        { pengajuan_cuti_id: pengajuanCutiId },
                        { user_id: userId },
                    ]
                },
                transaction: trx
            })

            if (!checkNotApprovalCuti) {
                await trx.rollback();

                return res.status(400).json({
                    status: 'error',
                    msg: 'Pengajuan cuti tidak tersedia atau anda tidak memiliki akses untuk approve pengajuan cuti ini!'
                })
            }

            if (checkNotApprovalCuti.status !== 'pending') {
                await trx.rollback();

                return res.status(400).json({
                    status: 'error',
                    msg: 'Proses approval hanya bisa dilakukan sekali!'
                })
            }

            await checkNotApprovalCuti.update({
                status: 'tidak-disetujui',
                tgl_not_approval: new Date,
                keterangan: keterangan
            }, { transaction: trx })


            // Check semuanya pengajuan cuti tersebut sudah di approve atau tidak.
            let notApprovedAll = true;

            const checkAllNotApprovedCuti = await ApprovalCuti.findAll({
                where: {
                    pengajuan_cuti_id: pengajuanCutiId
                },
                transaction: trx
            })

            checkAllNotApprovedCuti.map(item => {
                if (item.status !== 'tidak-disetujui' && item.status !== 'disetujui') {
                    notApprovedAll = false;
                }
            })

            if (notApprovedAll) {
                const getStatusCuti = await PengajuanCuti.findOne({
                    where: {
                        id: pengajuanCutiId
                    },
                    transaction: trx
                })

                //update status pengajuan cuti
                await getStatusCuti.update({
                    status: 'tidak-disetujui'
                })
            }

            await trx.commit();

            res.json({
                status: 'success',
                msg: 'Pengajuan cuti successfully not-approved'
            })
        } catch (error) {
            await trx.rollback();

            res.status(500).json({
                status: 'error',
                msg: error.message
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}