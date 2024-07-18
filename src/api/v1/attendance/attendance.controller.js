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
          isActive: 1,
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

          const withGraceTime = graceTime.format("HH:mm");

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
            limit: 2,
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
  async attedanceCron() {
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
        isActive: 1
      },
    });
console.log("existEmployees",existEmployees)
    await Promise.all(
      existEmployees.map(async (singleEmp) => {
        let presentStatus = null;

        if (singleEmp.weekOffMaster.weekOffDayMappingMasters.length > 0) {
          presentStatus = "weeklyOff";
        } else if (singleEmp.holidayCompanyLocationConfigurations.length > 0) {
          presentStatus = "holiday";
        } else if (singleEmp.employeeLeaveTransaction) {
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
              const totalMinutesLateMinutes =
                time.hours() * 60 + time.minutes() + time.seconds() / 60;

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

              console.log(
                "totalMinutesTotalHoursMinutes",
                totalMinutesTotalHoursMinutes
              );

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
                totalMinutesTotalHoursMinutes <
                singleEmp.attendancePolicymaster
                  .leaveDeductPolicyWorkDurationHalfDayTime
              ) {
                isHalfDay_total_work = 1;
                halfDayFor_total_work = 1;
              }
            }

            let markHalfDay = null;
            let markHalfDayType = null;
            if (isHalfDay_late_by == 0 || halfDayFor_late_by == 0) {
              markHalfDay = 0;
              markHalfDayType = 0;
            } else if (isHalfDay_late_by == 1 && isHalfDay_total_work == 1) {
              markHalfDay = 0;
              markHalfDayType = 0;
            } else if (isHalfDay_late_by == 1 && isHalfDay_total_work == null) {
              markHalfDay = 1;
              markHalfDayType = 1;
            } else if (isHalfDay_late_by == null && isHalfDay_total_work == 1) {
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
                  isHalfDay: markHalfDay, // Replace with actual is half day value (0 or 1)
                  halfDayFor: markHalfDayType, // Replace with actual half day for value
                  leaveCount: markHalfDay == 1 ? 0.5 : 1,
                  status: "pending", // Replace with actual status
                  reason: "Late By/ Work Duration", // Replace with actual reason
                  message: "Late By/ Work Duration",
                  pendingAt: EMP_DATA.managerData.id, // Replace with actual pending at value
                  createdBy: singleEmp.id, // Replace with actual creator user ID
                  createdAt: moment(), // Replace with actual creation date
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
              needAttendanceCron: 1,
            },
            {
              where: {
                attendanceAutoId: singleEmp.attendancemaster.attendanceAutoId,
              },
            }
          );
        } else {
          await db.attendanceMaster.create({
            attendanceDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
            employeeId: singleEmp.id,
            attendancePolicyId: singleEmp.attendancePolicyId,
            attendanceShiftId: singleEmp.shiftId,
            attendancePresentStatus: presentStatus,
          });
        }
      })
    );

    // return respHelper(res, {
    //   status: 200,
    //   data: existEmployees,
    // });
  }
}

export default new AttendanceController();
