import db from "../../../config/db.config.js";
import validator from "../../../helper/validator.js";
import logger from "../../../helper/logger.js";
import helper from "../../../helper/helper.js";
import respHelper from "../../../helper/respHelper.js";
import constant from "../../../constant/messages.js";
import eventEmitter from "../../../services/eventService.js";
import bcrypt from "bcrypt";
import commonController from "../common/common.controller.js";
import moment from "moment";
import { Op } from "sequelize";
import client from "../../../config/redisDb.config.js";

class AdminController {
  async addEmployee(req, res) {
    try {
      const result = await validator.userCreationSchema.validateAsync(req.body);

      const existUser = await db.employeeMaster.findOne({
        where: {
          [Op.or]: [
            { personalMobileNumber: result.personalMobileNumber },
            { email: result.email },
          ],
        },
      });

      if (existUser) {
        return respHelper(res, {
          status: 400,
          msg: constant.ALREADY_EXISTS.replace("<module>", "User"),
        });
      }

      const employeeTypeDetails = await db.employeeTypeMaster.findOne({
        where: { empTypeId: result.employeeType },
        attributes: ["empTypeId", "empTypeCode", "startingIndex"],
      });
      if (employeeTypeDetails) {
        let startingIndex = parseInt(employeeTypeDetails.startingIndex) + 1;

        if (employeeTypeDetails.empTypeId != 4) {
          startingIndex = `${employeeTypeDetails.empTypeCode}-${startingIndex}`;
        }

        const empCode = startingIndex;
        const password = await helper.generateRandomPassword();
        const encryptedPassword = await helper.encryptPassword(password);

        result.password = encryptedPassword;
        result.role_id = 3;
        result.empCode = empCode;
        result.isTempPassword = 1;

        const createdUser = await db.employeeMaster.create(result);
        await db.employeeTypeMaster.update(
          { startingIndex: parseInt(employeeTypeDetails.startingIndex) + 1 },
          { where: { empTypeId: result.employeeType } }
        );

        if (result.image) {
          const file = await helper.fileUpload(
            result.image,
            "profileImage",
            `uploads/${createdUser.dataValues.id.toString()}`
          );
          await db.employeeMaster.update(
            { profileImage: file },
            { where: { id: createdUser.dataValues.id } }
          );
        }

        return respHelper(res, {
          status: 200,
          msg: "Account has been created successfully.",
        });
      } else {
        return respHelper(res, {
          status: 403,
          msg: constant.INVALID_ID.replace("<module>", "Employee Type"),
        });
      }
    } catch (error) {
      console.log(error);
      logger.error(error);
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

  async unlockAccount(req, res) {
    try {
      const result = await validator.unlockAccountSchema.validateAsync(
        req.body
      );

      await db.employeeMaster.update(
        {
          wrongPasswordCount: 0,
          accountRecoveryTime: null,
        },
        {
          where: {
            empCode: result.employeeCode,
          },
        }
      );

      return respHelper(res, {
        status: 200,
        msg: constant.ACCOUNT_UNLOCKED,
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

  async dashboardCard(req, res) {
    try {
      await commonController.dashboardCard(req, res);
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(req, res) {
    try {
      const result = await validator.unlockAccountSchema.validateAsync(
        req.body
      );

      const existUser = await db.employeeMaster.findOne({
        raw: true,
        where: {
          empCode: result.employeeCode,
        },
      });

      const newPassword = await helper.generateRandomPassword();

      const encryptedPassword = await helper.encryptPassword(newPassword);

      await db.employeeMaster.update(
        {
          password: encryptedPassword,
          isTempPassword: 1,
        },
        {
          where: {
            empCode: result.employeeCode,
          },
        }
      );

      eventEmitter.emit(
        "resetPasswordMail",
        JSON.stringify({
          password: newPassword,
          email: existUser.email,
        })
      );

      return respHelper(res, {
        status: 200,
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

  async updateUserStatus(req, res) {
    try {
      for (const iterator of req.body) {
        await db.employeeMaster.update(
          {
            isActive: iterator.status,
            id: iterator.user,
          },
          {
            where: {
              id: iterator.user,
            },
          }
        );
      }

      return respHelper(res, {
        status: 200,
        msg: "Status Updated",
      });
    } catch (error) {
      return respHelper(res, {
        status: 500,
      });
    }
  }

  // async updateManager(req, res) {
  //   try {
  //     const result = await validator.updateManagerSchema.validateAsync(req.body)

  //     for (const iterator of result) {
  //       let getInfoEmp = await db.employeeMaster.findOne({
  //         attributes: ["id", "empCode", "name", "manager", "createdAt", "updatedAt"],
  //         where: { id: iterator.user },
  //       });
  //       if (getInfoEmp) {
  //         let createHistory = {
  //           employeeId: getInfoEmp.dataValues.id,
  //           managerId: getInfoEmp.dataValues.manager ? getInfoEmp.dataValues.manager : 1,
  //           fromDate: moment(getInfoEmp.dataValues.createdAt).format("YYYY-MM-DD"),
  //           toDate: moment().format("YYYY-MM-DD"),
  //           createdBy: req.userId,
  //           updatedBy: req.userId,
  //           createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  //           updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  //         };
  //         await db.managerHistory.create(createHistory);
  //         await db.employeeMaster.update(
  //           {
  //             manager: iterator.manager
  //           },
  //           {
  //             where: {
  //               id: iterator.user,
  //             },
  //           }
  //         );
  //       } else {
  //         console.log("employee not found");
  //       }
  //     }

  //     return respHelper(res, {
  //       status: 200,
  //     });
  //   } catch (error) {
  //     console.log("error", error);
  //     if (error.isJoi) {
  //       return respHelper(res, {
  //         msg: error.details[0].message,
  //         status: 422
  //       })
  //     }
  //     return respHelper(res, {
  //       status: 500,
  //     });
  //   }
  // }
  async updateManager(req, res) {
    try {
      const result = await validator.updateManagerSchema.validateAsync(
        req.body
      );

      for (const iterator of result) {
        if (iterator.user === iterator.manager) {
          return respHelper(res, {
            msg: `Employee can't be their own manager`,
            status: 400,
          });
        }
      }
      let error = false;
      for (const iterator of result) {
        const recordsExistForDate = await db.managerHistory.findOne({
          raw: true,
          where: {
            fromDate: iterator.date,
            needAttendanceCron: 1,
            employeeId: iterator.user,
          },
        });
        if (!recordsExistForDate) {
          const userData = await db.employeeMaster.findOne({
            attributes:['id','manager'],
            where: {
              id:  iterator.user,
            },
          });

          const currentManagerOfTheEmployeeExist = await db.managerHistory.findOne({ where: { employeeId:iterator.user, }, });
           if(!currentManagerOfTheEmployeeExist){ 
            await db.managerHistory.create({ 
          employeeId:iterator.user,
          managerId:userData.manager,
          fromDate:moment(userData.createdAt).format("YYYY-MM-DD"),
          needAttendanceCron:0
               }
              ); 
            }
          let createHistory = {
            employeeId: iterator.user,
            managerId: iterator.manager,
            fromDate: iterator.date
              ? iterator.date
              : moment().add(1, "day").format("YYYY-MM-DD"),
            toDate: null,
            createdBy: req.userId,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          await db.managerHistory.create(createHistory);
        } else {
          error = true;
        }
      }

      if (error) {
        return respHelper(res, {
          status: 400,
          msg: "Record Already Exist for the selected date",
        });
      } else {
        return respHelper(res, {
          status: 200,
          msg: "Record Added",
        });
      }
    } catch (error) {
      console.log("error", error);
      if (error.isJoi) {
        return respHelper(res, {
          msg: error.details[0].message,
          status: 422,
        });
      }
      return respHelper(res, {
        status: 500,
      });
    }
  }

  /**
   * Employee onboarding flow
   */

  async onboardEmployee(req, res) {
    try {
      const result = await validator.onboardEmployeeSchema.validateAsync(
        req.body
      );
      let query = {
        [Op.or]: [
          { personalMobileNumber: result.personalMobileNumber },
          { personalEmail: result.personalEmail },
        ],
      };

      // Initialize an array for additional conditions
      const additionalConditions = [];

      // Add companyEmail condition if it's provided
      if (result.email && result.email.trim() !== "") {
        additionalConditions.push({ email: result.email });
      }

      // Add officeMobileNumber condition if it's provided
      if (
        result.officeMobileNumber &&
        result.officeMobileNumber.trim() !== ""
      ) {
        additionalConditions.push({
          officeMobileNumber: result.officeMobileNumber,
        });
      }

      // If there are additional conditions, add them to the main query
      if (additionalConditions.length > 0) {
        query[Op.or] = [...query[Op.or], ...additionalConditions];
      }

      let existUser = await db.employeeMaster.findOne({ where: query });

      if (existUser) {
        if (
          existUser.personalEmail === result.personalEmail ||
          existUser.personalMobileNumber === result.personalMobileNumber
        ) {
          return respHelper(res, {
            status: 400,
            msg: "Employee personal email/mobile no. already exists.",
          });
        } else {
          return respHelper(res, {
            status: 400,
            msg: "Employee company email or official mobile no. already exists.",
          });
        }
      } else {
        existUser = await db.employeeStagingMaster.findOne({ where: query });

        if (existUser) {
          if (
            existUser.personalEmail === result.personalEmail ||
            existUser.personalMobileNumber === result.personalMobileNumber
          ) {
            return respHelper(res, {
              status: 400,
              msg: "Employee personal email/mobile no. already exists.",
            });
          } else {
            return respHelper(res, {
              status: 400,
              msg: "Employee company email or official mobile no. already exists.",
            });
          }
        } else {
          result.role_id = 3;
          result.offRoleCTC = (result.offRoleCTC) ? result.offRoleCTC : 0;

          const createdUser = await db.employeeStagingMaster.create(result);

          if (result.image) {
            const file = await helper.fileUpload(
              result.image,
              "profileImage",
              `uploads/${createdUser.dataValues.id.toString()}`
            );
            await db.employeeStagingMaster.update(
              { profileImage: file },
              { where: { id: createdUser.dataValues.id } }
            );
          }
          return respHelper(res, {
            status: 200,
            msg: "Employee added successfully.",
          });
        }
      }
    } catch (error) {
      logger.error("Error while creating employee", error);
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

  async getOnboardEmployee(req, res) {
    try {
      const { search, filterType, filterValue } = req.query;
      let department = "";
      let designation = "";
      let buSearch = "";
      let sbuSearch = "";
      let areaSearch = "";

      if (filterType == "department") {
        department = filterValue;
      } else if (filterType == "designation") {
        designation = filterValue;
      } else if (filterType == "buSearch") {
        buSearch = filterValue;
      } else if (filterType == "sbuSearch") {
        sbuSearch = filterValue;
      } else if (filterType == "areaSearch") {
        areaSearch = filterValue;
      }

      const isActive = req.query.isActive || 1;
      let buFIlter = {};
      let sbbuFIlter = {};
      let functionAreaFIlter = {};
      let departmentFIlter = {};
      let designationFIlter = {};
      const usersData = req.userData;

      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const activeQuery = { isActive: isActive };

      if (
        usersData.role_id != 1 &&
        usersData.role_id != 2 &&
        usersData.role_id != 5
      ) {
        let permissionAssignTousers = [];
        if (usersData.permissionAndAccess) {
          permissionAssignTousers = usersData.permissionAndAccess
            .split(",")
            .map((el) => parseInt(el));
        }
        let permissionAndAccess = await db.permissoinandaccess.findAll({
          where: {
            role_id: usersData.role_id,
            isActive: 1,
            permissoinandaccessId: {
              [Op.in]: permissionAssignTousers,
            },
          },
        }); /// get all permission of access to fetch list with active status as per role

        const buArrayForFilter = permissionAndAccess
          .filter((obj) => obj.permissionType == "BU")
          .map((obj) => obj.permissionValue); // checking BU Access

        if (buArrayForFilter.length > 0) {
          buFIlter.buId = {
            ///appedning Bu to filter
            [Op.in]: buArrayForFilter,
          };
        }

        const sbuArrayForFilter = permissionAndAccess
          .filter((obj) => obj.permissionType == "SBU")
          .map((obj) => obj.permissionValue); // checking SBU Access
        if (sbuArrayForFilter.length > 0) {
          sbbuFIlter.sbuId = {
            ///appedning SBU to filter
            [Op.in]: sbuArrayForFilter,
          };
        }

        const departmentArrayForFilter = permissionAndAccess
          .filter((obj) => obj.permissionType == "DEPARTMENT")
          .map((obj) => obj.permissionValue); // checking department Access

        if (departmentArrayForFilter.length > 0) {
          departmentFIlter.departmentId = {
            ///appedning department to filter
            [Op.in]: departmentArrayForFilter,
          };
        }
        const funcareaArrayForFilter = permissionAndAccess
          .filter((obj) => obj.permissionType == "FUNCAREA")
          .map((obj) => obj.permissionValue); // checking SBU Access

        if (funcareaArrayForFilter.length > 0) {
          functionAreaFIlter.functionalAreaId = {
            ///appedning SBU to filter
            [Op.in]: funcareaArrayForFilter,
          };
        }

        const designationArrayForFilter = permissionAndAccess
          .filter((obj) => obj.permissionType == "DESIGNATION")
          .map((obj) => obj.permissionValue); // checking SBU Access

        if (designationArrayForFilter.length > 0) {
          designationFIlter.designationId = {
            ///appedning SBU to filter
            [Op.in]: designationArrayForFilter,
          };
        }
      }

      let employeeData = await db.employeeStagingMaster.findAndCountAll({
        order: [["id", "desc"]],
        limit,
        offset,
        where: Object.assign(
          search
            ? {
              [Op.or]: [
                {
                  name: {
                    [Op.like]: `%${search}%`,
                  },
                },
                {
                  email: {
                    [Op.like]: `%${search}%`,
                  },
                },
              ],
              [Op.and]: [
                {
                  isActive:
                    usersData.role_id == 1 || usersData.role_id == 2
                      ? [1, 0]
                      : [1],
                },
              ],
              [Op.and]: activeQuery,
            }
            : {
              [Op.and]: [
                {
                  isActive:
                    usersData.role_id == 1 || usersData.role_id == 2
                      ? [1, 0]
                      : [1],
                },
              ],
              [Op.and]: activeQuery,
            }
        ),
        attributes: [
          "id",
          "name",
          "email",
          "personalEmail",
          "firstName",
          "lastName",
          "officeMobileNumber",
          "personalMobileNumber",
          "buId",
          "sbuId",
          "isActive",
        ],
        include: [
          {
            model: db.designationMaster,
            seperate: true,
            attributes: ["name"],
            where: {
              ...(designation && {
                name: { [Op.like]: `%${designation}%` },
              }),
              ...designationFIlter,
            },
          },
          {
            model: db.departmentMaster,
            seperate: true,
            attributes: ["departmentName"],
            where: {
              ...(department && {
                departmentName: { [Op.like]: `%${department}%` },
              }),
              ...departmentFIlter,
            },
          },
          {
            model: db.buMaster,
            seperate: true,
            attributes: ["buName", "buCode"],
            where: {
              ...(buSearch && { buName: { [Op.like]: `%${buSearch}%` } }),
              ...buFIlter,
            },
          },
          {
            model: db.sbuMaster,
            seperate: true,
            attributes: ["sbuname", "code"],
            where: {
              ...(sbuSearch && {
                sbuname: { [Op.like]: `%${sbuSearch}%` },
              }),
              ...sbbuFIlter,
            },
          },
          {
            model: db.functionalAreaMaster,
            seperate: true,
            attributes: ["functionalAreaName"],
            where: {
              ...(areaSearch && {
                functionalAreaName: { [Op.like]: `%${areaSearch}%` },
              }),
              ...functionAreaFIlter,
            },
          },
          {
            model: db.companyLocationMaster,
            attributes: ["address1", "address2"],
          },
        ],
      });

      if (employeeData.rows.length > 0) {
        return respHelper(res, {
          status: 200,
          data: employeeData,
        });
      } else {
        return respHelper(res, {
          status: 404,
          msg: constant.DATA_BLANK,
          data: employeeData,
        });
      }
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async createTMC(req, res) {
    try {
      const result = await validator.createTMCSchema.validateAsync(req.body);
      const selectedUsers = result.selectedUsers;

      // find and create TMC
      for (let i = 0; i < selectedUsers.length; i++) {
        // get employee on-boarding details by id
        const employeeOnboardingDetails =
          await db.employeeStagingMaster.findOne({
            where: { id: selectedUsers[i] },
          });
        if (employeeOnboardingDetails) {
          let query = {
            [Op.or]: [
              {
                personalMobileNumber:
                  employeeOnboardingDetails.personalMobileNumber,
              },
              { personalEmail: employeeOnboardingDetails.personalEmail },
            ],
          };

          // Initialize an array for additional conditions
          const additionalConditions = [];

          // Add companyEmail condition if it's provided
          if (
            employeeOnboardingDetails.email &&
            employeeOnboardingDetails.email.trim() !== ""
          ) {
            additionalConditions.push({
              email: employeeOnboardingDetails.email,
            });
          }

          // Add officeMobileNumber condition if it's provided
          if (
            employeeOnboardingDetails.officeMobileNumber &&
            employeeOnboardingDetails.officeMobileNumber.trim() !== ""
          ) {
            additionalConditions.push({
              officeMobileNumber: employeeOnboardingDetails.officeMobileNumber,
            });
          }

          // If there are additional conditions, add them to the main query
          if (additionalConditions.length > 0) {
            query[Op.or] = [...query[Op.or], ...additionalConditions];
          }

          const existUser = await db.employeeMaster.findOne({ where: query });

          if (existUser) {
            if (
              existUser.personalEmail ===
              employeeOnboardingDetails.personalEmail ||
              existUser.personalMobileNumber ===
              employeeOnboardingDetails.personalMobileNumber
            ) {
              return respHelper(res, {
                status: 400,
                msg: "Employee personal email/mobile no. already exists.",
              });
            } else {
              return respHelper(res, {
                status: 400,
                msg: "Employee company email or official mobile no. already exists.",
              });
            }
          } else {
            let currentDate = new Date();
            let dateOfJoining = new Date(
              employeeOnboardingDetails.dateOfJoining
            );
            if (dateOfJoining <= currentDate) {
              const employeeTypeDetails = await db.employeeTypeMaster.findOne({
                where: {
                  empTypeId: employeeOnboardingDetails.employeeType,
                  companyId: employeeOnboardingDetails.companyId,
                },
                attributes: ["empTypeId", "prefix", "startingIndex"],
              });
              if (employeeTypeDetails) {
                let startingIndex =
                  parseInt(employeeTypeDetails.startingIndex) + 1;

                if (employeeTypeDetails.prefix) {
                  startingIndex = `${employeeTypeDetails.prefix}-${startingIndex}`;
                }

                const empCode = startingIndex;
                const password = await helper.generateRandomPassword();
                const encryptedPassword = await helper.encryptPassword(
                  password
                );

                let newEmployee = {
                  name: employeeOnboardingDetails.name,
                  email: employeeOnboardingDetails.email,
                  personalEmail: employeeOnboardingDetails.personalEmail,
                  firstName: employeeOnboardingDetails.firstName,
                  middleName: employeeOnboardingDetails.middleName,
                  lastName: employeeOnboardingDetails.lastName,
                  panNo: employeeOnboardingDetails.panNo,
                  uanNo: employeeOnboardingDetails.uanNo,
                  pfNo: employeeOnboardingDetails.pfNo,
                  employeeType: employeeOnboardingDetails.employeeType,
                  profileImage: employeeOnboardingDetails.profileImage,
                  officeMobileNumber:
                    employeeOnboardingDetails.officeMobileNumber,
                  personalMobileNumber:
                    employeeOnboardingDetails.personalMobileNumber,
                  dateOfJoining: employeeOnboardingDetails.dateOfJoining,

                  manager: employeeOnboardingDetails.manager,
                  designation_id: employeeOnboardingDetails.designation_id,
                  functionalAreaId: employeeOnboardingDetails.functionalAreaId,
                  buId: employeeOnboardingDetails.buId,
                  sbuId: employeeOnboardingDetails.sbuId,
                  shiftId: employeeOnboardingDetails.shiftId,
                  departmentId: employeeOnboardingDetails.departmentId,
                  companyId: employeeOnboardingDetails.companyId,
                  buHRId: employeeOnboardingDetails.buHRId,
                  buHeadId: employeeOnboardingDetails.buHeadId,
                  attendancePolicyId:
                    employeeOnboardingDetails.attendancePolicyId,
                  companyLocationId:
                    employeeOnboardingDetails.companyLocationId,
                  weekOffId: employeeOnboardingDetails.weekOffId,

                  newCustomerName: employeeOnboardingDetails.newCustomerName,
                  iqTestApplicable: employeeOnboardingDetails.iqTestApplicable,
                  positionType: employeeOnboardingDetails.positionType,
                  password: encryptedPassword,
                  role_id: 3,
                  empCode: empCode,
                  isTempPassword: 1,

                  selfService: employeeOnboardingDetails.selfService,
                  offRoleCTC: employeeOnboardingDetails.offRoleCTC,
                  highestQualification:
                    employeeOnboardingDetails.highestQualification,
                  ESICPFDeduction: employeeOnboardingDetails.ESICPFDeduction,
                  fatherName: employeeOnboardingDetails.fatherName,
                  workstationAdmin: employeeOnboardingDetails.workstationAdmin,
                  mobileAdmin: employeeOnboardingDetails.mobileAdmin,
                  dataCardAdmin: employeeOnboardingDetails.dataCardAdmin,
                  visitingCardAdmin:
                    employeeOnboardingDetails.visitingCardAdmin,
                  recruiterName: employeeOnboardingDetails.recruiterName,
                  noticePeriodAutoId:
                    employeeOnboardingDetails.noticePeriodAutoId,
                };

                const createdUser = await db.employeeMaster.create(newEmployee);
                await db.employeeTypeMaster.update(
                  {
                    startingIndex:
                      parseInt(employeeTypeDetails.startingIndex) + 1,
                  },
                  {
                    where: {
                      empTypeId: employeeOnboardingDetails.employeeType,
                    },
                  }
                );

                let newEmployeeBioDetails = {
                  userId: createdUser.id,
                  nationality: employeeOnboardingDetails.nationality,
                  maritalStatus: employeeOnboardingDetails.maritalStatus,
                  maritalStatusSince:
                    employeeOnboardingDetails.maritalStatusSince,
                  gender: employeeOnboardingDetails.gender,
                  dateOfBirth: employeeOnboardingDetails.dateOfBirth,
                  mobileAccess: employeeOnboardingDetails.mobileAccess,
                  laptopSystem: employeeOnboardingDetails.laptopSystem,
                  backgroundVerification:
                    employeeOnboardingDetails.backgroundVerification,
                };

                const createdUserBioDetails =
                  await db.biographicalDetails.create(newEmployeeBioDetails);

                // get probation details
                let getProbationDetails = await db.probationMaster.findOne({
                  where: { probationId: employeeOnboardingDetails.probationId },
                });
                if (getProbationDetails) {
                  let probationName = getProbationDetails.probationName;
                  let durationOfProbation =
                    getProbationDetails.durationOfProbation;

                  let newEmployeeJobDetails = {
                    userId: createdUser.id,
                    dateOfJoining: employeeOnboardingDetails.dateOfJoining,
                    probationPeriod: `${probationName}(${durationOfProbation} day(s))`,
                    probationDays: durationOfProbation,
                    jobLevelId: employeeOnboardingDetails.jobLevelId,
                  };

                  const createdUserJobDetails = await db.jobDetails.create(
                    newEmployeeJobDetails
                  );

                  if (employeeOnboardingDetails.employeeType == 3) {
                    let newEmployeePaymentDetails = {
                      userId: createdUser.id,
                      paymentAccountNumber:
                        employeeOnboardingDetails.paymentAccountNumber,
                      paymentBankName:
                        employeeOnboardingDetails.paymentBankName,
                      paymentBankIfsc:
                        employeeOnboardingDetails.paymentBankIfsc,
                      status: "approved",
                    };

                    const createdUserPaymentDetails =
                      await db.paymentDetails.create(newEmployeePaymentDetails);
                  }

                  eventEmitter.emit(
                    "onboardingEmployeeMail",
                    JSON.stringify({
                      email: employeeOnboardingDetails.email,
                      firstName: employeeOnboardingDetails.firstName,
                      empCode: empCode,
                      password: password,
                    })
                  );

                  await db.employeeStagingMaster.destroy({
                    where: {
                      id: selectedUsers[i],
                    },
                  });
                }
              } else {
                return respHelper(res, {
                  status: 403,
                  msg: constant.INVALID_ID.replace("<module>", "Employee Type"),
                });
              }
            } else {
              return respHelper(res, {
                status: 400,
                msg: "Employee having DOJ in future dates, their TMC is not created in the current date.",
              });
            }
          }
        } else {
          return respHelper(res, {
            status: 403,
            msg: constant.INVALID_ID.replace(
              "<module>",
              "Employee On-boarding"
            ),
          });
        }
      }

      return respHelper(res, {
        status: 200,
        msg: "TMC has been created successfully.",
      });
    } catch (error) {
      console.log(error);
      logger.error(error);
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

  async changeStatusOnboardEmployee(req, res) {
    try {
      let id = req.params.id;
      let condition = { id: id };
      let getResult = await db.employeeStagingMaster.findOne({
        where: { id: id },
        attributes: ["id", "isActive"],
        raw: true,
      });
      if (getResult) {
        let result = await db.employeeStagingMaster.update(
          { isActive: getResult.isActive == 0 ? 1 : 0 },
          { where: condition }
        );
        return respHelper(res, {
          status: 202,
          msg: constant.UPDATE_SUCCESS.replace(
            "<module>",
            "On-boarding employee status"
          ),
        });
      } else {
        return respHelper(res, {
          status: 401,
          msg: constant.INVALID_ID.replace(
            "<module>",
            "On-boarding employee status"
          ),
        });
      }
    } catch (error) {
      logger.error(
        "Error while getting activate/deactivate status of on-boarding employee",
        error
      );
      return respHelper(res, { status: 500, msg: error?.parent?.sqlMessage });
    }
  }

  async updateOnboardEmployee(req, res) {
    try {
      let id = req.params.id;
      let condition = { id: id };
      const updateMetaData =
        await validator.onboardEmployeeSchema.validateAsync(req.body);

      let query = {
        [Op.or]: [
          { personalMobileNumber: updateMetaData.personalMobileNumber },
          ...(updateMetaData.email ? [{ email: updateMetaData.email }] : []),
          ...(updateMetaData.officeMobileNumber
            ? [{ officeMobileNumber: updateMetaData.officeMobileNumber }]
            : []),
          { personalEmail: updateMetaData.personalEmail },
        ],
        [Op.and]: [{ id: { [Op.not]: id } }],
      };

      let existUser = await db.employeeMaster.findOne({ where: query });

      if (existUser) {
        if (
          existUser.email === updateMetaData.email ||
          existUser.officeMobileNumber === updateMetaData.officeMobileNumber
        ) {
          return respHelper(res, {
            status: 400,
            msg: "Employee company email/mobile no. already exists.",
          });
        } else {
          return respHelper(res, {
            status: 400,
            msg: "Employee personal email/mobile no. already exists.",
          });
        }
      }

      let result = await db.employeeStagingMaster.update(updateMetaData, {
        where: condition,
      });

      // update image
      if (updateMetaData.image) {
        const file = await helper.fileUpload(
          updateMetaData.image,
          "profileImage",
          `uploads/${id.toString()}`
        );
        await db.employeeStagingMaster.update(
          { profileImage: file },
          { where: { id: id } }
        );
      }

      return respHelper(res, {
        status: 202,
        msg: constant.UPDATE_SUCCESS.replace("<module>", "Employee details"),
      });
    } catch (error) {
      logger.error("Error while getting update employee details", error);
      if (error.isJoi === true) {
        return respHelper(res, {
          status: 422,
          msg: error.details[0].message,
        });
      } else {
        return respHelper(res, {
          status: 500,
          msg: error?.parent?.sqlMessage,
        });
      }
    }
  }

  async getOnboardEmployeeDetails(req, res) {
    try {
      let id = req.params.id;
      let condition = { id: id };
      let attributes = [
        "name",
        "firstName",
        "middleName",
        "lastName",
        "email",
        "personalEmail",
        "officeMobileNumber",
        "personalMobileNumber",
        "panNo",
        "uanNo",
        "pfNo",
        "employeeType",
        "profileImage",
        "dateOfJoining",
        "manager",
        "designation_id",
        "functionalAreaId",
        "buId",
        "sbuId",
        "shiftId",
        "departmentId",
        "companyId",
        "buHRId",
        "buHeadId",
        "attendancePolicyId",
        "companyLocationId",
        "weekOffId",
        "gender",
        "maritalStatus",
        "maritalStatusSince",
        "nationality",
        "probationId",
        "dateOfBirth",
        "newCustomerNameId",
        "iqTestApplicable",
        "positionType",
        "jobLevelId",
        "selfService",
        "mobileAccess",
        "laptopSystem",
        "backgroundVerification",
        "workstationAdmin",
        "mobileAdmin",
        "dataCardAdmin",
        "visitingCardAdmin",
        "recruiterName",
        "offRoleCTC",
        "highestQualification",
        "ESICPFDeduction",
        "fatherName",
        "paymentAccountNumber",
        "paymentBankName",
        "paymentBankIfsc",
        "noticePeriodAutoId",
      ];

      let result = await db.employeeStagingMaster.findOne({
        where: condition,
        attributes: attributes,
        include: [
          { model: db.companyMaster, attributes: ['companyId', 'companyName'] },
          { model: db.shiftMaster, attributes: ['shiftId', 'shiftName'] },
          { model: db.attendancePolicymaster, attributes: ['attendancePolicyId', 'policyName'] },
          { model: db.weekOffMaster, attributes: ['weekOffId', 'weekOffName'] },
          { model: db.employeeMaster, attributes: ['id', 'name', 'empCode'] },
          { model: db.designationMaster, attributes: ['designationId', 'name', 'code'] },
        ]
      });
      if (result) {

        let subQuery = { 'isActive': 1 };

        const buData = await db.buMapping.findAll({
          where: { companyId: result.companyId },
          include: [
            {
              model: db.buMaster,
              where: subQuery,
              attributes: ["buId", "buName", "buCode"],
            },
          ],
        });

        const mappingBU = buData.find(bu => bu.buId === result.buId);

        const sbuData = await db.sbuMapping.findAll({
          where: { 'buMappingId': mappingBU.buMappingId },
          include: [
            {
              model: db.sbuMaster,
              where: subQuery,
              attributes: ["sbuId", "sbuName", "code"],
            },
          ],
        });

        const mappingSBU = sbuData.find(bu => bu.sbuId === result.sbuId);

        const departmentData = await db.departmentMapping.findAll({
          where: { sbuMappingId: mappingSBU.sbuMappingId },
          include: [
            {
              model: db.departmentMaster,
              where: subQuery,
              attributes: ["departmentId", "departmentName", "departmentCode"],
            },
          ],
        });

        const mappingDepartment = departmentData.find(bu => bu.departmentId === result.departmentId);

        const functionalAreaData = await db.functionalAreaMapping.findAll({
          where: { departmentMappingId: mappingDepartment.departmentMappingId },
          include: [
            {
              model: db.functionalAreaMaster,
              where: subQuery,
              attributes: [
                "functionalAreaId",
                "functionalAreaName",
                "functionalAreaCode",
              ],
            },
          ],
        });

        const buhrData = await db.buMapping.findAll({
          where: { 'buMappingId': mappingBU.buMappingId },
          include: [
            {
              model: db.employeeMaster,
              where: subQuery,
              attributes: ["id", "name"],
              as: "buhrData",
            },
          ],
        });

        const buheadData = await db.buMapping.findAll({
          where: { 'buMappingId': mappingBU.buMappingId },
          include: [
            {
              model: db.employeeMaster,
              where: subQuery,
              attributes: ["id", "name"],
              as: "buHeadData",
            },
          ],
        });

        const companyLocationData = await db.companyLocationMaster.findAll({
          where: { 'isActive': 1, 'companyId': result.companyId },
          attributes: ["companyLocationId", "address1", "companyLocationCode"],
          include: [{ model: db.cityMaster, attributes: ["cityName"] }],
        });

        const employeeTypeData = await db.employeeTypeMaster.findAll({ where: subQuery });
        const probationData = await db.probationMaster.findAll({ where: subQuery, attributes: ["probationId", "probationName"] });
        const newCustomerNameData = await db.newCustomerNameMaster.findAll({ where: subQuery, attributes: ["newCustomerNameId", "newCustomerName"] });
        const jobLevelData = await db.jobLevelMaster.findAll({ where: subQuery });
        // const noticePeriodData = await db.noticePeriodMaster.findAll({ where: subQuery, attributes: ["noticePeriodAutoId", "noticePeriodName"] });
        const noticePeriodData = [];
        const degreeData = await db.degreeMaster.findAll({ where: subQuery, attributes: ["degreeId", "degreeName"] });

        let allDetails = {
          result, buData, sbuData, departmentData, functionalAreaData, buhrData, buheadData,
          companyLocationData, employeeTypeData, probationData, newCustomerNameData, jobLevelData, noticePeriodData, degreeData
        };

        return respHelper(res, {
          status: 200,
          msg: constant.DATA_FETCHED,
          data: allDetails,
        });
      } else {
        return respHelper(res, {
          status: 400,
          msg: constant.DATA_BLANK,
          data: {},
        });
      }
    } catch (error) {
      logger.error("Error while getting on-boarding employee details", error);
      return respHelper(res, { status: 500, msg: error?.parent?.sqlMessage });
    }
  }
  async updatePolicyOfEMP(req, res) {
    try {
      const result = await validator.updatePolicyOfEMP.validateAsync(req.body);

      let error = false;
      for (const iterator of result) {
        const recordsExistForDate = await db.PolicyHistory.findOne({
          raw: true,
          where: {
            fromDate: iterator.date,
            needAttendanceCron: 1,
            employeeId: iterator.user,
          },
        });
        if (!recordsExistForDate) {
          let createHistory = {
            employeeId: iterator.user,
            shiftPolicy: iterator.shiftPolicy
              ? iterator.shiftPolicy
              : iterator.currentshiftPolicy,
            currentshiftPolicy: iterator.currentshiftPolicy,
            attendancePolicy: iterator.attendancePolicy
              ? iterator.attendancePolicy
              : iterator.currentattendancePolicy,
            currentattendancePolicy: iterator.currentattendancePolicy,
            weekOffPolicy: iterator.weekOffPolicy
              ? iterator.weekOffPolicy
              : iterator.currentweekOffPolicy,
            currentweekOffPolicy: iterator.currentweekOffPolicy,
            fromDate: iterator.date
              ? iterator.date
              : moment().add(1, "day").format("YYYY-MM-DD"),
            toDate: null,
            createdBy: req.userId,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          await db.PolicyHistory.create(createHistory);
        } else {
          error = true;
        }
      }

      if (error) {
        return respHelper(res, {
          status: 400,
          msg: "Record Already Exist for the selected date",
        });
      } else {
        return respHelper(res, {
          status: 200,
          data: result,
          msg: "Record Added",
        });
      }
    } catch (error) {
      console.log("error", error);
      if (error.isJoi) {
        return respHelper(res, {
          msg: error.details[0].message,
          status: 422,
        });
      }
      return respHelper(res, {
        status: 500,
      });
    }
  }
}

export default new AdminController();
