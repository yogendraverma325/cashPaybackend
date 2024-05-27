import respHelper from "../../../helper/respHelper.js";
import db from "../../../config/db.config.js";
import moment from "moment";
import message from "../../../constant/messages.js";
import validator from "../../../helper/validator.js";
import helper from "../../../helper/helper.js";
import eventEmitter from "../../../services/eventService.js";
import { Op } from "sequelize";

class AttendanceController {
    async attendance(req, res) {
        try {
            const result = await validator.attendanceSchema.validateAsync(req.body);
            const currentDate = moment();

            const existEmployee = await db.employeeMaster.findOne({
                where: {
                    id: req.userId,
                },
                attributes: ["empCode", "name", "email", "shiftId"],
                include: [
                    {
                        model: db.shiftMaster,
                        attributes: [
                            "shiftName",
                            "shiftStartTime",
                            "shiftEndTime",
                            "shiftFlexiStartTime",
                            "shiftFlexiEndTime",
                        ],
                    },
                ],
            });

            if (!existEmployee) {
                return respHelper(res, {
                    status: 404,
                    msg: message.USER_NOT_EXIST,
                });
            }

            const checkAttendance = await db.attendanceMaster.findOne({
                raw: true,
                where: {
                    employeeId: req.userId,
                    attendanceDate: currentDate.format("YYYY-MM-DD"),
                },
            });

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
                    attendanceLateBy: await helper.calculateLateBy(currentDate.format("HH:mm:ss"), existEmployee.shiftsmaster.dataValues.shiftFlexiStartTime),
                    attendancePresentStatus: "Present",
                    attendancePunchInRemark: result.remark,
                    attendancePunchInLocationType: result.locationType,
                    attendancePunchInLocation: result.location,
                    attendancePunchInLatitude: result.latitude,
                    attendancePunchInLongitude: result.longitude,
                    createdBy: req.userId,
                    createdAt: currentDate,
                });

