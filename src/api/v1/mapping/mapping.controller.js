import db from "../../../config/db.config.js";
import respHelper from '../../../helper/respHelper.js'

class MappingController {

    async groupCompany(req, res) {
        try {

            const groupCompanyData = await db.groupCompanyMaster.findAll({
                where: {
                    isActive: 1
                },
                attributes: ["groupId", "groupCode", "groupName"]
            })

            return respHelper(res, {
                status: 200,
                data: groupCompanyData
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
            const groupId = req.query.groupId

            const companyData = await db.companyMaster.findAll({
                where: Object.assign(
                    (groupId) ? { groupId } : {},
                    { isActive: 1 }
                ),
                attributes: ["companyId", "companyName", "companyCode"]
            })

            for (const iterator of companyData) {
                const existBu = await db.buMapping.findAll({
                    where: {
                        companyId: iterator.dataValues.companyId
                    }
                })
                iterator.dataValues['existBu'] = existBu.length != 0 ? true : false
            }

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

    async bu(req, res) {
        try {
            const companyId = req.query.companyId

            if (!companyId) {
                return respHelper(res, {
                    status: 404,
                    msg: "Company ID required"
                })
            }

            const buData = await db.buMapping.findAll({
                where: {
                    companyId,
                },
                include: [{
                    model: db.buMaster,
                    where: {
                        isActive: 1
                    },
                    attributes: ['buName', 'buCode']
                }]
            })

            for (const iterator of buData) {
                const existSbu = await db.sbuMapping.findAll({
                    where: {
                        buMappingId: iterator.dataValues.buMappingId
                    }
                })
                iterator.dataValues['existSbu'] = existSbu.length != 0 ? true : false
            }

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

    async sbu(req, res) {
        try {
            const buMappingId = req.query.buMappingId

            if (!buMappingId) {
                return respHelper(res, {
                    status: 404,
                    msg: "Bu ID required"
                })
            }

            const buData = await db.sbuMapping.findAll({
                where: {
                    buMappingId
                },
                include: [{
                    model: db.sbuMaster,
                    where: {
                        isActive: 1
                    },
                    attributes: ['sbuName']
                }]
            })

            for (const iterator of buData) {
                const existDepartment = await db.departmentMapping.findAll({
                    where: {
                        sbuMappingId: iterator.dataValues.sbuMappingId
                    }
                })
                iterator.dataValues['existDepartment'] = existDepartment.length != 0 ? true : false
            }

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

    async department(req, res) {
        try {
            const sbuMappingId = req.query.sbuMappingId

            const departmentData = await db.departmentMapping.findAll({
                where: {
                    sbuMappingId
                },
                include: [{
                    model: db.departmentMaster,
                    where: {
                        isActive: 1
                    },
                    attributes: ['departmentCode', 'departmentName']
                }]
            })

            for (const iterator of departmentData) {
                const existFunctionalArea = await db.functionalAreaMapping.findAll({
                    where: {
                        departmentMappingId: iterator.dataValues.departmentMappingId
                    }
                })
                iterator.dataValues['existFunctionalArea'] = existFunctionalArea.length != 0 ? true : false
            }

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

    async functionalArea(req, res) {
        try {
            const departmentMappingId = req.query.departmentMappingId

            const functionalAreaData = await db.functionalAreaMapping.findAll({
                where: {
                    departmentMappingId
                },
                include: [{
                    model: db.functionalAreaMaster,
                    where: {
                        isActive: 1
                    },
                    attributes: ['functionalAreaName', 'functionalAreaCode']
                }]
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
}

export default new MappingController()