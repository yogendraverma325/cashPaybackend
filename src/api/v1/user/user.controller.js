import db from "../../../config/db.config.js";
import respHelper from '../../../helper/respHelper.js'

class UserController {

    async profileDetails(req, res) {
        try {
            const profileData = await db.employeeMaster.findOne({
                where: {
                    id: req.userId
                },
                attributes: { exclude: ['password', 'role_id', 'designation_id'] },
                include: [
                    {
                        model: db.functionalAreaMaster,
                        required: true,
                        attributes: ["functionalAreaId", "functionalAreaName", "functionalAreaCode"]
                    },
                    {
                        model: db.buMaster,
                        required: true,
                        attributes: ["buId", "buName", "buCode"]
                    },
                    {
                        model: db.departmentMaster,
                        required: true,
                        attributes: ["departmentId", "departmentCode", "departmentName"]
                    },
                    {
                        model: db.companyMaster,
                        required: true,
                        attributes: ["companyId", "companyName", "companyCode"],
                        include: [{
                            model: db.groupCompanyMaster,
                            required: true,
                            attributes: ['groupId', 'groupCode', 'groupName', 'groupShortName']
                        }]
                    },
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

            return respHelper(res, {
                status: 200,
                data: profileData
            })
        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async personalDetails(req, res) {
        try {
            const personalData = await db.employeeMaster.findOne({
                where: {
                    id: req.userId
                },
                attributes: { exclude: ['password', 'role_id', 'designation_id'] },
                include: [{
                    model: db.biographicalDetails,
                    required: true,
                    attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'isActive'] },
                },
                {
                    model: db.jobDetails,
                    required: true,
                    attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'isActive'] },
                },
                {
                    model: db.emergencyDetails,
                    required: true,
                    attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'isActive'] },
                },
                {
                    model: db.familyDetails,
                    required: true,
                    attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt'] },
                },
                {
                    model: db.educationDetails,
                    attributes: { exclude: ['createdAt', 'createdBy', 'updatedBy', 'updatedAt', 'isActive'] },
                    include: [{
                        model: db.degreeMaster
                    }]
                }]
            })

            return respHelper(res, {
                status: 200,
                data: personalData
            })

        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }
}

export default new UserController()