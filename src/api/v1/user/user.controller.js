import db from "../../../config/db.config.js";
import respHelper from "../../../helper/respHelper.js";
import commonController from "../common/common.controller.js";
import helper from "../../../helper/helper.js";
import validator from "../../../helper/validator.js";
import { Op } from "sequelize";
import constant from "../../../constant/messages.js";
import eventEmitter from "../../../services/eventService.js";
import fs from "fs";
import moment from "moment";

class UserController {
  async globalSearch(req, res) {
    try {
      const { search } = req.params;
      const EMP_DATA = await db.employeeMaster.findAll({
        raw: true,
        nest: true,
        attributes: ["id", "empCode", "name", "firstName", "lastName", "email"],
        where: {
          isActive: 1,
          [Op.or]: [
            { empCode: { [Op.like]: `%${search}%` } },
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { "$designationmaster.name$": { [Op.like]: `%${search}%` } },
            {
              "$departmentmaster.departmentName$": { [Op.like]: `%${search}%` },
            },
          ],
        },
        include: [
          {
            model: db.designationMaster,
            required: false,
            attributes: ["designationId", "name"],
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
            model: db.salutationMaster,
            attributes: ["salutationId", "salutation"],
          },
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
            include: [
              {
                model: db.employeeMaster,
                attributes: [
                  "id",
                  "name",
                  "firstName",
                  "middleName",
                  "lastName",
                  "dataCardAdmin",
                  "visitingCardAdmin",
                  "workstationAdmin",
                  "lastIncrementDate",
                  "iqTestApplicable",
                  "mobileAdmin",
                  "recruiterName",
                  "employeeType",
                  "offRoleCTC",
                  "highestQualification",
                  "ESICPFDeduction",
                  "fatherName"
                ],
                include: [
                  {
                    model: db.salutationMaster,
                    attributes: ["salutationId", "salutation"],
                  },
                ],
              },
            ],
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
            include: [
              {
                model: db.employeeMaster,
                attributes: ["id"],
                include: [
                  {
                    model: db.companyLocationMaster,
                    attributes: ["address1", "companyLocationId"],
                    include: [
                      {
                        model: db.stateMaster,
                        attributes: ["stateId", "stateName"],
                      },
                      {
                        model: db.cityMaster,
                        attributes: ["cityId", "cityName"],
                      },
                    ],
                  },
                ],
              },
              {
                model: db.unionCodIncrementMaster,
                as: "incrementCycle",
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
                model: db.bandMaster,
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
                model: db.gradeMaster,
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
                model: db.jobLevelMaster,
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
                model: db.stateMaster,
                attributes: {
                  exclude: [
                    "createdAt",
                    "createdBy",
                    "updatedBy",
                    "updatedAt",
                    "isActive",
                  ],
                },
                as: "lwfStateName",
              },
              {
                model: db.lwfDesignationMaster,
                attributes: ["lwfDesignationId", "lwfDesignationName"],
                as: "lwfDesignationName",
              },
              {
                model: db.probationMaster,
                attributes: [
                  "probationId",
                  "probationName",
                  "durationOfProbation",
                ],
                required: false,
              },
            ],
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
            // where: {
            //   status: "approved",
            // },
            attributes: {
              exclude: [
                "createdAt",
                "createdBy",
                "updatedBy",
                "updatedAt",
                "isActive",
              ],
            },
            include:[ {
              model: db.bankMaster,
              attributes: ["bankId", "bankName", "bankIfsc"],
            },
            {
              model: db.bankMaster,
              attributes: ["bankId", "bankName", "bankIfsc"],
              as: "newBankName",
            },]
            
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
          {
            model: db.employeeAddress,
            include: [
              {
                model: db.countryMaster,
                attributes: ["countryId", "countryName"],
                as: "currentcountry",
              },
              {
                model: db.countryMaster,
                attributes: ["countryId", "countryName"],
                as: "permanentcountry",
              },
              {
                model: db.countryMaster,
                attributes: ["countryId", "countryName"],
                as: "emergencycountry",
              },
              {
                model: db.stateMaster,
                attributes: ["stateId", "stateName"],
                as: "currentstate",
              },
              {
                model: db.stateMaster,
                attributes: ["stateId", "stateName"],
                as: "permanentstate",
              },
              {
                model: db.stateMaster,
                attributes: ["stateId", "stateName"],
                as: "emergencystate",
              },
              {
                model: db.cityMaster,
                attributes: ["cityId", "cityName"],
                as: "currentcity",
              },
              {
                model: db.cityMaster,
                attributes: ["cityId", "cityName"],
                as: "permanentcity",
              },
              {
                model: db.cityMaster,
                attributes: ["cityId", "cityName"],
                as: "emergencycity",
              },
              {
                model: db.pinCodeMaster,
                attributes: ["pincodeId", "pincode"],
                as: "currentpincode",
              },
              {
                model: db.pinCodeMaster,
                attributes: ["pincodeId", "pincode"],
                as: "permanentpincode",
              },
              {
                model: db.pinCodeMaster,
                attributes: ["pincodeId", "pincode"],
                as: "emergencypincode",
              },
            ],
          },
          {
            model: db.employeeWorkExperience,
          },
          {
            model: db.hrLetters,
            required: false,
            where: {
              isActive: { [Op.not]: false },
            },
            attributes: ["documentType", "documentImage", "letterId", "userId"],
            include: {
              model: db.hrDocumentMaster,
              attributes: ["documentId", "documentName"],
            },
          },
          {
            model: db.employeeCertificates,
          },
          {
            model: db.degreeMaster,
            attributes: ["degreeId", "degreeName"],
            required: false,
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
          passwordExpiryDate: moment().add(
            parseInt(process.env.PASSWORD_EXPIRY_LIMIT),
            "days"
          ),
        },
        {
          where: {
            id: req.userId,
          },
        }
      );

      return respHelper(res, {
        status: 200,
        msg: constant.PASSWORD_CHANGED,
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

  async taskBoxCount(req, res) {
    try {
      let userid = req.userId;
      const countLeavePending = await db.employeeLeaveTransactions.findAll({
        where: {
          employeeId: userid,
          status: "pending",
        },
        attributes: [
          "batch_id",
          [
            db.sequelize.fn(
              "COUNT",
              db.sequelize.col("employeeleavetransactionsId")
            ),
            "count",
          ],
        ],
        group: ["batch_id"],
      });

      const countLeaveAssgined = await db.employeeLeaveTransactions.findAll({
        where: {
          pendingAt: userid,
          status: "pending",
        },
        attributes: [
          "batch_id",
          [
            db.sequelize.fn(
              "COUNT",
              db.sequelize.col("employeeleavetransactionsId")
            ),
            "count",
          ],
        ],
        group: ["batch_id"],
      });

      let assignedAttCount = await db.regularizationMaster.count({
        where: {
          regularizeManagerId: userid,
          regularizeStatus: "Pending",
        },
      });
      let pendingAttCount = await db.regularizationMaster.count({
        where: {
          regularizeStatus: "Pending",
          createdBy: userid,
        },
      });
      let pendingSeperationCount = await db.separationMaster.count(
        {
          pendingAt: userid,
        },
        {
          where: {
            finalStatus: [2, 5, 9],
          },
        }
      );

      return respHelper(res, {
        status: 200,
        data: {
          web: {
            leaveData: {
              raisedByMe: countLeavePending.length,
              assignedToMe: countLeaveAssgined.length,
            },
            attedanceData: {
              raisedByMe: pendingAttCount,
              assignedToMe: assignedAttCount,
            },
            seperationCount: {
              raisedByMe: 0,
              assignedToMe: pendingSeperationCount,
            },
          },
          mobile: {
            raisedByMe: {
              leaveData: countLeavePending.length,
              attedanceData: pendingAttCount,
              seperationCount: 0,
            },
            assignedToMe: {
              leaveData: countLeaveAssgined.length,
              attedanceData: assignedAttCount,
              seperationCount: pendingSeperationCount,
            },
          },
        },
        msg: "Task Box Listed",
      });
    } catch (error) {
      console.log("error", error);
      return respHelper(res, {
        status: 500,
        data: error,
      });
    }
  }

  async updateProfilePicture(req, res) {
    try {
      const result = await validator.updateProfilePictureSchema.validateAsync(
        req.body
      );

      const existUser = await db.employeeMaster.findOne({
        raw: true,
        where: {
          id: result.user,
          isActive: 1,
        },
        attributes: ["empCode", "profileImage"],
      });

      if (!existUser) {
        return respHelper(res, {
          status: 400,
          msg: constant.USER_NOT_EXIST,
        });
      }

      const d = Math.floor(Date.now() / 1000);
      const profilePicture = await helper.fileUpload(
        result.image,
        `profileImage_${d}`,
        `uploads/${existUser.empCode}`
      );

      await db.employeeMaster.update(
        {
          profileImage: profilePicture,
        },
        {
          where: {
            id: result.user,
          },
        }
      );

      if (existUser.profileImage) {
        fs.unlinkSync(existUser.profileImage);
      }

      return respHelper(res, {
        status: 200,
        msg: constant.PROFILE_PICTURE_UPDATED,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const result = await validator.forgotPasswordSchema.validateAsync(
        req.body
      );

      const getEmployee = await db.employeeMaster.findOne({
        where: {
          email: result.email,
          isActive: 1,
        },
      });

      if (getEmployee) {
        const otp = await helper.generateOTP(6);
        eventEmitter.emit(
          "forgotPasswordMail",
          JSON.stringify({
            email: result.email,
            otp: otp,
          })
        );

        const deocdeOTP = await helper.generateJwtOTPEncrypt({
          id: getEmployee.id,
          email: result.email,
          otp: otp,
        });
        return respHelper(res, {
          status: 200,
          msg: constant.OTP_SENT,
          data: deocdeOTP,
        });
      } else {
        return respHelper(res, {
          status: 400,
          msg: constant.INVALID.replace("<module>", "Email ID"),
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

  async verifyOTP(req, res) {
    try {
      const { data, otp } = req.body;
      const compareOTP = await helper.generateJwtOTPDecrypt(data);
      if (compareOTP) {
        if (compareOTP.otp == otp) {
          return respHelper(res, {
            status: 200,
            msg: constant.OTP_VERIFIED,
            data: { id: compareOTP.id },
          });
        } else {
          return respHelper(res, {
            status: 400,
            msg: constant.OTP_NOT_MATACHED,
            data: {},
          });
        }
      } else {
        return respHelper(res, {
          status: 400,
          msg: constant.OTP_EXPIRED,
          data: {},
        });
      }
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 400,
        msg: constant.OTP_EXPIRED,
        data: {},
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { id, newPassword } = req.body;
      await db.employeeMaster.update(
        {
          password: await helper.encryptPassword(newPassword),
          isTempPassword: 0,
          passwordExpiryDate: moment().add(
            parseInt(process.env.PASSWORD_EXPIRY_LIMIT),
            "days"
          ),
        },
        { where: { id: id } }
      );
      return respHelper(res, {
        status: 200,
        msg: constant.PASSWORD_CHANGED,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async initiateSeparation(req, res) {
    try {
      const result = await validator.separationByEmployee.validateAsync(
        req.body
      );
      const user = req.query.user || req.userId;

      const existSeparationData = await db.separationMaster.findOne({
        where: {
          employeeId: user,
          finalStatus: {
            [Op.notIn]: [3, 6, 7, 10, 11],
          },
        },
      });

      if (existSeparationData) {
        return respHelper(res, {
          status: 400,
          msg: constant.SEPARATION_ALREADY_SUBMITTED,
        });
      }

      const existUser = await db.employeeMaster.findOne({
        where: {
          id: user,
        },
        include: [
          {
            model: db.noticePeriodMaster,
            attributes: ["nPDaysAfterConfirmation"],
          },
          {
            model: db.departmentMaster,
            attributes: ["departmentName"],
          },
          {
            model: db.designationMaster,
            attributes: ["name"],
          },
          {
            model: db.employeeMaster,
            as: "managerData",
            attributes: ["name", "email"],
          },
          {
            model: db.companyMaster,
            attributes: ["companyName"],
          },
        ],
      });

      const lastWorkingDay = moment(result.resignationDate, "YYYY-MM-DD").add(
        parseInt(
          existUser.dataValues.noticeperiodmaster.nPDaysAfterConfirmation
        ) - 1,
        "days"
      );

      const d = Math.floor(Date.now() / 1000);

      const createdData = await db.separationMaster.create({
        employeeId: existUser.dataValues.id,
        initiatedBy: "Self",
        noticePeriodDay:
          existUser.dataValues.noticeperiodmaster.nPDaysAfterConfirmation,
        noticePeriodLastWorkingDay: lastWorkingDay.format("YYYY-MM-DD"),
        resignationDate: result.resignationDate,
        empProposedLastWorkingDay: result.empProposedLastWorkingDay,
        empProposedRecoveryDays:
          result.empProposedRecoveryDays > 0
            ? result.empProposedRecoveryDays
            : 0,
        empReasonOfResignation: result.empReasonOfResignation,
        empNewOrganizationName:
          result.empNewOrganizationName != ""
            ? result.empNewOrganizationName
            : null,
        empSalaryHike: result.empSalaryHike,
        empPersonalEmailId: result.empPersonalEmailId,
        empPersonalMobileNumber: result.empPersonalMobileNumber,
        empRemark: result.empRemark,
        pendingAt: existUser.dataValues.manager,
        finalStatus: 2,
        empAttachment: result.attachment
          ? await helper.fileUpload(
            result.attachment,
            `separation_attachment_${d}`,
            `uploads/${existUser.dataValues.empCode}`
          )
          : null,
        empSubmissionDate: moment(),
        createdDt: moment(),
        createdAt: req.userId,
      });

      await db.separationTrail.create({
        separationAutoId: createdData.dataValues.resignationAutoId,
        separationStatus: 2,
        pending: 0,
        pendingAt: user,
        createdBy: req.userId,
        actionDate: moment(),
        createdDt: moment(),
      });

      await db.separationTrail.create({
        separationAutoId: createdData.dataValues.resignationAutoId,
        separationStatus: 5,
        pending: 1,
        pendingAt: existUser.dataValues.manager,
        createdBy: req.userId,
        createdDt: moment(),
      });

      await db.separationTrail.create({
        separationAutoId: createdData.dataValues.resignationAutoId,
        separationStatus: 9,
        pending: 1,
        pendingAt: existUser.dataValues.buHRId,
        createdBy: req.userId,
        createdDt: moment(),
      });

      eventEmitter.emit(
        "initiateSeparation",
        JSON.stringify({
          email: existUser.dataValues.managerData.email,
          recipientName: existUser.dataValues.managerData.name,
          empName: existUser.dataValues.name,
          empDesignation: existUser.dataValues.designationmaster.name,
          empDepartment: existUser.dataValues.departmentmaster.departmentName,
          companyName: existUser.dataValues.companymaster.companyName,
        })
      );

      eventEmitter.emit(
        "separationUserAcknowledge",
        JSON.stringify({
          email: existUser.dataValues.email,
          companyName: existUser.dataValues.companymaster.companyName,
        })
      );

      return respHelper(res, {
        status: 200,
        msg: constant.SEPARATION_STATUS.replace("<status>", "Initiated"),
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

  async separationDetails(req, res) {
    try {
      const separationData = await db.separationMaster.findAll({
        where: {
          [Op.or]: [
            {
              employeeId: req.query.user || req.userId,
              finalStatus: req.query.user ? null : 1,
            },
            {
              pendingAt: req.userId,
              finalStatus: {
                [Op.in]: [5, 2],
              },
            },
          ],
        },
        include: [
          {
            model: db.employeeMaster,
            attributes: ["empCode", "name"],
          },
          {
            model: db.separationStatus,
            attributes: ["separationStatusCode", "separationStatusDesc"],
          },
          {
            model: db.separationType,
            as: "l2Separationtype",
            attributes: ["separationTypeName"],
          },
          {
            model: db.separationReason,
            as: "empReasonofResignation",
            attributes: ["separationReason"],
          },
          {
            model: db.separationReason,
            as: "l2ReasonofSeparation",
            attributes: ["separationReason"],
          },
          {
            model: db.separationReason,
            as: "l1ReasonofResignation",
            attributes: ["separationReason"],
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        data: separationData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async managerInputOnseparation(req, res) {
    try {
      const result = await validator.managerInputOnseparation.validateAsync(
        req.body
      );

      const separationData = await db.separationMaster.findOne({
        where: {
          resignationAutoId: result.resignationAutoId,
        },
        attributes: ["initiatedBy"],
        include: [
          {
            model: db.employeeMaster,
            attributes: ["empCode", "name", "email", "buHRId"],
            include: [
              {
                model: db.companyMaster,
                attributes: ["companyName"],
              },
              {
                model: db.employeeMaster,
                as: "buhrData",
                attributes: ["name", "email"],
              },
              {
                model: db.buMaster,
                attributes: ["buName"],
              },
              {
                model: db.employeeMaster,
                as: "managerData",
                attributes: ["email", "name"],
              },
            ],
          },
        ],
      });

      const d = Math.floor(Date.now() / 1000);

      await db.separationMaster.update(
        {
          l1ProposedLastWorkingDay: result.l1ProposedLastWorkingDay,
          l1ProposedRecoveryDays: result.l1ProposedRecoveryDays,
          l1ReasonForProposedRecoveryDays:
            result.l1ReasonForProposedRecoveryDays,
          l1ReasonOfResignation: result.l1ReasonOfResignation,
          l1BillingType: result.l1BillingType,
          l1CustomerName:
            result.l1CustomerName != "" ? result.l1CustomerName : null,
          replacementRequired: result.replacementRequired,
          replacementRequiredBy:
            result.replacementRequiredBy != ""
              ? result.replacementRequiredBy
              : null,
          l1Remark: result.l1Remark,
          l1Attachment: result.attachment
            ? await helper.fileUpload(
              result.attachment,
              `separation_attachment_${d}`,
              `uploads/${separationData.dataValues.employee.empCode}`
            )
            : null,
          l1SubmissionDate: moment(),
          pendingAt: separationData.dataValues.employee.buHRId,
          l1RequestStatus: "Approved",
          finalStatus: 5,
        },
        {
          where: {
            resignationAutoId: result.resignationAutoId,
          },
        }
      );

      await db.separationTrail.update(
        {
          actionUserRole: req.userRole,
          pendingAt: req.userId,
          pending: 0,
          actionDate: moment(),
          updatedBy: req.userId,
          updatedDt: moment(),
        },
        {
          where: {
            separationAutoId: result.resignationAutoId,
            separationStatus: 5,
          },
        }
      );

      eventEmitter.emit(
        "separationApprovalAcknowledgementToUser",
        JSON.stringify({
          email: separationData.dataValues.employee.email,
          recipientName: separationData.dataValues.employee.name,
          companyName:
            separationData.dataValues.employee.companymaster.companyName,
        })
      );

      eventEmitter.emit(
        "managerApprovesSeparation",
        JSON.stringify({
          email: separationData.dataValues.employee.buhrData.email,
          recipientName: separationData.dataValues.employee.buhrData.name,
          empName: separationData.dataValues.employee.name,
          empCode: separationData.dataValues.employee.empCode,
          bu: separationData.dataValues.employee.bumaster.buName,
          managerName: separationData.dataValues.employee.managerData.name,
        })
      );

      return respHelper(res, {
        status: 200,
        msg: constant.SEPARATION_STATUS.replace("<status>", "Approved"),
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

  async onBehalfManager(req, res) {
    try {
      const result = await validator.onBehalfSeperationByManager.validateAsync(
        req.body
      );
      const user = result.userId || req.userId;

      const existSeparationData = await db.separationMaster.findOne({
        where: {
          employeeId: user,
          finalStatus: {
            [Op.notIn]: [3, 6, 7, 10, 11],
          },
        },
      });

      if (existSeparationData) {
        return respHelper(res, {
          status: 400,
          msg: constant.SEPARATION_ALREADY_SUBMITTED,
        });
      }

      const existUser = await db.employeeMaster.findOne({
        where: {
          id: user,
        },
        include: [
          {
            model: db.noticePeriodMaster,
            attributes: ["nPDaysAfterConfirmation"],
          },
          {
            model: db.companyMaster,
            attributes: ["companyName"],
          },
          {
            model: db.employeeMaster,
            as: "buhrData",
            attributes: ["name", "email"],
          },
          {
            model: db.buMaster,
            attributes: ["buName"],
          },
          {
            model: db.employeeMaster,
            as: "managerData",
            attributes: ["email", "name"],
          },
        ],
      });
      const lastWorkingDay = moment(result.resignationDate, "YYYY-MM-DD").add(
        parseInt(
          existUser.dataValues.noticeperiodmaster.nPDaysAfterConfirmation
        ) - 1,
        "days"
      );

      const d = Math.floor(Date.now() / 1000);
      let separationEmpAttachment = null;
      if (result.l1Attachment != "") {
        separationEmpAttachment = await helper.fileUpload(
          result.l1Attachment,
          `separation_attachment_${d}`,
          `uploads/${existUser.dataValues.empCode}`
        );
      }
      const empRequestedLastWorkingDay = moment(
        result.empProposedLastWorkingDay,
        "YYYY-MM-DD"
      );
      const empProposedLastWorkingDay = moment(
        result.l1ProposedLastWorkingDay,
        "YYYY-MM-DD"
      );
      const recoveryDays = lastWorkingDay.diff(
        empRequestedLastWorkingDay,
        "days"
      );
      const proposedRecoveryDays = empProposedLastWorkingDay.diff(
        lastWorkingDay,
        "days"
      );
      let onBehalfObject = {
        employeeId: existUser.dataValues.id,
        resignationDate: result.resignationDate,
        //initiatedBy: "Other",
        initiatedBy: "Manager",
        noticePeriodDay:
          existUser.dataValues.noticeperiodmaster.nPDaysAfterConfirmation,
        noticePeriodLastWorkingDay: lastWorkingDay.format("YYYY-MM-DD"),
        empProposedLastWorkingDay: result.empProposedLastWorkingDay,
        empProposedRecoveryDays: recoveryDays > 0 ? recoveryDays - 1 : 0,
        l1ProposedLastWorkingDay: result.l1ProposedLastWorkingDay,
        l1ProposedRecoveryDays:
          result.l1ProposedRecoveryDays != ""
            ? result.l1ProposedRecoveryDays
            : 0,
        l1BillingType: result.l1BillingType,
        l1CustomerName:
          result.l1CustomerName != "" ? result.l1CustomerName : null,
        replacementRequired: result.replacementRequired,
        replacementRequiredBy:
          result.replacementRequiredBy != ""
            ? result.replacementRequiredBy
            : null,
        l1ReasonForProposedRecoveryDays: result.l1ReasonForProposedRecoveryDays,
        l1ReasonOfResignation: result.l1ReasonOfResignation,
        l1Remark: result.l1Remark != "" ? result.l1Remark : null,
        l1SubmissionDate: moment(),
        l1RequestStatus: "Approved",
        finalStatus: 5,
        submitType: result.submitType,
        createdBy: req.userId,
        createdDt: moment(),
        pendingAt: existUser.dataValues.buHRId,
        l1Attachment: separationEmpAttachment,
      };
      const createdData = await db.separationMaster.create(onBehalfObject);

      await db.separationTrail.create({
        actionUserRole: req.userRole,
        separationAutoId: createdData.dataValues.resignationAutoId,
        separationStatus: 5,
        actionDate: moment(),
        pending: 0,
        pendingAt: existUser.dataValues.manager,
        createdBy: req.userId,
        createdDt: moment(),
      });

      await db.separationTrail.create({
        separationAutoId: createdData.dataValues.resignationAutoId,
        separationStatus: 9,
        pending: 1,
        pendingAt: existUser.dataValues.buHRId,
        createdBy: req.userId,
        createdDt: moment(),
      });

      eventEmitter.emit(
        "separationUserAcknowledge",
        JSON.stringify({
          email: existUser.dataValues.email,
          companyName: existUser.dataValues.companymaster.companyName,
        })
      );

      eventEmitter.emit(
        "managerApprovesSeparation",
        JSON.stringify({
          email: existUser.dataValues.buhrData.email,
          recipientName: existUser.dataValues.buhrData.name,
          empName: existUser.dataValues.name,
          empCode: existUser.dataValues.empCode,
          bu: existUser.dataValues.bumaster.buName,
          managerName: existUser.dataValues.managerData.name,
        })
      );

      return respHelper(res, {
        status: 200,
        msg: constant.SEPARATION_STATUS.replace("<status>", "Initiated"),
      });
    } catch (error) {
      if (error.isJoi === true) {
        return respHelper(res, {
          status: 500,
          msg: error.details[0].message,
        });
      }
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async onBehalfBUHr(req, res) {
    try {
      const result = await validator.onBehalfSeperationByBUHr.validateAsync(
        req.body
      );
      let mailArray = [];
      const user = result.userId || req.userId;

      const existSeparationData = await db.separationMaster.findOne({
        where: {
          employeeId: user,
          finalStatus: {
            [Op.notIn]: [3, 6, 7, 10, 11],
          },
        },
      });

      if (existSeparationData) {
        return respHelper(res, {
          status: 400,
          msg: constant.SEPARATION_ALREADY_SUBMITTED,
        });
      }

      const existUser = await db.employeeMaster.findOne({
        where: {
          id: user,
        },
        attributes: [
          "id",
          "empCode",
          "name",
          "email",
          "officeMobileNumber",
          "personalEmail",
          "personalMobileNumber",
          "dateOfJoining",
          "companyId",
          "buHRId",
          "departmentId",
          "buId",
          "sbuId",
          "functionalAreaId",
        ],
        include: [
          {
            model: db.companyLocationMaster,
            attributes: ["address1"],
          },
          {
            model: db.departmentMaster,
            attributes: ["departmentName", "departmentCode"],
          },
          {
            model: db.buMaster,
            attributes: ["buName"],
          },
          {
            model: db.employeeMaster,
            as: "managerData",
            attributes: ["id", "name"],
          },
          {
            model: db.sbuMaster,
            attributes: ["sbuName"],
          },
          {
            model: db.companyMaster,
            attributes: ["companyName"],
          },
          {
            model: db.noticePeriodMaster,
            attributes: ["nPDaysAfterConfirmation"],
          },
          {
            model: db.designationMaster,
            attributes: ["name"],
          },
          {
            model: db.jobDetails,
            attributes: ["jobLevelId"],
          },
        ],
      });

      const lastWorkingDay = moment(result.resignationDate, "YYYY-MM-DD").add(
        parseInt(
          existUser.dataValues.noticeperiodmaster.nPDaysAfterConfirmation
        ) - 1,
        "days"
      );

      const d = Math.floor(Date.now() / 1000);
      let separationEmpAttachment;
      if (result.l2Attachment != "") {
        separationEmpAttachment = await helper.fileUpload(
          result.l2Attachment,
          `separation_attachment_${d}`,
          `uploads/${existUser.dataValues.empCode}`
        );
      }
      const empRequestedLastWorkingDay = moment(
        result.empProposedLastWorkingDay,
        "YYYY-MM-DD"
      );
      const empProposedLastWorkingDay = moment(
        result.l2LastWorkingDay,
        "YYYY-MM-DD"
      );
      const recoveryDays = lastWorkingDay.diff(
        empRequestedLastWorkingDay,
        "days"
      );
      const proposedRecoveryDays = empProposedLastWorkingDay.diff(
        lastWorkingDay,
        "days"
      );

      const separationConfig = await db.separationTaskConfig.findOne({
        where: {
          [Op.and]: [
            {
              functionalAreaId: {
                [Op.or]: [
                  { [Op.like]: `${existUser.dataValues.functionalAreaId},%` },
                  { [Op.like]: `%,${existUser.dataValues.functionalAreaId},%` },
                  { [Op.like]: `%,${existUser.dataValues.functionalAreaId}` },
                  { [Op.eq]: `${existUser.dataValues.functionalAreaId}` },
                ],
              },
            },
            {
              jobLevelId: {
                [Op.or]: [
                  {
                    [Op.like]: `${existUser.dataValues.employeejobdetail.jobLevelId},%`,
                  },
                  {
                    [Op.like]: `%,${existUser.dataValues.employeejobdetail.jobLevelId},%`,
                  },
                  {
                    [Op.like]: `%,${existUser.dataValues.employeejobdetail.jobLevelId}`,
                  },
                  {
                    [Op.eq]: `${existUser.dataValues.employeejobdetail.jobLevelId}`,
                  },
                ],
              },
            },
          ],
        },
      });

      const separationOwner = await db.separationTaskMapping.findAll({
        where: {
          taskConfigAutoId: separationConfig.dataValues.taskConfigAutoId,
        },
        include: [
          {
            model: db.separationTaskConfig,
            attributes: ["taskConfigName"],
          },
          {
            model: db.separationTaskMaster,
            where: {
              taskDependent: null,
            },
            attributes: ["taskName", "mappingOn", "mappingData"],
            include: [
              {
                model: db.separationTaskFields,
                attributes: ["taskFieldsAutoId"],
              },
            ],
          },
        ],
      });

      let onBehalfObject = {
        employeeId: existUser.dataValues.id,
        resignationDate: result.resignationDate,
        initiatedBy: "BuHr",
        noticePeriodDay:
          existUser.dataValues.noticeperiodmaster.nPDaysAfterConfirmation,
        noticePeriodLastWorkingDay: lastWorkingDay.format("YYYY-MM-DD"),
        l2LastWorkingDay: result.l2LastWorkingDay,
        l2RecoveryDays:
          result.l2RecoveryDays != ""
            ? result.l2RecoveryDays > 0
              ? result.l2RecoveryDays
              : 0
            : 0,
        l2RecoveryDaysReason: result.l2RecoveryDaysReason,
        l2SeparationType: result.l2SeparationType,
        l2ReasonOfSeparation: result.l2ReasonOfSeparation,
        l2NewOrganizationName:
          result.l2NewOrganizationName != ""
            ? result.l2NewOrganizationName
            : null,
        l2SalaryHike: result.l2SalaryHike,
        doNotReHire: result.doNotReHire,
        doNotReHireRemark:
          result.doNotReHireRemark != "" ? result.doNotReHireRemark : null,
        l2BillingType: result.l2BillingType,
        l2CustomerName:
          result.l2CustomerName != "" ? result.l2CustomerName : null,
        shortFallPayoutBasis:
          result.shortFallPayoutBasis != ""
            ? result.shortFallPayoutBasis
            : null,
        shortFallPayoutDays:
          result.shortFallPayoutDays != "" ? result.shortFallPayoutDays : null,
        shortfallPayoutRequired: result.shortfallPayoutRequired,
        ndaConfirmation: result.ndaConfirmation,
        holdFnf: result.holdFnf,
        holdFnfTillDate:
          result.holdFnfTillDate != "" ? result.holdFnfTillDate : null,
        holdFnfReason: result.holdFnfReason != "" ? result.holdFnfReason : null,
        l2Remark: result.l2Remark != "" ? result.l2Remark : null,
        l2SubmissionDate: moment(),
        createdBy: req.userId,
        createdDt: moment(),
        l1RequestStatus: "Approved",
        l2RequestStatus: "Approved",
        finalStatus: 9,
        submitType: result.submitType,
        l2Attachment: separationEmpAttachment,
        pendingAt: existUser.dataValues.buHRId,
      };
      const createdData = await db.separationMaster.create(onBehalfObject);

      await db.separationTrail.create({
        separationAutoId: createdData.dataValues.resignationAutoId,
        actionUserRole: req.userRole,
        separationStatus: 9,
        actionDate: moment(),
        pending: 0,
        pendingAt: req.userId,
        createdBy: req.userId,
        createdDt: moment(),
      });

      for (const element of separationOwner) {
        const initiatedTask = await db.separationInitiatedTask.create({
          employeeId: user,
          resignationAutoId: createdData.dataValues.resignationAutoId,
          taskAutoId: element.dataValues.taskAutoId,
          status: 0,
          createdDt: moment(),
          createdBy: 1,
          isActive: 1,
        });

        if (element.dataValues.separationtaskmaster.mappingOn === "FIX") {
          const ownerArray =
            element.dataValues.separationtaskmaster.mappingData.split(",");
          for (const element11 of ownerArray) {
            db.separationTaskOwner.create({
              taskMappingAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
              taskOwner: element11,
              isActive: 1,
              createdDt: moment(),
            });
            const employeeData = await db.employeeMaster.findOne({
              where: {
                id: element11,
              },
              attributes: ["id", "name", "email"],
            });

            mailArray.push({
              email: employeeData.dataValues.email,
              name: employeeData.dataValues.name,
              taskName: element.dataValues.separationtaskmaster.taskName,
            });
          }
        } else if (
          element.dataValues.separationtaskmaster.mappingOn === "SELF"
        ) {
          db.separationTaskOwner.create({
            taskMappingAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
            taskOwner: existUser.dataValues.id,
            isActive: 1,
            createdDt: moment(),
          });

          const employeeData = await db.employeeMaster.findOne({
            where: {
              id: existUser.dataValues.id,
            },
            attributes: ["id", "name", "email"],
          });

          mailArray.push({
            email: employeeData.dataValues.email,
            name: employeeData.dataValues.name,
            taskName: element.dataValues.separationtaskmaster.taskName,
          });
        } else if (
          element.dataValues.separationtaskmaster.mappingOn === "MANAGER"
        ) {
          db.separationTaskOwner.create({
            taskMappingAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
            taskOwner: existUser.dataValues.managerData.id,
            isActive: 1,
            createdDt: moment(),
          });

          const employeeData = await db.employeeMaster.findOne({
            where: {
              id: existUser.dataValues.managerData.id,
            },
            attributes: ["id", "name", "email"],
          });

          mailArray.push({
            email: employeeData.dataValues.email,
            name: employeeData.dataValues.name,
            taskName: element.dataValues.separationtaskmaster.taskName,
          });
        } else if (
          element.dataValues.separationtaskmaster.mappingOn === "OTHER"
        ) {
          const buMappingData = await db.taskBuMapping.findOne({
            where: {
              [Op.and]: [
                {
                  bu: {
                    [Op.or]: [
                      { [Op.like]: `${existUser.dataValues.buId},%` },
                      { [Op.like]: `%,${existUser.dataValues.buId},%` },
                      { [Op.like]: `%,${existUser.dataValues.buId}` },
                      { [Op.eq]: `${existUser.dataValues.buId}` },
                    ],
                  },
                },
                {
                  departmentId: {
                    [Op.or]: [
                      { [Op.like]: `${existUser.dataValues.departmentId},%` },
                      { [Op.like]: `%,${existUser.dataValues.departmentId},%` },
                      { [Op.like]: `%,${existUser.dataValues.departmentId}` },
                      { [Op.eq]: `${existUser.dataValues.departmentId}` },
                    ],
                  },
                },
                {
                  companyId: {
                    [Op.or]: [
                      { [Op.like]: `${existUser.dataValues.companyId},%` },
                      { [Op.like]: `%,${existUser.dataValues.companyId},%` },
                      { [Op.like]: `%,${existUser.dataValues.companyId}` },
                      { [Op.eq]: `${existUser.dataValues.companyId}` },
                    ],
                  },
                },
                {
                  taskAutoId: element.dataValues.taskAutoId,
                },
              ],
            },
          });

          if (buMappingData) {
            for (const element12 of buMappingData.dataValues.ownerId.split(
              ","
            )) {
              db.separationTaskOwner.create({
                taskMappingAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
                taskOwner: element12,
                isActive: 1,
                createdDt: moment(),
              });

              const employeeData = await db.employeeMaster.findOne({
                where: {
                  id: element12,
                },
                attributes: ["id", "name", "email"],
              });

              mailArray.push({
                email: employeeData.dataValues.email,
                name: employeeData.dataValues.name,
                taskName: element.dataValues.separationtaskmaster.taskName,
              });
            }
          }
        }

        if (
          element.dataValues.separationtaskmaster.separationtaskfields.length >
          0
        ) {
          for (const element2 of element.dataValues.separationtaskmaster
            .separationtaskfields) {
            await db.separationFieldValues.create({
              taskAutoId: element.dataValues.taskAutoId,
              initiatedTaskAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
              fields: element2.dataValues.taskFieldsAutoId,
              employeeId: user,
              createdDt: moment(),
              createdBy: 1,
            });
          }
        }
      }

      eventEmitter.emit(
        "separationApproveByBUHR",
        JSON.stringify({
          email: existUser.dataValues.email,
          empName: existUser.dataValues.name,
          empCode: existUser.dataValues.empCode,
          dateOfResignation: result.resignationDate,
          companyName: existUser.dataValues.companymaster.companyName,
          lastWorkingDay: result.l2LastWorkingDay,
        })
      );

      for (const element of mailArray) {
        eventEmitter.emit(
          "clearenceInitiated",
          JSON.stringify({
            email: element.email,
            recipientName: element.name,
            taskName: element.taskName,
            empCode: existUser.dataValues.empCode,
            empName: existUser.dataValues.name,
            officeLocation: existUser.dataValues.companylocationmaster.address1,
            department: `${existUser.dataValues.departmentmaster.departmentName} (${existUser.dataValues.departmentmaster.departmentCode})`,
            officeMobileNumber: existUser.dataValues.officeMobileNumber,
            sbuName: existUser.dataValues.sbumaster.sbuName,
            bu: existUser.dataValues.bumaster.buName,
            reportingName: existUser.dataValues.managerData.name,
            designation: existUser.dataValues.designationmaster.name,
            dateOfJoining: existUser.dataValues.dateOfJoining,
            dateOfResignation: result.resignationDate,
            lastWorkingDay: result.l2LastWorkingDay,
            personalMailID: existUser.dataValues.personalEmail,
            personalMobileNumber: existUser.dataValues.personalMobileNumber,
          })
        );
      }

      return respHelper(res, {
        status: 200,
        msg: constant.SEPARATION_STATUS.replace("<status>", "Initiated"),
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

  async rejectSeparation(req, res) {
    try {
      const result = await validator.rejectSeparation.validateAsync(req.body);

      const resignationData = await db.separationMaster.findOne({
        where: {
          resignationAutoId: result.resignationAutoId,
        },
        include: [
          {
            model: db.employeeMaster,
            attributes: ["empCode", "name", "email", "buHRId", "manager"],
            include: [
              {
                model: db.companyMaster,
                attributes: ["companyName"],
              },
              {
                model: db.departmentMaster,
                attributes: ["departmentName"],
              },
              {
                model: db.designationMaster,
                attributes: ["name"],
              },
              {
                model: db.employeeMaster,
                as: "managerData",
                attributes: ["name", "email"],
              },
            ],
          },
        ],
      });

      if (!resignationData) {
        return respHelper(res, {
          status: 400,
          data: constant.SEPARATION_REQUEST_NOT_AVAILABLE,
        });
      }

      let rejectObject = {};

      if (
        parseInt(req.userId) ===
        parseInt(resignationData.dataValues.employee.manager)
      ) {
        rejectObject = {
          l1Remark: result.remark != "" ? result.remark : null,
          l1RejectionReason: result.reason,
          l1SubmissionDate: moment(),
          l1RequestStatus: "Rejected",
          finalStatus: 6,
        };

        await db.separationMaster.update(rejectObject, {
          where: {
            resignationAutoId: result.resignationAutoId,
          },
        });

        const mailArray = [
          {
            email: resignationData.dataValues.employee.email,
            name: resignationData.dataValues.employee.name,
          },
        ];

        //================================update in   separation trail===============================================//
        await db.separationTrail.update(
          {
            pending: 0,
            separationStatus: 6,
            actionDate: moment(),
            updatedBy: req.userId,
            updatedDt: moment(),
          },
          {
            where: {
              separationAutoId: result.resignationAutoId,
              pendingAt: req.userId,
              //separationStatus: 6,
            },
          }
        );
        //============================================================================================================//
        for (const element of mailArray) {
          eventEmitter.emit(
            "managerRejectsSeparation",
            JSON.stringify({
              email: element.email,
              recipientName: element.name,
              empName: resignationData.dataValues.employee.name,
              empCode: resignationData.dataValues.employee.empCode,
              designation:
                resignationData.dataValues.employee.designationmaster.name,
              department:
                resignationData.dataValues.employee.departmentmaster
                  .departmentName,
              reportingManager:
                resignationData.dataValues.employee.managerData.name,
              companyName:
                resignationData.dataValues.employee.companymaster.companyName,
            })
          );
        }
      } else if (
        parseInt(req.userId) ===
        parseInt(resignationData.dataValues.employee.buHRId)
      ) {
        rejectObject = {
          l2SubmissionDate: moment(),
          l2Remark: result.remark != "" ? result.remark : null,
          l2RejectionReason: result.reason,
          l2RequestStatus: "Rejected",
          finalStatus: 10,
        };

        await db.separationMaster.update(rejectObject, {
          where: {
            resignationAutoId: result.resignationAutoId,
          },
        });

        // ===============================update in separation trail
        await db.separationTrail.update(
          {
            pending: 0,
            separationStatus: 10,
            actionDate: moment(),
            updatedBy: req.userId,
            updatedDt: moment(),
          },
          {
            where: {
              separationAutoId: result.resignationAutoId,
              pendingAt: req.userId,
              //separationStatus: 6,
            },
          }
        );

        //=====================================
        eventEmitter.emit(
          "separationRejectByBUHR",
          JSON.stringify({
            email: resignationData.dataValues.employee.email,
            empName: resignationData.dataValues.employee.name,
            empCode: resignationData.dataValues.employee.empCode,
          })
        );
      }

      return respHelper(res, {
        status: 200,
        msg: constant.SEPARATION_STATUS.replace("<status>", "Rejected"),
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

  async buhrInputOnSeparation(req, res) {
    try {
      let result = await validator.buhrInputOnSeparation.validateAsync(
        req.body
      );
      const mailArray = [];
      const separationData = await db.separationMaster.findOne({
        where: {
          resignationAutoId: result.resignationAutoId,
        },
        attributes: ["initiatedBy", "resignationDate"],
        include: [
          {
            model: db.employeeMaster,
            attributes: [
              "id",
              "empCode",
              "name",
              "email",
              "officeMobileNumber",
              "personalEmail",
              "personalMobileNumber",
              "dateOfJoining",
              "companyId",
              "buId",
              "departmentId",
              "sbuId",
              "functionalAreaId",
            ],
            include: [
              {
                model: db.companyLocationMaster,
                attributes: ["address1"],
              },
              {
                model: db.departmentMaster,
                attributes: ["departmentName", "departmentCode"],
              },
              {
                model: db.employeeMaster,
                as: "managerData",
                attributes: ["id", "name"],
              },
              {
                model: db.sbuMaster,
                attributes: ["sbuName"],
              },
              {
                model: db.buMaster,
                attributes: ["buName"],
              },
              {
                model: db.companyMaster,
                attributes: ["companyName"],
              },
              {
                model: db.designationMaster,
                attributes: ["name"],
              },
              {
                model: db.jobDetails,
                attributes: ["jobLevelId"],
              },
            ],
          },
        ],
      });

      const d = Math.floor(Date.now() / 1000);

      const separationConfig = await db.separationTaskConfig.findOne({
        where: {
          [Op.and]: [
            {
              functionalAreaId: {
                [Op.or]: [
                  {
                    [Op.like]: `${separationData.dataValues.employee.functionalAreaId},%`,
                  },
                  {
                    [Op.like]: `%,${separationData.dataValues.employee.functionalAreaId},%`,
                  },
                  {
                    [Op.like]: `%,${separationData.dataValues.employee.functionalAreaId}`,
                  },
                  {
                    [Op.eq]: `${separationData.dataValues.employee.functionalAreaId}`,
                  },
                ],
              },
            },
            {
              jobLevelId: {
                [Op.or]: [
                  {
                    [Op.like]: `${separationData.dataValues.employee.employeejobdetail.jobLevelId},%`,
                  },
                  {
                    [Op.like]: `%,${separationData.dataValues.employee.employeejobdetail.jobLevelId},%`,
                  },
                  {
                    [Op.like]: `%,${separationData.dataValues.employee.employeejobdetail.jobLevelId}`,
                  },
                  {
                    [Op.eq]: `${separationData.dataValues.employee.employeejobdetail.jobLevelId}`,
                  },
                ],
              },
            },
          ],
        },
      });

      const separationOwner = await db.separationTaskMapping.findAll({
        where: {
          taskConfigAutoId: separationConfig.dataValues.taskConfigAutoId,
        },
        include: [
          {
            model: db.separationTaskConfig,
            attributes: ["taskConfigName"],
          },
          {
            model: db.separationTaskMaster,
            where: {
              taskDependent: null,
            },
            attributes: ["taskName", "mappingOn", "mappingData"],
            include: [
              {
                model: db.separationTaskFields,
                attributes: ["taskFieldsAutoId"],
              },
            ],
          },
        ],
      });

      await db.separationMaster.update(
        {
          l2LastWorkingDay: result.l2LastWorkingDay,
          l2RecoveryDays: result.l2RecoveryDays,
          l2RecoveryDaysReason: result.l2RecoveryDaysReason,
          l2SeparationType: result.l2SeparationType,
          l2ReasonOfSeparation: result.l2ReasonOfSeparation,
          l2NewOrganizationName: result.l2NewOrganizationName
            ? result.l2NewOrganizationName
            : null,
          l2SalaryHike: result.l2SalaryHike ? result.l2SalaryHike : null,
          doNotReHire: result.doNotReHire,
          doNotReHireRemark:
            result.doNotReHireRemark != "" ? result.doNotReHireRemark : null,
          l2BillingType: result.l2BillingType,
          l2CustomerName:
            result.l2CustomerName != "" ? result.l2CustomerName : null,
          shortFallPayoutBasis:
            result.shortFallPayoutBasis != ""
              ? result.shortFallPayoutBasis
              : null,
          shortFallPayoutDays:
            result.shortFallPayoutDays != ""
              ? result.shortFallPayoutDays
              : null,
          shortfallPayoutRequired: result.shortfallPayoutRequired,
          ndaConfirmation: result.ndaConfirmation,
          holdFnf: result.holdFnf,
          holdFnfReason:
            result.holdFnfReason != "" ? result.holdFnfReason : null,
          holdFnfTillDate:
            result.holdFnfTillDate != "" ? result.holdFnfTillDate : null,
          l2Remark: result.l2Remark,
          l2Attachment: result.attachment
            ? await helper.fileUpload(
              result.attachment,
              `separation_attachment_${d}`,
              `uploads/${separationData.dataValues.employee.empCode}`
            )
            : null,
          l2SubmissionDate: moment(),
          l2RequestStatus: "Approved",
          finalStatus: 9,
        },
        {
          where: {
            resignationAutoId: result.resignationAutoId,
          },
        }
      );

      await db.separationTrail.update(
        {
          pendingAt: req.userId,
          actionUserRole: req.userRole,
          pending: 0,
          actionDate: moment(),
          updatedBy: req.userId,
          updatedDt: moment(),
        },
        {
          where: {
            separationAutoId: result.resignationAutoId,
            separationStatus: 9,
          },
        }
      );

      for (const element of separationOwner) {
        const initiatedTask = await db.separationInitiatedTask.create({
          employeeId: separationData.dataValues.employee.id,
          resignationAutoId: result.resignationAutoId,
          taskAutoId: element.dataValues.taskAutoId,
          status: 0,
          createdDt: moment(),
          createdBy: 1,
          isActive: 1,
        });

        if (element.dataValues.separationtaskmaster.mappingOn === "FIX") {
          const ownerArray =
            element.dataValues.separationtaskmaster.mappingData.split(",");
          for (const element11 of ownerArray) {
            db.separationTaskOwner.create({
              taskMappingAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
              taskOwner: element11,
              isActive: 1,
              createdDt: moment(),
            });

            const employeeData = await db.employeeMaster.findOne({
              where: {
                id: element11,
              },
              attributes: ["id", "name", "email"],
            });

            mailArray.push({
              email: employeeData.dataValues.email,
              name: employeeData.dataValues.name,
              taskName: element.dataValues.separationtaskmaster.taskName,
            });
          }
        } else if (
          element.dataValues.separationtaskmaster.mappingOn === "SELF"
        ) {
          db.separationTaskOwner.create({
            taskMappingAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
            taskOwner: separationData.dataValues.employee.id,
            isActive: 1,
            createdDt: moment(),
          });

          const employeeData = await db.employeeMaster.findOne({
            where: {
              id: separationData.dataValues.employee.id,
            },
            attributes: ["id", "name", "email"],
          });

          mailArray.push({
            email: employeeData.dataValues.email,
            name: employeeData.dataValues.name,
            taskName: element.dataValues.separationtaskmaster.taskName,
          });
        } else if (
          element.dataValues.separationtaskmaster.mappingOn === "MANAGER"
        ) {
          db.separationTaskOwner.create({
            taskMappingAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
            taskOwner: separationData.dataValues.employee.managerData.id,
            isActive: 1,
            createdDt: moment(),
          });

          const employeeData = await db.employeeMaster.findOne({
            where: {
              id: separationData.dataValues.employee.managerData.id,
            },
            attributes: ["id", "name", "email"],
          });

          mailArray.push({
            email: employeeData.dataValues.email,
            name: employeeData.dataValues.name,
            taskName: element.dataValues.separationtaskmaster.taskName,
          });
        } else if (
          element.dataValues.separationtaskmaster.mappingOn === "OTHER"
        ) {
          const buMappingData = await db.taskBuMapping.findOne({
            where: {
              [Op.and]: [
                {
                  bu: {
                    [Op.or]: [
                      {
                        [Op.like]: `${separationData.dataValues.employee.buId},%`,
                      },
                      {
                        [Op.like]: `%,${separationData.dataValues.employee.buId},%`,
                      },
                      {
                        [Op.like]: `%,${separationData.dataValues.employee.buId}`,
                      },
                      { [Op.eq]: `${separationData.dataValues.employee.buId}` },
                    ],
                  },
                },
                {
                  departmentId: {
                    [Op.or]: [
                      {
                        [Op.like]: `${separationData.dataValues.employee.departmentId},%`,
                      },
                      {
                        [Op.like]: `%,${separationData.dataValues.employee.departmentId},%`,
                      },
                      {
                        [Op.like]: `%,${separationData.dataValues.employee.departmentId}`,
                      },
                      {
                        [Op.eq]: `${separationData.dataValues.employee.departmentId}`,
                      },
                    ],
                  },
                },
                {
                  companyId: {
                    [Op.or]: [
                      {
                        [Op.like]: `${separationData.dataValues.employee.companyId},%`,
                      },
                      {
                        [Op.like]: `%,${separationData.dataValues.employee.companyId},%`,
                      },
                      {
                        [Op.like]: `%,${separationData.dataValues.employee.companyId}`,
                      },
                      {
                        [Op.eq]: `${separationData.dataValues.employee.companyId}`,
                      },
                    ],
                  },
                },
                {
                  taskAutoId: element.dataValues.taskAutoId,
                },
              ],
            },
          });

          if (buMappingData) {
            for (const element12 of buMappingData.dataValues.ownerId.split(
              ","
            )) {
              db.separationTaskOwner.create({
                taskMappingAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
                taskOwner: element12,
                isActive: 1,
                createdDt: moment(),
              });

              const employeeData = await db.employeeMaster.findOne({
                where: {
                  id: element12,
                },
                attributes: ["id", "name", "email"],
              });

              mailArray.push({
                email: employeeData.dataValues.email,
                name: employeeData.dataValues.name,
                taskName: element.dataValues.separationtaskmaster.taskName,
              });
            }
          }
        }

        if (
          element.dataValues.separationtaskmaster.separationtaskfields.length >
          0
        ) {
          for (const element2 of element.dataValues.separationtaskmaster
            .separationtaskfields) {
            await db.separationFieldValues.create({
              taskAutoId: element.dataValues.taskAutoId,
              initiatedTaskAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
              fields: element2.dataValues.taskFieldsAutoId,
              employeeId: separationData.dataValues.employee.id,
              createdDt: moment(),
              createdBy: 1,
            });
          }
        }
      }

      eventEmitter.emit(
        "separationApproveByBUHR",
        JSON.stringify({
          email: separationData.dataValues.employee.email,
          empName: separationData.dataValues.employee.name,
          empCode: separationData.dataValues.employee.empCode,
          dateOfResignation: separationData.dataValues.resignationDate,
          companyName:
            separationData.dataValues.employee.companymaster.companyName,
          lastWorkingDay: result.l2LastWorkingDay,
        })
      );

      for (const element of mailArray) {
        eventEmitter.emit(
          "clearenceInitiated",
          JSON.stringify({
            email: element.email,
            recipientName: element.name,
            taskName: element.taskName,
            empCode: separationData.dataValues.employee.empCode,
            empName: separationData.dataValues.employee.name,
            officeLocation:
              separationData.dataValues.employee.companylocationmaster.address1,
            department: `${separationData.dataValues.employee.departmentmaster.departmentName} (${separationData.dataValues.employee.departmentmaster.departmentCode})`,
            officeMobileNumber:
              separationData.dataValues.employee.officeMobileNumber,
            sbuName: separationData.dataValues.employee.sbumaster.sbuName,
            bu: separationData.dataValues.employee.bumaster.buName,
            reportingName: separationData.dataValues.employee.managerData.name,
            designation:
              separationData.dataValues.employee.designationmaster.name,
            dateOfJoining: separationData.dataValues.employee.dateOfJoining,
            dateOfResignation: separationData.dataValues.resignationDate,
            lastWorkingDay: result.l2LastWorkingDay,
            personalMailID: separationData.dataValues.employee.personalEmail,
            personalMobileNumber:
              separationData.dataValues.employee.personalMobileNumber,
          })
        );
      }

      return respHelper(res, {
        status: 200,
        msg: constant.SEPARATION_STATUS.replace("<status>", "Approved"),
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

  async revokeSeparation(req, res) {
    try {
      const result = await validator.revokeSeparation.validateAsync(req.body);

      const separationData = await db.separationMaster.findOne({
        where: {
          employeeId: req.userId,
          finalStatus: 2,
        },
      });

      if (!separationData) {
        return respHelper(res, {
          status: 404,
          msg: constant.DETAILS_NOT_FOUND.replace("<module>", "Separation"),
        });
      }

      await db.separationMaster.update(
        {
          empRevokeReason: result.reason,
          empRemark: result.remark,
          empRevokeDate: moment(),
          finalStatus: 3,
        },
        {
          where: {
            resignationAutoId: separationData.dataValues.resignationAutoId,
          },
        }
      );

      await db.separationTrail.create({
        separationAutoId: separationData.dataValues.resignationAutoId,
        actionUserRole: req.userRole,
        separationStatus: 3,
        actionDate: moment(),
        pending: 0,
        pendingAt: req.userId,
        createdBy: req.userId,
        createdDt: moment(),
      });

      return respHelper(res, {
        status: 200,
        msg: constant.SEPARATION_REVOKED,
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

  async separationTrails(req, res) {
    try {
      const user = req.query.user || req.userId;

      const separationData = await db.separationMaster.findOne({
        where: {
          employeeId: user,
          finalStatus: {
            [Op.notIn]: [3, 6, 7, 10, 11],
          },
        },
        include: [
          {
            model: db.employeeMaster,
            attributes: ["empCode", "name"],
          },
          {
            model: db.employeeMaster,
            as: "pending",
            attributes: ["empCode", "name"],
          },
          {
            model: db.separationStatus,
            attributes: ["separationStatusDesc"],
          },
          {
            model: db.separationType,
            as: "l2Separationtype",
            attributes: ["separationTypeName"],
          },
          {
            model: db.separationReason,
            as: "empReasonofResignation",
            attributes: ["separationReason"],
          },
          {
            model: db.separationReason,
            as: "l2ReasonofSeparation",
            attributes: ["separationReason"],
          },
          {
            model: db.separationReason,
            as: "l1ReasonofResignation",
            attributes: ["separationReason"],
          },
        ],
      });

      if (separationData) {
        const separationTrails = await db.separationStatus.findAll({
          where: {
            statusTrail: 1,
          },
          attributes: [
            "separationStatusAutoId",
            "separationStatusCode",
            "separationStatusDesc",
            "separationLabel",
          ],
          include: [
            {
              model: db.separationTrail,
              required: true,
              where: {
                separationAutoId: separationData.dataValues.resignationAutoId,
              },
              include: [
                {
                  model: db.employeeMaster,
                  attributes: ["empCode", "name"],
                  as: "pendingat",
                },
              ],
            },
          ],
        });
        separationData.dataValues.separationTrails = separationTrails;
      }

      return respHelper(res, {
        status: 200,
        data: separationData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async taskHistoryAttendance(req, res) {
    try {
      const { search, fromDate, toDate, orderByAppliedFor, orderByOn, type } =
        req.query;
      const limit = parseInt(req.query.limit, 10) || 10;
      const pageNo = parseInt(req.query.page, 10) || 1;
      const offset = (pageNo - 1) * limit;
      const extendedToDate = toDate
        ? new Date(new Date(toDate).setHours(23, 59, 59, 999)).toISOString()
        : null;

      let order = [];
      if (orderByAppliedFor) {
        const attendanceDateOrder = orderByAppliedFor === "0" ? "desc" : "asc";
        order.push([
          { model: db.attendanceMaster, as: "attendancemaster" },
          "attendanceDate",
          attendanceDateOrder,
        ]);
      }

      if (orderByOn) {
        const createdAtOrder = orderByOn === "0" ? "desc" : "asc";
        order.push(["createdAt", createdAtOrder]);
      }

      const { count, rows: regularizationRequests } =
        await db.regularizationMaster.findAndCountAll({
          where: {
            regularizeStatus: { [Op.ne]: "Pending" },
            ...(fromDate &&
              extendedToDate && {
              createdAt: {
                [db.Sequelize.Op.between]: [fromDate, extendedToDate],
              },
            }),
          },
          include: [
            {
              model: db.employeeMaster,
              attributes: ["id", "name", "empCode"],
              as: "attendanceUpdatedBy",
              required: false,
            },
            {
              model: db.attendanceMaster,
              required: true,
              include: [
                {
                  model: db.employeeMaster,
                  attributes: ["id", "empCode", "name", "manager"],
                  where: {
                    ...(search && { name: { [Op.like]: `%${search}%` } }),
                    ...(type === "all"
                      ? {
                        [Op.or]: [
                          //{ id: req.userId },
                          { manager: req.userId },
                        ],
                      }
                      : { id: req.userId }),
                  },
                  include: [
                    {
                      model: db.employeeMaster,
                      attributes: ["id", "empCode", "name"],
                      as: "managerData",
                    },
                  ],
                  required: true,
                },
              ],
            },
          ],
          limit,
          offset,
          order,
        });

      return respHelper(res, {
        status: 200,
        msg: constant.DATA_FETCHED,
        data: {
          totalRecords: count,
          totalPages: Math.ceil(count / limit),
          currentPage: pageNo,
          regularizationRequests,
        },
      });
    } catch (error) {
      return respHelper(res, {
        status: 500,
        msg: error.message,
      });
    }
  }

  async taskHistoryLeave(req, res) {
    try {
      const {
        search,
        fromDate,
        toDate,
        orderByAppliedFor,
        orderByOn,
        type,
        isSystemGenerated,
      } = req.query;

      const limit = parseInt(req.query.limit, 10) || 10;
      const pageNo = parseInt(req.query.page, 10) || 1;
      const offset = (pageNo - 1) * limit;

      let order = [];
      if (orderByAppliedFor) {
        const attendanceDateOrder = orderByAppliedFor === "0" ? "desc" : "asc";
        order.push(["appliedFor", attendanceDateOrder]);
      }

      if (orderByOn) {
        const createdAtOrder = orderByOn === "0" ? "desc" : "asc";
        order.push(["appliedOn", createdAtOrder]);
      }

      const { count, rows: leaveRequests } =
        await db.employeeLeaveTransactions.findAndCountAll({
          where: {
            status: { [Op.ne]: "pending" },
            ...(isSystemGenerated == 1 && { source: "system_generated" }),
            ...(fromDate &&
              toDate && {
              appliedFor: {
                [db.Sequelize.Op.between]: [fromDate, toDate],
              },
            }),
            ...(type === "all" && isSystemGenerated == 0
              ? {
                [Op.or]: [{ pendingAt: req.userId }],
              }
              : type === "all" && isSystemGenerated == 1
                ? {
                  [Op.or]: [
                    { employeeId: req.userId },
                    { pendingAt: req.userId },
                  ],
                }
                : { employeeId: req.userId }), // Default case for non-"all" types
          },
          include: [
            {
              model: db.employeeMaster,
              attributes: ["id", "name", "empCode"],
              where: { ...(search && { name: { [Op.like]: `%${search}%` } }) },
            },
            {
              model: db.leaveMaster,
              attributes: ["leaveId", "leaveName", "leaveCode"],
              as: "leaveMasterDetails",
            },
            {
              model: db.employeeMaster,
              attributes: ["id", "name", "empCode"],
              as: "leaveUpdatedBy",
              required: false,
            },
          ],
          limit,
          offset,
          order,
        });

      return respHelper(res, {
        status: 200,
        msg: constant.DATA_FETCHED,
        data: {
          totalRecords: count,
          totalPages: Math.ceil(count / limit),
          currentPage: pageNo,
          leaveRequests,
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

  async separationTaskForm(req, res) {
    try {
      const user = req.query.user || req.userId;

      const separationFields = await db.separationTaskFields.findAll({
        where: {
          taskAutoId: req.params.id,
        },
      });

      return respHelper(res, {
        status: 200,
        data: separationFields,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async separationTaskValues(req, res) {
    try {
      let reqObj = {};
      for (const element of req.body) {
        if (
          element.fieldsCode === "file" &&
          element.value !== "" &&
          element.value
        ) {
          const d = Math.floor(Date.now() / 1000);
          const userData = await db.employeeMaster.findOne({
            where: {
              id: element.user,
            },
            attributes: ["empCode"],
          });
          const fileName = await helper.fileUpload(
            element.value,
            `separationTask_${element.id}_${d}`,
            `uploads/${userData.dataValues.empCode.toString()}`
          );
          element.value = fileName;
        }
        reqObj[element.fieldsCode] =
          element.value !== "" ? element.value : null;
      }

      for (const element of req.body) {
        await db.separationFieldValues.update(
          {
            fieldValues: element.value,
            updatedBy: req.userId,
            updatedAt: moment(),
          },
          {
            where: {
              taskAutoId: element.taskAutoId,
              fields: element.id,
              employeeId: element.user,
            },
          }
        );
      }

      await db.separationInitiatedTask.update(
        {
          status: 1,
          updatedBy: req.userId,
          updatedAt: moment(),
        },
        {
          where: {
            taskAutoId: req.body[0].taskAutoId,
            employeeId: req.body[0].user,
          },
        }
      );

      const mailArray = [];
      const separationData = await db.separationMaster.findOne({
        where: {
          employeeId: req.body[0].user,
          finalStatus: 9,
        },
        attributes: ["initiatedBy", "resignationDate"],
        include: [
          {
            model: db.employeeMaster,
            attributes: [
              "id",
              "empCode",
              "name",
              "email",
              "officeMobileNumber",
              "personalEmail",
              "personalMobileNumber",
              "dateOfJoining",
              "companyId",
              "buId",
              "sbuId",
              "departmentId",
              "functionalAreaId",
            ],
            include: [
              {
                model: db.companyLocationMaster,
                attributes: ["address1"],
              },
              {
                model: db.departmentMaster,
                attributes: ["departmentName", "departmentCode"],
              },
              {
                model: db.employeeMaster,
                as: "managerData",
                attributes: ["name"],
              },
              {
                model: db.sbuMaster,
                attributes: ["sbuName"],
              },
              {
                model: db.buMaster,
                attributes: ["buName"],
              },
              {
                model: db.companyMaster,
                attributes: ["companyName"],
              },
              {
                model: db.designationMaster,
                attributes: ["name"],
              },
              {
                model: db.jobDetails,
                required: true,
                attributes: ["jobLevelId"],
              },
            ],
          },
        ],
      });
      if (separationData) {
        const separationConfig = await db.separationTaskConfig.findOne({
          where: {
            [Op.and]: [
              {
                functionalAreaId: {
                  [Op.or]: [
                    {
                      [Op.like]: `${separationData.dataValues.employee.functionalAreaId},%`,
                    },
                    {
                      [Op.like]: `%,${separationData.dataValues.employee.functionalAreaId},%`,
                    },
                    {
                      [Op.like]: `%,${separationData.dataValues.employee.functionalAreaId}`,
                    },
                    {
                      [Op.eq]: `${separationData.dataValues.employee.functionalAreaId}`,
                    },
                  ],
                },
              },
              {
                jobLevelId: {
                  [Op.or]: [
                    {
                      [Op.like]: `${separationData.dataValues.employee.employeejobdetail.jobLevelId},%`,
                    },
                    {
                      [Op.like]: `%,${separationData.dataValues.employee.employeejobdetail.jobLevelId},%`,
                    },
                    {
                      [Op.like]: `%,${separationData.dataValues.employee.employeejobdetail.jobLevelId}`,
                    },
                    {
                      [Op.eq]: `${separationData.dataValues.employee.employeejobdetail.jobLevelId}`,
                    },
                  ],
                },
              },
            ],
          },
        });

        const separationOwner = await db.separationTaskMapping.findAll({
          where: {
            taskConfigAutoId: separationConfig.dataValues.taskConfigAutoId,
          },
          include: [
            {
              model: db.separationTaskConfig,
              attributes: ["taskConfigName"],
            },
            {
              model: db.separationTaskMaster,
              where: {
                taskDependent: req.body[0].taskAutoId,
              },
              attributes: ["taskName", "mappingOn", "mappingData"],
              include: [
                {
                  model: db.separationTaskFields,
                  attributes: ["taskFieldsAutoId"],
                },
              ],
            },
          ],
        });

        for (const element of separationOwner) {
          const initiatedTask = await db.separationInitiatedTask.create({
            employeeId: separationData.dataValues.employee.id,
            taskAutoId: element.dataValues.taskAutoId,
            status: 0,
            createdDt: moment(),
            createdBy: 1,
            isActive: 1,
          });

          if (element.dataValues.separationtaskmaster.mappingOn === "FIX") {
            const ownerArray =
              element.dataValues.separationtaskmaster.mappingData.split(",");
            for (const element11 of ownerArray) {
              db.separationTaskOwner.create({
                taskMappingAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
                taskOwner: element11,
                isActive: 1,
                createdDt: moment(),
              });

              const employeeData = await db.employeeMaster.findOne({
                where: {
                  id: element11,
                },
                attributes: ["id", "name", "email"],
              });

              mailArray.push({
                email: employeeData.dataValues.email,
                name: employeeData.dataValues.name,
                taskName: element.dataValues.separationtaskmaster.taskName,
              });
            }
          } else if (
            element.dataValues.separationtaskmaster.mappingOn === "SELF"
          ) {
            db.separationTaskOwner.create({
              taskMappingAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
              taskOwner: separationData.dataValues.employee.id,
              isActive: 1,
              createdDt: moment(),
            });

            const employeeData = await db.employeeMaster.findOne({
              where: {
                id: separationData.dataValues.employee.id,
              },
              attributes: ["id", "name", "email"],
            });

            mailArray.push({
              email: employeeData.dataValues.email,
              name: employeeData.dataValues.name,
              taskName: element.dataValues.separationtaskmaster.taskName,
            });
          } else if (
            element.dataValues.separationtaskmaster.mappingOn === "MANAGER"
          ) {
            db.separationTaskOwner.create({
              taskMappingAutoId: initiatedTask.dataValues.initiatedTaskAutoId,
              taskOwner: separationData.dataValues.employee.managerData.id,
              isActive: 1,
              createdDt: moment(),
            });

            const employeeData = await db.employeeMaster.findOne({
              where: {
                id: separationData.dataValues.employee.managerData.id,
              },
              attributes: ["id", "name", "email"],
            });

            mailArray.push({
              email: employeeData.dataValues.email,
              name: employeeData.dataValues.name,
              taskName: element.dataValues.separationtaskmaster.taskName,
            });
          } else if (
            element.dataValues.separationtaskmaster.mappingOn === "OTHER"
          ) {
            const buMappingData = await db.taskBuMapping.findOne({
              where: {
                [Op.and]: [
                  {
                    bu: {
                      [Op.or]: [
                        {
                          [Op.like]: `${separationData.dataValues.employee.buId},%`,
                        },
                        {
                          [Op.like]: `%,${separationData.dataValues.employee.buId},%`,
                        },
                        {
                          [Op.like]: `%,${separationData.dataValues.employee.buId}`,
                        },
                        {
                          [Op.eq]: `${separationData.dataValues.employee.buId}`,
                        },
                      ],
                    },
                  },
                  {
                    departmentId: {
                      [Op.or]: [
                        {
                          [Op.like]: `${separationData.dataValues.employee.departmentId},%`,
                        },
                        {
                          [Op.like]: `%,${separationData.dataValues.employee.departmentId},%`,
                        },
                        {
                          [Op.like]: `%,${separationData.dataValues.employee.departmentId}`,
                        },
                        {
                          [Op.eq]: `${separationData.dataValues.employee.departmentId}`,
                        },
                      ],
                    },
                  },
                  {
                    companyId: {
                      [Op.or]: [
                        {
                          [Op.like]: `${separationData.dataValues.employee.companyId},%`,
                        },
                        {
                          [Op.like]: `%,${separationData.dataValues.employee.companyId},%`,
                        },
                        {
                          [Op.like]: `%,${separationData.dataValues.employee.companyId}`,
                        },
                        {
                          [Op.eq]: `${separationData.dataValues.employee.companyId}`,
                        },
                      ],
                    },
                  },
                  {
                    taskAutoId: element.dataValues.taskAutoId,
                  },
                ],
              },
            });

            if (buMappingData) {
              for (const element12 of buMappingData.dataValues.ownerId.split(
                ","
              )) {
                console.log(element12);
                db.separationTaskOwner.create({
                  taskMappingAutoId:
                    initiatedTask.dataValues.initiatedTaskAutoId,
                  taskOwner: element12,
                  isActive: 1,
                  createdDt: moment(),
                });

                const employeeData = await db.employeeMaster.findOne({
                  where: {
                    id: element12,
                  },
                  attributes: ["id", "name", "email"],
                });

                mailArray.push({
                  email: employeeData.dataValues.email,
                  name: employeeData.dataValues.name,
                  taskName: element.dataValues.separationtaskmaster.taskName,
                });
              }
            }
          }

          if (
            element.dataValues.separationtaskmaster.separationtaskfields
              .length > 0
          ) {
            for (const element2 of element.dataValues.separationtaskmaster
              .separationtaskfields) {
              await db.separationFieldValues.create({
                taskAutoId: element.dataValues.taskAutoId,
                initiatedTaskAutoId:
                  initiatedTask.dataValues.initiatedTaskAutoId,
                fields: element2.dataValues.taskFieldsAutoId,
                employeeId: separationData.dataValues.employee.id,
                createdDt: moment(),
                createdBy: 1,
              });
            }
          }
        }

        for (const element of mailArray) {
          eventEmitter.emit(
            "clearenceInitiated",
            JSON.stringify({
              email: element.email,
              recipientName: element.name,
              taskName: element.taskName,
              empCode: separationData.dataValues.employee.empCode,
              empName: separationData.dataValues.employee.name,
              officeLocation:
                separationData.dataValues.employee.companylocationmaster
                  .address1,
              department: `${separationData.dataValues.employee.departmentmaster.departmentName} (${separationData.dataValues.employee.departmentmaster.departmentCode})`,
              officeMobileNumber:
                separationData.dataValues.employee.officeMobileNumber,
              sbuName: separationData.dataValues.employee.sbumaster.sbuName,
              bu: separationData.dataValues.employee.bumaster.buName,
              reportingName:
                separationData.dataValues.employee.managerData.name,
              dateOfJoining: separationData.dataValues.employee.dateOfJoining,
              dateOfResignation: separationData.dataValues.resignationDate,
              designation:
                separationData.dataValues.employee.designationmaster.name,
              lastWorkingDay: separationData.dataValues.l2LastWorkingDay,
              personalMailID: separationData.dataValues.employee.personalEmail,
              personalMobileNumber:
                separationData.dataValues.employee.personalMobileNumber,
            })
          );
        }
      }

      return respHelper(res, {
        status: 200,
        msg: constant.TASK_SUBMITTED,
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

  async initiatedTaskList(req, res) {
    try {
      const separationTasks = await db.separationInitiatedTask.findAll({
        where: {
          status: 0,
          isActive: 1
        },
        attributes: ["initiatedTaskAutoId", "status", "createdDt"],
        include: [
          {
            model: db.employeeMaster,
            required: true,
            attributes: [
              "id",
              "empCode",
              "name",
              "dateOfJoining",
              "dataCardAdmin",
              "mobileAdmin",
            ],
            include: [
              {
                model: db.separationMaster,
                attributes: ["resignationDate", "l2LastWorkingDay"],
                required: true,
                where: {
                  finalStatus: 9,
                  resignationAutoId: db.Sequelize.col('separationInitiatedTask.resignationAutoId')
                },
              },
              {
                model: db.designationMaster,
                attributes: ["name", "code"],
              },
              {
                model: db.buMaster,
                attributes: ["buName"],
              },
              {
                model: db.sbuMaster,
                attributes: ["sbuName"],
              },
              {
                model: db.employeeMaster,
                as: "managerData",
                attributes: ["empCode", "name", "email"],
              },
              {
                model: db.companyLocationMaster,
                attributes: ["address1"],
              },
            ],
          },
          {
            model: db.separationTaskMaster,
            attributes: ["taskAutoId", "taskName", "taskCode"],
          },
          {
            model: db.separationTaskOwner,
            attributes: [
              "taskOwnerAutoId",
              "taskMappingAutoId",
              "taskOwner",
              "isActive",
            ],
            required: true,
            where: {
              taskOwner: req.userId,
            },
            include: [
              {
                model: db.employeeMaster,
                attributes: ["name", "empCode"],
              },
            ],
          },
        ],
        order: [["initiatedTaskAutoId", "DESC"]],
      });

      return respHelper(res, {
        status: 200,
        data: separationTasks,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async empInitiatedTask(req, res) {
    try {
      const user = req.query.user || req.userId;

      const taskData = await db.separationInitiatedTask.findAll({
        where: {
          employeeId: user,
          isActive: 1
        },
        attributes: ["initiatedTaskAutoId", "status", "createdDt"],
        include: [
          {
            model: db.employeeMaster,
            required: true,
            attributes: ["empCode", "name"],
            include: [
              {
                model: db.designationMaster,
                attributes: ["name"],
              },
              {
                model: db.separationMaster,
                required: true,
                where: {
                  finalStatus: 9,
                  resignationAutoId: db.Sequelize.col('separationInitiatedTask.resignationAutoId')
                },
                attributes: ["resignationDate", "l2LastWorkingDay"],
              },
            ],
          },
          {
            model: db.separationTaskMaster,
            attributes: ["taskAutoId", "taskName", "taskCode"],
          },
          {
            model: db.separationTaskOwner,
            attributes: [
              "taskOwnerAutoId",
              "taskMappingAutoId",
              "taskOwner",
              "isActive",
            ],
            required: true,
            // nest: true,
            include: [
              {
                model: db.employeeMaster,
                attributes: ["name", "empCode"],
              },
            ],
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        data: taskData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }
  // manager history
  async managerHistory(req, res) {
    try {
      const listData = await db.managerHistory.findAll({
        where: {
          employeeId: req.query.user,
          needAttendanceCron: 0,
        },
        include: [
          {
            model: db.employeeMaster,
            as: "managerHistoryDate",
            attributes: ["id", "empCode", "name"],
            required: true,
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        msg: constant.DATA_FETCHED,
        data: listData,
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
  // manager history
  // userPolicyHistory
  async userPolicyHistory(req, res) {
    try {
      const listData = await db.PolicyHistory.findAll({
        where: {
          employeeId: req.query.user,
          needAttendanceCron: 0,
        },
        attributes: ["id", "updatedAt", "fromDate", "toDate"],
        order: [["id", "DESC"]], // Replace 'createdAt' with your desired column
        include: [
          {
            model: db.shiftMaster,
            as: "historyshiftMaster",
            attributes: ["shiftId", "shiftName"],
          },
          {
            model: db.attendancePolicymaster,
            as: "historyattendanceMaster",
            attributes: ["attendancePolicyId", "policyName"],
          },
          {
            model: db.weekOffMaster,
            as: "historyweekOffMaster",
            attributes: ["weekOffId", "weekOffName"],
          },
          {
            model: db.employeeMaster,
            as: "PolicyUpdaterDetails",
            attributes: ["id", "name", "empCode"],
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        msg: constant.DATA_FETCHED,
        data: listData,
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

  async taskData(req, res) {
    try {
      const user = req.query.user;
      const task = req.query.task;

      const taskData = await db.separationTaskMaster.findOne({
        where: {
          taskAutoId: task,
        },
      });

      if (!taskData) {
        return respHelper(res, {
          status: 200,
        });
      }

      const taskFormValues = await db.separationTaskFields.findAll({
        where: {
          taskAutoId: taskData.dataValues.taskDependent,
        },
        include: [
          {
            model: db.separationFieldValues,
            attributes: ["fieldValues"],
            where: {
              employeeId: user,
            },
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        data: taskFormValues,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async taskHistorySeparation(req, res) {
    try {
      const { search } = req.query;
      const limit = parseInt(req.query.limit, 10) || 10;
      const pageNo = parseInt(req.query.page, 10) || 1;
      const offset = (pageNo - 1) * limit;

      const { count, rows: separationData } =
        await db.separationTrail.findAndCountAll({
          where: { pendingAt: req.userId, pending: 0 },
          include: [
            {
              model: db.separationMaster,
              where: {
                employeeId: { [Op.ne]: req.userId },
              },
              include: [
                {
                  model: db.employeeMaster,
                  attributes: ["empCode", "name"],
                  where: {
                    ...(search && { name: { [Op.like]: `%${search}%` } }),
                  },
                },
                {
                  model: db.separationStatus,
                  attributes: ["separationStatusCode", "separationStatusDesc"],
                },
                {
                  model: db.separationReason,
                  as: "empReasonofResignation",
                  attributes: ["separationReason"],
                },
                {
                  model: db.separationReason,
                  as: "l1ReasonofResignation",
                  attributes: ["separationReason"],
                },
                {
                  model: db.separationReason,
                  attributes: ["separationReason"],
                  as: "l2ReasonofSeparation",
                },
                {
                  model: db.subCategoryMaster,
                  attributes: ["subCategoryName"],
                  as: "revokeReason",
                },
              ],
            },
            {
              model: db.separationStatus,
              attributes: ["separationStatusCode", "separationStatusDesc"],
            },
            {
              model: db.employeeMaster,
              attributes: ["empCode", "name"],
              as: "pendingat",
            },
          ],
          limit,
          offset,
          distinct: true,
        });

      return respHelper(res, {
        status: 200,
        data: {
          totalRecords: count,
          totalPages: Math.ceil(count / limit),
          currentPage: pageNo,
          separationData,
        },
      });
    } catch (error) {
      console.error(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }


  async separationWorkflow(req, res) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const pageNo = parseInt(req.query.page, 10) || 1;
      const offset = (pageNo - 1) * limit;

      const { count, rows: workflowData } =
        await db.separationInitiatedTask.findAndCountAll({
          where: {
            updatedBy: req.userId,
          },
          include: [
            {
              model: db.separationTaskOwner,
              attributes: ["taskOwnerAutoId", "taskOwner"],
              include: [
                {
                  model: db.employeeMaster,
                  attributes: ["empCode", "name"],
                },
              ],
            },
            {
              model: db.separationTaskMaster,
              attributes: ["taskAutoId", "taskCode", "taskName"],
            },
            {
              model: db.employeeMaster,
              attributes: ["id", "name", "email", "empCode"],
              include: [
                {
                  model: db.companyLocationMaster,
                  attributes: ["address1"],
                },
                {
                  model: db.jobDetails,
                  attributes: ["dateOfJoining"],
                  include: [
                    {
                      model: db.jobLevelMaster,
                      attributes: [
                        "jobLevelId",
                        "jobLevelName",
                        "jobLevelCode",
                      ],
                    },
                  ],
                },
                {
                  model: db.separationMaster,
                  attributes: [
                    "resignationDate",
                    "noticePeriodDay",
                    "l2LastWorkingDay",
                  ],
                },
              ],
            },
            {
              model: db.separationFieldValues,
              attributes: ["fieldValues"],
              separate: true,
              include: [
                {
                  model: db.separationTaskFields,
                  attributes: ["fieldsCode", "label", "isRequired"],
                },
              ],
            },
          ],
          limit,
          offset,
        });

      return respHelper(res, {
        status: 200,
        data: {
          totalRecords: count,
          totalPages: Math.ceil(count / limit),
          currentPage: pageNo,
          workflowData,
        },
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }


  async revokeSeparationBUHR(req, res) {
    try {
      const result = await validator.revokeSeparationBUHR.validateAsync(
        req.body
      );

      const separationData = await db.separationMaster.findOne({
        where: {
          resignationAutoId: result.resignationAutoId,
          finalStatus: 9,
        },
      });

      if (!separationData) {
        return respHelper(res, {
          status: 404,
          msg: constant.DETAILS_NOT_FOUND.replace("<module>", "Separation"),
        });
      }

      await db.separationMaster.update(
        {
          l2RevokeReason: result.reason,
          l2RequestStatus: "Revoked",
          l2Remark: result.remark,
          l2RevokeDate: moment(),
          finalStatus: 11,
        },
        {
          where: {
            resignationAutoId: separationData.dataValues.resignationAutoId,
          },
        }
      );

      await db.separationTrail.create({
        separationAutoId: separationData.dataValues.resignationAutoId,
        actionUserRole: req.userRole,
        separationStatus: 11,
        actionDate: moment(),
        pending: 0,
        pendingAt: req.userId,
        createdBy: req.userId,
        createdDt: moment(),
      });

      await db.separationInitiatedTask.update({
        isActive: 0
      }, {
        where: {
          resignationAutoId: separationData.dataValues.resignationAutoId,
        }
      })

      return respHelper(res, {
        status: 200,
        msg: constant.SEPARATION_REVOKED,
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

  async requestForPaymentApproval(req, res) {
    try {
      const result =
        await validator.requestForPaymentApprovalSchema.validateAsync(req.body);

        const existUser = await db.employeeMaster.findOne({
          raw: true,
          where: {
            id: req.userId,
            isActive: 1,
          },
          attributes: ["name","empCode", "profileImage"],
        });
      const isSameDetails = await db.paymentDetails.findOne({
        where: { userId: req.userId },
      });

      if (isSameDetails) {
        if(
          isSameDetails.paymentAccountNumber == result.paymentAccountNumber 
          && isSameDetails.paymentBankIfsc == result.paymentBankIfsc
        ){
          return respHelper(res, {
            status: 400,
            msg: constant.ALREADY_EXISTS.replace("<module>", "Payment Details"),
          });
        }
        else{
          const d = Math.floor(Date.now() / 1000);
          if(result.paymentAttachment){
          var paymentAttachment = await helper.fileUpload(
            result.paymentAttachment,
            `paymentDetails${d}`,
            `uploads/${existUser.empCode}`
          );
        }
        if(result.supportingDocument){
          var supportingDocument = await helper.fileUpload(
            result.supportingDocument,
            `paymentDetails${d}`,
            `uploads/${existUser.empCode}`
          );      
        }
         const objForApproval = {
          status:"pending",
          pendingAt:1982,
          ...(result.bankId != isSameDetails.bankId && { newBankId: result.bankId }),
          ...(result.paymentBankName && { newBankNameReq: result.paymentBankName }),
          ...(result.paymentAccountNumber != isSameDetails.paymentAccountNumber && { newAccountNumberReq: result.paymentAccountNumber }),
          ...(result.paymentHolderName != isSameDetails.paymentHolderName && { newAccountHolderNameReq: result.paymentHolderName }),
          ...(result.paymentBankIfsc != isSameDetails.paymentBankIfsc && { newIfscCodeReq: result.paymentBankIfsc }),
          ...(result.comment ? { comment: result.comment }:{comment: null}),
          ...(result.paymentAttachment ? { newPaymentAttachment: paymentAttachment } : { newPaymentAttachment: null }),
          ...(result.supportingDocument ? { newSupportingDocument: supportingDocument } : { newSupportingDocument: null })
         }
         await db.paymentDetails.update(objForApproval,{ where: { userId: req.userId }});
         eventEmitter.emit(
          "paymentDetailsApprovalRequestMail",
          JSON.stringify({
            email: result.email,
            name: existUser.name
          })
        );
         return respHelper(res, {
          status: 200,
          msg: constant.PAYMENT_REQUEST_FOR_APPROVAL,
        });
       }
      } else {
        const objForApproval = {
          userId:req.userId,
          status:"pending",
          pendingAt:1982,
          ...(result.bankId && { newBankId: result.bankId }),
          ...(result.paymentBankName && { newBankNameReq: result.paymentBankName }),
          ...(result.paymentAccountNumber && { newAccountNumberReq: result.paymentAccountNumber }),
          ...(result.paymentHolderName && { newAccountHolderNameReq: result.paymentHolderName }),
          ...(result.paymentBankIfsc && { newIfscCodeReq: result.paymentBankIfsc }),
          ...(result.comment ? { comment: result.comment }:{comment: null}),
          ...(result.paymentAttachment ? { newPaymentAttachment: paymentAttachment } : { newPaymentAttachment: null }),
          ...(result.supportingDocument ? { newSupportingDocument: supportingDocument } : { newSupportingDocument: null })
         }
         await db.paymentDetails.create(objForApproval);
         eventEmitter.emit(
          "paymentDetailsApprovalRequestMail",
          JSON.stringify({
            email: result.email,
            name: existUser.name
          })
        );
         return respHelper(res, {
          status: 200,
          msg: constant.PAYMENT_REQUEST_FOR_APPROVAL,
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

async mapBank(req, res) {
  try {
    const getAllEmployee = await db.paymentDetails.findAll({
      where: {
        paymentBankIfsc: { [Op.ne]: null }
      }
    });

    if (getAllEmployee) {
      for (let i = 0; i < getAllEmployee.length; i++) {
        const ele = getAllEmployee[i];
        const bankRecord = await db.bankMaster.findOne({ where: { bankIfsc: ele.paymentBankIfsc } });

        if (bankRecord) {
          await db.paymentDetails.update(
            { bankId: bankRecord.bankId },
            { where: { userId: ele.userId } }
          );
        } else {
          console.log("Bank ID is not available for IFSC:", ele.paymentBankIfsc);
        }
      }
    }

    return res.status(200).json({ message: "Bank mapping completed successfully" });
  } catch (error) {
    console.error(error);

    if (error.isJoi === true) {
      return respHelper(res, {
        status: 422,
        msg: error.details[0].message,
      });
    }
    return respHelper(res, {
      status: 500,
      msg: "Internal server error",
    });
  }
}

}

export default new UserController();
