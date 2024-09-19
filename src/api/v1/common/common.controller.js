import db from "../../../config/db.config.js";
import validator from "../../../helper/validator.js";
import logger from "../../../helper/logger.js";
import helper from "../../../helper/helper.js";
import respHelper from "../../../helper/respHelper.js";
import constant from "../../../constant/messages.js";
import client from "../../../config/redisDb.config.js";
import moment from "moment";
import { Op } from "sequelize";

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
            "<module>", "Details"),
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
      if(result.salutationId){
        await db.employeeMaster.update({salutationId:result.salutationId,middleName:result.middleName}, {
          where: { id: userId },
        });
      }

      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS.replace(
         "<module>", "Details"
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
        msg: constant.UPDATE_SUCCESS.replace("<module>", "Details"),
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
          // updatedBy: req.userData.role_id != 3 ? req.userId : result.userId,
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
      const user = req.query.user || req.userId;

      const existFamilyMember = await db.familyDetails.findOne({
        raw: true,
        where: {
          EmployeeId: user,
          empFamilyDetailsId: {
            [Op.ne]: result.empFamilyDetailsId,
          },
          name: result.name,
        },
      });

      if (existFamilyMember) {
        return respHelper(res, {
          status: 400,
          msg: constant.ALREADY_EXISTS.replace("<module>", "Family Member"),
        });
      }

      let getFamilyDetails = await db.familyDetails.findOne({
        where: { empFamilyDetailsId: result.empFamilyDetailsId },
      });
      if (getFamilyDetails) {
        await db.familyMemberHistory.create({
          EmployeeId: getFamilyDetails.EmployeeId,
          name: getFamilyDetails.name,
          dob: getFamilyDetails.dob,
          gender: getFamilyDetails.gender,
          mobileNo: getFamilyDetails.mobileNo,
          memberAddress:getFamilyDetails.memberAddress,
          relationWithEmp: getFamilyDetails.relationWithEmp,
          createdBy: getFamilyDetails.createdBy,
          updatedBy: getFamilyDetails.updatedBy,
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
          "<module>", "Details"
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
        where: { empFamilyDetailsId: userId},
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
    } catch (error) {
      console.log("error",error)
      return respHelper(res, {
        status: 500,
      });
    }
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
          ...{ updatedAt:moment().format("YYYY-MM-DD HH:mm:ss") },
          ...{ userId: userId },
          ...{ isActive: 1 },
        };
        await db.employeeJobDetailsHistory.create(existPaymentDetails);
        await db.jobDetails.update(obj, {
          where: { userId: userId },
        });

        return respHelper(res, {
          status: 200,
          msg: constant.UPDATE_SUCCESS.replace("<module>", "Details"),
        });
      } else {
        let obj = {
          ...result,
          ...{ createdBy: req.userId },
          ...{ createdAt: moment().format("YYYY-MM-DD HH:mm:ss") },
          ...{ updatedBy: req.userId },
          ...{ updatedAt: moment() },
          ...{ userId: userId },
          ...{ isActive: 1 },
        };
        await db.jobDetails.create(obj);

        return respHelper(res, {
          status: 200,
          msg: constant.DETAILS_ADDED.replace("<module>", "Details"),
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
      const userId = req.body.userId == 0 ? req.userId : result.userId;
      const existUser = await db.employeeMaster.findOne({ where: { id: userId } });

      const existPaymentDetails = await db.paymentDetails.findOne({
        raw: true,
        where: {
          userId: userId,
        },
      });
    
      if (result.paymentAttachment) {
        const d = Math.floor(Date.now() / 1000);
        var paymentAttachment = await helper.fileUpload(
          result.paymentAttachment,
          `cheque${d}`,
          `uploads/${existUser.empCode}`
        );
      }
      if (existPaymentDetails) {
        let obj = {
          ...result,
          ...(paymentAttachment !== "" && { paymentAttachment }),
          ...{ createdBy: existPaymentDetails.createdBy },
          ...{ createdAt: existPaymentDetails.createdAt },
          ...{ updatedBy: userId },
          ...{ updatedAt: moment().format("YYYY-MM-DD HH:mm:ss") },
          ...{ userId: userId },
          ...{ isActive: 1 },
        };
        await db.paymentDetails.update(obj, {
          where: { userId: userId },
        });

        return respHelper(res, {
          status: 200,
          msg: constant.UPDATE_SUCCESS.replace("<module>", "Details"),
        });
      } else {
        let obj = {
          ...result,
          ...(paymentAttachment !== "" && { paymentAttachment }),
          ...{ createdBy: userId },
          ...{ createdAt: moment().format("YYYY-MM-DD HH:mm:ss") },
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

      let employeeData;
      if (req.query.user) {
        employeeData = await db.employeeMaster.findOne({
          raw: true,
          where: {
            id: req.query.user,
          },
          attributes: ["companyLocationId"],
        });
      }

      const holidayData = await db.holidayCompanyLocationConfiguration.findAll({
        where: {
          companyLocationId: req.query.user
            ? employeeData.companyLocationId
            : userData.companyLocationId,
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
      const userId = result.userId > 0 ? result.userId : req.userId;
      const existUser = await db.employeeMaster.findOne({ where: { id: userId}})
      if (result.educationAttachments) {
        const d = Math.floor(Date.now() / 1000);
        var educationAttachments = await helper.fileUpload(
          result.educationAttachments,
          `educationDocument${d}`,
          `uploads/${existUser.empCode}`
        );
      }
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
            userId:userId,
            ...(educationAttachments !== "" && { educationAttachments }),
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
        msg: constant.UPDATE_SUCCESS.replace("<module>", "Details"),
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
      const userId = result.userId > 0 ? result.userId : req.userId;
      const existUser = await db.employeeMaster.findOne({ where: { id: userId}})
      let educationAttachments = null
      if (result.educationAttachments) {
        const d = Math.floor(Date.now() / 1000);
         educationAttachments = await helper.fileUpload(
          result.educationAttachments,
          `educationDocument${d}`,
          `uploads/${existUser.empCode}`
        );
      }
      await db.educationDetails.create(
        Object.assign(
          result,
          {
            userId: userId,
            isActive: 1,
          },
          {
            ...(educationAttachments != "" && { educationAttachments:educationAttachments }),
            createdBy: req.userId,
            createdAt: moment(),
          }
        )
      );

      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS.replace(
          "<module>",
          "Details"
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

  async searchEmployee(req, res) {
    try {
      const {
        search,
        department,
        designation,
        buSearch,
        sbuSearch,
        areaSearch,
      } = req.query;

      let buFIlter = {};
      let sbbuFIlter = {};
      let functionAreaFIlter = {};
      let departmentFIlter = {};
      let designationFIlter = {};
      let empFilters = {};
      const usersData = req.userData;

      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const cacheKey = `employeeList:${req.userId}:${pageNo}:${limit}:${
        search || ""
      }:${department || ""}:${designation || ""}:${buSearch || ""}:${
        sbuSearch || ""
      }:${areaSearch || ""}`;

      let employeeData = [];
      await client.get(cacheKey).then(async (data) => {
        if (data) {
          employeeData = JSON.parse(data);
          return respHelper(res, {
            status: 200,
            data: employeeData,
          });
        } else {
          console.log("usersData.role_id", usersData.role_id);
          let myReportyList = await db.employeeMaster.findAll({
            where: {
              manager: req.userId,
            },
            attributes: ["id"],
          });

          let final = myReportyList.map((singleEmp) => singleEmp.id);
          empFilters.id = {
            ///appedning SBU to filter
            [Op.in]: final,
          };
          console.log("empFilters", empFilters);

          employeeData = await db.employeeMaster.findAndCountAll({
            order: [["id", "desc"]],
            limit,
            offset,
            where: Object.assign(
              search
                ? {
                    [Op.or]: [
                      {
                        empCode: {
                          [Op.like]: `%${search}%`,
                        },
                      },
                      {
                        name: {
                          [Op.like]: `%${search}%`,
                        },
                      },
                      {
                        email: {
                          [Op.like]: `%${search}%`,
                        },
                      },
                    ],
                    [Op.and]: [
                      {
                        isActive:
                          usersData.role_id == 1 || usersData.role_id == 2
                            ? [1, 0]
                            : [1],
                        ...empFilters,
                      },
                    ],
                  }
                : {
                    [Op.and]: [
                      {
                        isActive:
                          usersData.role_id == 1 || usersData.role_id == 2
                            ? [1, 0]
                            : [1],
                        ...empFilters,
                      },
                    ],
                  }
            ),
            attributes: [
              "id",
              "empCode",
              "name",
              "email",
              "firstName",
              "lastName",
              "officeMobileNumber",
              "buId",
              "sbuId",
              "isActive",
            ],
            include: [
              {
                model: db.designationMaster,
                seperate: true,
                attributes: ["name"],
                where: {
                  ...(designation && {
                    name: { [Op.like]: `%${designation}%` },
                  }),
                  ...designationFIlter,
                },
              },
              {
                model: db.departmentMaster,
                seperate: true,
                attributes: ["departmentName"],
                where: {
                  ...(department && {
                    departmentName: { [Op.like]: `%${department}%` },
                  }),
                  ...departmentFIlter,
                },
              },
              {
                model: db.buMaster,
                seperate: true,
                attributes: ["buName", "buCode"],
                where: {
                  ...(buSearch && { buName: { [Op.like]: `%${buSearch}%` } }),
                  ...buFIlter,
                },
              },
              {
                model: db.sbuMaster,
                seperate: true,
                attributes: ["sbuname", "code"],
                where: {
                  ...(sbuSearch && {
                    sbuname: { [Op.like]: `%${sbuSearch}%` },
                  }),
                  ...sbbuFIlter,
                },
              },
              {
                model: db.functionalAreaMaster,
                seperate: true,
                attributes: ["functionalAreaName"],
                where: {
                  ...(areaSearch && {
                    functionalAreaName: { [Op.like]: `%${areaSearch}%` },
                  }),
                  ...functionAreaFIlter,
                },
              },
              {
                model: db.employeeMaster,
                required: false,
                as: "managerData",
                attributes: ["id", "name", "email", "empCode"],
              },
              {
                model: db.companyLocationMaster,
                attributes: ["address1", "address2"],
              },
            ],
          });

          const employeeJson = JSON.stringify(employeeData);
          await client.setEx(cacheKey, parseInt(process.env.TTL), employeeJson); // Cache for 2.3 minutes

          return respHelper(res, {
            status: 200,
            data: employeeData,
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

  async updateEmergencyContact(req, res) {
    try {
      const result = await validator.emergencyContactDetails.validateAsync(
        req.body
      );
      const userId = result.userId > 0 ? result.userId : req.userId;
      const getEmergencyContact = await db.emergencyDetails.findOne({
        raw: true,
        where: {
          userId: userId,
        },
      });

      if (getEmergencyContact) {
        let obj = {
          ...result,
          ...{ userId: userId },
          ...{ updatedBy: req.userId },
          ...{ updatedAt: moment() },
          ...{ isActive: 1 },
        };
        await db.emergencyDetails.update(obj, {
          where: { userId: userId },
        });

        return respHelper(res, {
          status: 200,
          msg: constant.UPDATE_SUCCESS.replace("<module>", "Details"),
        });
      } else {
        let obj = {
          ...result,
          ...{ createdBy: req.userId },
          ...{ createdAt: moment() },
          ...{ userId: userId },
          ...{ isActive: 1 },
        };
        await db.emergencyDetails.create(obj);

        return respHelper(res, {
          status: 200,
          msg: constant.DETAILS_ADDED.replace("<module>", "Details"),
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

  async updateAddress(req, res) {
    try {
      const result = await validator.updateAddress.validateAsync(
        req.body
      );
      const userId = result.employeeId > 0 ? result.employeeId : req.userId;
      const getAddress = await db.employeeAddress.findOne({
        raw: true,
        where: {
          employeeId: userId,
        },
      });

      if (getAddress) {
        let obj = {
          ...result,
          ...{ employeeId: userId },
          ...{ updatedBy: req.userId },
          ...{ updatedAt: moment() },
          ...{ isActive: 1 },
        };
        await db.employeeAddress.update(obj, {
          where: { employeeId: userId },
        });

        return respHelper(res, {
          status: 200,
          msg: constant.UPDATE_SUCCESS.replace("<module>", "Details"),
        });
      } else {
        let obj = {
          ...result,
          ...{ createdBy: req.userId },
          ...{ createdAt: moment() },
          ...{ employeeId: userId },
          ...{ isActive: 1 },
        };

        await db.employeeAddress.create(obj);

        return respHelper(res, {
          status: 200,
          msg: constant.INSERT_SUCCESS,
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
  async getSalutation(req, res) {
    try {
      const getList = await db.salutationMaster.findAll({
        raw: true,
        where: {
          // isActive: 1,
        },
        attributes: ["salutationId", "salutation"],
      });

      return respHelper(res, {
        status: 200,
        data: getList,
        msg: message.DATA_FETCHED,
      });
    } catch (error) {
      console.log("error", error);
      return respHelper(res, {
        status: 500,
        data: error,
      });
    }
  }

  async uploadDocument(req, res) {
    try {
      const userId = req.body.userId > 0 ? req.body.userId : req.userId;
      const existUser = await db.employeeMaster.findOne({ where: { id: userId } });
      const d = Math.floor(Date.now() / 1000);
  
      // Initialize an empty object to hold the fields to update
      let updateFields = {};
  
      // Check each field in the request and upload the file if it exists
      if (req.body.adhrFront) {
        const adhrFront = await helper.fileUpload(req.body.adhrFront, `aadharFront${d}`, `uploads/${existUser.empCode}`);
        updateFields.adhrFront = adhrFront;
      }
      if (req.body.adhrBack) {
        const adhrBack = await helper.fileUpload(req.body.adhrBack, `aadharBack${d}`, `uploads/${existUser.empCode}`);
        updateFields.adhrBack = adhrBack;
      }
      if (req.body.dlImg) {
        const dlImg = await helper.fileUpload(req.body.dlImg, `drivingLicence${d}`, `uploads/${existUser.empCode}`);
        updateFields.dlImg = dlImg;
      }
      if (req.body.panImg) {
        const panImg = await helper.fileUpload(req.body.panImg, `pan${d}`, `uploads/${existUser.empCode}`);
        updateFields.panImg = panImg;
      }
      if (req.body.passportImg) {
        const passportImg = await helper.fileUpload(req.body.passportImg, `passport${d}`, `uploads/${existUser.empCode}`);
        updateFields.passportImg = passportImg;
      }
  
      // Update the employeeMaster table only with the fields that were uploaded
      await db.employeeMaster.update(updateFields, { where: { id: userId } });
  
      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS.replace("<module>", "Details"),
      });
    } catch (error) {
      console.log("error", error);
      return respHelper(res, {
        status: 500,
        data: error,
      });
    }
  }

  async updateEmployeeInfo(req, res) {
    try {
      const result = await validator.employeeUpdateInfo.validateAsync(req.body);

      const userId = req.body.userId > 0 ? req.body.userId : req.userId;
      await db.employeeMaster.update(req.body, { where: { id: userId } });
  
      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS.replace(
          "<module>",
           "Details"
        ),
      });
    } catch (error) {
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
  async addWorkExperience(req, res) {
    try {
      const result = await validator.addemployeeWorkInfo.validateAsync(req.body);
      const userId = result.userId == 0 ? req.userId : result.userId;
      
      const existUser = await db.employeeMaster.findOne({ where: { id: userId } });
  
      let experienceletter = null
      if (result.experienceletter && result.experienceletter.trim() !== "") {
        const d = Math.floor(Date.now() / 1000);
        experienceletter = await helper.fileUpload(
          result.experienceletter,
          `workExperience${d}`,
          `uploads/${existUser.empCode}`
        );
      }
  
      let obj = {
        ...result,
        userId: userId,
        createdBy: req.userId,
        createdAt:moment().format("YYYY-MM-DD HH:mm:ss"),
        isActive: 1,
        ...(experienceletter !== "" && { experienceletter:experienceletter })
      };
      await db.employeeWorkExperience.create(obj);

      return respHelper(res, {
        status: 200,
        msg: constant.DETAILS_ADDED.replace("<module>", "Work Experience"),
      });
    } catch (error) {
      console.log("error", error);
      return respHelper(res, {
        status: 500,
      });
    }
  }
  
  async updateWorkExperience(req,res){
    try {
      const result = await validator.updateemployeeWorkInfo.validateAsync(req.body);
      const userId = result.userId == 0 ? req.userId : result.userId;
      const existUser = await db.employeeMaster.findOne({ where: { id: userId } });

      if (result.experienceletter) {
        const d = Math.floor(Date.now() / 1000);
        var experienceletter = await helper.fileUpload(
          result.experienceletter,
          `workExperience${d}`,
          `uploads/${existUser.empCode}`
        );
      }
      await db.employeeWorkExperience.update({
        ...result,
        updatedBy:req.userId,
        updatedAt:moment().format("YYYY-MM-DD HH:mm:ss"),
        ...{userId:userId},
        ...(experienceletter !== "" && { experienceletter:experienceletter })
      }, 
        { where: { workExperienceId: result.workExperienceId } 
      });
  
      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS.replace(
          "<module>",
           "Details"
        ),
      });
    } catch (error) {
      console.log("error",error)
      return respHelper(res, {
        status: 500,
      });
    }
  }
  
  async uploadHrDocuments(req, res) {
    try {
      
      // const userId = req.body.userId > 0 ? req.body.userId : req.userId;
      // const existUser = await db.employeeMaster.findOne({ where: { id: userId } });
      // const d = Math.floor(Date.now() / 1000);
  
      // // Initialize an empty object to hold the fields to update
      // let updateFields = {};
  
      // // Check each field in the request and upload the file if it exists
      // if (req.body.meritPlanningLetters) {
      //   const meritPlanningLetters = await helper.fileUpload(req.body.meritPlanningLetters, `meritPlanningLetters${d}`, `uploads/${existUser.empCode}`);
      //   updateFields.meritPlanningLetters = meritPlanningLetters;
      // }
      // if (req.body.confirmationLetters) {
      //   const confirmationLetters = await helper.fileUpload(req.body.confirmationLetters, `confirmationLetters${d}`, `uploads/${existUser.empCode}`);
      //   updateFields.confirmationLetters = confirmationLetters;
      // }
      // if (req.body.pipLetters) {
      //   const pipLetters = await helper.fileUpload(req.body.pipLetters, `pipLetters${d}`, `uploads/${existUser.empCode}`);
      //   updateFields.pipLetters = pipLetters;
      // }
      // if (req.body.bgvReport) {
      //   const bgvReport = await helper.fileUpload(req.body.bgvReport, `bgvReport${d}`, `uploads/${existUser.empCode}`);
      //   updateFields.bgvReport = bgvReport;
      // }
      // if (req.body.employmentRelated) {
      //   const employmentRelated = await helper.fileUpload(req.body.employmentRelated, `employmentRelated${d}`, `uploads/${existUser.empCode}`);
      //   updateFields.employmentRelated = employmentRelated;
      // }
      // if (req.body.insuranceCards) {
      //   const insuranceCards = await helper.fileUpload(req.body.insuranceCards, `insuranceCards${d}`, `uploads/${existUser.empCode}`);
      //   updateFields.insuranceCards = insuranceCards;
      // }
      // // Update the employeeMaster table only with the fields that were uploaded
      // const isDocExists = await db.hrLetters.findOne({where:{userId:userId}});
      // if(isDocExists){
      //   let obj = {
      //     updatedBy:userId,
      //     ...updateFields
      //   }
      //   await db.hrLetters.update(obj, { where: { userId: userId } });
      //   return respHelper(res, {
      //     status: 200,
      //   });
      // }
      // else{
      //   let obj = {
      //     ...{createdBy:userId},
      //     ...updateFields,
      //     ...{userId:userId}
      //   }
      //   await db.hrLetters.create(obj);
      //   return respHelper(res, {
      //     status: 200,
      //   });
      // }
     
    } catch (error) {
      console.log("error", error);
      return respHelper(res, {
        status: 500,
        data: error,
      });
    }
  }

  async addCertificates(req,res){
   try {
    const result = await validator.addEmployeeCertificates.validateAsync(req.body);
    const userId = result.userId == 0 ? req.userId : result.userId;

    let obj = {
      ...result,
      userId: userId,
      createdBy: req.userId,
      createdAt:moment().format("YYYY-MM-DD HH:mm:ss"),
      isActive: 1,
    };
    await db.employeeCertificates.create(obj);

    return respHelper(res, {
      status: 200,
      msg: constant.DETAILS_ADDED.replace("<module>", "Certificates"),
    });
   } catch (error) {
    console.log("error", error);
    return respHelper(res, {
      status: 500,
      data: error,
    });
   }
  }
  
  async updateCertificates(req,res){
    try {
      const result = await validator.updateEmployeeCertificates.validateAsync(req.body);
      const userId = result.userId == 0 ? req.userId : result.userId;

      await db.employeeCertificates.update({
        ...result,
        updatedBy:req.userId,
        updatedAt:moment().format("YYYY-MM-DD HH:mm:ss"),
        ...{userId:userId}
      }, 
        { where: { certificateId: result.certificateId } 
      });
  
      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS.replace(
         "<module>", "Details"
        ),
      });
    } catch (error) {
    return respHelper(res, {
      status: 500,
      data: error,
    });
    }
  }

  async updateContactInfo(req,res){
    try {
      const result = await validator.updateContactInfo.validateAsync(req.body);
      const userId = result.userId == 0 ? req.userId : result.userId;
      await db.employeeMaster.update({
        ...result,
        updatedBy:userId,
        updatedAt:moment().format("YYYY-MM-DD HH:mm:ss"),
      }, 
        { where: { id: userId } 
      });
  
      return respHelper(res, {
        status: 200,
        msg: constant.UPDATE_SUCCESS.replace(
          "<module>",
           "Details"
        ),
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
}

export default new commonController();
