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

      const result = await validator.updateBiographicalDetailsSchema.validateAsync(req.body)

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

  async updatePaymentDetails(req, res) {
    try {

      const result = await validator.updatePaymentDetailsSchema.validateAsync(req.body)

      await db.paymentDetails.update(Object.assign(result, {
        updatedBy: req.userId,
        updatedAt: moment()
      }), {
        where: { userId: result.userId ? result.userId : req.userId },
      })

      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async updateFamilyMembers(req, res) {
    try {

      const result = await validator.updateFamilyDetailsSchema.validateAsync(req.body)

      await db.familyDetails.update(
        Object.assign(
          result,
          {
            updatedBy: req.userId,
            updatedAt: moment()
          }
        ),
        {
          where: { empFamilyDetailsId: result.empFamilyDetailsId },
        });

      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS,
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

  async addPaymentDetails(req, res) {
    try {

    } catch (error) {
      console.log(error)
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
