import respHelper from '../../../helper/respHelper.js'
import db from '../../../config/db.config.js'
import moment from 'moment'
import message from '../../../constant/messages.js'
import validator from '../../../helper/validator.js'
import helper from '../../../helper/helper.js'
import eventEmitter from "../../../services/eventService.js";
import { Op, literal } from 'sequelize'

class AttendanceController {

    async attendance(req, res) {
        try {

            const result = await validator.attendanceSchema.validateAsync(req.body)
            const currentDate = moment()

            const existEmployee = await db.employeeMaster.findOne({
                where: {
                    id: req.userId,
                },
                attributes: ['empCode', 'name', 'email', 'shiftId'],
                include: [{
                    model: db.shiftMaster,
                    attributes: ['shiftName', 'shiftStartTime', 'shiftEndTime', 'shiftFlexiStartTime', 'shiftFlexiEndTime']
                }]
            })

            if (!existEmployee) {
                return respHelper(res, {
                    status: 404,
                    msg: message.USER_NOT_EXIST
                })
            }

            const checkAttendance = await db.attendanceMaster.findOne({
                raw: true,
                where: {
                    employeeId: req.userId,
                    attendanceDate: currentDate.format("YYYY-MM-DD")
                }
            })

            if (!checkAttendance) {
                // const punchInStartTime = moment(existEmployee.shiftsmaster.dataValues.shiftStartTime, 'HH:mm')
                // const punchInFlexiTime = moment(existEmployee.shiftsmaster.dataValues.shiftFlexiStartTime, 'HH:mm')

                // const checkTime = currentDate.isBetween(punchInStartTime, punchInFlexiTime)

                await db.attendanceMaster.create({
                    attendanceDate: currentDate.format("YYYY-MM-DD"),
                    employeeId: req.userId,
                    attandanceShiftStartDate: currentDate.format("YYYY-MM-DD"),
                    attendanceShiftId: existEmployee.dataValues.shiftId,
                    attendancePunchInTime: currentDate.format("HH:mm:ss"),
                    attendanceStatus: "Punch In",
                    attendancePresentStatus: "Present",
                    attendancePunchInRemark: result.remark,
                    attendancePunchInLocationType: result.locationType,
                    attendancePunchInLocation: result.location,
                    attendancePunchInLatitude: result.latitude,
                    attendancePunchInLongitude: result.longitude,
                    createdBy: req.userId,
                    createdAt: currentDate
                })

                return respHelper(res, {
                    status: 200,
                    msg: message.PUNCH_IN_SUCCESS
                })
            } else {

                await db.attendanceMaster.update({
                    attendancePunchOutTime: currentDate.format("HH:mm:ss"),
                    attendanceShiftEndDate: currentDate.format("YYYY-MM-DD"),
                    attendancePunchOutLocationType: result.locationType,
                    attendanceStatus: "Punch Out",
                    attendancePunchOutRemark: result.remark,
                    attendanceLocationType: result.locationType,
                    attendanceWorkingTime: await helper.timeDifference(checkAttendance.attendancePunchInTime, currentDate.format("HH:mm")),
                    attendancePunchOutLocation: result.location,
                    attendancePunchOutLatitude: result.latitude,
                    attendancePunchOutLongitude: result.longitude,
                }, {
                    where: {
                        attendanceDate: currentDate.format("YYYY-MM-DD"),
                        employeeId: req.userId,
                    }
                })

                return respHelper(res, {
                    status: 200,
                    msg: message.PUNCH_OUT_SUCCESS
                })
            }

        } catch (error) {
            console.log(error)
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message
                })
            }
            return respHelper(res, {
                status: 500
            })
        }
    }

    async updateAttendance() {
        const existEmployees = await db.employeeMaster.findAll({
            attributes: ['id', 'empCode', 'name', 'email', 'shiftId'],
            include: [{
                model: db.shiftMaster,
                attributes: ['shiftName', 'shiftStartTime', 'shiftEndTime', 'shiftFlexiStartTime', 'shiftFlexiEndTime']
            }]
        })

        for (const iterator of existEmployees) {

            const existAttendance = await db.attendanceMaster.findOne({
                where: {
                    attendanceDate: moment().subtract(1, 'day').format("YYYY-MM-DD"),
                    employeeId: iterator.dataValues.id,
                }
            })

            if (!existAttendance) {

                await db.attendanceMaster.create({
                    attendanceDate: moment().subtract(1, 'day').format("YYYY-MM-DD"),
                    employeeId: iterator.dataValues.id,
                    attendanceShiftId: iterator.dataValues.shiftId,
                    attendancePresentStatus: "Absent",
                })

            } else {

                await db.attendanceMaster.update({
                    attendancePresentStatus: (existAttendance.dataValues.attendanceStatus === 'Punch In') ? "Single Punch Absent" : "Absent",
                }, {
                    where: {
                        attendanceDate: moment().subtract(1, 'day').format("YYYY-MM-DD"),
                        employeeId: iterator.dataValues.id,
                    }
                })

            }
        }
    }

    async regularizeRequest(req, res) {
        try {
            const result = await validator.regularizeRequest.validateAsync(req.body)

            if (moment().isBefore(result.fromDate)) {
                return respHelper(res, {
                    status: 400,
                    msg: message.ATTENDANCE_DATE_CANNOT_AFTER_TODAY
                })
            }

            const attendanceData = await db.regularizationMaster.findOne({
                where: {
                    attendanceAutoId: result.attendanceAutoId,
                },
                attributes: ['regularizeStatus'],
                limit: 1,
                order: [["createdAt", "DESC"]],
                include: [{
                    model: db.attendanceMaster,
                    attributes: ['attendanceRegularizeCount'],
                    include: {
                        model: db.employeeMaster,
                        attributes: ['name', 'email'],
                        include: [{
                            model: db.employeeMaster,
                            required: false,
                            as: 'managerData',
                            attributes: ['name', 'email'],
                        }]
                    }
                }]
            })

            // if (!attendanceData) {
            //     return respHelper(res, {
            //         status: 404,
            //         msg: message.ATTENDANCE_NOT_AVAILABLE
            //     })
            // }

            if (attendanceData && attendanceData.dataValues.attendancemaster.attendanceRegularizeCount >= 3) {
                return respHelper(res, {
                    status: 400,
                    msg: message.MAXIMUM_REGULARIZATION_LIMIT
                })
            }

            if (attendanceData && attendanceData.dataValues.attendancemaster.attendanceRegularizeCount >= 3) {
                return respHelper(res, {
                    status: 400,
                    msg: message.MAXIMUM_REGULARIZATION_LIMIT
                })
            }

            await db.regularizationMaster.create({
                attendanceAutoId: result.attendanceAutoId,
                regularizePunchInDate: result.fromDate,
                regularizePunchOutDate: result.toDate,
                regularizeUserRemark: result.remark,
                regularizePunchInTime: result.punchInTime,
                regularizePunchOutTime: result.punchOutTime,
                regularizeReason: result.reason,
                regularizeStatus: 'Pending',
                createdBy: req.userId,
                createdAt: moment()
            })

            // eventEmitter.emit('regularizeRequestMail', JSON.stringify({
            //     requesterName: attendanceData.dataValues.attendancemaster.employee.name,
            //     attendenceDate: result.fromDate,
            //     managerName: attendanceData.dataValues.attendancemaster.employee.managerData.name,
            //     managerEmail: 'manishmaurya@teamcomputers.com'
            //     // managerEmail: attendanceData.dataValues.attendancemaster.employee.managerData.email
            // }));

            await db.attendanceMaster.update({ attendanceRegularizeCount: (!attendanceData) ? 1 : attendanceData.dataValues.attendancemaster.attendanceRegularizeCount + 1 }, {
                where: {
                    attendanceAutoId: result.attendanceAutoId
                }
            })

            return respHelper(res, {
                status: 200,
                msg: message.REGULARIZE_REQUEST_SUCCESSFULL,
            })

        } catch (error) {
            console.log(error)
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message
                })
            }
            return respHelper(res, {
                status: 500
            })
        }
    }

    async attendanceList(req, res) {
        try {
            const user = req.query.user

            const attendanceData = await db.attendanceMaster.findAndCountAll({
                where: {
                    employeeId: (user) ? user : req.userId
                },
                attributes: { exclude: ['createdBy', 'createdAt', 'updatedBy', 'updatedAt'] },
            })

            return respHelper(res, {
                status: 200,
                data: attendanceData
            })
        } catch (error) {
            return respHelper(res, {
                status: 500
            })
        }
    }
}

export default new AttendanceController()