import respHelper from '../../../helper/respHelper.js'
import db from '../../../config/db.config.js'
import moment from 'moment'
import message from '../../../constant/messages.js'
import validator from '../../../helper/validator.js'
import helper from '../../../helper/helper.js'

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
                    attandanceDate: currentDate.format("YYYY-MM-DD")
                }
            })

            if (!checkAttendance) {
                // const punchInStartTime = moment(existEmployee.shiftsmaster.dataValues.shiftStartTime, 'HH:mm')
                // const punchInFlexiTime = moment(existEmployee.shiftsmaster.dataValues.shiftFlexiStartTime, 'HH:mm')

                // const checkTime = currentDate.isBetween(punchInStartTime, punchInFlexiTime)

                await db.attendanceMaster.create({
                    attandanceDate: currentDate.format("YYYY-MM-DD"),
                    employeeId: req.userId,
                    attendanceShiftId: existEmployee.dataValues.shiftId,
                    attendancePunchInTime: currentDate.format("HH:mm:ss"),
                    attendanceStatus: "Punch In",
                    attendancePresentStatus: "Present",
                    attendancePunchInRemark: result.remark,
                    attendanceLocationType: result.locationType,
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
                    attendanceStatus: "Punch Out",
                    attendancePunchOutRemark: result.remark,
                    attendanceLocationType: result.locationType,
                    attendanceWorkingTime: await helper.timeDifference(checkAttendance.attendancePunchInTime, currentDate.format("HH:mm")),
                    attendancePunchOutLocation: result.location,
                    attendancePunchOutLatitude: result.latitude,
                    attendancePunchOutLongitude: result.longitude,
                }, {
                    where: {
                        attandanceDate: currentDate.format("YYYY-MM-DD"),
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

    async updateAttendance(req, res) {
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
                    attandanceDate: moment().subtract(1, 'day').format("YYYY-MM-DD"),
                    employeeId: iterator.dataValues.id,
                }
            })

            if (!existAttendance) {

                await db.attendanceMaster.create({
                    attandanceDate: moment().subtract(1, 'day').format("YYYY-MM-DD"),
                    employeeId: iterator.dataValues.id,
                    attendanceShiftId: iterator.dataValues.shiftId,
                    attendancePresentStatus: "Absent",
                })

            } else {

                await db.attendanceMaster.update({
                    attendancePresentStatus: (existAttendance.dataValues.attendanceStatus === 'Punch In') ? "Single Punch Absent" : "Absent",
                }, {
                    where: {
                        attandanceDate: moment().subtract(1, 'day').format("YYYY-MM-DD"),
                        employeeId: iterator.dataValues.id,
                    }
                })

            }
        }
    }
}

export default new AttendanceController()