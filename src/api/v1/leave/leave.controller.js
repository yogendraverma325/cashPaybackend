import respHelper from "../../../helper/respHelper.js";
import db from "../../../config/db.config.js";
import moment from "moment";
import message from "../../../constant/messages.js";
import validator from "../../../helper/validator.js";
import helper from "../../../helper/helper.js";
import eventEmitter from "../../../services/eventService.js";
import { Op, fn, col } from "sequelize";
import fs from "fs";
import { cwd } from "process";
var _this = this;

class LeaveController {
  async history(req, res) {
    try {
      const user = req.query.user;
      const year = req.query.year;
      const month = req.query.month;

      const attendanceData = await db.employeeLeaveTransactions.findAndCountAll(
        {
          where: {
            employeeId: user ? user : req.userId,
            appliedFor: {
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
        }
      );

      return respHelper(res, {
        status: 200,
        data: attendanceData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }
  async leaveMapping(req, res) {
    try {
      const userId = req.query.user || req.userId;
      let leaveData = await helper.empLeaveDetails(userId, 0);
      return respHelper(res, {
        status: 200,
        data: leaveData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async leaveRequestList(req, res) {
    try {
      const query = req.query.listFor;

      const regularizeList = await db.employeeLeaveTransactions.findAll({
        where: Object.assign(
          query === "raisedByMe"
            ? {
                employeeId: req.userId,
                status: "pending",
              }
            : { pendingAt: req.userId, status: "pending" }
        ),
        attributes: { exclude: ["createdBy", "updatedBy", "updatedAt"] },
        include: [
          {
            model: db.employeeMaster,
            attributes: ["empCode", "name"],
          },
          {
            model: db.leaveMaster,
            required: false,
            as: "leaveMasterDetails",
            attributes: ["leaveName", "leaveCode"],
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
  async updateLeaveRequest(req, res) {
    try {
      const result = await validator.updateLeaveRequest.validateAsync(req.body);
      let leaveIds = result.employeeLeaveTransactionsIds.split(",");
      let countLeave = await db.employeeLeaveTransactions.count({
        where: {
          status: "pending",
          pendingAt: req.userId,
          employeeLeaveTransactionsId: leaveIds,
        },
      });

      if (leaveIds.length != countLeave) {
        return respHelper(res, {
          status: 402,
          msg: message.LEAVE.NO_UPDATE,
        });
      }
      await db.employeeLeaveTransactions.update(
        {
          status: result.status,
          updatedBy: req.userId,
          updatedAt: moment(),
        },
        {
          where: {
            employeeLeaveTransactionsId: leaveIds,
          },
        }
      );
      if (result.status == "approved") {
        for (const leaveID of leaveIds) {
          const existingRecord = await db.employeeLeaveTransactions.findOne({
            where: { employeeLeaveTransactionsId: leaveID },
          });

          if (existingRecord) {
            await db.attendanceMaster.update(
              { employeeLeaveTransactionsId: leaveID },
              {
                where: {
                  attendanceDate: existingRecord.appliedFor,
                  employeeId: existingRecord.employeeId,
                },
              }
            );

            if (existingRecord.leaveAutoId === 6) {
              const lwpLeave = await db.leaveMapping.findOne({
                where: {
                  EmployeeId: existingRecord.employeeId,
                  leaveAutoId: existingRecord.leaveAutoId,
                },
              });

              if (lwpLeave) {
                await db.leaveMapping.increment(
                  { accruedThisYear: parseFloat(existingRecord.leaveCount) },
                  {
                    where: {
                      EmployeeId: existingRecord.employeeId,
                      leaveAutoId: existingRecord.leaveAutoId,
                    },
                  }
                );
              } else {
                await db.leaveMapping.create({
                  EmployeeId: existingRecord.employeeId,
                  leaveAutoId: existingRecord.leaveAutoId,
                  availableLeave: 0,
                  accruedThisYear: parseFloat(existingRecord.leaveCount),
                  creditedFromLastYear: 0,
                  annualAllotment: 0,
                });
              }
            } else {
              await db.leaveMapping.increment(
                { accruedThisYear: parseFloat(existingRecord.leaveCount) },
                {
                  where: {
                    EmployeeId: existingRecord.employeeId,
                    leaveAutoId: existingRecord.leaveAutoId,
                  },
                }
              );
              await db.leaveMapping.increment(
                { availableLeave: -parseFloat(existingRecord.leaveCount) },
                {
                  where: {
                    EmployeeId: existingRecord.employeeId,
                    leaveAutoId: existingRecord.leaveAutoId,
                  },
                }
              );
            }
          }
          //  else {
          // await db.User.create(record, { transaction });
          // }
        }
      }

      return respHelper(res, {
        status: 200,
        data: countLeave,
        msg: message.UPDATE_SUCCESS.replace("<module>", "Leave"),
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
  //   async requestForLeave(req, res) {
  //     try {
  //       const result = await validator.leaveRequestSchema.validateAsync(req.body);

  //       const leaveCountForDates = await db.employeeLeaveTransactions.findAll({
  //         where: {
  //           appliedFor: {
  //             [Op.between]: [req.body.fromDate, req.body.toDate],
  //           },
  //           status: {
  //             [Op.ne]: "revoked",
  //           },
  //           employeeId: req.body.employeeId,
  //         },
  //       });

  //       const fromDateReq = req.body.fromDate;
  //       const toDateReq = req.body.toDate;
  //       const daysDifferenceReq = moment(toDateReq).diff(
  //         moment(fromDateReq),
  //         "days"
  //       );
  //       if (daysDifferenceReq > parseInt(process.env.LEAVE_LIMIT)) {
  //         return respHelper(res, {
  //           status: 404,
  //           data: {},
  //           msg: message.LEAVE.LEAVE_LIMIT,
  //         });
  //       }
  //       var inputs = [];
  //       for (let i = -1; i < daysDifferenceReq; i++) {
  //         let appliedFor = moment(fromDateReq)
  //           .add(i + 1, "days")
  //           .format("YYYY-MM-DD");

  //         let halfDayFor = 0;
  //         let isHalfDay = 0;

  //         if (daysDifferenceReq == 0) {
  //           isHalfDay = req.body.firstDayHalf != 0 ? 1 : 0;
  //           halfDayFor = req.body.firstDayHalf;
  //         } else {
  //           if (i + 1 == 0) {
  //             isHalfDay = req.body.firstDayHalf != 0 ? 1 : 0;
  //             halfDayFor = req.body.firstDayHalf;
  //           } else if (i + 1 == daysDifferenceReq) {
  //             isHalfDay = req.body.lastDayHalf != 0 ? 1 : 0;
  //             halfDayFor = req.body.lastDayHalf;
  //           }
  //         }
  //         inputs = leaveCountForDates.filter((el) => {
  //           if (el.appliedFor == appliedFor) {
  //             if (el.isHalfDay == 1) {
  //               if (halfDayFor == 0) {
  //                 return true;
  //               } else {
  //                 if (el.halfDayFor == halfDayFor) {
  //                   return true;
  //                 } else {
  //                   return false;
  //                 }
  //               }
  //             } else {
  //               return true;
  //             }
  //           } else {
  //             return true;
  //           }
  //         });
  //       }
  //       if (inputs.length > 0) {
  //         return respHelper(res, {
  //           status: 402,
  //           msg: message.LEAVE.DATES_NOT_APPLICABLE,
  //         });
  //       }
  //       let EMP_DATA = await helper.getEmpProfile(req.body.employeeId);
  //       let leaveData = await helper.empLeaveDetails(
  //         req.body.employeeId,
  //         req.body.leaveAutoId
  //       );

  //       const fromDate = req.body.fromDate;
  //       const toDate = req.body.toDate;
  //       let arr = [];
  //       let leaveDays = 0;
  //       const daysDifference = moment(toDate).diff(moment(fromDate), "days");
  //       let uuid = "id_" + moment().format("YYYYMMDDHHmmss");
  //       for (let i = -1; i < daysDifference; i++) {

  //         let appliedFor = moment(fromDate)
  //           .add(i + 1, "days")
  //           .format("YYYY-MM-DD");
  // console.log("appliedForappliedForappliedFor",appliedFor)
  //         let halfDayFor = 0;
  //         let isHalfDay = 0;

  //         if (daysDifference == 0) {
  //           isHalfDay = req.body.firstDayHalf != 0 ? 1 : 0;
  //           halfDayFor = req.body.firstDayHalf;
  //         } else {
  //           if (i + 1 == 0) {
  //             isHalfDay = req.body.firstDayHalf != 0 ? 1 : 0;
  //             halfDayFor = req.body.firstDayHalf;
  //           } else if (i + 1 == daysDifference) {
  //             isHalfDay = req.body.lastDayHalf != 0 ? 1 : 0;
  //             halfDayFor = req.body.lastDayHalf;
  //           }
  //         }

  //         if (isHalfDay) {
  //           leaveDays += 0.5;
  //         } else {
  //           leaveDays += 1;
  //         }

  //         let leaveId = 6;
  //         if (leaveData) {
  //           leaveId = req.body.leaveAutoId;
  //           if (leaveId != 6) {
  //             let pendingLeaveCountList =
  //               await db.employeeLeaveTransactions.findAll({
  //                 where: {
  //                   status: "pending",
  //                   employeeId: req.body.employeeId,
  //                   leaveAutoId: leaveId,
  //                 },
  //               });
  //             let pendingLeaveCount = 0;
  //             pendingLeaveCountList.map((el) => {
  //               pendingLeaveCount += parseFloat(el.leaveCount);
  //             });

  //             if (
  //               pendingLeaveCount + leaveDays >=
  //               parseFloat(leaveData.availableLeave)
  //             ) {
  //               leaveId = 6;
  //             }
  //           }
  //         }
  //         const recordData = {
  //           employeeId: req.body.employeeId, // Replace with actual employee ID
  //           attendanceShiftId: EMP_DATA.shiftId, // Replace with actual attendance shift ID
  //           attendancePolicyId: EMP_DATA.attendancePolicyId, // Replace with actual attendance policy ID
  //           leaveAutoId: leaveId, // Replace with actual leave auto ID
  //           appliedOn: moment().format("YYYY-MM-DD"), // Replace with actual applied on date
  //           appliedFor: appliedFor, // Replace with actual applied for date
  //           isHalfDay: isHalfDay, // Replace with actual is half day value (0 or 1)
  //           halfDayFor: halfDayFor, // Replace with actual half day for value
  //           status: "pending", // Replace with actual status
  //           reason: req.body.reason, // Replace with actual reason
  //           leaveCount: isHalfDay == 1 ? 0.5 : 1,
  //           message: req.body.message,
  //           leaveAttachment:
  //             result.attachment != ""
  //               ? await helper.fileUpload(
  //                 result.attachment,
  //                 `leaveAttachment_${uuid}`,
  //                 `uploads/${EMP_DATA.empCode}`
  //               )
  //               : null,
  //           pendingAt: EMP_DATA.managerData.id, // Replace with actual pending at value
  //           createdBy: req.userId, // Replace with actual creator user ID
  //           createdAt: moment(), // Replace with actual creation date
  //           batch_id: uuid,
  //         };
  //         arr.push(recordData);

  //         //const record = await db.employeeLeaveTransactions.create(recordData);
  //       }

  //       return respHelper(res, {
  //         status: 200,
  //         data: arr,
  //         msg: message.LEAVE.RECORDED,
  //       });
  //     } catch (error) {
  //       if (error.isJoi === true) {
  //         return respHelper(res, {
  //           status: 422,
  //           msg: error.details[0].message,
  //         });
  //       }
  //       console.log("error", error);
  //       return respHelper(res, {
  //         status: 500,
  //       });
  //     }
  //   }
  async requestForLeave(req, res) {
    try {
      const result = await validator.leaveRequestSchema.validateAsync(req.body);

      const leaveCountForDates = await db.employeeLeaveTransactions.findAll({
        where: {
          appliedFor: {
            [Op.between]: [req.body.fromDate, req.body.toDate],
          },
          status: {
            [Op.ne]: "revoked",
          },
          employeeId: req.body.employeeId,
        },
      });

      const fromDateReq = req.body.fromDate;
      const toDateReq = req.body.toDate;
      const daysDifferenceReq = moment(toDateReq).diff(
        moment(fromDateReq),
        "days"
      );
      if (daysDifferenceReq > parseInt(process.env.LEAVE_LIMIT)) {
        return respHelper(res, {
          status: 404,
          data: {},
          msg: message.LEAVE.LEAVE_LIMIT.replace("#", process.env.LEAVE_LIMIT),
        });
      }
      var inputs = [];
      for (let i = -1; i < daysDifferenceReq; i++) {
        let appliedFor = moment(fromDateReq)
          .add(i + 1, "days")
          .format("YYYY-MM-DD");

        let halfDayFor = 0;
        let isHalfDay = 0;

        if (daysDifferenceReq == 0) {
          isHalfDay = req.body.firstDayHalf != 0 ? 1 : 0;
          halfDayFor = req.body.firstDayHalf;
        } else {
          if (i + 1 == 0) {
            isHalfDay = req.body.firstDayHalf != 0 ? 1 : 0;
            halfDayFor = req.body.firstDayHalf;
          } else if (i + 1 == daysDifferenceReq) {
            isHalfDay = req.body.lastDayHalf != 0 ? 1 : 0;
            halfDayFor = req.body.lastDayHalf;
          }
        }
        inputs = leaveCountForDates.filter((el) => {
          if (el.appliedFor == appliedFor) {
            if (el.isHalfDay == 1) {
              if (halfDayFor == 0) {
                return true;
              } else {
                if (el.halfDayFor == halfDayFor) {
                  return true;
                } else {
                  return false;
                }
              }
            } else {
              return true;
            }
          } else {
            return true;
          }
        });
      }
      if (inputs.length > 0) {
        return respHelper(res, {
          status: 402,
          msg: message.LEAVE.DATES_NOT_APPLICABLE,
        });
      }
      let EMP_DATA = await helper.getEmpProfile(req.body.employeeId);
      let leaveData = await helper.empLeaveDetails(
        req.body.employeeId,
        req.body.leaveAutoId
      );

      const fromDate = req.body.fromDate;
      const toDate = req.body.toDate;
      let arr = [];
      let leaveDays = 0;
      const daysDifference = moment(toDate).diff(moment(fromDate), "days");
      let uuid = "id_" + moment().format("YYYYMMDDHHmmss");
      for (let i = -1; i < daysDifference; i++) {
        let appliedFor = moment(fromDate)
          .add(i + 1, "days")
          .format("YYYY-MM-DD");
        let halfDayFor = 0;
        let isHalfDay = 0;
        console.log("EMP_DATA", EMP_DATA);
        let isDayWorking = await helper.isDayWorking(
          appliedFor,
          EMP_DATA.weekOffId,
          EMP_DATA.companyLocationId
        );
        if (isDayWorking == 0) {
          console.log("leave on this day");
        } else {
          if (daysDifference == 0) {
            isHalfDay = req.body.firstDayHalf != 0 ? 1 : 0;
            halfDayFor = req.body.firstDayHalf;
          } else {
            if (i + 1 == 0) {
              isHalfDay = req.body.firstDayHalf != 0 ? 1 : 0;
              halfDayFor = req.body.firstDayHalf;
            } else if (i + 1 == daysDifference) {
              isHalfDay = req.body.lastDayHalf != 0 ? 1 : 0;
              halfDayFor = req.body.lastDayHalf;
            }
          }

          if (isHalfDay) {
            leaveDays += 0.5;
          } else {
            leaveDays += 1;
          }

          let leaveId = 6;
          if (leaveData) {
            leaveId = req.body.leaveAutoId;
            if (leaveId != 6) {
              let pendingLeaveCountList =
                await db.employeeLeaveTransactions.findAll({
                  where: {
                    status: "pending",
                    employeeId: req.body.employeeId,
                    leaveAutoId: leaveId,
                  },
                });
              let pendingLeaveCount = 0;
              pendingLeaveCountList.map((el) => {
                pendingLeaveCount += parseFloat(el.leaveCount);
              });

              if (
                pendingLeaveCount + leaveDays >
                parseFloat(leaveData.availableLeave)
              ) {
                leaveId = 6;
              }
            }
          }
          const recordData = {
            employeeId: req.body.employeeId, // Replace with actual employee ID
            attendanceShiftId: EMP_DATA.shiftId, // Replace with actual attendance shift ID
            attendancePolicyId: EMP_DATA.attendancePolicyId, // Replace with actual attendance policy ID
            leaveAutoId: leaveId, // Replace with actual leave auto ID
            appliedOn: moment().format("YYYY-MM-DD"), // Replace with actual applied on date
            appliedFor: appliedFor, // Replace with actual applied for date
            isHalfDay: isHalfDay, // Replace with actual is half day value (0 or 1)
            halfDayFor: halfDayFor, // Replace with actual half day for value
            status: "pending", // Replace with actual status
            reason: req.body.reason, // Replace with actual reason
            leaveCount: isHalfDay == 1 ? 0.5 : 1,
            message: req.body.message,
            leaveAttachment:
              result.attachment != ""
                ? await helper.fileUpload(
                    result.attachment,
                    `leaveAttachment_${uuid}`,
                    `uploads/${EMP_DATA.empCode}`
                  )
                : null,
            pendingAt: EMP_DATA.managerData.id, // Replace with actual pending at value
            createdBy: req.userId, // Replace with actual creator user ID
            createdAt: moment(), // Replace with actual creation date
            batch_id: uuid,
            weekOffId: EMP_DATA.weekOffId,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            source: req.deviceSource,
          };
          arr.push(recordData);
          //const record = await db.employeeLeaveTransactions.create(recordData);
        }
        //const record = await db.employeeLeaveTransactions.bulkCreate(arr);
      }
      // Perform bulk insert
      await db.employeeLeaveTransactions.bulkCreate(arr);
      return respHelper(res, {
        status: 200,
        data: arr,
        msg: message.LEAVE.RECORDED,
      });
    } catch (error) {
      if (error.isJoi === true) {
        return respHelper(res, {
          status: 422,
          msg: error.details[0].message,
        });
      }
      console.log("error", error);
      return respHelper(res, {
        status: 500,
      });
    }
  }
  async revokeLeaveRequest(req, res) {
    try {
      const result = await validator.revoekLeaveRequest.validateAsync(req.body);
      let leaveIds = result.employeeLeaveTransactionsIds.split(",");
      let countLeave = await db.employeeLeaveTransactions.count({
        where: {
          status: "pending",
          employeeLeaveTransactionsId: leaveIds,
        },
      });

      if (leaveIds.length != countLeave) {
        return respHelper(res, {
          status: 402,
          msg: message.LEAVE.NO_UPDATE,
        });
      }
      await db.employeeLeaveTransactions.update(
        {
          status: "revoked",
          updatedBy: req.userId,
          updatedAt: moment(),
        },
        {
          where: {
            employeeLeaveTransactionsId: leaveIds,
          },
        }
      );

      return respHelper(res, {
        status: 200,
        data: {},
        msg: message.LEAVE.REVOKED,
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

  // async leaveRemainingCount(req, res) {
  //   try {
  //     const {
  //       leaveAutoId,
  //       startDate,
  //       endDate,
  //       employeeFor,
  //       leaveFirstHalf,
  //       leaveSecondHalf,
  //     } = req.body;
  //     const daysDifferenceReq = moment(endDate).diff(moment(startDate), "days");

  //     if (daysDifferenceReq > parseInt(process.env.LEAVE_LIMIT)) {
  //       return respHelper(res, {
  //         status: 404,
  //         data: {},
  //         msg: message.LEAVE.LEAVE_LIMIT,
  //       });
  //     }

  //     let getCombinedVal = await helper.getCombineValue(
  //       leaveFirstHalf,
  //       leaveSecondHalf
  //     );
  //     let employeeId = employeeFor == 0 ? req.userId : employeeFor;
  //     let employeeWeekOfId = await db.employeeMaster.findOne({
  //       where: { id: employeeId },
  //     });

  //     let totalWorkingDays = await helper.remainingLeaveCount(
  //       startDate,
  //       endDate,
  //       employeeWeekOfId.weekOffId,
  //       employeeWeekOfId.companyLocationId
  //     );

  //     let pendingLeaveCountList = await db.employeeLeaveTransactions.findAll({
  //       where: {
  //         status: "pending",
  //         employeeId: employeeId,
  //         leaveAutoId: leaveAutoId,
  //       },
  //     });

  //     let pendingLeaveCount = 0;
  //     pendingLeaveCountList.map((el) => {
  //       pendingLeaveCount += parseFloat(el.leaveCount);
  //     });

  //     const availableLeaveCount = await db.leaveMapping.findOne({
  //       where: {
  //         EmployeeId: employeeId,
  //         leaveAutoId: leaveAutoId,
  //       },
  //     });
  //     let totalAvailableLeave = availableLeaveCount
  //       ? parseFloat(availableLeaveCount.availableLeave).toFixed(2) -
  //           parseFloat(pendingLeaveCount).toFixed(2) <
  //         0
  //         ? "0.00"
  //         : parseFloat(availableLeaveCount.availableLeave) -
  //           parseFloat(pendingLeaveCount).toFixed(2)
  //       : "0.00";

  //     let unpaidLeave =
  //       parseFloat(availableLeaveCount.availableLeave) -
  //         parseFloat(totalWorkingDays).toFixed(2) <
  //       0
  //         ? -parseFloat(
  //             parseFloat(availableLeaveCount.availableLeave) -
  //               parseFloat(totalWorkingDays).toFixed(2)
  //           )
  //         : 0;

  //     let totalWorkingDaysCalculated =
  //       totalWorkingDays > 0
  //         ? parseFloat(totalWorkingDays).toFixed(2) -
  //           parseFloat(getCombinedVal).toFixed(2)
  //         : 0;

  //     let unpaidLeaveCalculated =
  //       unpaidLeave - parseFloat(getCombinedVal).toFixed(2) < 0
  //         ? 0
  //         : unpaidLeave - parseFloat(getCombinedVal).toFixed(2);

  //     return respHelper(res, {
  //       status: 200,
  //       data: {
  //         totalWorkingDays: totalWorkingDaysCalculated,
  //         availableLeave:
  //           parseFloat(availableLeaveCount.availableLeave) -
  //             parseFloat(totalWorkingDaysCalculated) <
  //           0
  //             ? 0
  //             : parseFloat(availableLeaveCount.availableLeave) -
  //               parseFloat(totalWorkingDaysCalculated),
  //         unpaidLeave:
  //           parseFloat(availableLeaveCount.availableLeave) -
  //             parseFloat(totalWorkingDaysCalculated) <
  //           0
  //             ? -(
  //                 parseFloat(availableLeaveCount.availableLeave) -
  //                 parseFloat(totalWorkingDaysCalculated)
  //               )
  //             : 0, //(totalWorkingDaysCalculated-totalAvailableLeave)>0?totalWorkingDaysCalculated-totalAvailableLeave:0,
  //       },
  //       msg: message.LEAVE.REMAINING_LEAVES,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({
  //       message: "Internal server error",
  //     });
  //   }
  // }
  async leaveRemainingCount(req, res) {
    try {
      const {
        leaveAutoId,
        startDate,
        endDate,
        employeeFor,
        leaveFirstHalf,
        leaveSecondHalf,
      } = req.body;
  
      const daysDifferenceReq = moment(endDate).diff(moment(startDate), "days");
  
      if (daysDifferenceReq > parseInt(process.env.LEAVE_LIMIT)) {
        return respHelper(res, {
          status: 404,
          data: {},
          msg: message.LEAVE.LEAVE_LIMIT,
        });
      }
  
      const getCombinedVal = await helper.getCombineValue(leaveFirstHalf, leaveSecondHalf);
      const employeeId = employeeFor == 0 ? req.userId : employeeFor;
  
      // Fetch employee details and leave counts in parallel
      const [employeeWeekOfId, pendingLeaveCountList, availableLeaveCount] = await Promise.all([
        db.employeeMaster.findOne({ where: { id: employeeId } }),
        db.employeeLeaveTransactions.findAll({
          where: {
            status: "pending",
            employeeId: employeeId,
            leaveAutoId: leaveAutoId,
          },
        }),
        db.leaveMapping.findOne({
          where: {
            EmployeeId: employeeId,
            leaveAutoId: leaveAutoId,
          },
        }),
      ]);
  
      const totalWorkingDays = await helper.remainingLeaveCount(
        startDate,
        endDate,
        employeeWeekOfId.weekOffId,
        employeeWeekOfId.companyLocationId
      );
  
      // Calculate pending leave count
      const pendingLeaveCount = pendingLeaveCountList.reduce((acc, el) => acc + parseFloat(el.leaveCount), 0);
  
      const totalAvailableLeave = availableLeaveCount
        ? parseFloat(availableLeaveCount.availableLeave) - pendingLeaveCount
        : 0;
  
      const unpaidLeave = Math.max(0, totalWorkingDays - totalAvailableLeave);
      const totalWorkingDaysCalculated = Math.max(0, totalWorkingDays - getCombinedVal);
      const unpaidLeaveCalculated = Math.max(0, unpaidLeave - getCombinedVal);
  
      const availableLeave = Math.max(0, totalAvailableLeave - totalWorkingDaysCalculated);
      const unpaidLeaveResult = Math.max(0, unpaidLeaveCalculated);
      const earnedLeave = parseFloat(availableLeaveCount.availableLeave) - parseFloat(pendingLeaveCount)
      return respHelper(res, {
        status: 200,
        data: {
          totalWorkingDays: totalWorkingDaysCalculated,
          availableLeave: availableLeave,
          earnedLeave : earnedLeave,
          unpaidLeave: unpaidLeaveResult,
        },
        msg: message.LEAVE.REMAINING_LEAVES,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  
  async leaveHistory(req, res) {
    try {
      const year = req.params.year;
      const employeeId = req.userId;
      const result = [];
      const grandLeaveTotal = [];
      let grandTotalLeaveCount = 0; // Initialize grand total leave count

      // Helper function to get the month name
      const getMonthName = (month) => {
        const date = new Date();
        date.setMonth(month - 1);
        return date.toLocaleString("default", { month: "long" });
      };

      // Fetch all leaveMaster details once
      const leaveMasterDetails = await db.leaveMaster.findAll({
        attributes: ["leaveId", "leaveName", "leaveCode"],
        raw: true,
      });

      // Create a map for leaveId to leaveName
      const leaveMasterMap = leaveMasterDetails.reduce((map, leave) => {
        map[leave.leaveId] = leave.leaveName;
        return map;
      }, {});

      // Fetch all leave transactions for the given employee and year
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const attendanceData = await db.employeeLeaveTransactions.findAll({
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
          employeeId: employeeId,
          status: "approved",
          appliedFor: {
            [db.Sequelize.Op.between]: [startDate, endDate],
          },
        },
        group: [
          "employeeId",
          "leaveAutoId",
          db.Sequelize.fn("MONTH", db.Sequelize.col("appliedFor")),
        ],
        raw: true,
      });

      // Group data by month and leave type
      const groupedData = {};
      attendanceData.forEach((item) => {
        const month = getMonthName(item.month);
        if (!groupedData[month]) {
          groupedData[month] = {};
        }
        groupedData[month][item.leaveAutoId] = item.totalLeaveCount;
      });

      // Create the result array
      for (let month = 1; month <= 12; month++) {
        const monthName = getMonthName(month);
        const attendanceDataForMonth = [];
        let totalLeaveCountForMonth = 0;

        function getMonthName(month) {
          const monthNames = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December",
          };

          return monthNames[month] ? monthNames[month] : "Invalid month number";
        }
        leaveMasterDetails.forEach((leave) => {
          const leaveCount =
            groupedData[monthName] && groupedData[monthName][leave.leaveId]
              ? groupedData[monthName][leave.leaveId]
              : 0;
          totalLeaveCountForMonth += parseFloat(leaveCount);

          attendanceDataForMonth.push({
            leaveType: leave.leaveName,
            leaveCode: leave.leaveCode,
            totalLeaveCount: leaveCount,
          });
        });

        grandTotalLeaveCount += totalLeaveCountForMonth; // Update grand total leave count

        result.push({
          month: getMonthName(month),
          totalMonthLeave: totalLeaveCountForMonth,
          attendanceData: attendanceDataForMonth,
        });
      }

      // Add the grand total to the result
      grandLeaveTotal.push({
        month: "Total",
        totalMonthLeave: grandTotalLeaveCount.toFixed(2),
        attendanceData: [],
      });

      return respHelper(res, {
        status: 200,
        data: {
          totalYearLeaves:
            grandLeaveTotal[0].totalMonthLeave == "0.00"
              ? 0
              : grandLeaveTotal[0].totalMonthLeave,
          monthWiseLeaves: result,
        },
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  //working fine
  // async leaveHistory(req, res) {
  //   try {
  //     const year = req.params.year;
  //     const employeeId = req.userId;
  //     const result = [];

  //     // Helper function to get the month name
  //     const getMonthName = (month) => {
  //       const date = new Date();
  //       date.setMonth(month - 1);
  //       return date.toLocaleString("default", { month: "long" });
  //     };

  //     // Fetch all leaveMaster details once
  //     const leaveMasterDetails = await db.leaveMaster.findAll({
  //       attributes: ["leaveId", "leaveName"],
  //       raw: true,
  //     });

  //     // Create a map for leaveId to leaveName
  //     const leaveMasterMap = leaveMasterDetails.reduce((map, leave) => {
  //       map[leave.leaveId] = leave.leaveName;
  //       return map;
  //     }, {});

  //     // Fetch all leave transactions for the given employee and year
  //     const startDate = `${year}-01-01`;
  //     const endDate = `${year}-12-31`;

  //     const attendanceData = await db.employeeLeaveTransactions.findAll({
  //       attributes: [
  //         "employeeId",
  //         "leaveAutoId",
  //         [
  //           db.Sequelize.fn("MONTH", db.Sequelize.col("appliedFor")),
  //           "month",
  //         ],
  //         [
  //           db.Sequelize.fn("sum", db.Sequelize.col("leaveCount")),
  //           "totalLeaveCount",
  //         ],
  //       ],
  //       where: {
  //         employeeId: employeeId,
  //         status: "approved",
  //         appliedFor: {
  //           [db.Sequelize.Op.between]: [startDate, endDate],
  //         },
  //       },
  //       group: ["employeeId", "leaveAutoId", db.Sequelize.fn("MONTH", db.Sequelize.col("appliedFor"))],
  //       raw: true,
  //     });

  //     // Group data by month and leave type
  //     const groupedData = {};
  //     attendanceData.forEach((item) => {
  //       const month = getMonthName(item.month);
  //       if (!groupedData[month]) {
  //         groupedData[month] = {};
  //       }
  //       groupedData[month][item.leaveAutoId] = item.totalLeaveCount;
  //     });

  //     // Create the result array
  //     for (let month = 1; month <= 12; month++) {
  //       const monthName = getMonthName(month);
  //       const attendanceDataForMonth = [];
  //       let totalLeaveCountForMonth = 0;

  //       leaveMasterDetails.forEach(leave => {
  //         const leaveCount = groupedData[monthName] && groupedData[monthName][leave.leaveId] ? groupedData[monthName][leave.leaveId] : 0;
  //         totalLeaveCountForMonth += parseFloat(leaveCount);

  //         attendanceDataForMonth.push({
  //           leaveType: leave.leaveName,
  //           totalLeaveCount: leaveCount,
  //         });
  //       });

  //       result.push({
  //         month: monthName,
  //         totalMonthLeave: totalLeaveCountForMonth,
  //         attendanceData: attendanceDataForMonth,
  //       });
  //     }

  //     return respHelper(res, {
  //       status: 200,
  //       data: result,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return respHelper(res, {
  //       status: 500,
  //     });
  //   }
  // }

  // working fine time execution time fine
  // async leaveHistory(req, res) {
  //   try {
  //     const year = "2024";
  //     const employeeId = 365;
  //     const result = [];

  //     const formatMonth = (month) => month.toString().padStart(2, "0");

  //     // Fetch all leaveMaster details once
  //     const leaveMasterDetails = await db.leaveMaster.findAll({
  //       attributes: ["leaveId", "leaveName"],
  //       raw: true,
  //     });

  //     // Create a map for leaveId to leaveName
  //     const leaveMasterMap = leaveMasterDetails.reduce((map, leave) => {
  //       map[leave.leaveId] = leave.leaveName;
  //       return map;
  //     }, {});

  //     // Fetch all leave transactions for the given employee and year
  //     const startDate = `${year}-01-01`;
  //     const endDate = `${year}-12-31`;

  //     const attendanceData = await db.employeeLeaveTransactions.findAll({
  //       attributes: [
  //         "employeeId",
  //         "leaveAutoId",
  //         [
  //           db.Sequelize.fn("MONTH", db.Sequelize.col("appliedFor")),
  //           "month",
  //         ],
  //         [
  //           db.Sequelize.fn("sum", db.Sequelize.col("leaveCount")),
  //           "totalLeaveCount",
  //         ],
  //       ],
  //       where: {
  //         employeeId: employeeId,
  //         status: "approved",
  //         appliedFor: {
  //           [db.Sequelize.Op.between]: [startDate, endDate],
  //         },
  //       },
  //       group: ["employeeId", "leaveAutoId", db.Sequelize.fn("MONTH", db.Sequelize.col("appliedFor"))],
  //       raw: true,
  //     });

  //     // Group data by month and leave type
  //     const groupedData = {};
  //     attendanceData.forEach((item) => {
  //       const month = formatMonth(item.month);
  //       if (!groupedData[month]) {
  //         groupedData[month] = [];
  //       }
  //       groupedData[month].push({
  //         leaveType: leaveMasterMap[item.leaveAutoId] || "Unknown",
  //         totalLeaveCount: item.totalLeaveCount,
  //       });
  //     });

  //     // Create the result array
  //     for (let month = 1; month <= 12; month++) {
  //       const formattedMonth = formatMonth(month);
  //       result.push({
  //         month: formattedMonth,
  //         attendanceData: groupedData[formattedMonth] || [],
  //       });
  //     }

  //     return respHelper(res, {
  //       status: 200,
  //       data: result,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return respHelper(res, {
  //       status: 500,
  //     });
  //   }
  // }

  //this is working fine but taking time
  // async leaveHistory(req, res) {
  //   try {
  //     const year = "2024";
  //     const employeeId = 365;
  //     const result = [];

  //     const formatMonth = (month) => month.toString().padStart(2, "0");

  //     // Fetch distinct leaveAutoIds for the given employee
  //     // Fetch distinct leaveIds
  //     const leaveIds = await db.leaveMaster.findAll({
  //       attributes: [
  //         [db.Sequelize.fn("DISTINCT", db.Sequelize.col("leaveId")), "leaveId"],
  //       ],
  //       raw: true, // To get plain objects instead of Sequelize instances
  //     });

  //     for (let index = 0; index < leaveIds.length; index++) {
  //       const leaveAutoId = leaveIds[index].leaveId;
  //       // Fetch leaveMaster details for the current leaveAutoId
  //       const leaveMasterDetails = await db.leaveMaster.findOne({
  //         where: { leaveId: leaveAutoId },
  //         raw: true, // To get plain object instead of Sequelize instance
  //       });

  //       for (let month = 1; month <= 12; month++) {
  //         const startDate = `${year}-${formatMonth(month)}-01`;
  //         const endDate = new Date(year, month, 0).toISOString().split("T")[0]; // Correctly get the last day of the current month

  //         // Fetch attendance data for the current month and leaveAutoId
  //         const attendanceData = await db.employeeLeaveTransactions.findAll({
  //           attributes: [
  //             "employeeId",
  //             [
  //               db.Sequelize.fn("sum", db.Sequelize.col("leaveCount")),
  //               "totalLeaveCount",
  //             ],
  //           ],
  //           where: {
  //             employeeId: employeeId,
  //             leaveAutoId: leaveAutoId,
  //             status: "approved",
  //             appliedFor: {
  //               [db.Sequelize.Op.between]: [startDate, endDate],
  //             },
  //           },
  //           group: ["employeeId", "leaveAutoId"],
  //           raw: true, // To get plain objects instead of Sequelize instances
  //         });

  //         result.push({
  //           month: formatMonth(month),
  //           leaveType: leaveMasterDetails
  //             ? leaveMasterDetails.leaveName
  //             : "Unknown",
  //           attendanceData: attendanceData,
  //         });
  //       }
  //     }

  //     return respHelper(res, {
  //       status: 200,
  //       data: result,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return respHelper(res, {
  //       status: 500,
  //     });
  //   }
  // }

  // async leaveHistory(req, res) {
  //   try {
  //     const year = "2024";
  //     const employeeId = 365;
  //     const result = [];

  //     const formatMonth = (month) => month.toString().padStart(2, "0");

  //     const allLeaveIds = await db.leaveMaster.findAll({attributes:['leaveId']});
  //     console.log("allLeaveIdsallLeaveIds",allLeaveIds)
  //     // Fetch unique leaveAutoIds for the given employee
  //     const leaveIds = await db.employeeLeaveTransactions.findAll({
  //       attributes: ["leaveAutoId"],
  //       where: {
  //         status: "approved",
  //         employeeId: employeeId,
  //       },
  //       group: ["leaveAutoId"],
  //       raw: true, // To get plain objects instead of Sequelize instances
  //     });

  //     for (let index = 0; index < leaveIds.length; index++) {
  //       const leaveAutoId = leaveIds[index].leaveAutoId;

  //       // Fetch leaveMaster details for the current leaveAutoId
  //       const leaveMasterDetails = await db.leaveMaster.findOne({ where: { leaveId: leaveAutoId } });

  //       for (let month = 1; month <= 12; month++) {
  //         const startDate = `${year}-${formatMonth(month)}-01`;
  //         const endDate = new Date(year, month, 0).toISOString().split("T")[0]; // Correctly get the last day of the current month

  //         // Fetch attendance data for the current month and leaveAutoId
  //         const attendanceData = await db.employeeLeaveTransactions.findAll({
  //           attributes: [
  //             "employeeId",
  //             [fn("sum", col("leaveCount")), "totalLeaveCount"],
  //           ],
  //           where: {
  //             employeeId: employeeId,
  //             leaveAutoId: leaveAutoId,
  //             status: "approved",
  //             appliedFor: {
  //               [Op.between]: [startDate, endDate],
  //             },
  //           },
  //           group: ["employeeId", "leaveAutoId"],
  //           raw: true, // To get plain objects instead of Sequelize instances
  //         });

  //         result.push({
  //           month: formatMonth(month),
  //           leaveType: leaveMasterDetails.leaveName,
  //           attendanceData: attendanceData,
  //         });
  //       }
  //     }

  //     return respHelper(res, {
  //       status: 200,
  //       data: result,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return respHelper(res, {
  //       status: 500,
  //     });
  //   }
  // }
}

export default new LeaveController();
