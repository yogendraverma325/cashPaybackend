import db from "../../../config/db.config.js";
import respHelper from '../../../helper/respHelper.js'

class PaymentController {
    async payElements(req, res) {
        try {
            const user = req.query.user

            const payElementsData = await db.payElements.findAll({
                where: {
                    EmployeeId: (user) ? user : req.userId
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

    async paySlips(req, res) {
        try {
            const user = req.query.user
            const financialYear = req.query.financialYear

            const paySlip = await db.paySlips.findAll({
                where:
                {
                    EmployeeId: (user) ? user : req.userId,
                    paySlipFinancialYear: financialYear
                },
                order: [['createdAt', 'desc']],
                attributes: { exclude: ['createdAt', 'createdBy'] },
                include: [{
                    model: db.employeeMaster,
                    attributes: ['name', 'empCode', 'email', 'designation_id', 'departmentId'],
                    include: [{
                        model: db.departmentMaster,
                        required: true,
                        attributes: ["departmentCode", "departmentName"]
                    },
                    {
                        model: db.designationMaster,
                        required: false,
                        attributes: ['name']
                    },
                    {
                        model: db.jobDetails,
                        attributes: ['dateOfJoining']
                    }
                    ]
                },
                {
                    model: db.paySlipComponent,
                    attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'isActive'] },
                }]
            })

            return respHelper(res, {
                status: 200,
                data: paySlip
            })

        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async payPackage(req, res) {
        try {

            const payPackage = await db.payPackage.findAll({
                order: [['createdAt', 'desc']],
                attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'isActive'] },
            })

            return respHelper(res, {
                status: 200,
                data: payPackage
            })

        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async ctcProration(req, res) {
        try {
            const payPackageAutoId = req.query.payPackageAutoId

            const payElements = await db.payElements.findAll({
                where: {
                    payPackageAutoId
                },
                include: [{
                    model: db.salaryComponent,
                    attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'isActive'] },
                }],
                attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'isActive'] },
            })

            return respHelper(res, {
                status: 200,
                data: payElements
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