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
            { 'personalMobileNumber': result.personalMobileNumber },
            { 'email': result.email }
          ]
        },
      });

      if (existUser) {
        return respHelper(res, {
          status: 400,
          msg: constant.ALREADY_EXISTS.replace("<module>", "User"),
        });
      }

      const employeeTypeDetails = await db.employeeTypeMaster.findOne({ where: { 'empTypeId': result.employeeType }, attributes: ['empTypeId', 'empTypeCode', 'startingIndex'] });
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
        await db.employeeTypeMaster.update({ 'startingIndex': parseInt(employeeTypeDetails.startingIndex) + 1 }, { where: { 'empTypeId': result.employeeType } })

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
      }
      else {
        return respHelper(res, {
          status: 403,
          msg: constant.INVALID_ID.replace("<module>", "Employee Type")
        });
      }

    }
    catch (error) {
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

  async updateManager(req, res) {
    try {
      const result = await validator.updateManagerSchema.validateAsync(req.body)

      for (const iterator of result) {
        let getInfoEmp = await db.employeeMaster.findOne({
          attributes: ["id", "empCode", "name", "manager", "createdAt", "updatedAt"],
          where: { id: iterator.user },
        });
        if (getInfoEmp) {
          let createHistory = {
            employeeId: getInfoEmp.dataValues.id,
            managerId: getInfoEmp.dataValues.manager ? getInfoEmp.dataValues.manager : 1,
            fromDate: moment(getInfoEmp.dataValues.createdAt).format("YYYY-MM-DD"),
            toDate: moment().format("YYYY-MM-DD"),
            createdBy: req.userId,
            updatedBy: req.userId,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          await db.managerHistory.create(createHistory);
          await db.employeeMaster.update(
            {
              manager: iterator.manager
            },
            {
              where: {
                id: iterator.user,
              },
            }
          );
        } else {
          console.log("employee not found");
        }
      }

      return respHelper(res, {
        status: 200,
      });
    } catch (error) {
      console.log("error", error);
      if (error.isJoi) {
        return respHelper(res, {
          msg: error.details[0].message,
          status: 422
        })
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
      const result = await validator.onboardEmployeeSchema.validateAsync(req.body);

      const existUser = await db.employeeStagingMaster.findOne({
        where: {
          [Op.or]: [
            { 'personalMobileNumber': result.personalMobileNumber },
            { 'email': result.email }
          ]
        },
      });

      if (existUser) {
        return respHelper(res, {
          status: 400,
          msg: constant.ALREADY_EXISTS.replace("<module>", "User"),
        });
      }

      const password = await helper.generateRandomPassword();
      const encryptedPassword = await helper.encryptPassword(password);

      result.password = encryptedPassword;
      result.role_id = 3;
      result.isTempPassword = 1;

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
        msg: "Onboarding has been completed successfully.",
      });

  }
  catch(error) {
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

  async getOnboardEmployee(req, res) {
    try {
      const {
        search,
        department,
        designation,
        buSearch,
        sbuSearch,
        areaSearch,
      } = req.query;

      let buFIlter = {};
      let sbbuFIlter = {};
      let functionAreaFIlter = {};
      let departmentFIlter = {};
      let designationFIlter = {};
      const usersData = req.userData;

      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const cacheKey = `employeeStagingList:${pageNo}:${limit}:${search || ""}:${department || ""
        }:${designation || ""}:${buSearch || ""}:${sbuSearch || ""}:${areaSearch || ""
        }`;

      let employeeData = [];
      await client.get(cacheKey).then(async (data) => {
        if (data) {
          employeeData = JSON.parse(data);
          return respHelper(res, {
            status: 200,
            data: employeeData,
          });
        } else {
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

          employeeData = await db.employeeStagingMaster.findAndCountAll({
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
                }
            ),
            attributes: [
              "id",
              "name",
              "email",
              "firstName",
              "lastName",
              "officeMobileNumber",
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
                attributes: ["address1", "address2"]
              }
            ],
          });

          const employeeJson = JSON.stringify(employeeData);
          await client.setEx(cacheKey, parseInt(process.env.TTL), employeeJson); // Cache for 2.3 minutes

          return respHelper(res, {
            status: 200,
            data: employeeData,
          });
        }
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

}

export default new AdminController();
