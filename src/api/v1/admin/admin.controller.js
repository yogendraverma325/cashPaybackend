import db from "../../../config/db.config.js";
import validator from "../../../helper/validator.js";
import logger from "../../../helper/logger.js";
import helper from "../../../helper/helper.js";
import respHelper from "../../../helper/respHelper.js";
import constant from "../../../constant/messages.js";
import eventEmitter from "../../../services/eventService.js";
import bcrypt from "bcrypt";
import commonController from "../common/common.controller.js";

class AdminController {
  async addEmployee(req, res) {
    try {
      const result = await validator.userCreationSchema.validateAsync(req.body);

      const existUser = await db.employeeMaster.findOne({
        where: {
          personalMobileNumber: result.personalMobileNumber,
        },
      });

      if (existUser) {
        return respHelper(res, {
          status: 400,
          msg: constant.ALREADY_EXISTS.replace('<module>', 'User'),
        });
      }

      const maxCode = await db.employeeMaster.max("empCode");
      const salt = await bcrypt.genSalt(10);

      result.password = await bcrypt.hash("test1234", salt);
      result.role_id = 3;
      result.empCode = parseInt(maxCode) + 1;
      const createdUser = await db.employeeMaster.create(result);

      const file = helper.fileUpload(
        result.image,
        "profileImage.jpg",
        `uploads/${createdUser.dataValues.id.toString()}`
      );

      await db.employeeMaster.update(
        { profileImage: file },
        { where: { id: createdUser.dataValues.id } }
      );

      return respHelper(res, {
        status: 200,
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

  async unlockAccount(req, res) {
    try {

      const result = await validator.unlockAccountSchema.validateAsync(req.body)

      await db.employeeMaster.update({
        wrongPasswordCount: 0,
        accountRecoveryTime: null
      }, {
        where: {
          empCode: result.employeeCode
        }
      })

      return respHelper(res, {
        status: 200,
        msg: constant.ACCOUNT_UNLOCKED
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
  };

  async dashboardCard(req, res) {
    try {
      await commonController.dashboardCard(req, res)
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(req, res) {
    try {
      const result = await validator.unlockAccountSchema.validateAsync(req.body)

      const existUser = await db.employeeMaster.findOne({
        raw: true,
        where: {
          empCode: result.employeeCode
        }
      })

      const newPassword = await helper.generateRandomPassword()

      const encryptedPassword = await helper.encryptPassword(newPassword)

      await db.employeeMaster.update({
        password: encryptedPassword,
        isTempPassword: 1
      }, {
        where: {
          empCode: result.employeeCode
        }
      })

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
  };

  async updateUserStatus(req, res) {
    try {

      for (const iterator of req.body) {

        await db.employeeMaster.update({
          isActive: iterator.status,
          id: iterator.user
        }, {
          where: {
            id: iterator.user
          }
        })

      }

      return respHelper(res, {
        status: 200,
        msg: "Status Updated"
      });

    } catch (error) {
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async updateManager(req, res) {
    try {

      for (const iterator of req.body) {
        await db.employeeMaster.update({
          manager: iterator.manager,
          id: iterator.user
        }, {
          where: {
            id: iterator.user
          }
        })
      }

      return respHelper(res, {
        status: 200,
      });

    } catch (error) {
      return respHelper(res, {
        status: 500,
      });
    }
  }
}

export default new AdminController();
