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
      if(employeeTypeDetails) {

        let startingIndex = parseInt(employeeTypeDetails.startingIndex) + 1;
    
        if(employeeTypeDetails.empTypeId != 4) {
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
        await db.employeeTypeMaster.update({ 'startingIndex': parseInt(employeeTypeDetails.startingIndex) + 1 }, { where: { 'empTypeId': result.employeeType }})
  
        if(result.image) {
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

}

export default new AdminController();
