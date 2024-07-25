import db from "../../../config/db.config.js";
import respHelper from "../../../helper/respHelper.js";
import commonController from "../common/common.controller.js";
import helper from "../../../helper/helper.js";
import validator from "../../../helper/validator.js";
import { Op } from "sequelize";

class UserController {
  async globalSearch(req, res) {
    try {
      const { search } = req.params;
      const EMP_DATA = await db.employeeMaster.findAll({
        raw: true,
        nest: true,
        attributes: ["id", "empCode", "name", "firstName", "lastName", "email"],
        where: {
          [Op.or]: [
            { empCode: { [Op.like]: `%${search}%` } },
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { "$designationmaster.name$": { [Op.like]: `%${search}%` } },
            { "$departmentmaster.departmentName$": { [Op.like]: `%${search}%` } },
          ],
        },
        include: [
          {
            model: db.designationMaster,
            required: false,
            attributes: ["designationId", 'name'],
          },
          {
            model: db.departmentMaster,
            required: false,
            attributes: ["departmentId", "departmentCode", "departmentName"],
          },
        ],
      });
      return respHelper(res, {
        status: 200,
        data: EMP_DATA,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }
  async profileDetails(req, res) {
    try {
      const user = req.query.user;
      let EMP_DATA = await helper.getEmpProfile(user ? user : req.userId);

      return respHelper(res, {
        status: 200,
        data: EMP_DATA,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async personalDetails(req, res) {
    try {
      const user = req.query.user;

      const personalData = await db.employeeMaster.findOne({
        where: {
          id: user ? user : req.userId,
        },
        attributes: { exclude: ["password", "role_id", "designation_id"] },
        include: [
          {
            model: db.biographicalDetails,
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
          {
            model: db.jobDetails,
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
          {
            model: db.emergencyDetails,
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
          {
            model: db.familyDetails,
            required: false,
            where: {
              isActive: 1,
            },
            attributes: {
              exclude: [
                "isActive",
                "createdAt",
                "createdBy",
                "updatedBy",
                "updatedAt",
              ],
            },
          },
          {
            model: db.educationDetails,
            attributes: {
              exclude: [
                "createdAt",
                "createdBy",
                "updatedBy",
                "updatedAt",
                "isActive",
              ],
            },
            include: [
              {
                model: db.degreeMaster,
              },
            ],
          },
          {
            model: db.paymentDetails,
            required: false,
            where: {
              isActive: 1,
            },
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
          {
            model: db.vaccinationDetails,
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
        data: personalData,
      });
    } catch (error) {
      console.log(error);
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
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async changePassword(req, res) {
    try {
      const result = await validator.changePasswordSchema.validateAsync(
        req.body
      );
      const hashedPassword = await helper.encryptPassword(result.password);

      await db.employeeMaster.update(
        {
          password: hashedPassword,
          isTempPassword: 0,
        },
        {
          where: {
            id: req.userId,
          },
        }
      );

      return respHelper(res, {
        status: 200,
        msg: "Password Changed SuccessFully.",
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

export default new UserController();
