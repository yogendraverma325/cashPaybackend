import validator from "../../../helper/validator.js";
import db from "../../../config/db.config.js";
import helper from "../../../helper/helper.js";
import respHelper from "../../../helper/respHelper.js";
import constant from "../../../constant/messages.js";
import bcrypt from "bcrypt";
import moment from "moment";
import axios from "axios";
import FormData from "form-data";

class AuthController {

  async login(req, res) {
    try {

      const result = await validator.loginSchema.validateAsync(req.body);

      const formData = new FormData();
      formData.append("uname", result.tmc);
      formData.append("pass", result.password);
      let dataRes = await axios({
        method: 'post',
        url: 'https://wap.teamcomputers.com/emaauth/api/AD/Validatelogin',
        data: formData
      });

      const existUser = await db.employeeMaster.findOne({
        where: { empCode: result.tmc, isActive: 1 },
        include: [
          {
            model: db.roleMaster,
            attributes: ['role_id', 'name']
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

      if (!dataRes.data.status) {

        const comparePass = await bcrypt.compare(
          result.password,
          existUser.password
        );

        if (!comparePass) {
          await db.employeeMaster.update(
            Object.assign(
              { wrongPasswordCount: existUser.dataValues.wrongPasswordCount + 1 },
              (existUser.dataValues.wrongPasswordCount === 2) ? {
                accountRecoveryTime: moment().add(parseInt(process.env.ACCOUNT_RECOVERY_TIME), 'minutes')
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
      }

      const loggedInUser = await validateUser(req, existUser)

      return respHelper(res, {
        status: 200,
        msg: constant.LOGIN_SUCCESS,
        token: loggedInUser.token,
        data: loggedInUser.userData
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

  async sso(req, res) {
    try {
      const existUser = await db.employeeMaster.findOne({
        where: { empCode: req.user[0], isActive: 1 },
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

      if (existUser.dataValues.accountRecoveryTime) {
        return respHelper(res, {
          status: 404,
          msg: constant.ACCOUNT_LOCKED
        })
      }

      const loggedInUser = await validateUser(req, existUser)

      return respHelper(res, {
        status: 200,
        msg: constant.LOGIN_SUCCESS,
        token: loggedInUser.token,
        data: loggedInUser.userData
      });

    } catch (error) {
      return respHelper(res, {
        status: 500,
      });
    }
  }
}

const validateUser = async (req, existUser) => {
  delete existUser.dataValues.password;

  await db.employeeMaster.update(
    { lastLogin: moment(), wrongPasswordCount: 0 },
    {
      where: { id: existUser.dataValues.id },
    }
  );

  await db.loginDetails.create({
    employeeId: existUser.dataValues.id,
    loginIP: req.headers['x-real-ip'] || await helper.ip(req._remoteAddress),
    loginDevice: `${req.deviceSource.os ? req.deviceSource.os.name : 'OS Name'} - ${req.deviceSource.device ? req.deviceSource.device.type : 'Device Type'}`,
    createdDt: moment()
  });

  const payload = {
    user: {
      id: existUser.id,
      name: existUser.name,
      role: existUser.role.name,
      device: req.deviceSource.device ? req.deviceSource.device.type : 'Other'
    },
  };

  const token = await helper.generateJwtToken(payload);

  return {
    token,
    userData: {
      emp: existUser,
      tokens: {
        accessToken: token,
        refreshToken: token,
      }
    }
  }
}

export default new AuthController();