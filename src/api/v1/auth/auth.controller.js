import validator from "../../../helper/validator.js";
import db from "../../../config/db.config.js";
import helper from "../../../helper/helper.js";
import respHelper from "../../../helper/respHelper.js";
import constant from "../../../constant/messages.js";
import bcrypt from "bcrypt";
import moment from "moment";
import fs from 'fs';
import { cwd } from 'process';


class AuthController {

  async login(req, res) {
    try {

      console.log("req device server --->>", req.deviceSource)

      const result = await validator.loginSchema.validateAsync(req.body);
      const existUser = await db.employeeMaster.findOne({
        where: { empCode: result.tmc, isActive: 1 },
        include: [
          {
            model: db.roleMaster,
          },
          {
            model: db.designationMaster,
            attributes: ["designationId", "name"],
          }
        ],
      });

      if (!existUser) {
        return respHelper(res, {
          status: 404,
          msg: constant.USER_NOT_EXIST,
        });
      }

      if (existUser.dataValues.wrongPasswordCount === parseInt(process.env.WRONG_PASSWORD_LIMIT)) {
        return respHelper(res, {
          status: 404,
          msg: constant.ACCOUNT_LOCKED,
        });
      }

      const comparePass = await bcrypt.compare(
        result.password,
        existUser.password
      );

      if (!comparePass) {
        await db.employeeMaster.update(
          Object.assign(
            { wrongPasswordCount: existUser.dataValues.wrongPasswordCount + 1 },
            (existUser.dataValues.wrongPasswordCount === 2) ? {
              accountRecoveryTime: moment().add(parseInt(process.env.ACCOUNT_RECOVERY_TIME), 'hours')
            } : null
          ), {
          where: {
            id: existUser.dataValues.id
          }
        })

        if (existUser.dataValues.wrongPasswordCount === (parseInt(process.env.WRONG_PASSWORD_LIMIT) - 1)) {
          return respHelper(res, {
            status: 404,
            msg: constant.REACHED_WRONG_PASSWORD_LIMIT,
          });
        }

        return respHelper(res, {
          status: 404,
          msg: constant.INVALID_CREDENTIALS,
        });
      }

      delete existUser.dataValues.password;

      await db.employeeMaster.update(
        { lastLogin: moment(), wrongPasswordCount: 0 },
        {
          where: { id: existUser.dataValues.id },
        }
      );

      await db.loginDetails.create({
        employeeId: existUser.dataValues.id,
        loginIP: req.headers['x-real-ip'] ? req.headers['x-real-ip'] : await helper.ip(req._remoteAddress),
        loginDevice: `${req.deviceSource.os ? req.deviceSource.os.name : 'OS Name'} - ${req.deviceSource.device ? req.deviceSource.device.type : 'Device Type'}`,
        createdDt: moment()
      })

      const payload = {
        user: {
          id: existUser.id,
          name: existUser.name,
          role: existUser.role.name,
          device: req.deviceSource.device ? req.deviceSource.device.type : 'Other'
        },
      };

      const token = await helper.generateJwtToken(payload);

      return respHelper(res, {
        status: 200,
        msg: constant.LOGIN_SUCCESS,
        data: {
          emp: existUser,
          tokens: {
            accessToken: token,
            refreshToken: token,
          },
        },
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

export default new AuthController();
