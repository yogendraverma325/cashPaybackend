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

      const leaveData = await db.leaveMapping.findAll({
        where: {
          EmployeeId: userId,
        },
        include: [
          {
            model: db.leaveMaster,
            attributes: {
              exclude: [
                "createdAt",
                "createdBy",
                "updatedBy",
                "updatedAt",
                "isActive",
              ],
            },
          },
        ],
      });

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
    // try {
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
        status: 401,
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
    // } catch (error) {
    //   console.log(error);
    //   if (error.isJoi === true) {
    //     return respHelper(res, {
    //       status: 422,
    //       msg: error.details[0].message,
    //     });
    //   }
    //   return respHelper(res, {
    //     status: 500,
    //   });
    // }
  }
}

export default new LeaveController();
