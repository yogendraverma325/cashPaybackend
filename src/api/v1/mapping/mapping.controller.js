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
            const companyId = req.query.companyId
            const buId = req.query.buId

            if (!companyId) {
                return respHelper(res, {
                    status: 404,
                    msg: "Company ID required"
                })
            }

            if (!buId) {
                return respHelper(res, {
                    status: 404,
                    msg: "Bu ID required"
                })
            }

            const buData = await db.sbuMapping.findAll({
                where: {
                    companyId,
                    buId
                },
                include: [{
                    model: db.buMaster,
                    where: {
                        isActive: 1
                    },
                    attributes: ['buName', 'buCode']
                }]
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

}

export default new MappingController()