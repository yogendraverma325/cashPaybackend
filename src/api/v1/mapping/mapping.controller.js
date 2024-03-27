import db from "../../../config/db.config.js";
import respHelper from '../../../helper/respHelper.js'

class MappingController {

    async buMapping(req, res) {
        try {
            const companyId = req.query.companyId

            if (!companyId) {
                return respHelper(res, {
                    status: 404,
                    msg: "Company ID Not Found"
                })
            }

            const buMappingData = await db.buMapping.findAll({
                where: {
                    companyId
                },
                include: [{
                    model: db.buMaster,
                    required: true,
                    attributes: ["buId", "buName", "buCode"],
                    order: [["buName", "ASC"]]
                }],
            })


            return respHelper(res, {
                status: 200,
                data: buMappingData
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