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
                  "recruiterName"
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
                    attributes: ["address1"],
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
                as: "lwfStateName"
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
                attributes: ['pincodeId', 'pincode'],
                as: "currentpincode"
              },
              {
                model: db.pinCodeMaster,
                attributes: ['pincodeId', 'pincode'],
                as: "permanentpincode"
              },
              {
                model: db.pinCodeMaster,
                attributes: ['pincodeId', 'pincode'],
                as: "emergencypincode"
              }
            ],
          },
          {
            model: db.employeeWorkExperience
          },
          {
            model: db.hrLetters,
            attributes: ['documentType', 'documentImage'],
            include: {
              model: db.hrDocumentMaster,
              attributes: ['documentId', 'documentName']
            }
          },
          {
            model: db.employeeCertificates
          }
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
          },
          mobile: {
            raisedByMe: {
              leaveData: countLeavePending.length,
              attedanceData: pendingAttCount,
            },
            assignedToMe: {
              leaveData: countLeaveAssgined.length,
              attedanceData: assignedAttCount,
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
        { password: await helper.encryptPassword(newPassword) },
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
      const result = await validator.separationByEmployee.validateAsync(req.body)
      const user = req.query.user || req.userId

      const existUser = await db.employeeMaster.findOne({
        where: {
          id: user
        },
        include: [
          {
            model: db.noticePeriodMaster,
            attributes: ['noticePeriodDuration']
          }
        ]
      })

      const lastWorkingDay = moment(result.resignationDate, 'YYYY-MM-DD').add(existUser.dataValues.noticeperiodmaster.noticePeriodDuration, 'days')

      const d = Math.floor(Date.now() / 1000);

      await db.separationMaster.create({
        employeeId: existUser.dataValues.id,
        initiatedBy: parseInt(req.query.user) === parseInt(req.userId) ? "Self" : "Other",
        noticePeriodDay: existUser.dataValues.noticeperiodmaster.noticePeriodDuration,
        noticePeriodLastWorkingDay: lastWorkingDay.format("YYYY-MM-DD"),
        resignationDate: result.resignationDate,
        empProposedLastWorkingDay: result.empProposedLastWorkingDay,
        empProposedRecoveryDays: result.empProposedRecoveryDays,
        empReasonOfResignation: result.empReasonOfResignation,
        empSalaryHike: result.empSalaryHike,
        empPersonalEmailId: result.empPersonalEmailId,
        empPersonalMobileNumber: result.empPersonalMobileNumber,
        empRemark: result.empRemark,
        pendingAt: existUser.dataValues.manager,
        finalStatus: "User_Submitted",
        empAttachment: (result.attachment != '') ? await helper.fileUpload(
          result.attachment,
          `separation_attachment_${d}`,
          `uploads/${existUser.dataValues.empCode}`
        ) : null,
        empSubmissionDate: moment()
      })

      return respHelper(res, {
        status: 200,
        msg: constant.SEPARATION_INITIATED
      });
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) {
        return respHelper(res, {
          status: 422,
          msg: error.details[0].message
        });
      }
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async separationDetails(req, res) {
    try {

      const separationData = await db.separationMaster.findOne({
        where: {
          finalStatus: 'User_Submitted',
          [Op.or]: [{
            employeeId: req.userId
          }, {
            pendingAt: req.userId
          }]
        },
        include: [{
          model: db.employeeMaster,
          attributes: ['empCode', 'name']
        }]
      })

      return respHelper(res, {
        status: 200,
        data: separationData
      })

    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async managerInputOnseparation(req, res) {
    try {
      const result = await validator.managerInputOnseparation.validateAsync(req.body)

      const separationData = await db.separationMaster.findOne({
        where: {
          resignationAutoId: result.resignationAutoId
        },
        attributes: ['initiatedBy'],
        include: [{
          model: db.employeeMaster,
          attributes: ['empCode', 'name', 'email', 'buHRId'],
        }]
      })

      const d = Math.floor(Date.now() / 1000);
      const separationManagerAttachment = await helper.fileUpload(
        result.attachment,
        `separation_attachment_${d}`,
        `uploads/${separationData.dataValues.employee.empCode}`
      );

      await db.separationMaster.update({
        l1ProposedLastWorkingDay: result.l1ProposedLastWorkingDay,
        l1ProposedRecoveryDays: result.l1ProposedRecoveryDays,
        l1ReasonForProposedRecoveryDays: result.l1ReasonForProposedRecoveryDays,
        l1ReasonOfResignation: result.l1ReasonOfResignation,
        l1BillingType: result.l1BillingType,
        l1CustomerName: result.l1CustomerName,
        replacementRequired: result.replacementRequired,
        replacementRequiredBy: result.replacementRequiredBy,
        l1Remark: result.l1Remark,
        l1Attachment: separationManagerAttachment,
        l1SubmissionDate: moment(),
        pendingAt: separationData.dataValues.employee.buHRId,
        l1RequestStatus: "L1_Approved"
      }, {
        where: {
          resignationAutoId: result.resignationAutoId
        }
      })

      return respHelper(res, {
        status: 200,
        msg: "Filled Remark"
      });

    } catch (error) {
      console.log(error);
      if (error.isJoi === true) {
        return respHelper(res, {
          status: 422,
          msg: error.details[0].message
        });
      }
      return respHelper(res, {
        status: 500,
      });
    }
  }

  // async rejectSeparation(req, res) {
  //   try {
  //     const result = await validator.rejectSeparation.validateAsync(req.body)

  //     await db.separationMaster.update({

  //     }, {
  //       where: {
  //         resignationAutoId: result.resignationAutoId
  //       }
  //     })


  //     return respHelper(res, {
  //       status: 200,
  //       // msg:constant
  //     })
  //   } catch (error) {
  //     console.log(error);
  //     if (error.isJoi === true) {
  //       return respHelper(res, {
  //         status: 422,
  //         msg: error.details[0].message
  //       });
  //     }
  //     return respHelper(res, {
  //       status: 500,
  //     });
  //   }
  // }
}

export default new UserController();
