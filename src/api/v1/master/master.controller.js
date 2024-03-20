import db from "../../../config/db.config.js";
import respHelper from '../../../helper/respHelper.js'

class MasterController {

    async reporties(req, res) {
        try {

            const manager = req.query.manager

            const reportie = await db.employeeMaster.findOne({
                where: Object.assign(
                    (manager) ? {
                        id: manager
                    } : {
                        manager: null
                    }
                ),
                attributes: { exclude: ['password', 'role_id', 'designation_id'] },
                include: [
                    {
                        model: db.employeeMaster,
                        required: false,
                        attributes: ['name'],
                        as: 'managerData',
                        include: [
                            {
                                model: db.roleMaster,
                                required: false,
                            },
                            {
                                model: db.designationMaster,
                                required: false,
                                attributes: ['designationId', 'name']
                            },]
                    },
                    {
                        model: db.roleMaster,
                        required: true,
                        attributes: ['name']
                    },
                    {
                        model: db.designationMaster,
                        required: true,
                        attributes: ['designationId', 'name']
                    },
                    {
                        model: db.employeeMaster,
                        as: 'reportie',
                        required: false,
                        attributes: { exclude: ['password', 'role_id', 'designation_id'] },
                        include: [{
                            model: db.roleMaster,
                            required: true,
                        },
                        {
                            model: db.designationMaster,
                            required: true,
                            attributes: ['designationId', 'name']
                        }]

                    }]
            })

            for (const iterator of reportie.dataValues.reportie) {
                const reportie = await db.employeeMaster.findOne({
                    where: {
                        manager: iterator.dataValues.id
                    },
                })
                iterator.dataValues['reportings'] = (reportie) ? true : false
            }

            return respHelper(res, {
                status: 200,
                data: reportie
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async band(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const bandData = await db.bandMaster.findAll({
                limit,
                offset
            })

            return respHelper(res, {
                status: 200,
                data: bandData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async bu(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const buData = await db.buMaster.findAll({
                limit,
                offset
            })

            return respHelper(res, {
                status: 200,
                data: buData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async costCenter(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const costCenterData = await db.costCenterMaster.findAll({
                limit,
                offset
            })

            return respHelper(res, {
                status: 200,
                data: costCenterData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async designation(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const designationData = await db.designationMaster.findAll({
                limit,
                offset
            })

            return respHelper(res, {
                status: 200,
                data: designationData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async grade(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const gradeData = await db.gradeMaster.findAll({
                limit,
                offset
            })

            return respHelper(res, {
                status: 200,
                data: gradeData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async jobLevel(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const jobLevelData = await db.jobLevelMaster.findAll({
                limit,
                offset
            })

            return respHelper(res, {
                status: 200,
                data: jobLevelData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }
}

export default new MasterController()