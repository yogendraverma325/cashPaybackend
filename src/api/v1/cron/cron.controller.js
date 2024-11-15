import { Op } from "sequelize";
import db from "../../../config/db.config.js";
import moment from "moment";

import xlsx from "json-as-xlsx";
import fs from "fs";
import logger from "../../../helper/logger.js";
import eventEmitter from "../../../services/eventService.js";


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
        const currentManagerOfTheEmployee = await db.managerHistory.findOne({
          raw: true,
          where: {
            needAttendanceCron: 0,
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
        ///TRANSFER ALL RECORDS TO NEW MANAGER
        if (updateDone) {
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
          let dataAudit = await db.separationMaster.update(
            {
              pendingAt: element.managerId,
            },
            {
              where: {
                finalStatus: 2,
                employeeId: element.employeeId,
              },
            }
          );
          if (dataAudit) {
            await db.separationTrail.update(
              {
                pendingAt: element.managerId,
              },
              {
                where: {
                  pending: 1,
                  separationAutoId: dataAudit.resignationAutoId,
                },
              }
            );
          }
        }
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

  async newJoinEmployee() {
    try {
      let today = moment().format("YYYY-MM-DD");
      let condition = { 'createdAt': { [Op.gte]: `${today} 00:00:00`} };
      let attributes = [
        "empCode",
        "name",
        "personalEmail",
        "personalMobileNumber",
        "dateOfJoining",
        "manager",
        "designation_id",
        "buId"
      ];

      let docs = await db.employeeMaster.findAll({
        where: condition,
        attributes: attributes,
        include: [
          { model: db.employeeMaster, attributes: ['id', 'empCode'], as: 'managerData' },
          { model: db.designationMaster, attributes: ['designationId', 'name', 'code'] },
          { model: db.buMaster, attributes: ['buId', 'buName'] },
          { model: db.companyLocationMaster, attributes: ["companyLocationId", "address1", "companyLocationCode"], include: [{ model: db.cityMaster, attributes: ['cityName'] } ] },
          { model: db.jobDetails, attributes: ['jobId', 'jobLevelId'], include: [{ model: db.jobLevelMaster, attributes: ['jobLevelCode'] }] },
          { model: db.biographicalDetails, attributes: ['mobileAccess', 'laptopSystem'] },
          { model: db.emergencyDetails, attributes: ['emergencyContactNumber', 'emergencyBloodGroup'] },
        ]
      });
  
      if (docs.length > 0) {
          const sheetName = `uploads/temp/NewJoinEmployee_${today}`; //+ dt.getTime();
          fs.writeFileSync(sheetName + ".xlsx", "", { flag: "a+" }, (err) => {
            if (err) {
              console.error("Error writing file:", err);
              return;
            }
            console.log("File created successfully!");
          });

          let data = [
              {
                  sheet: `Sheet1`,
                  columns: [
                      { label: 'Employee_TMC', value: "empCode" },
                      { label: 'Employee_Name', value: "name" },
                      { label: "Employee_Designation", value: (row) => (row.designationmaster) ? row.designationmaster.name : '-' },
                      { label: "DateOfJoining", value: "dateOfJoining" },
                      { label: "Office_City", value: (row) => (row.companylocationmaster) ? row.companylocationmaster.citymaster.cityName : '-' },
                      { label: "Employee_Grade", value: (row) => (row.employeejobdetail.joblevelmaster) ? row.employeejobdetail.joblevelmaster.jobLevelCode : '-' },
                      { label: "Business_Unit", value: (row) => (row.bumaster) ? row.bumaster.buName : '-' },
                      { label: "Personal_Email", value: "personalEmail" },
                      { label: "ReportingManager_TMC", value: (row) => (row.managerData) ? row.managerData.empCode : '-' },
                      { label: "Mobile_No", value: "personalMobileNumber" },
                      { label: "IsLaptop", value: (row) => (row.employeebiographicaldetail) ? row.employeebiographicaldetail.laptopSystem : '-' },
                      { label: "IsMobile", value: (row) => (row.employeebiographicaldetail.mobileAccess === true) ? "Yes" : (row.employeebiographicaldetail.mobileAccess === false) ? "No" : "-" },
                      { label: "Blood_Group", value: (row) => (row.employeeemergencycontact) ? row.employeeemergencycontact.emergencyBloodGroup : '-' },
                      { label: "Emergency_ContactNo", value: (row) => (row.employeeemergencycontact) ? row.employeeemergencycontact.emergencyContactNumber : '-' }
                  ],
                  content: docs
              }
          ];

          const settings = {
            fileName: sheetName,
            extraLength: 3,
            writeMode: "writeFile",
            writeOptions: {},
            RTL: false,
          };

          let current = moment().format('DD-MMM-YYYY HH:mm');
          let yesterday = moment().subtract(1, 'days');
          yesterday = moment(yesterday).format("DD-MMM-YYYY HH:mm");
  
          xlsx(data, settings, () => {
            // return res.download(sheetName + ".xlsx");
            eventEmitter.emit(
              "newJoinEmployeeMail",
              JSON.stringify({
                today: today,
                current: current,
                yesterday: yesterday              
              })
            );
          });

      } 

    }
    catch (error) {
      logger.error("Error while export new join employee report", error);
      // return respHelper(res, { status: 500, msg: error?.parent?.sqlMessage });
    }
  }

}

export default new CronController();