                return respHelper(res, {
                    status: 200,
                    msg: message.PUNCH_IN_SUCCESS,
                });
            } else {
                await db.attendanceMaster.update(
                    {
                        attendancePunchOutTime: currentDate.format("HH:mm:ss"),
                        attendanceShiftEndDate: currentDate.format("YYYY-MM-DD"),
                        attendancePunchOutLocationType: result.locationType,
                        attendanceStatus: "Punch Out",
                        attendancePunchOutRemark: result.remark,
                        attendanceLocationType: result.locationType,
                        attendanceWorkingTime: await helper.timeDifference(
                            checkAttendance.attendancePunchInTime,
                            currentDate.format("HH:mm")
                        ),
                        attendancePunchOutLocation: result.location,
                        attendancePunchOutLatitude: result.latitude,
                        attendancePunchOutLongitude: result.longitude,
                    },
                    {
                        where: {
                            attendanceDate: currentDate.format("YYYY-MM-DD"),
                            employeeId: req.userId,
                        },
                    }
                );

                return respHelper(res, {
                    status: 200,
                    msg: message.PUNCH_OUT_SUCCESS,
                });
            }
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                });
            }
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async regularizeRequest(req, res) {
        try {
            const result = await validator.regularizeRequest.validateAsync(req.body);

            if (moment().isBefore(result.fromDate)) {
                return respHelper(res, {
                    status: 400,
                    msg: message.ATTENDANCE_DATE_CANNOT_AFTER_TODAY,
                });
            }

            let attendanceData = await db.attendanceMaster.findOne({
                where: {
                    attendanceAutoId: result.attendanceAutoId,
                },
                attributes: ["attendanceRegularizeCount"],
                include: [
                    {
                        model: db.regularizationMaster,
                        as: "latest_Regularization_Request",
                        limit: 1,
                        order: [["createdAt", "desc"]],
                        attributes: ["regularizeStatus"],
                    },
                    {
                        model: db.employeeMaster,
                        attributes: ["name", "email"],
                        include: [
                            {
                                model: db.employeeMaster,
                                required: false,
                                as: "managerData",
                                attributes: ["name", "email"],
                            },
                        ],
                    },
                ],
            });

            if (!attendanceData) {
                return respHelper(res, {
                    status: 404,
                    msg: message.ATTENDANCE_NOT_AVAILABLE,
                });
            }

            if (attendanceData.dataValues.latest_Regularization_Request[0].regularizeStatus === "Pending") {
                return respHelper(res, {
                    status: 400,
                    msg: message.ALREADY_REQUESTED.replace('<module>', 'Regularization'),
                });
            }

            if (
                attendanceData &&
                attendanceData.dataValues.attendanceRegularizeCount >= 3
            ) {
                return respHelper(res, {
                    status: 400,
                    msg: message.MAXIMUM_REGULARIZATION_LIMIT,
                });
            }

            await db.regularizationMaster.create({
                attendanceAutoId: result.attendanceAutoId,
                regularizePunchInDate: result.fromDate,
                regularizePunchOutDate: result.toDate,
                regularizeUserRemark: result.remark,
                regularizePunchInTime: result.punchInTime,
                regularizePunchOutTime: result.punchOutTime,
                regularizeReason: result.reason,
                regularizeStatus: "Pending",
                createdBy: req.userId,
                createdAt: moment(),
            });

            eventEmitter.emit(
                "regularizeRequestMail",
                JSON.stringify({
                    requesterName: attendanceData.dataValues.employee.name,
                    attendenceDate: result.fromDate,
                    managerName: attendanceData.dataValues.employee.managerData.name,
                    // managerEmail: attendanceData.dataValues.employee.managerData.email
                    managerEmail: attendanceData.dataValues.employee.email,
                })
            );

            await db.attendanceMaster.update(
                {
                    attendanceRegularizeCount: !attendanceData
                        ? 1
                        : attendanceData.dataValues.attendanceRegularizeCount + 1,
                    attendanceRegularizeStatus: "Pending",
                },
                {
                    where: {
                        attendanceAutoId: result.attendanceAutoId,
                    },
                }
            );

            return respHelper(res, {
                status: 200,
                msg: message.REGULARIZE_REQUEST_SUCCESSFULL,
            });
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                });
            }
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async attendanceList(req, res) {
        try {
            const user = req.query.user;
            const year = req.query.year;
            const month = req.query.month;

            let averageWorkingTime = []
            let calculateLateTime = []

            if (!year || !month) {
                return respHelper(res, {
                    status: 400,
                    msg: "Please Fill Month and Year",
                });
            }

            const attendanceData = await db.attendanceMaster.findAndCountAll({
                where: {
                    employeeId: user ? user : req.userId,
                    attendanceDate: {
                        [Op.and]: [
                            { [Op.gte]: `${year}-${month}-01` },
                            { [Op.lte]: `${year}-${month}-${moment(`${year}-${month}`, "YYYY-MM").daysInMonth()}` },
                        ],
                    },
                },
                attributes: {
                    exclude: ["createdBy", "createdAt", "updatedBy", "updatedAt"],
                },
            });

            for (const iterator of attendanceData.rows) {
                if (iterator.dataValues.attendanceWorkingTime) {
                    averageWorkingTime.push(iterator.dataValues.attendanceWorkingTime)
                }
                if (iterator.dataValues.attendanceLateBy && iterator.dataValues.attendanceLateBy != '00:00:00') {
                    calculateLateTime.push(iterator.dataValues.attendanceLateBy)
                }
            }

            return respHelper(res, {
                status: 200,
                data: {
                    statics: {
                        lateTime: helper.calculateTime(calculateLateTime),
                        averageWorkingTime: helper.calculateAverageHours(averageWorkingTime),
                    },
                    attendanceData
                }
            });
        } catch (error) {
            console.log(error);
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async approveRegularizationRequest(req, res) {
        try {
            const result =
                await validator.approveRegularizationRequestSchema.validateAsync(
                    req.body
                );

            const regularizeData = await db.regularizationMaster.findOne({
                raw: true,
                where: {
                    regularizeId: result.regularizeId,
                },
            });

            await db.regularizationMaster.update(
                {
                    regularizeManagerRemark: result.remark,
                    regularizeStatus: result.status ? "Approved" : "Rejected",
                },
                {
                    where: {
                        regularizeId: result.regularizeId,
                    },
                }
            );

            if (result.status) {
                await db.attendanceMaster.update(
                    {
                        attendanceDate: regularizeData.regularizePunchInDate,
                        attendanceWorkingTime: await helper.timeDifference(
                            regularizeData.regularizePunchInTime,
                            regularizeData.regularizePunchOutTime
                        ),
                        attandanceShiftStartDate: regularizeData.regularizePunchInDate,
                        attendanceShiftEndDate: regularizeData.regularizePunchOutDate,
                        attendancePunchInTime: regularizeData.regularizePunchInTime,
                        attendancePunchOutTime: regularizeData.regularizePunchOutTime,
                        attendanceRegularizeUserRemark: regularizeData.regularizeUserRemark,
                        attendanceRegularizeManagerRemark:
                            regularizeData.regularizeManagerRemark,
                        attendanceRegularizeReason: regularizeData.regularizeReason,
                        attendanceRegularizeStatus: "Approved",
                    },
                    {
                        where: {
                            attendanceAutoId: regularizeData.attendanceAutoId,
                        },
                    }
                );
            } else {
                await db.attendanceMaster.update(
                    {
                        attendanceRegularizeStatus: "Rejected",
                    },
                    {
                        where: {
                            attendanceAutoId: regularizeData.attendanceAutoId,
                        },
                    }
                );
            }

            return respHelper(res, {
                status: 200,
                msg: message.REGULARIZATION_ACTION.replace(
                    "<status>",
                    result.status ? "Approved." : "Rejected."
                ),
            });
        } catch (error) {
            console.log(error);
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                });
            }
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async regularizeRequestList(req, res) {
        try {

            const query = req.query.listFor

            const regularizeList = await db.regularizationMaster.findAll({
                where: Object.assign(
                    (query === 'raisedByMe') ? {
                        createdBy: req.userId
                    } : {
                        regularizeManagerId: req.userId
                    },

                    {
                        regularizeStatus: 'Pending'
                    },
                ),
                attributes: { exclude: ["createdBy", "createdAt", "updatedBy", "updatedAt"], },
                include: [{
                    model: db.attendanceMaster,
                    attributes: { exclude: ["createdBy", "createdAt", "updatedBy", "updatedAt"], },
                    include: [
                        {
                            model: db.employeeMaster,
                            attributes: ['name']
                        }]
                }]

            })

            return respHelper(res, {
                status: 200,
                data: regularizeList
            });

        } catch (error) {
            return respHelper(res, {
                status: 500,
            });
        }
    }
}

export default new AttendanceController();
