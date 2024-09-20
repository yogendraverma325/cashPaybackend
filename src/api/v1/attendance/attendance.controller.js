import respHelper from "../../../helper/respHelper.js";
import db from "../../../config/db.config.js";
import moment from "moment";
import message from "../../../constant/messages.js";
import validator from "../../../helper/validator.js";
import helper from "../../../helper/helper.js";
import eventEmitter from "../../../services/eventService.js";
import { Op } from "sequelize";
import fs from "fs";
import { cwd } from "process";
import client from "../../../config/redisDb.config.js";
var _this = null;
class AttendanceController {
  constructor() {
    _this = this;
  }

  async attendance(req, res) {
    try {
      const result = await validator.attendanceSchema.validateAsync(req.body);
      if (result.locationType == "Office") {
        const distanceQuery = `
    SELECT companyLocationId, (
      6371 * acos(
        cos(radians(:userLat)) *
        cos(radians(latitude)) *
        cos(radians(longitude) - radians(:userLon)) +
        sin(radians(:userLat)) *
        sin(radians(latitude))
      )
    ) AS distance
    FROM companylocationmaster
    HAVING distance <= ${
      process.env.RADIUS_LIMIT / 1000
    }; -- 0.5 km = 500 meters
  `;
        let userLat = result.latitude;
        let userLon = result.longitude;
        const withInLocatoinRange = await db.sequelize.query(distanceQuery, {
          replacements: { userLat, userLon },
          type: db.QueryTypes.SELECT,
        });
        if (withInLocatoinRange[0].length == 0) {
          return respHelper(res, {
            status: 404,
            msg: message.RADIUS_MESSAGE.replace("#", process.env.RADIUS_LIMIT),
          });
        }
      }

      const currentDate = moment();

      const existEmployee = await db.employeeMaster.findOne({
        where: {
          id: req.userId,
          isActive: 1,
        },
        attributes: ["empCode", "name", "email", "weekOffId"],
        include: [
          {
            model: db.shiftMaster,
            required: false,
            attributes: [
              "shiftId",
              "shiftName",
              "shiftStartTime",
              "shiftEndTime",
              "isOverNight",
            ],
            where: {
              isActive: true,
            },
          },
          {
            model: db.attendancePolicymaster,
            required: false,
            where: {
              isActive: true,
            },
          },
        ],
      });

      if (!existEmployee) {
        return respHelper(res, {
          status: 200,
          data: existEmployee,
          msg: message.USER_NOT_EXIST,
        });
      }
      if (!existEmployee.shiftsmaster) {
        return respHelper(res, {
          status: 404,
          msg: message.SHIFT.NO_SHIFT,
        });
      }

      if (!existEmployee.attendancePolicymaster) {
        return respHelper(res, {
          status: 404,
          msg: message.ATTENDANCE_POLICY_DID_NOT_MAP,
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
        if (existEmployee.shiftsmaster.isOverNight) {
          return respHelper(res, {
            data: {
              overNightCase: "yes",
            },
            status: 200,
            msg: message.PUNCH_OUT_SUCCESS,
          });
          // Handle Over night case
        } else {
          let shiftStartTime = moment(
            existEmployee.shiftsmaster.shiftStartTime,
            "HH:mm"
          ); // set shift start time

          shiftStartTime.subtract(
            existEmployee.attendancePolicymaster.allowBufferTime == 1
              ? existEmployee.attendancePolicymaster.bufferTimePre
              : 0,
            "minutes"
          ); // Add buffer time  to the selected time if buffer allow

          const finalShiftStartTime = shiftStartTime.format("HH:mm");
          if (currentDate.format("HH:mm") < finalShiftStartTime) {
            // campare shift time and current time inclu
            return respHelper(res, {
              status: 400,
              msg: message.SHIFT.SHIFT_TIME_INVALID,
            });
          }

          let graceTime = moment(
            existEmployee.shiftsmaster.shiftStartTime,
            "HH:mm"
          ); // set shift start time

          graceTime.add(
            existEmployee.attendancePolicymaster.graceTimeClockIn,
            "minutes"
          ); // Add buffer time  to the selected time if buffer allow

          const withGraceTime = graceTime.format("HH:mm");

          let creationObject = {
            attendanceDate: currentDate.format("YYYY-MM-DD"),
            employeeId: req.userId,
            attandanceShiftStartDate: currentDate.format("YYYY-MM-DD"),
            attendanceShiftId: existEmployee.shiftsmaster.shiftId,
            attendancePunchInTime: currentDate.format("HH:mm:ss"),
            attendanceStatus: "Punch In",
            attendanceLateBy: await helper.calculateLateBy(
              currentDate.format("HH:mm:ss"),
              withGraceTime
            ),
            attendancePresentStatus: "present",
            attendancePunchInRemark: result.remark,
            attendancePunchInLocationType: result.locationType,
            attendancePunchInLocation: result.location,
            attendancePunchInLatitude: result.latitude,
            attendancePunchInLongitude: result.longitude,
            createdBy: req.userId,
            attendancePolicyId: req.userData.attendancePolicyId,
            createdAt: currentDate,
            weekOffId: existEmployee.weekOffId,
          };

          await db.attendanceMaster.create(creationObject);

          await db.attendanceHistory.create({
            date: currentDate.format("YYYY-MM-DD"),
            time: currentDate.format("HH:mm:ss"),
            status: "Punch In",
            employeeId: req.userId,
            location: result.location,
            lat: result.latitude,
            long: result.longitude,
            createdBy: req.userId,
            createdAt: currentDate,
          });
          return respHelper(res, {
            status: 200,
            msg: message.PUNCH_IN_SUCCESS,
          });
        }
      } else {
        if (existEmployee.shiftsmaster.isOverNight) {
          return respHelper(res, {
            data: {
              overNightCase: "yes",
            },
            status: 200,
            msg: message.PUNCH_OUT_SUCCESS,
          });
          // Handle Over night case
        } else {
          let shiftEndtime = moment(
            existEmployee.shiftsmaster.shiftEndTime,
            "HH:mm"
          ); // set shift start time

          shiftEndtime.subtract(
            existEmployee.attendancePolicymaster.graceTimeClockOut,
            "minutes"
          ); // subtract grace time  to the selected time if buffer allow

          const finalShiftStartTime = shiftEndtime.format("HH:mm");

          let graceTime = moment(
            existEmployee.shiftsmaster.shiftEndTime,
            "HH:mm"
          ); // set shift start time

          graceTime.add(
            existEmployee.attendancePolicymaster.bufferTimePost,
            "minutes"
          ); // Add buffer time  to the selected time if buffer allow
          console.log("withGraceTime", graceTime);

          const withGraceTime = graceTime.format("HH:mm");
          console.log("finalShiftStartTime", finalShiftStartTime);
          console.log("currentDate", currentDate.format("HH:mm"));

          console.log("withGraceTime", withGraceTime);

          if (
            currentDate.format("HH:mm") < finalShiftStartTime ||
            currentDate.format("HH:mm") > withGraceTime
          ) {
            // campare shift time and current time inclu
            return respHelper(res, {
              status: 400,
              msg: message.SHIFT.SHIFT_TIME_INVALID,
            });
          }

          await db.attendanceMaster.update(
            {
              attendancePunchOutTime: currentDate.format("HH:mm:ss"),
              attendanceShiftEndDate: currentDate.format("YYYY-MM-DD"),
              attendancePunchOutLocationType: result.locationType,
              attendanceStatus: "Punch Out",
              attendancePunchOutRemark: result.remark,
              attendanceLocationType: result.locationType,
              attendanceWorkingTime: await helper.timeDifference(
                `${checkAttendance.attandanceShiftStartDate} ${checkAttendance.attendancePunchInTime}`,
                `${currentDate.format("YYYY-MM-DD")} ${currentDate.format(
                  "HH:mm:ss"
                )}`
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
          await db.attendanceHistory.create({
            date: currentDate.format("YYYY-MM-DD"),
            time: currentDate.format("HH:mm:ss"),
            status: "Punch Out",
            employeeId: req.userId,
            location: result.location,
            lat: result.latitude,
            long: result.longitude,
            updatedBy: req.userId,
            updatedAt: currentDate,
          });
        }

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

      const punchInDateTime = moment(
        `${result.fromDate}T${result.punchInTime}`
      );
      const punchOutDateTime = moment(
        `${result.toDate}T${result.punchOutTime}`
      );

      if (
        result.punchInTime == "00:00:00" ||
        result.punchOutTime == "00:00:00"
      ) {
        return respHelper(res, {
          status: 400,
          msg: message.ZERO_TIME,
        });
      }

      if (result.punchInTime == result.punchOutTime) {
        return respHelper(res, {
          status: 400,
          msg: message.NOT_SAME,
        });
      }

      if (punchOutDateTime.isBefore(punchInDateTime)) {
        return respHelper(res, {
          status: 400,
          msg: message.TIME_LESS, // "PunchOut time can't be less than PunchIn time."
        });
      }

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
                attributes: ["id", "name", "email"],
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

      if (
        attendanceData.dataValues.latest_Regularization_Request.length != 0 &&
        (attendanceData.dataValues.latest_Regularization_Request[0]
          .regularizeStatus === "Pending" ||
          attendanceData.dataValues.latest_Regularization_Request[0]
            .regularizeStatus === "Approved")
      ) {
        return respHelper(res, {
          status: 400,
          msg: message.ALREADY_REQUESTED.replace("<module>", "Regularization"),
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
        regularizeManagerId: attendanceData.dataValues.employee.managerData.id,
        regularizePunchInTime: result.punchInTime,
        regularizePunchOutTime: result.punchOutTime,
        regularizeLocationType: result.locationType,
        regularizeReason: result.reason,
        regularizeStatus: "Pending",
        createdBy: req.userId,
        createdAt: moment(),
      });

      eventEmitter.emit(
        "regularizeRequestMail",
        JSON.stringify({
          requesterName: attendanceData.dataValues.employee.name,
          attendenceFromDate: result.fromDate,
          attendenceToDate: result.toDate,
          userRemark: result.remark,
          managerName: attendanceData.dataValues.employee.managerData.name,
          managerEmail: attendanceData.dataValues.employee.managerData.email,
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

  //old implmentation
  // async attendanceList(req, res) {
  //   try {
  //     const user = req.query.user;
  //     const year = req.query.year;
  //     const month = req.query.month;
  //     const companyLocationId = req.userData.companyLocationId;
  //     let averageWorkingTime = [];
  //     let calculateLateTime = [];
  //     let calculateleaveDays = [];
  //     let calculateUnpaidleaveDays = [];
  //     let calculatePresentDays = [];
  //     let calculateAbsentDays = [];
  //     let calculateSinglePunchAbsent = [];

  //     if (!year || !month) {
  //       return respHelper(res, {
  //         status: 400,
  //         msg: "Please Fill Month and Year",
  //       });
  //     }

  //     const getLocationBasedHolidays = await db.holidayCompanyLocationConfiguration.findAll({
  //       where: { companyLocationId: companyLocationId },
  //       include: [{
  //         model: db.holidayMaster,
  //         required: true,
  //         as: "holidayDetails",
  //         attributes: ["holidayName", "holidayDate"],
  //         where: { isActive: 1 },
  //       }],
  //     });

  //     const attendanceData = await db.attendanceMaster.findAndCountAll({
  //       where: {
  //         employeeId: user ? user : req.userId,
  //         attendanceDate: {
  //           [Op.and]: [
  //             { [Op.gte]: `${year}-${month}-01` },
  //             { [Op.lte]: `${year}-${month}-${moment(`${year}-${month}`, "YYYY-MM").daysInMonth()}` },
  //           ],
  //         },
  //       },
  //       attributes: { exclude: ["createdBy", "createdAt", "updatedBy", "updatedAt"] },
  //       include: [
  //         {
  //           model: db.regularizationMaster.scope("latest"),
  //           required: false,
  //           row: true,
  //           as: "latest_Regularization_Request",
  //           attributes: ["regularizeStatus", "regularizeId"],
  //           where: { regularizeStatus: ["Pending", "Approved"] },
  //         },
  //         {
  //           model: db.holidayCompanyLocationConfiguration,
  //           required: false,
  //           as: "holidayLocationMappingDetails",
  //           include: {
  //             model: db.holidayMaster,
  //             required: true,
  //             as: "holidayDetails",
  //             attributes: ["holidayName", "holidayDate"],
  //             where: { isActive: 1 },
  //           },
  //         },
  //         {
  //           model: db.employeeLeaveTransactions,
  //           required: false,
  //           as: "employeeLeaveTransactionDetails",
  //           attributes: ["status", "employeeLeaveTransactionsId", "isHalfDay", "halfDayFor", "reason", "leaveAutoId"],
  //           limit: 2,
  //           where: { status: ["pending", "approved"], employeeId: user ? user : req.userId },
  //           include: {
  //             model: db.leaveMaster,
  //             required: false,
  //             as: "leaveMasterDetails",
  //             attributes: ["leaveName", "leaveCode"],
  //           },
  //         },
  //       ],
  //     });

  //     const monthDays = await db.CalenderYear.findAll({
  //       attributes: ["calenderId", "date", "year", "month", "fullDate"],
  //       where: { month: month, year: year },
  //     });

  //     for (const iterator of attendanceData.rows) {

  //       if (iterator.dataValues.attendanceWorkingTime) {
  //         averageWorkingTime.push(iterator.dataValues.attendanceWorkingTime);
  //       }
  //       if (iterator.dataValues.attendanceLateBy && iterator.dataValues.attendanceLateBy != "00:00:00") {
  //         calculateLateTime.push(iterator.dataValues.attendanceLateBy);
  //       }
  //       switch (iterator.dataValues.attendancePresentStatus) {
  //         case "absent":
  //           calculateAbsentDays.push(iterator.dataValues.attendanceAutoId);
  //           break;
  //         case "present":
  //           calculatePresentDays.push(iterator.dataValues.attendanceAutoId);
  //           break;
  //         case "singlePunchAbsent":
  //           calculateSinglePunchAbsent.push(iterator.dataValues.attendanceAutoId);
  //           break;
  //         case "leave":
  //           calculateleaveDays.push(iterator.dataValues.attendanceAutoId);
  //           break;
  //         case "unpaidLeave":
  //           calculateUnpaidleaveDays.push(iterator.dataValues.attendanceAutoId);
  //           break;
  //       }
  //     }

  //     let holidayDates = {};
  //     getLocationBasedHolidays.forEach((locationHoliday) => {
  //       if (locationHoliday.holidayDetails) {
  //         holidayDates[locationHoliday.holidayDetails.holidayDate] = {
  //           holidayDate: locationHoliday.holidayDetails.holidayDate,
  //           holidayName: locationHoliday.holidayDetails.holidayName,
  //         };
  //       }
  //     });

  //     const attendanceMap = attendanceData.rows.reduce((map, record) => {
  //       map[record.attendanceDate] = record;
  //       return map;
  //     }, {});

  //     let i = 0;
  //     const result = await Promise.all(monthDays.map(async (day) => {
  //       const attendance = attendanceMap[day.fullDate] || null;
  //       const holiday = holidayDates[day.fullDate] || null;
  //       const employeeLeaveTransactionDetails = await db.employeeLeaveTransactions.findAll({
  //         attributes: [
  //           "status",
  //           "employeeLeaveTransactionsId",
  //           "isHalfDay",
  //           "halfDayFor",
  //           "reason",
  //           "leaveAutoId",
  //         ],
  //         where: { employeeId: req.userId, appliedFor: attendance ? attendance.attendanceDate : day.fullDate },
  //         include: {
  //           model: db.leaveMaster,
  //           required: false,
  //           as: "leaveMasterDetails",
  //           attributes: ["leaveName", "leaveCode"],
  //         },
  //       });

  //       return {
  //         attendanceAutoId: attendance ? attendance.attendanceAutoId : i++,
  //         employeeId: attendance ? attendance.employeeId : 0,
  //         attendanceShiftId: attendance ? attendance.attendanceShiftId : 0,
  //         attendancePolicyId: attendance ? attendance.attendancePolicyId : 0,
  //         attendanceRegularizeId: attendance ? attendance.attendanceRegularizeId : 0,
  //         attendanceDate: attendance ? attendance.attendanceDate : day.fullDate,
  //         day: moment(attendance ? attendance.attendanceDate : day.fullDate).format('dddd'),
  //         attandanceShiftStartDate: attendance ? attendance.attandanceShiftStartDate : day.fullDate,
  //         attendanceShiftEndDate: attendance ? attendance.attendanceShiftEndDate : day.fullDate,
  //         attendancePunchInTime: attendance ? attendance.attendancePunchInTime : null,
  //         attendancePunchOutTime: attendance ? attendance.attendancePunchOutTime : null,
  //         attendanceLateBy: attendance ? attendance.attendanceLateBy : "",
  //         attendancePunchInRemark: attendance ? attendance.attendancePunchInRemark : "",
  //         attendancePunchOutRemark: attendance ? attendance.attendancePunchOutRemark : "",
  //         attendancePunchInLocationType: attendance ? attendance.attendancePunchInLocationType : "",
  //         attendancePunchOutLocationType: attendance ? attendance.attendancePunchOutLocationType : "",
  //         attendanceStatus: attendance ? attendance.attendanceStatus : "NA",
  //         attendancePresentStatus: attendance ? attendance.attendancePresentStatus : "NA",
  //         attendanceRegularizeStatus: attendance ? attendance.attendanceRegularizeStatus : "NA",
  //         attendanceManagerUpdateDate: attendance ? attendance.attendanceManagerUpdateDate : "NA",
  //         attendancePunchInLocation: attendance ? attendance.attendancePunchInLocation : "NA",
  //         attendancePunchInLatitude: attendance ? attendance.attendancePunchInLatitude : "",
  //         attendancePunchInLongitude: attendance ? attendance.attendancePunchInLongitude : "",
  //         attendancePunchOutLocation: attendance ? attendance.attendancePunchOutLocation : "",
  //         attendancePunchOutLatitude: attendance ? attendance.attendancePunchOutLatitude : "",
  //         attendancePunchOutLongitude: attendance ? attendance.attendancePunchOutLongitude : "",
  //         attendanceWorkingTime: attendance ? attendance.attendanceWorkingTime : null,
  //         attendanceRegularizeCount: attendance ? attendance.attendanceRegularizeCount : 0,
  //         employeeLeaveTransactionsId: attendance ? attendance.employeeLeaveTransactionsId : i,
  //         needAttendanceCron: attendance ? attendance.needAttendanceCron : 0,
  //         holidayCompanyLocationConfigurationID: attendance ? attendance.holidayCompanyLocationConfigurationID : 0,
  //         holidayLocationMappingDetails: holiday ? [holiday] : [],
  //         latest_Regularization_Request: attendance ? attendance.latest_Regularization_Request : [],
  //         employeeLeaveTransactionDetails: employeeLeaveTransactionDetails,
  //       };
  //     }));

  //     return respHelper(res, {
  //       status: 200,
  //       data: {
  //         statics: {
  //           lateTime: await helper.calculateTime(calculateLateTime),
  //           averageWorkingTime: await helper.calculateAverageHours(averageWorkingTime),
  //           absentDays: calculateAbsentDays.length,
  //           presentDays: calculatePresentDays.length,
  //           singlePunchAbsentDays: calculateSinglePunchAbsent.length,
  //           leaveDays: calculateleaveDays.length,
  //           unpaidLeaveDays: calculateUnpaidleaveDays.length,
  //         },
  //         attendanceData: {
  //           count: result.length,
  //           rows: result,
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return respHelper(res, { status: 500 });
  //   }
  // }

  //new implementation
  // async attendanceList(req, res) {
  //   try {
  //     const user = req.query.user;
  //     const year = req.query.year;
  //     const month = req.query.month;
  //     const companyLocationId = req.userData.companyLocationId;

  //     if (!year || !month) {
  //       return respHelper(res, {
  //         status: 400,
  //         msg: "Please Fill Month and Year",
  //       });
  //     }

  //     // Fetch all required data in bulk
  //     const [locationBasedHolidays, attendanceData, monthDays, employeeLeaveTransactions] = await Promise.all([
  //       db.holidayCompanyLocationConfiguration.findAll({
  //         where: { companyLocationId: companyLocationId },
  //         include: [{
  //           model: db.holidayMaster,
  //           required: true,
  //           as: "holidayDetails",
  //           attributes: ["holidayName", "holidayDate"],
  //           where: { isActive: 1 },
  //         }],
  //       }),
  //       db.attendanceMaster.findAll({
  //         where: {
  //           employeeId: user || req.userId,
  //           attendanceDate: {
  //             [Op.between]: [
  //               `${year}-${month}-01`,
  //               `${year}-${month}-${moment(`${year}-${month}`, "YYYY-MM").daysInMonth()}`,
  //             ],
  //           },
  //         },
  //         attributes: { exclude: ["createdBy", "createdAt", "updatedBy", "updatedAt"] },
  //         include: [
  //           {
  //             model: db.regularizationMaster.scope("latest"),
  //             required: false,
  //             as: "latest_Regularization_Request",
  //             attributes: ["regularizeStatus", "regularizeId"],
  //             where: { regularizeStatus: ["Pending", "Approved"] },
  //           },
  //           {
  //             model: db.holidayCompanyLocationConfiguration,
  //             required: false,
  //             as: "holidayLocationMappingDetails",
  //             include: {
  //               model: db.holidayMaster,
  //               required: true,
  //               as: "holidayDetails",
  //               attributes: ["holidayName", "holidayDate"],
  //               where: { isActive: 1 },
  //             },
  //           },
  //           {
  //             model: db.employeeLeaveTransactions,
  //             required: false,
  //             as: "employeeLeaveTransactionDetails",
  //             attributes: ["status", "employeeLeaveTransactionsId", "isHalfDay", "halfDayFor", "reason", "leaveAutoId"],
  //             where: { status: ["pending", "approved"], employeeId: user || req.userId },
  //             include: {
  //               model: db.leaveMaster,
  //               required: false,
  //               as: "leaveMasterDetails",
  //               attributes: ["leaveName", "leaveCode"],
  //             },
  //           },
  //         ],
  //       }),
  //       db.CalenderYear.findAll({
  //         attributes: ["calenderId", "date", "year", "month", "fullDate"],
  //         where: { month: month, year: year },
  //       }),
  //       db.employeeLeaveTransactions.findAll({
  //         attributes: ["status", "employeeLeaveTransactionsId", "isHalfDay", "halfDayFor", "reason", "leaveAutoId"],
  //         where: {
  //           employeeId: req.userId,
  //           appliedFor: {
  //             [Op.between]: [
  //               `${year}-${month}-01`,
  //               `${year}-${month}-${moment(`${year}-${month}`, "YYYY-MM").daysInMonth()}`,
  //             ],
  //           },
  //         },
  //         include: {
  //           model: db.leaveMaster,
  //           required: false,
  //           as: "leaveMasterDetails",
  //           attributes: ["leaveName", "leaveCode"],
  //         },
  //       }),
  //     ]);

  //     // Process holidays
  //     const holidayDates = locationBasedHolidays.reduce((acc, locationHoliday) => {
  //       if (locationHoliday.holidayDetails) {
  //         acc[locationHoliday.holidayDetails.holidayDate] = {
  //           holidayDate: locationHoliday.holidayDetails.holidayDate,
  //           holidayName: locationHoliday.holidayDetails.holidayName,
  //         };
  //       }
  //       return acc;
  //     }, {});

  //     // Process attendance data
  //     let averageWorkingTime = [];
  //     let calculateLateTime = [];
  //     let calculateleaveDays = [];
  //     let calculateUnpaidleaveDays = [];
  //     let calculatePresentDays = [];
  //     let calculateAbsentDays = [];
  //     let calculateSinglePunchAbsent = [];

  //     const attendanceMap = attendanceData.reduce((acc, record) => {
  //       const data = record.dataValues;
  //       acc[data.attendanceDate] = record;
  //       if (data.attendanceWorkingTime) {
  //         averageWorkingTime.push(data.attendanceWorkingTime);
  //       }
  //       if (data.attendanceLateBy && data.attendanceLateBy !== "00:00:00") {
  //         calculateLateTime.push(data.attendanceLateBy);
  //       }
  //       switch (data.attendancePresentStatus) {
  //         case "absent":
  //           calculateAbsentDays.push(data.attendanceAutoId);
  //           break;
  //         case "present":
  //           calculatePresentDays.push(data.attendanceAutoId);
  //           break;
  //         case "singlePunchAbsent":
  //           calculateSinglePunchAbsent.push(data.attendanceAutoId);
  //           break;
  //         case "leave":
  //           calculateleaveDays.push(data.attendanceAutoId);
  //           break;
  //         case "unpaidLeave":
  //           calculateUnpaidleaveDays.push(data.attendanceAutoId);
  //           break;
  //       }
  //       return acc;
  //     }, {});

  //     // Combine monthDays with attendance and holiday data
  //     const result = monthDays.map(day => {
  //       const fullDate = day.fullDate;
  //       const attendance = attendanceMap[fullDate] || {};
  //       const holiday = holidayDates[fullDate] || null;
  //       const leaveTransactions = employeeLeaveTransactions.filter(tx => tx.appliedFor === fullDate);

  //       return {
  //         attendanceAutoId: attendance.attendanceAutoId || 0,
  //         employeeId: attendance.employeeId || 0,
  //         attendanceShiftId: attendance.attendanceShiftId || 0,
  //         attendancePolicyId: attendance.attendancePolicyId || 0,
  //         attendanceRegularizeId: attendance.attendanceRegularizeId || 0,
  //         attendanceDate: attendance.attendanceDate || fullDate,
  //         day: moment(fullDate).format('dddd'),
  //         attandanceShiftStartDate: attendance.attandanceShiftStartDate || fullDate,
  //         attendanceShiftEndDate: attendance.attendanceShiftEndDate || fullDate,
  //         attendancePunchInTime: attendance.attendancePunchInTime || null,
  //         attendancePunchOutTime: attendance.attendancePunchOutTime || null,
  //         attendanceLateBy: attendance.attendanceLateBy || "",
  //         attendancePunchInRemark: attendance.attendancePunchInRemark || "",
  //         attendancePunchOutRemark: attendance.attendancePunchOutRemark || "",
  //         attendancePunchInLocationType: attendance.attendancePunchInLocationType || "",
  //         attendancePunchOutLocationType: attendance.attendancePunchOutLocationType || "",
  //         attendanceStatus: attendance.attendanceStatus || "NA",
  //         attendancePresentStatus: attendance.attendancePresentStatus || "NA",
  //         attendanceRegularizeStatus: attendance.attendanceRegularizeStatus || "NA",
  //         attendanceManagerUpdateDate: attendance.attendanceManagerUpdateDate || "NA",
  //         attendancePunchInLocation: attendance.attendancePunchInLocation || "NA",
  //         attendancePunchInLatitude: attendance.attendancePunchInLatitude || "",
  //         attendancePunchInLongitude: attendance.attendancePunchInLongitude || "",
  //         attendancePunchOutLocation: attendance.attendancePunchOutLocation || "",
  //         attendancePunchOutLatitude: attendance.attendancePunchOutLatitude || "",
  //         attendancePunchOutLongitude: attendance.attendancePunchOutLongitude || "",
  //         attendanceWorkingTime: attendance.attendanceWorkingTime || null,
  //         attendanceRegularizeCount: attendance.attendanceRegularizeCount || 0,
  //         employeeLeaveTransactionsId: attendance.employeeLeaveTransactionsId || 0,
  //         needAttendanceCron: attendance.needAttendanceCron || 0,
  //         holidayCompanyLocationConfigurationID: attendance.holidayCompanyLocationConfigurationID || 0,
  //         holidayLocationMappingDetails: holiday ? [holiday] : [],
  //         latest_Regularization_Request: attendance.latest_Regularization_Request || [],
  //         employeeLeaveTransactionDetails: leaveTransactions,
  //       };
  //     });

  //     return respHelper(res, {
  //       status: 200,
  //       data: {
  //         statics: {
  //           lateTime: await helper.calculateTime(calculateLateTime),
  //           averageWorkingTime: await helper.calculateAverageHours(averageWorkingTime),
  //           absentDays: calculateAbsentDays.length,
  //           presentDays: calculatePresentDays.length,
  //           singlePunchAbsentDays: calculateSinglePunchAbsent.length,
  //           leaveDays: calculateleaveDays.length,
  //           unpaidLeaveDays: calculateUnpaidleaveDays.length,
  //         },
  //         attendanceData: {
  //           count: result.length,
  //           rows: result,
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return respHelper(res, { status: 500 });
  //   }
  // }

  async attendanceList(req, res) {
    try {
      const user = req.query.user || req.userId;
      const year = req.query.year;
      const month = req.query.month;
      const companyLocationId = req.userData.companyLocationId;
      const weekOffId = req.userData.weekOffId;
      const shiftId = req.userData.shiftId;
      if (!year || !month) {
        return respHelper(res, {
          status: 400,
          msg: "Please Fill Month and Year",
        });
      }

      const getUserDetails = await db.employeeMaster.findOne({
        attributes: ["id", "name", "empCode", "profileImage"],
        where: { id: user },
        include: [
          {
            model: db.attendancePolicymaster,
            attributes: ["policyName", "policyCode"],
          },
          {
            model: db.shiftMaster,
            attributes: ["shiftName", "shiftStartTime", "shiftEndTime"],
          },
          {
            model: db.weekOffMaster,
            attributes: ["weekOffName", "nonWorkingDays"],
          },
        ],
      });

      const startDateLeaves = `${year}-${month}-01`;
      const endDateLeaves = moment()
        .year(year)
        .month(month - 1)
        .endOf("month")
        .format("YYYY-MM-DD"); //`${year}-${month}-31`;

      // Fetch all required data in bulk
      const [
        locationBasedHolidays,
        attendanceData,
        monthDays,
        employeeLeaveTransactions,
        shiftMasters,
      ] = await Promise.all([
        db.holidayCompanyLocationConfiguration.findAll({
          where: { companyLocationId: companyLocationId },
          include: [
            {
              model: db.holidayMaster,
              required: true,
              as: "holidayDetails",
              attributes: ["holidayName", "holidayDate"],
              where: { isActive: 1 },
            },
          ],
        }),
        db.attendanceMaster.findAll({
          where: {
            employeeId: user,
            attendanceDate: {
              [Op.between]: [
                `${year}-${month}-01`,
                `${year}-${month}-${moment(
                  `${year}-${month}`,
                  "YYYY-MM"
                ).daysInMonth()}`,
              ],
            },
          },
          attributes: {
            exclude: ["createdBy", "createdAt", "updatedBy", "updatedAt"],
          },
          include: [
            {
              model: db.regularizationMaster.scope("latest"),
              required: false,
              as: "latest_Regularization_Request",
              attributes: [
                "regularizePunchInDate",
                "regularizePunchOutDate",
                "regularizeUserRemark",
                "regularizeLocationType",
                "regularizePunchInTime",
                "regularizePunchOutTime",
                "regularizeReason",
                "regularizeStatus",
                "regularizeManagerRemark",
                "regularizeId",
                "createdAt",
              ],
              where: { regularizeStatus: ["Pending", "Approved"] },
            },
            {
              model: db.holidayCompanyLocationConfiguration,
              required: false,
              as: "holidayLocationMappingDetails",
              include: {
                model: db.holidayMaster,
                required: true,
                as: "holidayDetails",
                attributes: ["holidayName", "holidayDate"],
                where: { isActive: 1 },
              },
            },
            {
              model: db.employeeLeaveTransactions,
              required: false,
              as: "employeeLeaveTransactionDetails",
              attributes: [
                "status",
                "employeeLeaveTransactionsId",
                "isHalfDay",
                "halfDayFor",
                "reason",
                "leaveAutoId",
              ],
              where: {
                status: ["pending", "approved"],
                employeeId: user,
              },
              include: {
                model: db.leaveMaster,
                required: false,
                as: "leaveMasterDetails",
                attributes: ["leaveName", "leaveCode"],
              },
            },
          ],
        }),
        db.CalenderYear.findAll({
          attributes: ["calenderId", "date", "year", "month", "fullDate"],
          where: { month: month, year: year },
        }),
        db.employeeLeaveTransactions.findAll({
          attributes: [
            "status",
            "employeeLeaveTransactionsId",
            "isHalfDay",
            "halfDayFor",
            "reason",
            "message",
            "leaveAutoId",
            "appliedOn",
            "appliedFor",
            "leaveCount",
            "fromDate",
            "toDate",
            "managerRemark",
            "leaveAttachment",
          ],
          where: {
            employeeId: user,
            appliedFor: {
              [Op.between]: [
                `${year}-${month}-01`,
                `${year}-${month}-${moment(
                  `${year}-${month}`,
                  "YYYY-MM"
                ).daysInMonth()}`,
              ],
            },
          },
          include: {
            model: db.leaveMaster,
            required: false,
            as: "leaveMasterDetails",
            attributes: ["leaveName", "leaveCode"],
          },
          order: [["employeeLeaveTransactionsId", "desc"]],
          //limit: 1
        }),
        db.shiftMaster.findAll({
          attributes: [
            "shiftId",
            "shiftName",
            "shiftStartTime",
            "shiftEndTime",
            "shiftRemark",
          ],
        }),
      ]);

      // Create a map for shiftMaster data
      const shiftMasterMap = shiftMasters.reduce((map, shift) => {
        map[shift.shiftId] = shift;
        return map;
      }, {});

      const monthLeaves = await db.employeeLeaveTransactions.findAll({
        attributes: [
          "employeeId",
          "leaveAutoId",
          [db.Sequelize.fn("MONTH", db.Sequelize.col("appliedFor")), "month"],
          [
            db.Sequelize.fn("sum", db.Sequelize.col("leaveCount")),
            "totalLeaveCount",
          ],
        ],
        where: {
          employeeId: user,
          status: "approved",
          appliedFor: {
            [db.Sequelize.Op.between]: [startDateLeaves, endDateLeaves],
          },
        },
        group: [
          "employeeId",
          "leaveAutoId",
          db.Sequelize.fn("MONTH", db.Sequelize.col("appliedFor")),
        ],
        raw: true,
      });
      const monthUpaidLeave = await db.employeeLeaveTransactions.findAll({
        attributes: [
          "employeeId",
          "leaveAutoId",
          [db.Sequelize.fn("MONTH", db.Sequelize.col("appliedFor")), "month"],
          [
            db.Sequelize.fn("sum", db.Sequelize.col("leaveCount")),
            "totalLeaveCount",
          ],
        ],
        where: {
          employeeId: user,
          status: "approved",
          leaveAutoId: 6,
          appliedFor: {
            [db.Sequelize.Op.between]: [startDateLeaves, endDateLeaves],
          },
        },
        group: [
          "employeeId",
          "leaveAutoId",
          db.Sequelize.fn("MONTH", db.Sequelize.col("appliedFor")),
        ],
        raw: true,
      });
      // Process holidays//
      const holidayDates = locationBasedHolidays.reduce(
        (acc, locationHoliday) => {
          if (locationHoliday.holidayDetails) {
            acc[locationHoliday.holidayDetails.holidayDate] = {
              holidayDate: locationHoliday.holidayDetails.holidayDate,
              holidayName: locationHoliday.holidayDetails.holidayName,
            };
          }
          return acc;
        },
        {}
      );

      // Process attendance data
      let averageWorkingTime = [];
      let calculateLateTime = [];
      let calculateleaveDays = [];
      let calculateUnpaidleaveDays = [];
      let calculatePresentDays = [];
      let calculateAbsentDays = [];
      let calculateSinglePunchAbsent = [];

      const attendanceMap = attendanceData.reduce((acc, record) => {
        const data = record.dataValues;
        acc[data.attendanceDate] = record;
        if (data.attendanceWorkingTime) {
          averageWorkingTime.push(data.attendanceWorkingTime);
        }
        if (data.attendanceLateBy && data.attendanceLateBy !== "00:00:00") {
          calculateLateTime.push(data.attendanceLateBy);
        }
        switch (data.attendancePresentStatus) {
          case "absent":
            calculateAbsentDays.push(data.attendanceAutoId);
            break;
          case "present":
            calculatePresentDays.push(data.attendanceAutoId);
            break;
          case "singlePunchAbsent":
            calculateSinglePunchAbsent.push(data.attendanceAutoId);
            break;
          case "leave":
            calculateleaveDays.push(data.attendanceAutoId);
            break;
          case "unpaidLeave":
            calculateUnpaidleaveDays.push(data.attendanceAutoId);
            break;
        }
        return acc;
      }, {});

      // Combine monthDays with attendance and holiday data
      const result = await Promise.all(
        monthDays.map(async (day) => {
          const fullDate = day.fullDate;
          const attendance = attendanceMap[fullDate] || {};
          const holiday = holidayDates[fullDate] || null;
          const leaveTransactions = employeeLeaveTransactions.filter(
            (tx) => tx.appliedFor === fullDate
          );
          const shiftMaster =
            shiftMasterMap[attendance.attendanceShiftId] ||
            shiftMasterMap[shiftId];

          let dayCode = parseInt(moment(fullDate).format("d")) + 1;
          let momentDate = moment(fullDate);
          let dayOfMonth = momentDate.date();
          let occurrence = Math.ceil(dayOfMonth / 7);

          let occurrenceDayCondition = {};
          switch (occurrence) {
            case 1:
              occurrenceDayCondition = {
                dayId: dayCode,
                isfirstDayOff: 1,
                weekOffId: weekOffId,
              };
              break;
            case 2:
              occurrenceDayCondition = {
                dayId: dayCode,
                isSecondDayOff: 1,
                weekOffId: weekOffId,
              };
              break;
            case 3:
              occurrenceDayCondition = {
                dayId: dayCode,
                isThirdyDayOff: 1,
                weekOffId: weekOffId,
              };
              break;
            case 4:
              occurrenceDayCondition = {
                dayId: dayCode,
                isFourthDayOff: 1,
                weekOffId: weekOffId,
              };
              break;
            case 5:
              occurrenceDayCondition = {
                dayId: dayCode,
                isFivethDayOff: 1,
                weekOffId: weekOffId,
              };
              break;
            default:
              occurrenceDayCondition = {};
          }

          let checkWeekOff = await db.weekOffDayMappingMaster.findOne({
            where: occurrenceDayCondition,
          });
          return {
            attendanceAutoId: attendance.attendanceAutoId || 0,
            employeeId: attendance.employeeId || 0,
            attendanceShiftId: attendance.attendanceShiftId || 0,
            attendancePolicyId: attendance.attendancePolicyId || 0,
            attendanceRegularizeId: attendance.attendanceRegularizeId || 0,
            attendanceDate: attendance.attendanceDate || fullDate,
            day: moment(fullDate).format("dddd"),
            attandanceShiftStartDate:
              attendance.attandanceShiftStartDate || fullDate,
            attendanceShiftEndDate:
              attendance.attendanceShiftEndDate || fullDate,
            attendancePunchInTime: attendance.attendancePunchInTime || null,
            attendancePunchOutTime: attendance.attendancePunchOutTime || null,
            attendanceLateBy: attendance.attendanceLateBy || "",
            attendancePunchInRemark: attendance.attendancePunchInRemark || "",
            attendancePunchOutRemark: attendance.attendancePunchOutRemark || "",
            attendancePunchInLocationType:
              attendance.attendancePunchInLocationType || "",
            attendancePunchOutLocationType:
              attendance.attendancePunchOutLocationType || "",
            attendanceStatus: attendance.attendanceStatus || "NA",
            attendancePresentStatus:
              attendance.attendancePresentStatus !== undefined
                ? attendance.attendancePresentStatus
                : checkWeekOff !== null
                ? "weeklyOff"
                : "NA",
            attendanceRegularizeStatus:
              attendance.attendanceRegularizeStatus || "NA",
            attendanceManagerUpdateDate:
              attendance.attendanceManagerUpdateDate || "NA",
            attendancePunchInLocation:
              attendance.attendancePunchInLocation || "NA",
            attendancePunchInLatitude:
              attendance.attendancePunchInLatitude || "",
            attendancePunchInLongitude:
              attendance.attendancePunchInLongitude || "",
            attendancePunchOutLocation:
              attendance.attendancePunchOutLocation || "",
            attendancePunchOutLatitude:
              attendance.attendancePunchOutLatitude || "",
            attendancePunchOutLongitude:
              attendance.attendancePunchOutLongitude || "",
            attendanceWorkingTime: attendance.attendanceWorkingTime || null,
            attendanceRegularizeCount:
              attendance.attendanceRegularizeCount || 0,
            employeeLeaveTransactionsId:
              attendance.employeeLeaveTransactionsId || 0,
            needAttendanceCron: attendance.needAttendanceCron || 0,
            holidayCompanyLocationConfigurationID:
              attendance.holidayCompanyLocationConfigurationID || 0,
            holidayLocationMappingDetails: holiday ? [holiday] : [],
            latest_Regularization_Request:
              attendance.latest_Regularization_Request || [],
            employeeLeaveTransactionDetails: leaveTransactions,
            attendanceShiftEmployee: shiftMaster,
          };
        })
      );
      return respHelper(res, {
        status: 200,
        data: {
          statics: {
            lateTime: await helper.calculateAverageHours(calculateLateTime),
            averageWorkingTime: await helper.calculateAverageHours(
              averageWorkingTime
            ),
            absentDays: calculateAbsentDays.length,
            presentDays: calculatePresentDays.length,
            singlePunchAbsentDays: calculateSinglePunchAbsent.length,
            leaveDays:
              monthLeaves.length > 0 ? monthLeaves[0].totalLeaveCount : 0,
            unpaidLeaveDays:
              monthUpaidLeave.length > 0
                ? monthUpaidLeave[0].totalLeaveCount
                : 0,
          },
          getUserDetails: getUserDetails,
          attendanceData: {
            count: result.length,
            rows: result,
          },
        },
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, { status: 500 });
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
        include: [
          {
            model: db.attendanceMaster,
            attributes: ["attendanceAutoId", "employeeId"],
            include: [
              {
                model: db.employeeMaster,
                attributes: ["attendancePolicyId", "name", "email"],
                include: [
                  {
                    model: db.employeeMaster,
                    as: "managerData",
                    attributes: ["name"],
                  },
                  {
                    model: db.shiftMaster,
                    required: false,
                    attributes: [
                      "shiftId",
                      "shiftName",
                      "shiftStartTime",
                      "shiftEndTime",
                      "isOverNight",
                    ],
                    where: {
                      isActive: true,
                    },
                  },
                  {
                    model: db.attendancePolicymaster,
                    attributes: ["graceTimeClockIn"],
                    where: {
                      isActive: true,
                    },
                  },
                ],
              },
            ],
          },
        ],
      });

      let graceTime = moment(
        regularizeData["attendancemaster.employee.shiftsmaster.shiftStartTime"],
        "HH:mm"
      ); // set shift start time

      graceTime.add(
        regularizeData[
          "attendancemaster.employee.attendancePolicymaster.graceTimeClockIn"
        ],
        "minutes"
      ); // Add buffer time  to the selected time if buffer allow

      const withGraceTime = graceTime.format("HH:mm");
      await db.regularizationMaster.update(
        {
          regularizeManagerRemark: result.remark != "" ? result.remark : null,
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
            attendanceWorkingTime: await helper.timeDifferenceNew(
              regularizeData.regularizePunchInTime,
              regularizeData.regularizePunchOutTime
            ),
            attendancePresentStatus: "present",
            attandanceShiftStartDate: regularizeData.regularizePunchInDate,
            attendanceShiftEndDate: regularizeData.regularizePunchOutDate,
            attendancePunchInTime: regularizeData.regularizePunchInTime,
            attendancePunchOutTime: regularizeData.regularizePunchOutTime,
            attendanceRegularizeUserRemark: regularizeData.regularizeUserRemark,
            attendanceRegularizeManagerRemark:
              regularizeData.regularizeManagerRemark,
            attendanceRegularizeReason: regularizeData.regularizeReason,
            attendanceRegularizeStatus: "Approved",
            attendanceLateBy: await helper.calculateLateBy(
              regularizeData.regularizePunchInTime,
              withGraceTime
            ),
          },
          {
            where: {
              attendanceAutoId: regularizeData.attendanceAutoId,
            },
          }
        );
        _this.attedanceCronManual(
          regularizeData.attendanceAutoId,
          regularizeData.regularizePunchInDate
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

      const obj = {
        email: regularizeData["attendancemaster.employee.email"],
        status: result.status ? "Approved" : "Rejected",
        fromDate: regularizeData.regularizePunchInDate,
        toDate: regularizeData.regularizePunchOutDate,
        managerName:
          regularizeData["attendancemaster.employee.managerData.name"],
        requesterName: regularizeData["attendancemaster.employee.name"],
      };
      eventEmitter.emit("regularizeAckMail", JSON.stringify(obj));

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
      const query = req.query.listFor;

      const regularizeList = await db.regularizationMaster.findAll({
        where: Object.assign(
          query === "raisedByMe"
            ? {
                createdBy: req.userId,
                regularizeStatus: "Pending",
              }
            : {
                regularizeManagerId: req.userId,
                regularizeStatus: "Pending",
              }
        ),
        attributes: { exclude: ["createdBy", "updatedBy", "updatedAt"] },
        include: [
          {
            model: db.attendanceMaster,
            attributes: {
              exclude: ["createdBy", "createdAt", "updatedBy", "updatedAt"],
            },
            include: [
              {
                model: db.employeeMaster,
                attributes: ["empCode", "name"],
              },
            ],
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        data: regularizeList,
      });
    } catch (error) {
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async revokeRegularizeRequest(req, res) {
    try {
      const regularizeId = req.query.reqularizeId;

      const regularizeData = await db.regularizationMaster.findOne({
        where: {
          regularizeId,
        },
        include: [
          {
            model: db.attendanceMaster,
            attributes: ["attendanceAutoId", "attendanceDate"],
            include: [
              {
                model: db.employeeMaster,
                attributes: ["empCode", "name", "email"],
                include: [
                  {
                    model: db.employeeMaster,
                    as: "managerData",
                    attributes: ["empCode", "name", "email"],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!regularizeData) {
        return respHelper(res, {
          status: 404,
          msg: message.REGULARIZE_REQUEST_NOT_FOUND,
        });
      }

      // console.log({
      //   name: `${regularizeData.dataValues.attendancemaster.employee.name} (${regularizeData.dataValues.attendancemaster.employee.empCode})`,
      //   email: regularizeData.dataValues.attendancemaster.employee.email,
      //   attendanceDate: moment(
      //     regularizeData.dataValues.attendancemaster.attendanceDate
      //   ).format("MMMM DD, YYYY"),
      //   managerName: `${regularizeData.dataValues.attendancemaster.employee.managerData.name} (${regularizeData.dataValues.attendancemaster.employee.managerData.empCode})`,
      //   // email: regularizeData.dataValues.attendancemaster.employee.managerData.email
      // });

      await db.regularizationMaster.update(
        {
          regularizeStatus: "Revoked",
        },
        {
          where: {
            regularizeId,
          },
        }
      );

      await db.attendanceMaster.update(
        {
          attendanceRegularizeStatus: "Revoked",
        },
        {
          where: {
            attendanceAutoId:
              regularizeData.dataValues.attendancemaster.attendanceAutoId,
          },
        }
      );

      eventEmitter.emit(
        "revokeRegularizationMail",
        JSON.stringify({
          name: regularizeData.dataValues.attendancemaster.employee.name,
          attendanceDate:
            regularizeData.dataValues.attendancemaster.attendanceDate,
          managerName:
            regularizeData.dataValues.attendancemaster.employee.managerData
              .name,
          email:
            regularizeData.dataValues.attendancemaster.employee.managerData
              .email,
        })
      );

      return respHelper(res, {
        status: 200,
        msg: message.REGULARIZE_REQUEST_REVOKED,
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

  async attedanceCron() {
    try {
      let lastDayDate = moment().subtract(1, "day").format("YYYY-MM-DD");
      let lastDayDateAnotherFormat = moment()
        .subtract(1, "day")
        .format("DD-MM-YYYY");
      let parsedDate = moment(lastDayDateAnotherFormat, "DD-MM-YYYY");
      let dayCode = parseInt(moment().subtract(1, "day").format("d")) + 1;

      let dayOfMonth = parsedDate.date();
      let occurrence = Math.ceil(dayOfMonth / 7);

      // Output the result
      let occurrenceDayCondition = {};
      switch (occurrence) {
        case 1:
          occurrenceDayCondition = {
            dayId: dayCode,
            isfirstDayOff: 1,
          };
          break;
        case 2:
          occurrenceDayCondition = {
            dayId: dayCode,
            isSecondDayOff: 1,
          };
          break;
        case 3:
          occurrenceDayCondition = {
            dayId: dayCode,
            isThirdyDayOff: 1,
          };
          break;
        case 4:
          occurrenceDayCondition = {
            dayId: dayCode,
            isFourthDayOff: 1,
          };
          break;
        case 5:
          occurrenceDayCondition = {
            dayId: dayCode,
            isFivethDayOff: 1,
          };
          break;
        default:
      }
      const existEmployees = await db.employeeMaster.findAll({
        include: [
          {
            model: db.shiftMaster,
            required: false,
            attributes: [
              "shiftId",
              "shiftName",
              "shiftStartTime",
              "shiftEndTime",
              "isOverNight",
            ],
            where: {
              isActive: 1,
            },
          },
          {
            model: db.attendancePolicymaster,
            required: false,
            where: {
              isActive: 1,
            },
          },
          {
            model: db.attendanceMaster,
            required: false,
            where: {
              attendanceDate: lastDayDate,
              needAttendanceCron: [0, 1],
            },
          },
          {
            model: db.employeeLeaveTransactions,
            required: false,
            where: {
              appliedFor: lastDayDate,
              status: "approved",
            },
          },
          {
            model: db.weekOffMaster,
            required: true,
            where: {
              isActive: 1,
            },
            include: [
              {
                model: db.weekOffDayMappingMaster,
                required: false,
                where: occurrenceDayCondition,
              },
            ],
          },
          {
            model: db.holidayCompanyLocationConfiguration,
            required: false,
            include: {
              model: db.holidayMaster,
              required: true,
              as: "holidayDetails",
              attributes: ["holidayName", "holidayDate"],
              where: {
                isActive: 1,
                holidayDate: lastDayDate,
              },
            },
          },
        ],
        where: {
          isActive: 1,
        },
      });

      await Promise.all(
        existEmployees.map(async (singleEmp) => {
          let presentStatus = null;

          if (singleEmp.weekOffMaster.weekOffDayMappingMasters.length > 0) {
            presentStatus = "weeklyOff";
          } else if (
            singleEmp.holidaycompanylocationconfigurations.length > 0
          ) {
            presentStatus = "holiday";
          } else if (singleEmp.employeeleavetransaction) {
            presentStatus = "leave";
          } else {
            presentStatus = "absent";
          }

          if (singleEmp.attendancemaster) {
            if (singleEmp.attendancemaster.needAttendanceCron == 1) {
              if (
                singleEmp.attendancemaster.attendancePunchInTime &&
                singleEmp.attendancemaster.attendancePunchOutTime
              ) {
                presentStatus = "present";
                let isHalfDay_late_by = null;
                let halfDayFor_late_by = null;
                let isHalfDay_total_work = null;
                let halfDayFor_total_work = null;

                if (
                  singleEmp.attendancePolicymaster
                    .isleaveDeductPolicyLateDuration == 1
                ) {
                  const time = moment.duration(
                    singleEmp.attendancemaster.attendanceLateBy
                  );

                  // Calculate the total minutes
                  let totalMinutesLateMinutes =
                    time.hours() * 60 + time.minutes() + time.seconds() / 60;
                  if (totalMinutesLateMinutes > 0) {
                    totalMinutesLateMinutes =
                      totalMinutesLateMinutes +
                      singleEmp.attendancePolicymaster.graceTimeClockIn; // Adjust Grace time with late by for leave calculation
                  }

                  if (
                    totalMinutesLateMinutes >=
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyLateDurationHalfDayTime &&
                    totalMinutesLateMinutes <
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyLateDurationFullDayTime
                  ) {
                    isHalfDay_late_by = 1;
                    halfDayFor_late_by = 1;
                  } else if (
                    totalMinutesLateMinutes >
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyLateDurationHalfDayTime &&
                    totalMinutesLateMinutes >=
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyLateDurationFullDayTime
                  ) {
                    isHalfDay_late_by = 0;
                    halfDayFor_late_by = 0;
                  }
                }

                if (
                  singleEmp.attendancePolicymaster
                    .isleaveDeductPolicyWorkDuration == 1
                ) {
                  const timeWorkDuration = moment.duration(
                    singleEmp.attendancemaster.attendanceWorkingTime
                  );

                  // Calculate the total minutes
                  const totalMinutesTotalHoursMinutes =
                    timeWorkDuration.hours() * 60 +
                    timeWorkDuration.minutes() +
                    timeWorkDuration.seconds() / 60;

                  if (
                    totalMinutesTotalHoursMinutes <
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyWorkDurationHalfDayTime &&
                    totalMinutesTotalHoursMinutes <
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyWorkDurationFullDayTime
                  ) {
                    isHalfDay_total_work = 0;
                    halfDayFor_total_work = 0;
                  } else if (
                    totalMinutesTotalHoursMinutes >
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyWorkDurationHalfDayTime &&
                    totalMinutesTotalHoursMinutes <
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyWorkDurationFullDayTime
                  ) {
                    isHalfDay_total_work = 1;
                    halfDayFor_total_work = 1;
                  }
                }

                let markHalfDay = null;
                let markHalfDayType = null;
                if (isHalfDay_late_by == 0 || isHalfDay_total_work == 0) {
                  markHalfDay = 0;
                  markHalfDayType = 0;
                } else if (
                  isHalfDay_late_by == 1 &&
                  isHalfDay_total_work == 1
                ) {
                  markHalfDay = 0;
                  markHalfDayType = 0;
                } else if (
                  isHalfDay_late_by == 1 &&
                  isHalfDay_total_work == null
                ) {
                  markHalfDay = 1;
                  markHalfDayType = 1;
                } else if (
                  isHalfDay_late_by == null &&
                  isHalfDay_total_work == 1
                ) {
                  markHalfDay = 1;
                  markHalfDayType = 2;
                }

                if (markHalfDay != null) {
                  let EMP_DATA = await helper.getEmpProfile(singleEmp.id);
                  if (EMP_DATA) {
                    await helper.empMarkLeaveOfGivenDate(
                      singleEmp.id,
                      {
                        employeeId: singleEmp.id, // Replace with actual employee ID
                        attendanceShiftId: singleEmp.shiftsmaster.shiftId, // Replace with actual attendance shift ID
                        attendancePolicyId:
                          singleEmp.attendancePolicymaster.attendancePolicyId, // Replace with actual attendance policy ID
                        leaveAutoId:
                          singleEmp.attendancePolicymaster
                            .leaveDeductPolicyLateDurationLeaveType, // Replace with actual leave auto ID
                        appliedOn: moment(lastDayDate).format("YYYY-MM-DD"), // Replace with actual applied on date
                        appliedFor: lastDayDate, // Replace with actual applied for date
                        fromDate: lastDayDate,
                        toDate: lastDayDate,
                        isHalfDay: markHalfDay, // Replace with actual is half day value (0 or 1)
                        halfDayFor: markHalfDayType, // Replace with actual half day for value
                        leaveCount: markHalfDay == 1 ? 0.5 : 1,
                        status:
                          isHalfDay_total_work == null ? "approved" : "pending", // Replace with actual status
                        reason: "Late By/ Work Duration", // Replace with actual reason
                        message: "Late By/ Work Duration",
                        pendingAt: EMP_DATA.managerData.id, // Replace with actual pending at value
                        createdBy: singleEmp.id, // Replace with actual creator user ID
                        createdAt: moment(), // Replace with actual creation date
                        punchInTime:
                          singleEmp.attendancemaster.attendancePunchInTime,
                        punchOutTime:
                          singleEmp.attendancemaster.attendancePunchOutTime,
                        weekOffId: singleEmp.weekOffMaster
                          ? singleEmp.weekOffMaster.weekOffId
                          : 0,
                      },
                      "id_" + moment().format("YYYYMMDDHHmmss") + singleEmp.id
                    );
                  }
                }
              } else {
                presentStatus = "singlePunchAbsent";
              }
              await db.attendanceMaster.update(
                {
                  attendanceShiftEndDate:
                    moment(lastDayDate).format("YYYY-MM-DD"),
                  attendancePresentStatus: presentStatus,
                  needAttendanceCron: 0,
                  weekOffId: singleEmp.weekOffMaster
                    ? singleEmp.weekOffMaster.weekOffId
                    : 0,
                },
                {
                  where: {
                    attendanceAutoId:
                      singleEmp.attendancemaster.attendanceAutoId,
                  },
                }
              );
            }
          } else {
            await db.attendanceMaster.create({
              attendanceDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
              employeeId: singleEmp.id,
              attendancePolicyId: singleEmp.attendancePolicyId,
              attendanceShiftId: singleEmp.shiftId,
              attendancePresentStatus: presentStatus,
              needAttendanceCron: 0,
              weekOffId: singleEmp.weekOffMaster
                ? singleEmp.weekOffMaster.weekOffId
                : 0,
            });
          }
        })
      );
    } catch (error) {}

    // return respHelper(res, {
    //   status: 200,
    //   data: existEmployees,
    // });
  }

  async attendenceDetails(req, res) {
    try {
      let attendanceData = await db.attendanceMaster.findOne({
        where: {
          employeeId: req.userId,
          attendanceDate: moment().format("YYYY-MM-DD"),
        },
      });

      if (!attendanceData) {
        return respHelper(res, {
          status: 200,
          msg: message.ATTENDANCE_NOT_AVAILABLE,
          data: null,
        });
      } else {
        return respHelper(res, {
          status: 200,
          data: attendanceData,
          msg: message.ATTENDANCE_NOT_AVAILABLE,
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
  async attedanceCronManual(attendanceAutoId, date) {
    try {
      let lastDayDate = moment(date).format("YYYY-MM-DD");
      console.log("date", date);
      console.log("attendanceAutoId", attendanceAutoId);
      let lastDayDateAnotherFormat = moment(date).format("DD-MM-YYYY");
      let parsedDate = moment(lastDayDateAnotherFormat, "DD-MM-YYYY");
      let dayCode = parseInt(moment(date).format("d")) + 1;

      let dayOfMonth = parsedDate.date();
      let occurrence = Math.ceil(dayOfMonth / 7);

      // Output the result
      let occurrenceDayCondition = {};
      switch (occurrence) {
        case 1:
          occurrenceDayCondition = {
            dayId: dayCode,
            isfirstDayOff: 1,
          };
          break;
        case 2:
          occurrenceDayCondition = {
            dayId: dayCode,
            isSecondDayOff: 1,
          };
          break;
        case 3:
          occurrenceDayCondition = {
            dayId: dayCode,
            isThirdyDayOff: 1,
          };
          break;
        case 4:
          occurrenceDayCondition = {
            dayId: dayCode,
            isFourthDayOff: 1,
          };
          break;
        case 5:
          occurrenceDayCondition = {
            dayId: dayCode,
            isFivethDayOff: 1,
          };
          break;
        default:
      }
      const existEmployees = await db.employeeMaster.findAll({
        include: [
          {
            model: db.shiftMaster,
            required: false,
            attributes: [
              "shiftId",
              "shiftName",
              "shiftStartTime",
              "shiftEndTime",
              "isOverNight",
            ],
            where: {
              isActive: 1,
            },
          },
          {
            model: db.attendancePolicymaster,
            required: false,
            where: {
              isActive: 1,
            },
          },
          {
            model: db.attendanceMaster,
            required: false,
            where: {
              attendanceDate: lastDayDate,
              attendanceAutoId: attendanceAutoId,
            },
          },
          {
            model: db.employeeLeaveTransactions,
            required: false,
            where: {
              appliedFor: lastDayDate,
              status: "approved",
            },
          },
          {
            model: db.weekOffMaster,
            required: true,
            include: [
              {
                model: db.weekOffDayMappingMaster,
                required: false,
                where: occurrenceDayCondition,
              },
            ],
          },
          {
            model: db.holidayCompanyLocationConfiguration,
            required: false,
            include: {
              model: db.holidayMaster,
              required: true,
              as: "holidayDetails",
              attributes: ["holidayName", "holidayDate"],
              where: {
                isActive: 1,
                holidayDate: lastDayDate,
              },
            },
          },
        ],
        where: {
          isActive: 1,
        },
      });

      await Promise.all(
        existEmployees.map(async (singleEmp) => {
          let presentStatus = null;

          if (singleEmp.weekOffMaster.weekOffDayMappingMasters.length > 0) {
            presentStatus = "weeklyOff";
          } else if (
            singleEmp.holidaycompanylocationconfigurations.length > 0
          ) {
            presentStatus = "holiday";
          } else if (singleEmp.employeeleavetransaction) {
            presentStatus = "leave";
          } else {
            presentStatus = "absent";
          }

          if (singleEmp.attendancemaster) {
            if (
              singleEmp.attendancemaster.attendancePunchInTime &&
              singleEmp.attendancemaster.attendancePunchOutTime
            ) {
              presentStatus = "present";
              let isHalfDay_late_by = null;
              let halfDayFor_late_by = null;
              let isHalfDay_total_work = null;
              let halfDayFor_total_work = null;

              if (
                singleEmp.attendancePolicymaster
                  .isleaveDeductPolicyLateDuration == 1
              ) {
                const time = moment.duration(
                  singleEmp.attendancemaster.attendanceLateBy
                );

                // Calculate the total minutes
                let totalMinutesLateMinutes =
                  time.hours() * 60 + time.minutes() + time.seconds() / 60;
                console.log("totalMinutesLateMinutes", totalMinutesLateMinutes);
                if (totalMinutesLateMinutes > 0) {
                  totalMinutesLateMinutes =
                    totalMinutesLateMinutes +
                    singleEmp.attendancePolicymaster.graceTimeClockIn; // Adjust Grace time with late by for leave calculation
                }

                if (
                  totalMinutesLateMinutes >=
                    singleEmp.attendancePolicymaster
                      .leaveDeductPolicyLateDurationHalfDayTime &&
                  totalMinutesLateMinutes <
                    singleEmp.attendancePolicymaster
                      .leaveDeductPolicyLateDurationFullDayTime
                ) {
                  isHalfDay_late_by = 1;
                  halfDayFor_late_by = 1;
                } else if (
                  totalMinutesLateMinutes >
                    singleEmp.attendancePolicymaster
                      .leaveDeductPolicyLateDurationHalfDayTime &&
                  totalMinutesLateMinutes >=
                    singleEmp.attendancePolicymaster
                      .leaveDeductPolicyLateDurationFullDayTime
                ) {
                  isHalfDay_late_by = 0;
                  halfDayFor_late_by = 0;
                }
              }

              if (
                singleEmp.attendancePolicymaster
                  .isleaveDeductPolicyWorkDuration == 1
              ) {
                const timeWorkDuration = moment.duration(
                  singleEmp.attendancemaster.attendanceWorkingTime
                );

                // Calculate the total minutes
                const totalMinutesTotalHoursMinutes =
                  timeWorkDuration.hours() * 60 +
                  timeWorkDuration.minutes() +
                  timeWorkDuration.seconds() / 60;

                if (
                  totalMinutesTotalHoursMinutes <
                    singleEmp.attendancePolicymaster
                      .leaveDeductPolicyWorkDurationHalfDayTime &&
                  totalMinutesTotalHoursMinutes <
                    singleEmp.attendancePolicymaster
                      .leaveDeductPolicyWorkDurationFullDayTime
                ) {
                  isHalfDay_total_work = 0;
                  halfDayFor_total_work = 0;
                } else if (
                  totalMinutesTotalHoursMinutes >
                    singleEmp.attendancePolicymaster
                      .leaveDeductPolicyWorkDurationHalfDayTime &&
                  totalMinutesTotalHoursMinutes <
                    singleEmp.attendancePolicymaster
                      .leaveDeductPolicyWorkDurationFullDayTime
                ) {
                  isHalfDay_total_work = 1;
                  halfDayFor_total_work = 1;
                }
              }

              let markHalfDay = null;
              let markHalfDayType = null;
              if (isHalfDay_late_by == 0 || isHalfDay_total_work == 0) {
                markHalfDay = 0;
                markHalfDayType = 0;
              } else if (isHalfDay_late_by == 1 && isHalfDay_total_work == 1) {
                markHalfDay = 0;
                markHalfDayType = 0;
              } else if (
                isHalfDay_late_by == 1 &&
                isHalfDay_total_work == null
              ) {
                markHalfDay = 1;
                markHalfDayType = 1;
              } else if (
                isHalfDay_late_by == null &&
                isHalfDay_total_work == 1
              ) {
                markHalfDay = 1;
                markHalfDayType = 2;
              }

              if (markHalfDay != null) {
                let EMP_DATA = await helper.getEmpProfile(singleEmp.id);
                await helper.empMarkLeaveOfGivenDate(
                  singleEmp.id,
                  {
                    employeeId: singleEmp.id, // Replace with actual employee ID
                    attendanceShiftId: singleEmp.shiftsmaster.shiftId, // Replace with actual attendance shift ID
                    attendancePolicyId:
                      singleEmp.attendancePolicymaster.attendancePolicyId, // Replace with actual attendance policy ID
                    leaveAutoId:
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyLateDurationLeaveType, // Replace with actual leave auto ID
                    appliedOn: moment().format("YYYY-MM-DD"), // Replace with actual applied on date
                    appliedFor: lastDayDate, // Replace with actual applied for date
                    fromDate: lastDayDate,
                    toDate: lastDayDate,
                    isHalfDay: markHalfDay, // Replace with actual is half day value (0 or 1)
                    halfDayFor: markHalfDayType, // Replace with actual half day for value
                    leaveCount: markHalfDay == 1 ? 0.5 : 1,
                    status:
                      isHalfDay_total_work == null ? "approved" : "pending", // Replace with actual status
                    reason: "Late By/ Work Duration", // Replace with actual reason
                    message: "Late By/ Work Duration",
                    pendingAt: EMP_DATA.managerData.id, // Replace with actual pending at value
                    createdBy: singleEmp.id, // Replace with actual creator user ID
                    createdAt: moment(), // Replace with actual creation date
                    weekOffId: singleEmp.weekOffMaster
                      ? singleEmp.weekOffMaster.weekOffId
                      : 0,
                    punchInTime:
                      singleEmp.attendancemaster.attendancePunchInTime,
                    punchOutTime:
                      singleEmp.attendancemaster.attendancePunchOutTime,
                  },
                  "id_" + moment().format("YYYYMMDDHHmmss")
                );
              }
            } else {
              presentStatus = "singlePunchAbsent";
            }
            await db.attendanceMaster.update(
              {
                attendanceShiftEndDate: moment().format("YYYY-MM-DD"),
                attendancePresentStatus: presentStatus,
                needAttendanceCron: 0,
              },
              {
                where: {
                  attendanceAutoId: singleEmp.attendancemaster.attendanceAutoId,
                },
              }
            );
          }
        })
      );
    } catch (error) {}

    // return respHelper(res, {
    //   status: 200,
    //   data: existEmployees,
    // });
  }
  async attedanceCronForEMP(req, res) {
    try {
      let empId = req.body.EMP_ID;
      let date = req.body.DATE;

      let lastDayDate = moment(date).format("YYYY-MM-DD");
      let lastDayDateAnotherFormat = moment(date).format("DD-MM-YYYY");
      let parsedDate = moment(lastDayDateAnotherFormat, "DD-MM-YYYY");
      let dayCode = parseInt(moment(date).format("d")) + 1;

      let dayOfMonth = parsedDate.date();
      let occurrence = Math.ceil(dayOfMonth / 7);

      // Output the result
      let occurrenceDayCondition = {};
      switch (occurrence) {
        case 1:
          occurrenceDayCondition = {
            dayId: dayCode,
            isfirstDayOff: 1,
          };
          break;
        case 2:
          occurrenceDayCondition = {
            dayId: dayCode,
            isSecondDayOff: 1,
          };
          break;
        case 3:
          occurrenceDayCondition = {
            dayId: dayCode,
            isThirdyDayOff: 1,
          };
          break;
        case 4:
          occurrenceDayCondition = {
            dayId: dayCode,
            isFourthDayOff: 1,
          };
          break;
        case 5:
          occurrenceDayCondition = {
            dayId: dayCode,
            isFivethDayOff: 1,
          };
          break;
        default:
      }

      const existEmployees = await db.employeeMaster.findAll({
        include: [
          {
            model: db.shiftMaster,
            required: false,
            attributes: [
              "shiftId",
              "shiftName",
              "shiftStartTime",
              "shiftEndTime",
              "isOverNight",
            ],
            where: {
              isActive: 1,
            },
          },
          {
            model: db.attendancePolicymaster,
            required: false,
            where: {
              isActive: 1,
            },
          },
          {
            model: db.attendanceMaster,
            required: false,
            where: {
              attendanceDate: lastDayDate,
              needAttendanceCron: [0, 1],
            },
          },
          {
            model: db.employeeLeaveTransactions,
            required: false,
            where: {
              appliedFor: lastDayDate,
              status: "approved",
            },
          },
          {
            model: db.weekOffMaster,
            required: true,
            where: {
              isActive: 1,
            },
            include: [
              {
                model: db.weekOffDayMappingMaster,
                required: false,
                where: occurrenceDayCondition,
              },
            ],
          },
          {
            model: db.holidayCompanyLocationConfiguration,
            required: false,
            include: {
              model: db.holidayMaster,
              required: true,
              as: "holidayDetails",
              attributes: ["holidayName", "holidayDate"],
              where: {
                isActive: 1,
                holidayDate: lastDayDate,
              },
            },
          },
        ],
        where: {
          isActive: 1,
        },
      });

      await Promise.all(
        existEmployees.map(async (singleEmp) => {
          let presentStatus = null;

          if (singleEmp.weekOffMaster.weekOffDayMappingMasters.length > 0) {
            presentStatus = "weeklyOff";
          } else if (
            singleEmp.holidaycompanylocationconfigurations.length > 0
          ) {
            presentStatus = "holiday";
          } else if (singleEmp.employeeleavetransaction) {
            presentStatus = "leave";
          } else {
            presentStatus = "absent";
          }

          if (singleEmp.attendancemaster) {
            if (singleEmp.attendancemaster.needAttendanceCron == 1) {
              if (
                singleEmp.attendancemaster.attendancePunchInTime &&
                singleEmp.attendancemaster.attendancePunchOutTime
              ) {
                presentStatus = "present";
                let isHalfDay_late_by = null;
                let halfDayFor_late_by = null;
                let isHalfDay_total_work = null;
                let halfDayFor_total_work = null;

                if (
                  singleEmp.attendancePolicymaster
                    .isleaveDeductPolicyLateDuration == 1
                ) {
                  const time = moment.duration(
                    singleEmp.attendancemaster.attendanceLateBy
                  );

                  // Calculate the total minutes
                  let totalMinutesLateMinutes =
                    time.hours() * 60 + time.minutes() + time.seconds() / 60;
                  if (totalMinutesLateMinutes > 0) {
                    totalMinutesLateMinutes =
                      totalMinutesLateMinutes +
                      singleEmp.attendancePolicymaster.graceTimeClockIn; // Adjust Grace time with late by for leave calculation
                  }

                  if (
                    totalMinutesLateMinutes >=
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyLateDurationHalfDayTime &&
                    totalMinutesLateMinutes <
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyLateDurationFullDayTime
                  ) {
                    isHalfDay_late_by = 1;
                    halfDayFor_late_by = 1;
                  } else if (
                    totalMinutesLateMinutes >
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyLateDurationHalfDayTime &&
                    totalMinutesLateMinutes >=
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyLateDurationFullDayTime
                  ) {
                    isHalfDay_late_by = 0;
                    halfDayFor_late_by = 0;
                  }
                }

                if (
                  singleEmp.attendancePolicymaster
                    .isleaveDeductPolicyWorkDuration == 1
                ) {
                  const timeWorkDuration = moment.duration(
                    singleEmp.attendancemaster.attendanceWorkingTime
                  );

                  // Calculate the total minutes
                  const totalMinutesTotalHoursMinutes =
                    timeWorkDuration.hours() * 60 +
                    timeWorkDuration.minutes() +
                    timeWorkDuration.seconds() / 60;

                  if (
                    totalMinutesTotalHoursMinutes <
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyWorkDurationHalfDayTime &&
                    totalMinutesTotalHoursMinutes <
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyWorkDurationFullDayTime
                  ) {
                    isHalfDay_total_work = 0;
                    halfDayFor_total_work = 0;
                  } else if (
                    totalMinutesTotalHoursMinutes >
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyWorkDurationHalfDayTime &&
                    totalMinutesTotalHoursMinutes <
                      singleEmp.attendancePolicymaster
                        .leaveDeductPolicyWorkDurationFullDayTime
                  ) {
                    isHalfDay_total_work = 1;
                    halfDayFor_total_work = 1;
                  }
                }

                let markHalfDay = null;
                let markHalfDayType = null;
                if (isHalfDay_late_by == 0 || isHalfDay_total_work == 0) {
                  markHalfDay = 0;
                  markHalfDayType = 0;
                } else if (
                  isHalfDay_late_by == 1 &&
                  isHalfDay_total_work == 1
                ) {
                  markHalfDay = 0;
                  markHalfDayType = 0;
                } else if (
                  isHalfDay_late_by == 1 &&
                  isHalfDay_total_work == null
                ) {
                  markHalfDay = 1;
                  markHalfDayType = 1;
                } else if (
                  isHalfDay_late_by == null &&
                  isHalfDay_total_work == 1
                ) {
                  markHalfDay = 1;
                  markHalfDayType = 2;
                }

                if (markHalfDay != null) {
                  let EMP_DATA = await helper.getEmpProfile(singleEmp.id);

                  if (EMP_DATA) {
                    await helper.empMarkLeaveOfGivenDate(
                      singleEmp.id,
                      {
                        employeeId: singleEmp.id, // Replace with actual employee ID
                        attendanceShiftId: singleEmp.shiftsmaster.shiftId, // Replace with actual attendance shift ID
                        attendancePolicyId:
                          singleEmp.attendancePolicymaster.attendancePolicyId, // Replace with actual attendance policy ID
                        leaveAutoId:
                          singleEmp.attendancePolicymaster
                            .leaveDeductPolicyLateDurationLeaveType, // Replace with actual leave auto ID
                        appliedOn: moment().format("YYYY-MM-DD"), // Replace with actual applied on date
                        appliedFor: lastDayDate, // Replace with actual applied for date
                        fromDate: lastDayDate,
                        toDate: lastDayDate,
                        isHalfDay: markHalfDay, // Replace with actual is half day value (0 or 1)
                        halfDayFor: markHalfDayType, // Replace with actual half day for value
                        leaveCount: markHalfDay == 1 ? 0.5 : 1,
                        status:
                          isHalfDay_total_work == null ? "approved" : "pending", // Replace with actual status
                        reason: "Late By/ Work Duration", // Replace with actual reason
                        message: "Late By/ Work Duration",
                        pendingAt: EMP_DATA.managerData.id, // Replace with actual pending at value
                        createdBy: singleEmp.id, // Replace with actual creator user ID
                        createdAt: moment(), // Replace with actual creation date
                        punchInTime:
                          singleEmp.attendancemaster.attendancePunchInTime,
                        punchOutTime:
                          singleEmp.attendancemaster.attendancePunchOutTime,
                        weekOffId: singleEmp.weekOffMaster
                          ? singleEmp.weekOffMaster.weekOffId
                          : 0,
                      },
                      "id_" + moment().format("YYYYMMDDHHmmss") + singleEmp.id
                    );
                  }
                }
              } else {
                presentStatus = "singlePunchAbsent";
              }
              await db.attendanceMaster.update(
                {
                  attendanceShiftEndDate:
                    moment(lastDayDate).format("YYYY-MM-DD"),
                  attendancePresentStatus: presentStatus,
                  needAttendanceCron: 0,
                  weekOffId: singleEmp.weekOffMaster
                    ? singleEmp.weekOffMaster.weekOffId
                    : 0,
                },
                {
                  where: {
                    attendanceAutoId:
                      singleEmp.attendancemaster.attendanceAutoId,
                  },
                }
              );
            }
          } else {
            await db.attendanceMaster.create({
              attendanceDate: moment(lastDayDate).format("YYYY-MM-DD"),
              employeeId: singleEmp.id,
              attendancePolicyId: singleEmp.attendancePolicyId,
              attendanceShiftId: singleEmp.shiftId,
              attendancePresentStatus: presentStatus,
              needAttendanceCron: 0,
              weekOffId: singleEmp.weekOffMaster
                ? singleEmp.weekOffMaster.weekOffId
                : 0,
            });
          }
        })
      );
    } catch (error) {}

    // return respHelper(res, {
    //   status: 200,
    //   data: existEmployees,
    // });
  }
}

export default new AttendanceController();
