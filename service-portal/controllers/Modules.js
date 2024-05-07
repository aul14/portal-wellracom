import Module from '../models/ModuleModel.js';
import Validator from 'fastest-validator';
import { checkUniqueness } from '../helpers/checkUnique.js';
import { Op } from 'sequelize'
const v = new Validator();

export const getModulesQuery = async (req, res) => {
    const { draw, start, length, search, order } = req.query;

    try {
        const searchData = search ? {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
            ]
        } : {};

        const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

        const moduleData = await Module.findAndCountAll({
            where: searchData,
            order: [['id', sortOrder]],
            limit: parseInt(length),
            offset: parseInt(start),
        });

        const responseData = {
            draw: parseInt(draw),
            recordsTotal: moduleData.count,
            recordsFiltered: moduleData.rows.length,
            data: moduleData.rows
        };

        res.json(responseData);

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}

export const getModules = async (req, res) => {
    try {
        const response = await Module.findAll();

        res.status(200).json({
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
export const getModuleById = async (req, res) => {
    try {
        const module = await Module.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!module) {
            return res.status(404).json({
                status: 'error',
                msg: 'Module not found'
            })
        }

        res.status(200).json({
            status: 'success',
            data: module
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const createModule = async (req, res) => {
    try {
        const schema = {
            name: 'string|empty:false',
        }

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                msg: validate
            })
        }

        const { name } = req.body;

        if (await checkUniqueness(Module, 'name', name)) {
            return res.status(400).json({
                status: 'error',
                msg: 'Module name is already exist'
            });
        }

        const module = await Module.create({
            name: name
        });

        res.status(201).json({
            status: 'success',
            msg: 'Module created',
            data: module
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const updateModule = async (req, res) => {
    try {
        const schema = {
            name: 'string|optional',
        }

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({
                status: 'error',
                msg: validate
            })
        }

        const module = await Module.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!module) {
            return res.status(404).json({
                status: 'error',
                msg: 'Module not found'
            })
        }

        const { name } = req.body;

        if (name) {
            if (await checkUniqueness(Module, 'name', name) && name !== module.name) {
                return res.status(400).json({
                    status: 'error',
                    msg: 'Module name is already exist'
                });
            }
        }

        const response_module = await module.update({
            name: name
        });

        res.status(200).json({
            status: 'success',
            msg: 'Module updated',
            data: response_module
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}
export const deleteModule = async (req, res) => {
    try {
        const module = await Module.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!module) {
            return res.status(404).json({
                status: 'error',
                msg: 'Module not found'
            })
        }

        await module.destroy();

        res.status(200).json({
            status: 'success',
            msg: 'Module deleted',
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}