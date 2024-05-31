import db from "../../../config/db.config.js";
import validator from "../../../helper/validator.js";
import logger from "../../../helper/logger.js";
import helper from "../../../helper/helper.js";
import respHelper from "../../../helper/respHelper.js";
import constant from "../../../constant/messages.js";
import client from "../../../config/redisDb.config.js";
import moment from "moment";

class commonController {
  async updateBiographicalDetails(req, res) {
    try {
      // const {
      //   userId,
      //   maritalStatus,
      //   mobileAccess,
      //   laptopSystem,
      //   backgroundVerification,
      //   gender,
      //   dateOfBirth,
      //   updatedBy,
      // } = req.body;

      const result = await validator.updateBiographicalDetailsSchema.validateAsync(req.body)

      // const updateObj = {
      //   ...(maritalStatus && { maritalStatus }),
      //   ...(mobileAccess && { mobileAccess }),
      //   ...(laptopSystem && {
      //     laptopSystem: laptopSystem
      //       .toLowerCase()
      //       .replace(/(?<= )[^\s]|^./g, (a) => a.toUpperCase()),
      //   }),
      //   ...(backgroundVerification && { backgroundVerification }),
      //   ...(gender && { gender }),
      //   ...(dateOfBirth && { dateOfBirth }),
      //   ...(updatedBy && { updatedBy: req.userId }),
      //   updatedAt: moment()
      // };

      const updateObj = Object.assign(
        result,
        {
          updatedAt: moment(),
          updatedBy: req.userId
        }
      )

      await db.biographicalDetails.update(updateObj, {
        where: { userId: result.userId ? result.userId : req.userId },
      });
      
      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS,
        data: updateObj,
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

  async insertOrUpdatePaymentDetails(req, res) {
    try {
      const existingPaymentDetails = await db.paymentDetails.findOne({
        where: { userId: req.body.userId ? req.body.userId : req.userId },
      });
      if (existingPaymentDetails) {
        await existingPaymentDetails.update(req.body);
        return respHelper(res, {
          status: 200,
          msg: constant.UPDATE_SUCCESS,
          data: req.body,
        });
      } else {
        let value = {
          ...req.body,
          ...(req.body.userId && { userId: req.body.userId }),
          ...(!req.body.userId && { userId: req.userId }),
        };
        const newPaymentDetails = await db.paymentDetails.create(value);
        return respHelper(res, {
          status: 200,
          msg: constant.INSERT_SUCCESS,
          data: newPaymentDetails,
        });
      }
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async updateFamilyMembers(req, res) {
    try {
      const existingFamilyDetails = await db.familyDetails.findOne({
        where: { relationWithEmp: req.body.relationWithEmp, EmployeeId: req.body.userId ? req.body.userId : req.userId },
      });
      if (existingFamilyDetails) {
        await existingFamilyDetails.update(req.body);
        return respHelper(res, {
          status: 200,
          msg: constant.UPDATE_SUCCESS,
          data: req.body,
        });
      } else {
        let value = {
          ...req.body,
          ...(req.body.userId && { EmployeeId: req.body.userId }),
          ...(!req.body.userId && { EmployeeId: req.userId }),
          ...{ createdBy: req.userId },
        };
        const newPFamilyDetails = await db.familyDetails.create(value);
        return respHelper(res, {
          status: 200,
          msg: constant.INSERT_SUCCESS,
          data: newPFamilyDetails,
        });
      }
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async dashboardCard(req, res) {
    try {
      //for key 0 using for web and 1 for app
      var dashboardData = [];
      let cacheKey = req.params.for == 0 ? "dashboardCardWeb" : "dashboardCardApp";
      await client.get(cacheKey).then(async (data) => {
        if (data) {
          dashboardData = JSON.parse(data);

          return respHelper(res, {
            status: 200,
            data: dashboardData,
          });
        } else {

          const whereConditon = {
            ...(req.params.for == 0 && { isActiveWeb: 1 }),
            ...(req.params.for == 1 && { isActiveApp: 1 }),
          }
          let orderFor = req.params.for == 0 ? [["positionWeb", "asc"]] : [["positionApp", "desc"]]
          dashboardData = await db.DashboardCard.findAndCountAll({
            where: whereConditon,
            order: orderFor
          });

          const dashboardJson = JSON.stringify(dashboardData);
          client
            .setEx(cacheKey, parseInt(process.env.TTL), dashboardJson)
            .then(() => {
              console.log("Array of objects stored in Redis successfully.");
            })
            .catch((err) => {
              console.error("Error storing array of objects in Redis:", err);
            });
          return respHelper(res, {
            status: 200,
            data: dashboardData,
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

export default new commonController();
