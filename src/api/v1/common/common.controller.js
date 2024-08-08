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
  async addBiographicalDetails(req, res) {
    try {
      const result =
        await validator.updateBiographicalDetailsSchema.validateAsync(req.body);
      let detailsExists = await db.biographicalDetails.findOne({
        where: { userId: result.userId == 0 ? req.userId : result.userId },
      });
      if (detailsExists) {
        return respHelper(res, {
          status: 400,
          msg: constant.ALREADY_EXISTS.replace(
            "<module>",
            "Biographical Details"
          ),
          data: {},
        });
      } else {
        const userId = result.userId == 0 ? req.userId : result.userId;

        let obj = {
          ...result,
          userId: userId,
          createdBy: req.userData.role_id != 3 ? req.userId : result.userId,
          updatedBy: req.userData.role_id != 3 ? req.userId : result.userId,
        };
        await db.biographicalDetails.create(obj);

        return respHelper(res, {
          status: 200,
          msg: constant.INSERT_SUCCESS.replace(
            "<module>",
            "Biographical Details"
          ),
          data: {},
        });
      }
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

  async updateBiographicalDetails(req, res) {
    try {
      const result =
        await validator.updateBiographicalDetailsSchema.validateAsync(req.body);

      const userId = result.userId == 0 ? req.userId : result.userId;
      const updateObj = Object.assign(result, {
        userId: userId,
        updatedAt: moment(),
        updatedBy: req.userId,
      });
      await db.biographicalDetails.update(updateObj, {
        where: { userId: userId },
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

  async getBiographicalDetails(req, res) {
    try {
      const userId = req.params.userId == 0 ? req.userId : req.params.userId;
      let detailsExists = await db.biographicalDetails.findOne({
        attributes: { exclude: ["createdAt", "updatedAt", "isActive"] },
        where: { userId: userId },
      });
      if (detailsExists) {
        return respHelper(res, {
          status: 200,
          msg: constant.DATA_FETCHED.replace(
            "<module>",
            "Biographical Details"
          ),
          data: detailsExists,
        });
      } else {
        return respHelper(res, {
          status: 400,
          msg: constant.NOT_FOUND.replace("<module>", "Biographical Details"),
          data: {},
        });
      }
    } catch (error) {}
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

  async addFamilyMembers(req, res) {
    try {
      const result = await validator.addFamilyDetailsSchema.validateAsync(
        req.body
      );
      let detailsExists = await db.familyDetails.findOne({
        where: {
          EmployeeId: result.userId == 0 ? req.userId : result.userId,
          name: result.name,
        },
      });
      if (detailsExists) {
        return respHelper(res, {
          status: 400,
          msg: constant.ALREADY_EXISTS.replace(
            "<module>",
            "Family Member Details"
          ),
          data: {},
        });
      } else {
        const userId = result.userId == 0 ? req.userId : result.userId;

        let obj = {
          ...result,
          EmployeeId: userId,
          createdBy: req.userData.role_id != 3 ? req.userId : result.userId,
          updatedBy: req.userData.role_id != 3 ? req.userId : result.userId,
        };

        await db.familyDetails.create(obj);

        return respHelper(res, {
          status: 200,
          msg: constant.INSERT_SUCCESS.replace(
            "<module>",
            "Family Member Details"
          ),
          data: {},
        });
      }
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

  async updateFamilyMembers(req, res) {
    try {
      const result = await validator.updateFamilyDetailsSchema.validateAsync(
        req.body
      );
      let getFamilyDetails = await db.familyDetails.findOne({
        where: { empFamilyDetailsId: result.empFamilyDetailsId },
      });
      if (getFamilyDetails) {
        await db.familyMemberHistory.create({
          "EmployeeId":getFamilyDetails.EmployeeId,
          "name":getFamilyDetails.name,
          "dob":getFamilyDetails.dob,
          "gender":getFamilyDetails.gender,
          "mobileNo":getFamilyDetails.mobileNo,
          "relationWithEmp":getFamilyDetails.relationWithEmp,
          "createdBy":getFamilyDetails.createdBy,
          "updatedBy":getFamilyDetails.updatedBy

        });
        await db.familyDetails.update(
          Object.assign(result, {
            updatedBy: req.userId,
            updatedAt: moment(),
          }),
          {
            where: { empFamilyDetailsId: result.empFamilyDetailsId },
          }
        );
      }
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

  async getFamilyList(req, res) {
    try {
      const userId = req.params.userId == 0 ? req.userId : req.params.userId;
      let detailsExists = await db.familyDetails.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "isActive"] },
        where: { EmployeeId: userId, isActive: 1 },
      });
      if (detailsExists) {
        return respHelper(res, {
          status: 200,
          msg: constant.DATA_FETCHED.replace(
            "<module>",
            "Family Member Details"
          ),
          data: detailsExists,
        });
      } else {
        return respHelper(res, {
          status: 400,
          msg: constant.NOT_FOUND.replace("<module>", "Family Member Details"),
          data: {},
        });
      }
    } catch (error) {}
  }

  async getFamilyMember(req, res) {
    try {
      const userId = req.params.userId == 0 ? req.userId : req.params.userId;
      let detailsExists = await db.familyDetails.findOne({
        attributes: { exclude: ["createdAt", "updatedAt", "isActive"] },
        where: { empFamilyDetailsId: userId, isActive },
      });
      if (detailsExists) {
        return respHelper(res, {
          status: 200,
          msg: constant.DATA_FETCHED.replace(
            "<module>",
            "Family Member Details"
          ),
          data: detailsExists,
        });
      } else {
        return respHelper(res, {
          status: 400,
          msg: constant.NOT_FOUND.replace("<module>", "Family Member Details"),
          data: {},
        });
      }
    } catch (error) {}
  }

  async addJobDetails(req, res) {
    try {
      const result = await validator.addJobDetailsSchema.validateAsync(
        req.body
      );
      const userId = req.body.userId == 0 ? req.userId : req.body.userId;
      const existPaymentDetails = await db.jobDetails.findOne({
        raw: true,
        where: {
          userId: userId,
        },
      });

      if (existPaymentDetails) {
        let obj = {
          ...result,
          ...{ createdBy: existPaymentDetails.createdBy },
          ...{ createdAt: existPaymentDetails.createdAt },
          ...{ updatedBy: req.userId },
          ...{ updatedAt: moment() },
          ...{ userId: userId },
          ...{ isActive: 1 },
        };
        await db.employeeJobDetailsHistory.create(existPaymentDetails);
        await db.jobDetails.update(obj, {
          where: { userId: userId },
        });

        return respHelper(res, {
          status: 200,
          msg: constant.UPDATE_SUCCESS.replace("<module>", "Job Details"),
        });
      } else {
        let obj = {
          ...result,
          ...{ createdBy: req.userId },
          ...{ createdAt: moment() },
          ...{ updatedBy: req.userId },
          ...{ updatedAt: moment() },
          ...{ userId: userId },
          ...{ isActive: 1 },
        };
        await db.jobDetails.create(obj);

        return respHelper(res, {
          status: 200,
          msg: constant.DETAILS_ADDED.replace("<module>", "Payment Details"),
        });
      }
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
  async addPaymentDetails(req, res) {
    try {
      const result = await validator.addPaymentDetailsSchema.validateAsync(
        req.body
      );
      const userId = req.body.userId == 0 ? req.userId : req.body.userId;
      const existPaymentDetails = await db.paymentDetails.findOne({
        raw: true,
        where: {
          userId: userId,
        },
      });

      if (existPaymentDetails) {
        let obj = {
          ...result,
          ...{ createdBy: existPaymentDetails.createdBy },
          ...{ createdAt: existPaymentDetails.createdAt },
          ...{ updatedBy: userId },
          ...{ updatedAt: moment() },
          ...{ userId: userId },
          ...{ isActive: 1 },
        };
        await db.paymentDetails.update(obj, {
          where: { userId: userId },
        });

        return respHelper(res, {
          status: 200,
          msg: constant.UPDATE_SUCCESS.replace("<module>", "Payment Details"),
        });
      } else {
        let obj = {
          ...result,
          ...{ createdBy: userId },
          ...{ createdAt: moment() },
          ...{ updatedBy: userId },
          ...{ updatedAt: moment() },
          ...{ userId: userId },
          ...{ isActive: 1 },
        };
        await db.paymentDetails.create(obj);

        return respHelper(res, {
          status: 200,
          msg: constant.DETAILS_ADDED.replace("<module>", "Payment Details"),
        });
      }
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

  async deleteFamilyMember(req, res) {
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
        mobileNo: "N/A",
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
  async updateEducationDetails(req, res) {
    try {
      const result = await validator.updateEducationDetailsSchema.validateAsync(
        req.body
      );

      let getInfo = await db.educationDetails.findOne({
        attributes: [
          "userId",
          "educationDegree",
          "educationSpecialisation",
          "educationStartDate",
          "educationCompletionDate",
          "educationInstitute",
          "educationAttachments",
          "educationRemark",
          "isHighestEducation",
          "createdBy",
          "updatedBy",
        ],
        where: { educationId: result.educationId },
        raw: true,
      });
      if (getInfo) {
        await db.employeeEducationDetailsHistory.create({
          userId: getInfo.userId,
          educationDegree: getInfo.educationDegree,
          educationSpecialisation: getInfo.educationSpecialisation,
          educationStartDate: getInfo.educationStartDate,
          educationCompletionDate: getInfo.educationCompletionDate,
          educationInstitute: getInfo.educationInstitute,
          educationAttachments: getInfo.educationAttachments,
          educationRemark: getInfo.educationRemark,
          educationActivities: getInfo.educationActivities,
          isHighestEducation: getInfo.isHighestEducation,
        });
        await db.educationDetails.update(
          Object.assign(result, {
            updatedBy: req.userId,
            updatedAt: moment(),
          }),
          {
            where: { educationId: result.educationId },
          }
        );
      }

      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS.replace("<module>", "Education Details"),
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
  async addEducationDetails(req, res) {
    try {
      const result = await validator.addEducationDetailsSchema.validateAsync(
        req.body
      );
      await db.educationDetails.create(
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
}

export default new commonController();
