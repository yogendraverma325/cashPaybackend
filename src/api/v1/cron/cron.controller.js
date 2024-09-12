import { Op } from "sequelize";
import db from "../../../config/db.config.js";
import moment from "moment";

class CronController {
  async updateAttendance() {
    const existEmployees = await db.employeeMaster.findAll({
      attributes: ["id", "empCode", "name", "email", "shiftId"],
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

    for (const iterator of existEmployees) {
      const existAttendance = await db.attendanceMaster.findOne({
        where: {
          attendanceDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
          employeeId: iterator.dataValues.id,
        },
      });

      if (!existAttendance) {
        await db.attendanceMaster.create({
          attendanceDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
          employeeId: iterator.dataValues.id,
          attendanceShiftId: iterator.dataValues.shiftId,
          attendancePresentStatus: "Absent",
        });
      } else {
        await db.attendanceMaster.update(
          {
            attendancePresentStatus:
              existAttendance.dataValues.attendanceStatus === "Punch In"
                ? "Single Punch Absent"
                : "Absent",
          },
          {
            where: {
              attendanceDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
              employeeId: iterator.dataValues.id,
            },
          }
        );
      }
    }
  }

  async updateActiveStatus() {
    const existsUsers = await db.employeeMaster.findAll({
      raw: true,
      where: {
        accountRecoveryTime: {
          [Op.lt]: `${moment().format("YYYY-MM-DD HH:mm")}:00`,
        },
      },
    });

    if (existsUsers.length > 0) {
      for (const iterator of existsUsers) {
        await db.employeeMaster.update(
          {
            wrongPasswordCount: 0,
            accountRecoveryTime: null,
          },
          {
            where: {
              id: iterator.id,
            },
          }
        );
      }
    }
  }

  async EarnedLeaveCreditCron() {
    console.log("EarnedLeaveCreditCron", moment().format("DD"))
    // creditDayOfMonth: moment().format("DD")
    const earnedLeaveDetails = await db.leaveMaster.findAll({
      raw: true,
      where: {
        iterationDistribution: {
          [Op.ne]: 0
        }
      },
    });
    await Promise.all(
      earnedLeaveDetails.map(async (singleItem) => {
        if (singleItem.creditDayOfMonth == moment().format("DD")) {
          await db.leaveMapping.increment(
            {
              availableLeave: parseFloat(singleItem.iterationDistribution),
              accruedThisYear: parseFloat(singleItem.iterationDistribution)
            },
            {
              where: {
                leaveAutoId: singleItem.leaveId
              },
            }
          );
        }

      }));
    console.log("earnedLeaveDetails", earnedLeaveDetails)

    // if (earnedLeaveDetails) {
    //   let value = parseFloat(earnedLeaveDetails.iterationDistribution).toFixed(
    //     2
    //   );


    // } else {
    //   console.log("not found");
    // }
  }

  async updateManager() {
    const managerData = await db.managerHistory.findAll({
      raw: true,
      where: {
        fromDate: moment().format("YYYY-MM-DD"),
      },
    });

    if (managerData.length != 0) {
      for (const element of managerData) {
        await db.employeeMaster.update(
          {
            manager: element.managerId,
          },
          {
            where: {
              id: element.employeeId,
            },
          }
        );
      }
    } else {
      console.log(
        `No Data Found for ${moment().format(
          "YYYY-MM-DD"
        )} (Update Manager Cron)`
      );
    }
  }
}

export default new CronController();
