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
                createdBy: req.userId,
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

      for (const leaveID of leaveIds) {
        const existingRecord = await db.employeeLeaveTransactions.findOne({
          where: { employeeLeaveTransactionsId: leaveID },
        });

        if (existingRecord) {
          console.log(
            "existingRecord.appliedFor",
            existingRecord.appliedFor,
            "existingRecord.employeeId",
            existingRecord.employeeId
          );
          await db.attendanceMaster.update(
            { employeeLeaveTransactionsId: leaveID },
            {
              where: {
                attendanceDate: existingRecord.appliedFor,
                employeeId: existingRecord.employeeId,
              },
            }
          );
        } else {
          // await db.User.create(record, { transaction });
        }

        console.log("leaveID", leaveID);
      }

      return respHelper(res, {
        status: 200,
        data: countLeave,
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
      console.log("EMP_DATA",EMP_DATA.managerData)
      let leaveData = await helper.empLeaveDetails(
        req.body.employeeId,
        req.body.leaveAutoId
      );

      const fromDate = req.body.fromDate;
      const toDate = req.body.toDate;
      let arr = [];
      let leaveDays = 0;
      const daysDifference = moment(toDate).diff(moment(fromDate), "days");
        let uuid ="id_"+moment().format('YYYYMMDDHHmmss');
      for (let i = -1; i < daysDifference; i++) {
        let appliedFor = moment(fromDate)
          .add(i + 1, "days")
          .format("YYYY-MM-DD");

        let halfDayFor = 0;
        let isHalfDay = 0;

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
            let pendingLeaveCountList = await db.employeeLeaveTransactions.findAll({
            where: {
            status: "pending",
            employeeId: req.body.employeeId,
            leaveAutoId: leaveId
            },
            });
    let pendingLeaveCount = 0;
     pendingLeaveCountList.map((el) => {
      pendingLeaveCount += parseFloat(el.leaveCount);
    });

      if (
      pendingLeaveCount + leaveDays >=
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
             leaveAttachment: helper.fileUpload(
            result.attachment,
            `leaveAttachment_${uuid}`,
            `uploads/${EMP_DATA.empCode}`
          ),
          pendingAt: EMP_DATA.managerData.id, // Replace with actual pending at value
          createdBy: req.userId, // Replace with actual creator user ID
          createdAt: moment(), // Replace with actual creation date
          batch_id: uuid,
        };
        arr.push(recordData);
        const record = await db.employeeLeaveTransactions.create(recordData);
      }
      return respHelper(res, {
        status: 200,
        data: {},
        msg: message.LEAVE.RECORDED,
      });
    } catch (error) {
      if (error.isJoi === true) {
        return respHelper(res, {
          status: 422,
          msg: error.details[0].message,
        });
      }
      console.log("error",error)
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

      console.log("leaveIds", leaveIds.length, countLeave);
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
}

export default new LeaveController();
