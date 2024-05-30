import db from "../../../config/db.config.js";
import validator from "../../../helper/validator.js";
import logger from "../../../helper/logger.js";
import helper from "../../../helper/helper.js";
import respHelper from "../../../helper/respHelper.js";
import constant from "../../../constant/messages.js";
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
          msg: constant.ALREADY_EXISTS,
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

  async updateBiographicalDetails(req, res) {
    try {
      req.body.updatedBy = req.userId
      await commonController.updateBiographicalDetails(req,res)
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async insertOrUpdatePaymentDetails(req, res){
    try {  
        req.body.updatedBy = req.userId
        await commonController.insertOrUpdatePaymentDetails(req,res)
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  };

  async updateFamilyMembers(req, res){
    try {  
        req.body.updatedBy = req.userId
        await commonController.updateFamilyMembers(req,res)
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  };
  
  async dashboardCard(req, res){
    console.log("req.body",req.params.for)
    try {  
        await commonController.dashboardCard(req,res)
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  };
  
}

export default new AdminController();
