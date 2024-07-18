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
class AttendanceController {
  async attendance(req, res) {
    try {
      const result = await validator.attendanceSchema.validateAsync(req.body);
      const currentDate = moment();

      const d = new Date();

      let data = result;
      result.time =
        d.getHours() + "::" + d.getMinutes() + "::" + d.getSeconds();
      const finalDate =
        d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
      let user = JSON.stringify(data);
      fs.appendFileSync(
        cwd() + "/uploads/RAG/" + finalDate + "USER_ATTENDANCE_LOG.txt",
        user + "\n"
      );

      const existEmployee = await db.employeeMaster.findOne({
        where: {
          id: req.userId,
        },
        attributes: ["empCode", "name", "email"],
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
            return;
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
          };
          await db.attendanceMaster.create(creationObject);
          return respHelper(res, {
            status: 200,
            msg: message.PUNCH_IN_SUCCESS,
          });
        }
      } else {
        console.log("time", currentDate.format("HH:mm:ss"));
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
          if (currentDate.format("HH:mm") < finalShiftStartTime) {
            // campare shift time and current time inclu
            return respHelper(res, {
              status: 400,
              msg: message.SHIFT.SHIFT_TIME_INVALID,
            });
            return;
          }

          let graceTime = moment(
            existEmployee.shiftsmaster.shiftEndTime,
            "HH:mm"
          ); // set shift start time

          graceTime.add(
            existEmployee.attendancePolicymaster.bufferTimePost,
            "minutes"
          ); // Add buffer time  to the selected time if buffer allow

          const withGraceTime = graceTime.format("HH:mm");

          if (currentDate.format("HH:mm") > withGraceTime) {
            // campare shift time and current time inclu
            return respHelper(res, {
              status: 400,
              msg: message.SHIFT.SHIFT_TIME_INVALID,
            });
            return;
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
        attendanceData.dataValues.latest_Regularization_Request[0]
          .regularizeStatus === "Pending"
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

  async attendenceDetails(req,res){
    try {
      console.log("req.params.employeeId",req.params.employeeId)
        let attendanceData = await db.attendanceMaster.findOne({
        where: {
          employeeId: req.params.employeeId,
          attendanceDate:moment().format('YYYY-MM-DD')
        }
      });

      if (!attendanceData) {
        return respHelper(res, {
          status: 404,
          msg: message.ATTENDANCE_NOT_AVAILABLE,
        });
      }
      else{
        return respHelper(res, {
          status: 200,
          data: attendanceData,
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
  async attendanceList(req, res) {
    try {
      const user = req.query.user;
      const year = req.query.year;
      const month = req.query.month;

      let averageWorkingTime = [];
      let calculateLateTime = [];
      let calculateleaveDays = [];
      let calculateUnpaidleaveDays = [];
      let calculatePresentDays = [];
      let calculateAbsentDays = [];
      let calculateSinglePunchAbsent = [];
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
              {
                [Op.lte]: `${year}-${month}-${moment(
                  `${year}-${month}`,
                  "YYYY-MM"
                ).daysInMonth()}`,
              },
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
            row: true,
            as: "latest_Regularization_Request",
            attributes: ["regularizeStatus", "regularizeId"],
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
              where: {
                isActive: 1,
              },
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
            limit: 1,
            where: {
              status: ["pending", "approved"],
              employeeId: user ? user : req.userId,
            },
            include: {
              model: db.leaveMaster,
              required: false,
              as: "leaveMasterDetails",
              attributes: ["leaveName", "leaveCode"],
            },
          },
        ],
      });

      for (const iterator of attendanceData.rows) {
        if (iterator.dataValues.attendanceWorkingTime) {
          averageWorkingTime.push(iterator.dataValues.attendanceWorkingTime);
        }
        if (
          iterator.dataValues.attendanceLateBy &&
          iterator.dataValues.attendanceLateBy != "00:00:00"
        ) {
          calculateLateTime.push(iterator.dataValues.attendanceLateBy);
        }

        switch (iterator.dataValues.attendancePresentStatus) {
          case "absent":
            calculateAbsentDays.push(iterator.dataValues.attendanceAutoId);
            break;
          case "present":
            calculatePresentDays.push(iterator.dataValues.attendanceAutoId);
            break;
          case "singlePunchAbsent":
            calculateSinglePunchAbsent.push(
              iterator.dataValues.attendanceAutoId
            );
            break;
          case "leave":
            calculateleaveDays.push(iterator.dataValues.attendanceAutoId);
            break;
          case "unpaidLeave":
            calculateUnpaidleaveDays.push(iterator.dataValues.attendanceAutoId);
            break;
        }
      }

      return respHelper(res, {
        status: 200,
        data: {
          statics: {
            lateTime: helper.calculateTime(calculateLateTime),
            averageWorkingTime:
              helper.calculateAverageHours(averageWorkingTime),
            absentDays: calculateAbsentDays.length,
            presentDays: calculatePresentDays.length,
            singlePunchAbsentDays: calculateSinglePunchAbsent.length,
            leaveDays: calculateleaveDays.length,
            unpaidLeaveDays: calculateUnpaidleaveDays.length,
          },
          attendanceData,
        },
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async attendanceListNew(req, res) {
    try {
      const user = req.query.user;
      const year = req.query.year;
      const month = req.query.month;
      const companyLocationId = req.userData.companyLocationId;

      if (!year || !month) {
        return respHelper(res, {
          status: 400,
          msg: "Please Fill Month and Year",
        });
      }

      const getLocationBasedHolidays =
        await db.holidayCompanyLocationConfiguration.findAll({
          where: {
            companyLocationId: companyLocationId,
          },
          include: [
            {
              model: db.holidayMaster,
              required: true,
              as: "holidayDetails",
              attributes: ["holidayName", "holidayDate"],
              where: {
                isActive: 1,
              },
            },
          ],
        });

      const monthDays = await db.CalenderYear.findAll({
        attributes: ["calenderId", "date", "year", "month", "fullDate"],
        where: {
          month: month,
          year: year,
        },
      });

      const attendanceData = await db.attendanceMaster.findAll({
        where: {
          employeeId: user ? user : req.userId,
          attendanceDate: {
            [Op.and]: [
              { [Op.gte]: `${year}-${month}-01` },
              {
                [Op.lte]: `${year}-${month}-${moment(
                  `${year}-${month}`,
                  "YYYY-MM"
                ).daysInMonth()}`,
              },
            ],
          },
        },
        attributes: {
          exclude: ["createdBy", "createdAt", "updatedBy", "updatedAt"],
        },
      });

      let holidayDates = {};

      getLocationBasedHolidays.forEach((locationHoliday) => {
        if (locationHoliday.holidayDetails) {
          holidayDates[locationHoliday.holidayDetails.holidayDate] = {
            holidayDate: locationHoliday.holidayDetails.holidayDate,
            holidayName: locationHoliday.holidayDetails.holidayName,
          };
        }
      });

      
      const attendanceMap = attendanceData.reduce((map, record) => {
        map[record.attendanceDate] = record;
        return map;
      }, {});

      const result = monthDays.map((day) => {
        const attendance = attendanceMap[day.fullDate] || null;
        const holiday = holidayDates[day.fullDate] || null;

        return {
          attendanceAutoId: attendance ? attendance.attendanceAutoId : null,
          employeeId: attendance ? attendance.employeeId : null,
          attendanceShiftId: attendance ? attendance.attendanceShiftId : null,
          attendancePolicyId: attendance ? attendance.attendancePolicyId : null,
          attendanceRegularizeId: attendance
            ? attendance.attendanceRegularizeId
            : null,
          attendanceDate: attendance ? attendance.attendanceDate : day.fullDate,
          attandanceShiftStartDate: attendance
            ? attendance.attandanceShiftStartDate
            : null,
          attendanceShiftEndDate: attendance
            ? attendance.attendanceShiftEndDate
            : null,
          attendancePunchInTime: attendance
            ? attendance.attendancePunchInTime
            : null,
          attendancePunchOutTime: attendance
            ? attendance.attendancePunchOutTime
            : null,
          attendanceLateBy: attendance ? attendance.attendanceLateBy : null,
          attendancePunchInRemark: attendance
            ? attendance.attendancePunchInRemark
            : null,
          attendancePunchOutRemark: attendance
            ? attendance.attendancePunchOutRemark
            : null,
          attendancePunchInLocationType: attendance
            ? attendance.attendancePunchInLocationType
            : null,
          attendancePunchOutLocationType: attendance
            ? attendance.attendancePunchOutLocationType
            : null,
          attendanceStatus: attendance ? attendance.attendanceStatus : null,
          attendancePresentStatus: attendance
            ? attendance.attendancePresentStatus
            : "NA",
          attendanceRegularizeStatus: attendance
            ? attendance.attendanceRegularizeStatus
            : null,
          attendanceManagerUpdateDate: attendance
            ? attendance.attendanceManagerUpdateDate
            : null,
          attendancePunchInLocation: attendance
            ? attendance.attendancePunchInLocation
            : null,
          attendancePunchInLatitude: attendance
            ? attendance.attendancePunchInLatitude
            : null,
          attendancePunchInLongitude: attendance
            ? attendance.attendancePunchInLongitude
            : null,
          attendancePunchOutLocation: attendance
            ? attendance.attendancePunchOutLocation
            : null,
          attendancePunchOutLatitude: attendance
            ? attendance.attendancePunchOutLatitude
            : null,
          attendancePunchOutLongitude: attendance
            ? attendance.attendancePunchOutLongitude
            : null,
          attendanceWorkingTime: attendance
            ? attendance.attendanceWorkingTime
            : null,
          attendanceRegularizeCount: attendance
            ? attendance.attendanceRegularizeCount
            : null,
          employeeLeaveTransactionsId: attendance
            ? attendance.employeeLeaveTransactionsId
            : null,
          needAttendanceCron: attendance ? attendance.needAttendanceCron : null,
          holidayCompanyLocationConfigurationID: attendance
            ? attendance.holidayCompanyLocationConfigurationID
            : null,
            holidayLocationMappingDetails: holiday ? [holiday] : [],
        };
      });

      return respHelper(res, {
        status: 200,
        data: result,
        // data: getLocationBasedHolidays,

        // data: {
        //   attendanceData: result,
        // },
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

      // const regularizeData = await db.regularizationMaster.findOne({
      //   raw: true,
      //   where: {
      //     regularizeId: result.regularizeId,
      //   },
      // });
      const regularizeData = await db.regularizationMaster.findOne({
        raw: true,
        where: {
          regularizeId: result.regularizeId,
        },
        include: [
          {
            model: db.attendanceMaster,
            attributes:['attendanceAutoId','employeeId'],
            include:[{
              model:db.employeeMaster,
              attributes:['attendancePolicyId'],
              include:[
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
                },{
                  model: db.attendancePolicymaster,
                  attributes:['graceTimeClockIn'],
                  where: {
                    isActive: true,
                  },
                }]
            }]
          }]
      });

      let graceTime = moment(
        regularizeData['attendancemaster.employee.shiftsmaster.shiftStartTime'],
        "HH:mm"
      ); // set shift start time

      graceTime.add(
        regularizeData['attendancemaster.employee.attendancePolicymaster.graceTimeClockIn'],
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
            attendanceWorkingTime: await helper.timeDifference(
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
      } else {
        await db.attendanceMaster.update(
          {
            attendanceRegularizeStatus: "Rejected",
            attendancePresentStatus: "absent",
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
      const query = req.query.listFor;

      const regularizeList = await db.regularizationMaster.findAll({
        where: Object.assign(
          query === "raisedByMe"
            ? {
                createdBy: req.userId,
              }
            : {
                regularizeManagerId: req.userId,
              },
          {
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

      console.log({
        name: `${regularizeData.dataValues.attendancemaster.employee.name} (${regularizeData.dataValues.attendancemaster.employee.empCode})`,
        email: regularizeData.dataValues.attendancemaster.employee.email,
        attendanceDate: moment(
          regularizeData.dataValues.attendancemaster.attendanceDate
        ).format("MMMM DD, YYYY"),
        managerName: `${regularizeData.dataValues.attendancemaster.employee.managerData.name} (${regularizeData.dataValues.attendancemaster.employee.managerData.empCode})`,
        // email: regularizeData.dataValues.attendancemaster.employee.managerData.email
      });

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
          name: `${regularizeData.dataValues.attendancemaster.employee.name} (${regularizeData.dataValues.attendancemaster.employee.empCode})`,
          email: regularizeData.dataValues.attendancemaster.employee.email,
          attendanceDate: moment(
            regularizeData.dataValues.attendancemaster.attendanceDate
          ).format("MMMM DD, YYYY"),
          managerName: `${regularizeData.dataValues.attendancemaster.employee.managerData.name} (${regularizeData.dataValues.attendancemaster.employee.managerData.empCode})`,
          // email: regularizeData.dataValues.attendancemaster.employee.managerData.email
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
  async generateCalendarForEmp(req, res) {
    try {
      const year = new Date().getFullYear();
      const daysInYear = moment([year]).isLeapYear() ? 366 : 365;
      let fullData = [];

      for (let day = 1; day <= daysInYear; day++) {
        const date = moment().year(year).dayOfYear(day);
        let calObj = {
          year: date.year(),
          month: date.format("MM"), // moment months are 0-based
          date: date.date(),
          fullDate: date.format("YYYY-MM-DD"),
        };
        fullData.push(calObj);
      }
      await db.CalenderYear.bulkCreate(fullData);
      return respHelper(res, {
        status: 200,
        msg: "success",
        data: {},
      });
    } catch (error) {
      return respHelper(res, {
        status: 500,
      });
    }
    return;
    for (let employee of employees) {
      let insertionData = [];
      for (let date of dates) {
        let holidayOnDate =
          await db.holidayCompanyLocationConfiguration.findOne({
            attributes: ["holidayCompanyLocationConfigurationID"],
            where: {
              companyLocationId: employee.companyLocationId,
            },
            include: {
              model: db.holidayMaster,
              attributes: ["holidayId", "holidayName", "holidayDate"],
              required: true,
              as: "holidayDetails",
              where: {
                holidayDate: date,
              },
            },
          });

        insertionData.push({
          attendanceDate: date,
          employeeId: employee.id,
          attandanceShiftStartDate: null,
          attendanceShiftEndDate: null,
          attendanceShiftId: employee.shiftId,
          attendancePunchInTime: null,
          attendancePunchOutTime: null,
          attendanceStatus: "NA",
          attendanceLateBy: "",
          attendancePresentStatus: "NA",
          attendancePunchInRemark: "",
          attendancePunchInLocationType: "",
          attendancePunchInLocation: "",
          attendancePunchInLatitude: "",
          attendancePunchInLongitude: "",
          createdBy: employee.id,
          attendancePolicyId: employee.attendancePolicyId,
          holidayCompanyLocationConfigurationID: holidayOnDate
            ? holidayOnDate.holidayCompanyLocationConfigurationID
            : 0,
          needAttendanceCron: 0,
          attendanceRegularizeCount: 0,
          employeeLeaveTransactionsId: 0,
          attendanceRegularizeId: 0,
        });
      }
      if (insertionData.length > 0) {
        await db.attendanceMaster.bulkCreate(insertionData);
      }
    }

    return respHelper(res, {
      status: 200,
      data: { whereCondition },
      msg: "hello",
    });
    console.log("");
  }
}

export default new AttendanceController();
