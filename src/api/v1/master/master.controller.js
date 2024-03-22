import { Op } from "sequelize";
import db from "../../../config/db.config.js";
import respHelper from '../../../helper/respHelper.js'

class MasterController {

    async employee(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;
            const search = req.query.search

            const employeeData = await db.employeeMaster.findAll({
                limit,
                offset,
                where: Object.assign(
                    (search) ? {
                        [Op.or]: [{
                            name: {
                                [Op.like]: `%${search}%`
                            }
                        }, {
                            email: {
                                [Op.like]: `%${search}%`
                            }
                        }]
                    } : {}
                )
            })

            return respHelper(res, {
                status: 200,
                data: employeeData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

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

    async functionalArea(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const functionalAreaData = await db.functionalAreaMaster.findAll({
                limit,
                offset
            })

            return respHelper(res, {
                status: 200,
                data: functionalAreaData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async state(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const stateCode = req.query.stateCode
            const stateName = req.query.stateName
            const countryId = req.query.countryId
            const regionId = req.query.regionId

            const stateData = await db.stateMaster.findAll({
                limit,
                offset,
                where: Object.assign(
                    (stateCode) ? {
                        stateCode
                    } : {},
                    (stateName) ? {
                        stateName
                    } : {},
                    (countryId) ? {
                        countryId
                    } : {},
                    (regionId) ? {
                        regionId
                    } : {}
                )
            })

            return respHelper(res, {
                status: 200,
                data: stateData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async region(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;
            const countryId = req.query.country

            const regionData = await db.regionMaster.findAll({
                limit,
                offset,
                where: Object.assign(
                    (countryId) ? {
                        countryId
                    } : {}
                )
            })

            return respHelper(res, {
                status: 200,
                data: regionData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async city(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;
            const stateId = req.query.stateId

            const cityData = await db.cityMaster.findAll({
                limit,
                offset,
                where: Object.assign(
                    (stateId) ? {
                        stateId
                    } : {}
                )
            })

            return respHelper(res, {
                status: 200,
                data: cityData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async companyLocation(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const companyLocationData = await db.companyLocationMaster.findAll({
                limit,
                offset,
            })

            return respHelper(res, {
                status: 200,
                data: companyLocationData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async company(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const companyData = await db.companyMaster.findAll({
                limit,
                offset,
            })

            return respHelper(res, {
                status: 200,
                data: companyData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async companyType(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const companyTypeData = await db.companyTypeMaster.findAll({
                limit,
                offset,
            })

            return respHelper(res, {
                status: 200,
                data: companyTypeData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async country(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const countryData = await db.countryMaster.findAll({
                limit,
                offset,
            })

            return respHelper(res, {
                status: 200,
                data: countryData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async currency(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const currencyData = await db.currencyMaster.findAll({
                limit,
                offset,
            })

            return respHelper(res, {
                status: 200,
                data: currencyData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async department(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const departmentData = await db.departmentMaster.findAll({
                limit,
                offset,
            })

            return respHelper(res, {
                status: 200,
                data: departmentData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async district(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const districtData = await db.districtMaster.findAll({
                limit,
                offset,
            })

            return respHelper(res, {
                status: 200,
                data: districtData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async employeeType(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const employeeTypeData = await db.employeeTypeMaster.findAll({
                limit,
                offset,
            })

            return respHelper(res, {
                status: 200,
                data: employeeTypeData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async industry(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const industryData = await db.industryMaster.findAll({
                limit,
                offset,
            })

            return respHelper(res, {
                status: 200,
                data: industryData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async pincode(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const pinCodeData = await db.pinCodeMaster.findAll({
                limit,
                offset,
            })

            return respHelper(res, {
                status: 200,
                data: pinCodeData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async timeZone(req, res) {
        try {

            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;

            const timeZoneData = await db.timeZoneMaster.findAll({
                limit,
                offset,
            })

            return respHelper(res, {
                status: 200,
                data: timeZoneData
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