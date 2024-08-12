import { Op } from "sequelize";
import db from "../../../config/db.config.js";
import respHelper from "../../../helper/respHelper.js";
import client from "../../../config/redisDb.config.js";

class MasterController {
  async employee(req, res) {
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
      const usersData = req.userData;

      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const cacheKey = `employeeList:${pageNo}:${limit}:${search || ""}:${department || ""
        }:${designation || ""}:${buSearch || ""}:${sbuSearch || ""}:${areaSearch || ""
        }`;

      let employeeData = [];
      await client.get(cacheKey).then(async (data) => {
        if (data) {
          employeeData = JSON.parse(data);
          return respHelper(res, {
            status: 200,
            data: employeeData,
          });
        } else {
          if (
            usersData.role_id != 1 &&
            usersData.role_id != 2 &&
            usersData.role_id != 5
          ) {
            let permissionAssignTousers = usersData.permissionAndAccess 
              .split(",")
              .map((el) => parseInt(el));
            let permissionAndAccess = await db.permissoinandaccess.findAll({
              where: {
                role_id: usersData.role_id,
                isActive: 1,
                permissoinandaccessId: {
                  [Op.in]: permissionAssignTousers,
                },
              },
            }); /// get all permission of access to fetch list with active status as per role

            const buArrayForFilter = permissionAndAccess
              .filter((obj) => obj.permissionType == "BU")
              .map((obj) => obj.permissionValue); // checking BU Access

            if (buArrayForFilter.length > 0) {
              buFIlter.buId = {
                ///appedning Bu to filter
                [Op.in]: buArrayForFilter,
              };
            }

            const sbuArrayForFilter = permissionAndAccess
              .filter((obj) => obj.permissionType == "SBU")
              .map((obj) => obj.permissionValue); // checking SBU Access
            if (sbuArrayForFilter.length > 0) {
              sbbuFIlter.sbuId = {
                ///appedning SBU to filter
                [Op.in]: sbuArrayForFilter,
              };
            }

            const departmentArrayForFilter = permissionAndAccess
              .filter((obj) => obj.permissionType == "DEPARTMENT")
              .map((obj) => obj.permissionValue); // checking department Access

            if (departmentArrayForFilter.length > 0) {
              departmentFIlter.departmentId = {
                ///appedning department to filter
                [Op.in]: departmentArrayForFilter,
              };
            }
            const funcareaArrayForFilter = permissionAndAccess
              .filter((obj) => obj.permissionType == "FUNCAREA")
              .map((obj) => obj.permissionValue); // checking SBU Access

            if (funcareaArrayForFilter.length > 0) {
              functionAreaFIlter.functionalAreaId = {
                ///appedning SBU to filter
                [Op.in]: funcareaArrayForFilter,
              };
            }

            const designationArrayForFilter = permissionAndAccess
              .filter((obj) => obj.permissionType == "DESIGNATION")
              .map((obj) => obj.permissionValue); // checking SBU Access

            if (designationArrayForFilter.length > 0) {
              designationFIlter.designationId = {
                ///appedning SBU to filter
                [Op.in]: designationArrayForFilter,
              };
            }
          }

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
                attributes: ["buName","buCode"],
                where: {
                  ...(buSearch && { buName: { [Op.like]: `%${buSearch}%` } }),
                  ...buFIlter,
                },
              },
              {
                model: db.sbuMaster,
                seperate: true,
                attributes: ["sbuname","code"],
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
                attributes: ["address1", "address2"]
              }
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

  async reporties(req, res) {
    try {
      const manager = req.query.manager;

      const reportie = await db.employeeMaster.findOne({
        where: Object.assign(
          manager
            ? {
              id: manager,
              isActive: 1,
            }
            : {
              manager: null,
              isActive: 1,
            }
        ),
        attributes: { exclude: ["password", "role_id", "designation_id"] },
        include: [
          {
            model: db.employeeMaster,
            required: false,
            attributes: ["id", "name", "profileImage"],
            as: "managerData",
            include: [
              {
                model: db.roleMaster,
                required: false,
              },
              {
                model: db.designationMaster,
                required: false,
                attributes: ["designationId", "name"],
              },
            ],
          },
          {
            model: db.roleMaster,
            required: true,
            attributes: ["name"],
          },
          {
            model: db.designationMaster,
            required: true,
            attributes: ["designationId", "name"],
          },
          {
            model: db.employeeMaster,
            as: "reportie",
            required: false,
            attributes: { exclude: ["password", "role_id", "designation_id"] },
            include: [
              {
                model: db.roleMaster,
                required: true,
              },
              {
                model: db.designationMaster,
                required: true,
                attributes: ["designationId", "name"],
              },
            ],
          },
        ],
      });

      for (const iterator of reportie.dataValues.reportie) {
        const reportie = await db.employeeMaster.findOne({
          where: {
            manager: iterator.dataValues.id,
          },
        });
        iterator.dataValues["reportings"] = reportie ? true : false;
      }

      return respHelper(res, {
        status: 200,
        data: reportie,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async band(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const bandData = await db.bandMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: bandData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async bu(req, res) {
    try {
      const limit = req.query.limit * 1 || null;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;
      const companyId = req.query.companyId;

      const buData = await db.buMaster.findAndCountAll({
        limit,
        offset,
        where: {
          buId: companyId,
        },
        order: [["buName", "asc"]],
      });

      return respHelper(res, {
        status: 200,
        data: buData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async costCenter(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const costCenterData = await db.costCenterMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: costCenterData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async designation(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const designationData = await db.designationMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: designationData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async grade(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const gradeData = await db.gradeMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: gradeData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async jobLevel(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const jobLevelData = await db.jobLevelMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: jobLevelData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async functionalArea(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const functionalAreaData = await db.functionalAreaMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: functionalAreaData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async state(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const stateCode = req.query.stateCode;
      const stateName = req.query.stateName;
      const countryId = req.query.countryId;
      const regionId = req.query.regionId;

      const stateData = await db.stateMaster.findAndCountAll({
        limit,
        offset,
        where: Object.assign(
          stateCode
            ? {
              stateCode,
            }
            : {},
          stateName
            ? {
              stateName,
            }
            : {},
          countryId
            ? {
              countryId,
            }
            : {},
          regionId
            ? {
              regionId,
            }
            : {}
        ),
      });

      return respHelper(res, {
        status: 200,
        data: stateData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async region(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;
      const countryId = req.query.country;

      const regionData = await db.regionMaster.findAndCountAll({
        limit,
        offset,
        where: Object.assign(
          countryId
            ? {
              countryId,
            }
            : {}
        ),
      });

      return respHelper(res, {
        status: 200,
        data: regionData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async city(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;
      const stateId = req.query.stateId;

      const cityData = await db.cityMaster.findAndCountAll({
        limit,
        offset,
        where: Object.assign(
          stateId
            ? {
              stateId,
            }
            : {}
        ),
      });

      return respHelper(res, {
        status: 200,
        data: cityData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async companyLocation(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const companyLocationData =
        await db.companyLocationMaster.findAndCountAll({
          limit,
          offset,
        });

      return respHelper(res, {
        status: 200,
        data: companyLocationData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async company(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;
      const groupId = req.query.groupId;

      const companyData = await db.companyMaster.findAndCountAll({
        limit,
        offset,
        where: Object.assign(groupId ? { groupId } : {}),
        attributes: ["companyId", "companyName", "companyCode"],
      });

      return respHelper(res, {
        status: 200,
        data: companyData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async companyType(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const companyTypeData = await db.companyTypeMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: companyTypeData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async country(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const countryData = await db.countryMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: countryData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async currency(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const currencyData = await db.currencyMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: currencyData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async department(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const departmentData = await db.departmentMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: departmentData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async district(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const districtData = await db.districtMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: districtData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async employeeType(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const employeeTypeData = await db.employeeTypeMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: employeeTypeData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async industry(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const industryData = await db.industryMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: industryData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async pincode(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const pinCodeData = await db.pinCodeMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: pinCodeData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async timeZone(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const timeZoneData = await db.timeZoneMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: timeZoneData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async groupCompany(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const groupCompanyData = await db.groupCompanyMaster.findAndCountAll({
        limit,
        offset,
        attributes: ["groupId", "groupCode", "groupName"],
      });

      return respHelper(res, {
        status: 200,
        data: groupCompanyData,
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
      const mobile = parseInt(req.query.mobile);
      const redisKey = mobile ? "dashboardCardMobile" : "dashboardCardWeb";
      let dashboardData = [];

      await client.get(redisKey).then(async (data) => {
        if (data) {
          dashboardData = JSON.parse(data);

          return respHelper(res, {
            status: 200,
            data: dashboardData,
          });
        } else {
          dashboardData = await db.DashboardCard.findAndCountAll({
            where: {
              isActive: 1,
            },
            order: mobile
              ? [["mobilePosition", "asc"]]
              : [["webPosition", "asc"]],
            attributes: mobile
              ? [
                "cardId",
                "cardName",
                "mobileUrl",
                "isCardWorking",
                "mobileLightFontColor",
                "mobileIcon",
                "mobileLightBackgroundColor",
                "mobilePosition",
                "mobileDarkFontColor",
                "mobileDarkBackgroundColor",
              ]
              : [
                "cardId",
                "cardName",
                "isCardWorking",
                "webUrl",
                "webFontColor",
                "webBackgroundColor",
                "webIcon",
                "webPosition",
              ],
          });

          const dashboardJson = JSON.stringify(dashboardData);
          client.setEx(redisKey, 500, dashboardJson);

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

  async leaveMaster(req, res) {
    try {
      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const leaveData = await db.leaveMaster.findAndCountAll({
        limit,
        offset,
      });

      return respHelper(res, {
        status: 200,
        data: leaveData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }
  async educationMaster(req, res) {
    try {
      const limit = req.query.limit * 1 || 100;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const redisKey = `educationDetails:${limit}:${offset}:${req.userId}`
      let educationData
      const redisData = await client.get(redisKey)

      if (redisData) {
        educationData = JSON.parse(redisData)
        return respHelper(res, {
          status: 200,
          data: educationData,
        });
      }

      educationData = await db.degreeMaster.findAndCountAll({
        limit,
        offset,
      });

      const employeeJson = JSON.stringify(educationData);
      await client.setEx(redisKey, parseInt(process.env.TTL), employeeJson);

      return respHelper(res, {
        status: 200,
        data: educationData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }
}

export default new MasterController();
