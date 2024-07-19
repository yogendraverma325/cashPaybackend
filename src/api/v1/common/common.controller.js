import db from "../../../config/db.config.js";
import validator from "../../../helper/validator.js";
import logger from "../../../helper/logger.js";
import helper from "../../../helper/helper.js";
import respHelper from "../../../helper/respHelper.js";
import constant from "../../../constant/messages.js";
import client from "../../../config/redisDb.config.js";
import moment from "moment";
const message = constant;
class commonController {
  async updateBiographicalDetails(req, res) {
    try {
      const result =
        await validator.updateBiographicalDetailsSchema.validateAsync(req.body);

      const updateObj = Object.assign(result, {
        updatedAt: moment(),
        updatedBy: req.userId,
      });

      await db.biographicalDetails.update(updateObj, {
        where: { userId: result.userId ? result.userId : req.userId },
      });

      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS.replace(
          "<module>",
          "Biographical Details"
        ),
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
      const result = await validator.updatePaymentDetailsSchema.validateAsync(
        req.body
      );

      await db.paymentDetails.update(
        Object.assign(result, {
          updatedBy: req.userId,
          updatedAt: moment(),
        }),
        {
          where: { userId: result.userId ? result.userId : req.userId },
        }
      );

      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS.replace("<module>", "Payment Details"),
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
      const result = await validator.updateFamilyDetailsSchema.validateAsync(
        req.body
      );

      await db.familyDetails.update(
        Object.assign(result, {
          updatedBy: req.userId,
          updatedAt: moment(),
        }),
        {
          where: { empFamilyDetailsId: result.empFamilyDetailsId },
        }
      );

      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS.replace(
          "<module>",
          "Family Member Details"
        ),
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
      const result = await validator.addPaymentDetailsSchema.validateAsync(
        req.body
      );

      const existPaymentDetails = await db.paymentDetails.findOne({
        raw: true,
        where: {
          userId: result.userId ? result.userId : req.userId,
          isActive: 1,
        },
      });

      if (existPaymentDetails) {
        return respHelper(res, {
          status: 400,
          msg: constant.ALREADY_EXISTS.replace("<module>", "Payment Details"),
        });
      }

      await db.paymentDetails.create(
        Object.assign(
          {
            userId: result.userId ? result.userId : req.userId,
            isActive: 1,
          },
          result,
          {
            createdBy: req.userId,
            createdAt: moment(),
          }
        )
      );

      return respHelper(res, {
        status: 200,
        msg: constant.DETAILS_ADDED.replace("<module>", "Payment Details"),
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

  async deleteFamilyMemberDetails(req, res) {
    try {
      const result =
        await validator.deleteFamilyMemberDetailsSchema.validateAsync(req.body);

      const existData = await db.familyDetails.findOne({
        raw: true,
        where: {
          empFamilyDetailsId: result.empFamilyDetailsId,
          isActive: 1,
        },
      });

      if (!existData) {
        return respHelper(res, {
          status: 400,
          msg: constant.DETAILS_NOT_FOUND.replace("<module>", "Family Member"),
        });
      }

      await db.familyDetails.update(
        {
          isActive: 0,
          updatedBy: req.userId,
          updatedAt: moment(),
        },
        {
          where: {
            empFamilyDetailsId: result.empFamilyDetailsId,
            isActive: 1,
          },
        }
      );

      return respHelper(res, {
        status: 200,
        msg: constant.DETAILS_DELETED.replace("<module>", "Family Member"),
      });
    } catch (error) {
      console.log(error);
      logger.error(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async dashboardCard(req, res) {
    try {
      //for key 0 using for web and 1 for app
      var dashboardData = [];
      let cacheKey =
        req.params.for == 0 ? "dashboardCardWeb" : "dashboardCardApp";
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
          };
          let orderFor =
            req.params.for == 0
              ? [["positionWeb", "asc"]]
              : [["positionApp", "desc"]];
          dashboardData = await db.DashboardCard.findAndCountAll({
            where: whereConditon,
            order: orderFor,
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
  async getCalendar(req, res) {
    try {
      let userData = req.userData;
      console.log("userData", userData);
      const holidayData = await db.holidayCompanyLocationConfiguration.findAll({
        where: {
          companyLocationId: userData.companyLocationId,
        },
        include: [
          {
            model: db.holidayMaster,
            attributes: ["holidayId", "holidayName", "holidayDate"],
            as: "holidayDetails",
            where: {
              isActive: 1,
            },
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        data: holidayData,
        msg: message.DATA_FETCHED,
      });
    } catch (error) {
      return respHelper(res, {
        status: 500,
        data: error,
      });
    }
  }

  async mobileNoUpdateInFamilyTable(req, res) {
    await db.familyDetails.update(
      {
        mobileNo:"N/A"
      },
      {
         where: {},
      }
    );
    return respHelper(res, {
      status: 200,
      data: {},
    });
  }
}

export default new commonController();
