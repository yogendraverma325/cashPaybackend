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
    console.log("EarnedLeaveCreditCron", moment().format("DD"));
    // creditDayOfMonth: moment().format("DD")
    const earnedLeaveDetails = await db.leaveMaster.findAll({
      raw: true,
      where: {
        iterationDistribution: {
          [Op.ne]: 0,
        },
      },
    });
    await Promise.all(
      earnedLeaveDetails.map(async (singleItem) => {
        if (singleItem.creditDayOfMonth == moment().format("DD")) {
          await db.leaveMapping.increment(
            {
              availableLeave: parseFloat(singleItem.iterationDistribution),
              accruedThisYear: parseFloat(singleItem.iterationDistribution),
            },
            {
              where: {
                leaveAutoId: singleItem.leaveId,
              },
            }
          );
        }
      })
    );
    console.log("earnedLeaveDetails", earnedLeaveDetails);

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
        needAttendanceCron: 1,
      },
    });
    if (managerData.length != 0) {
      for (const element of managerData) {
        let lastDayDate = moment(element.fromDate).format("YYYY-MM-DD");

        const userData = await db.employeeMaster.findOne({
          attributes:['id','manager'],
          where: {
            id: element.employeeId
          },
        });

         const currentManagerOfTheEmployee = await db.managerHistory.findOne({
          raw: true,
          where: {
            needAttendanceCron:0,
            toDate: {
              [Op.eq]: null,
            },
            employeeId: element.employeeId,
          },
        });
        if (currentManagerOfTheEmployee) {
          //MARKING LAST MANAGER WITH LAST DATE
          await db.managerHistory.update(
            {
              toDate: lastDayDate,
              updatedBy: 1,
            },
            {
              where: {
                id: currentManagerOfTheEmployee.id,
              },
            }
          );
          //MARKING LAST MANAGER WITH LAST DATE
        }
        //DISBALE CURRENT DATE DATA
        await db.managerHistory.update(
          {
            needAttendanceCron: 0,
            updatedBy: 1,
          },
          {
            where: {
              id: element.id,
            },
          }
        );
        //DISBALE CURRENT DATE DATA

        //UPDATE MANGER TO EMP MASTER TABLE
      
        ///TRANSFER ALL RECORDS TO NEW MANAGER
     
          await db.regularizationMaster.update(
            {
              regularizeManagerId: element.managerId,
            },
            {
              where: {
                regularizeStatus: "Pending",
                createdBy: element.employeeId,
              },
            }
          );
          await db.employeeLeaveTransactions.update(
            {
              pendingAt: element.managerId,
            },
            {
              where: {
                status: "pending",
                createdBy: element.employeeId,
              },
            }
          );
          await db.EmployeeLeaveHeader.update(
            {
              pendingAt: element.managerId,
            },
            {
              where: {
                status: "pending",
                createdBy: element.employeeId,
              },
            }
          );

          let sepExist = await db.separationMaster.findOne(
            {
              where: {
                finalStatus: 2,
                employeeId: element.employeeId,
              },
            }
          );
          if(sepExist){

          
            let dataAudit = await db.separationMaster.update(
              {
                pendingAt: element.managerId,
              },
              {
                where: {
                  finalStatus: 2,
                  employeeId: element.employeeId,
                  pendingAt:userData.manager
                },
              }
            );
            console.log("sepExist",sepExist)
          
              let res_sep=await db.separationTrail.update(
                {
                  pendingAt: element.managerId,
                },
                {
                  where: {
                    pending: 1,
                    separationAutoId: sepExist.resignationAutoId,
                    pendingAt: userData.manager,
                  },
                }
              );
          
            
          }
          let updateDone = await db.employeeMaster.update(
            {
              manager: element.managerId,
            },
            {
              where: {
                id: element.employeeId,
              },
            }
          );
         
        
        //UPDATE MANGER TO EMP MASTER TABLE
      }
    }
  }

  async updatePolicy() {
    const listData = await db.PolicyHistory.findAll({
      raw: true,
      where: {
        fromDate: moment().format("YYYY-MM-DD"),
        needAttendanceCron: 1,
      },
    });
    if (listData.length != 0) {
      for (const element of listData) {
        let lastDayDate = moment(element.fromDate).format("YYYY-MM-DD");
        const currentRecord = await db.PolicyHistory.findOne({
          raw: true,
          where: {
            toDate: {
              [Op.eq]: null,
            },
            employeeId: element.employeeId,
            needAttendanceCron: 0,
          },
        });
        if (currentRecord) {
          //MARKING LAST REDORDS WITH LAST DATE
          await db.PolicyHistory.update(
            {
              toDate: lastDayDate,
              updatedBy: 1,
            },
            {
              where: {
                id: currentRecord.id,
              },
            }
          );
          //MARKING LAST REDORDS WITH LAST DATE
        }
        //DISBALE CURRENT DATE DATA
        await db.PolicyHistory.update(
          {
            needAttendanceCron: 0,
            updatedBy: 1,
          },
          {
            where: {
              id: element.id,
            },
          }
        );
        //DISBALE CURRENT DATE DATA

        //UPDATE POLICY TO EMP MASTER TABLE
        await db.employeeMaster.update(
          {
            shiftId: element.shiftPolicy,
            attendancePolicyId: element.attendancePolicy,
            weekOffId: element.weekOffPolicy,
          },
          {
            where: {
              id: element.employeeId,
            },
          }
        );
      }
    }
  }

  async blockAccess() {

    const date = moment().subtract(1, 'day').format("YYYY-MM-DD")
    const userList = await db.separationMaster.findAll({
      where: {
        l2LastWorkingDay: date,
        finalStatus: 9
      }
    })

    if (userList.length > 0) {
      for (const element of userList) {
        await db.employeeMaster.update({
          dateOfexit: date,
          isActive: 0
        }, {
          where: {
            id: element.dataValues.employeeId
          }
        })
      }
    }
  }
}

export default new CronController();
