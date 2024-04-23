import db from "../../../config/db.config.js";
import respHelper from '../../../helper/respHelper.js'

class PaymentController {
    async payElements(req, res) {
        try {

            const payElementsData = await db.payElements.findAll({
                where: {
                    EmployeeId: req.userId,
                },
                attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'isActive'] },
                include: [{
                    model: db.salaryComponent,
                    attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'isActive'] },
                }]
            })

            return respHelper(res, {
                status: 200,
                data: payElementsData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }
}

export default new PaymentController();