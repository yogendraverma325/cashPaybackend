import { Op } from "sequelize";
import db from "../../../config/db.config.js";
import respHelper from "../../../helper/respHelper.js";
import client from "../../../config/redisDb.config.js";
import Pagination from "../../../helper/pagination.js";
import logger from "../../../helper/logger.js";
import validator from "../../../helper/validator.js";

class MasterController {
  async employee(req, res) {
    try {
      const { filterValue, filterType, searchId } = req.query;

      let buFIlter = {};
      let sbbuFIlter = {};
      let functionAreaFIlter = {};
      let departmentFIlter = {};
      let designationFIlter = {};
      const usersData = req.userData;

      const limit = req.query.limit * 1 || 10;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      let employeeData = [];

      if (usersData.role_id == 4) {
        let permissionAssignTousers = [];
        if (usersData.permissionAndAccess) {
          permissionAssignTousers = usersData.permissionAndAccess
            .split(",")
            .map((el) => parseInt(el));
        }
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

      let designation = null,
        department = null,
        buSearch = null,
        sbuSearch = null,
        areaSearch = null,
        search = null;
      switch (filterType) {
        case "search":
          search = filterValue;
          break;
        case "designation":
          designation = filterValue;
          break;
        case "department":
          department = filterValue;
          break;
        case "buSearch":
          buSearch = filterValue;
          break;
        case "sbuSearch":
          sbuSearch = filterValue;
          break;
        case "areaSearch":
          areaSearch = filterValue;
          break;
      }

      let searchCondition = {
        [Op.and]: [
          {
            isActive:
              usersData.role_id == 1 || usersData.role_id == 2 ? [1, 0] : [1],
          },
        ],
      };

      if (searchId) {
        searchCondition = { id: searchId };
      }

      if (search) {
        searchCondition = {
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
                usersData.role_id == 1 || usersData.role_id == 2 ? [1, 0] : [1],
            },
          ],
        };
      }

      employeeData = await db.employeeMaster.findAndCountAll({
        order: [["id", "desc"]],
        limit,
        offset,
        where: searchCondition,
        attributes: [
          "id",
          "empCode",
          "name",
          "email",
          "firstName",
          "lastName",
          "officeMobileNumber",
          "buId",
          "isLoginActive",
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

      // const employeeJson = JSON.stringify(employeeData);
      // await client.setEx(cacheKey, parseInt(process.env.TTL), employeeJson); // Cache for 2.3 minutes

      return respHelper(res, {
        status: 200,
        data: employeeData,
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
            where: { isActive: 1 },
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

      if (reportie) {
        for (const iterator of reportie.dataValues.reportie) {
          const reportie = await db.employeeMaster.findOne({
            where: {
              manager: iterator.dataValues.id,
            },
          });
          iterator.dataValues["reportings"] = reportie ? true : false;
        }
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
      const companyId = req.query.companyId;
      let query = { companyId: companyId };
      let subQuery = { isActive: 1 };

      const buData = await db.buMapping.findAll({
        where: query,
        include: [
          {
            model: db.buMaster,
            where: subQuery,
            attributes: ["buId", "buName", "buCode"],
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        data: buData,
      });
    } catch (error) {
      logger.error("Error while getting bu list", error);
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
      let search = req.query.search;
      let searchId = req.query.searchId;
      if (search || searchId) {
        let query = { isActive: 1, designationId: searchId };
        if (search) {
          query = { isActive: 1, name: { [Op.like]: `%${search}%` } };
        }

        const designationData = await db.designationMaster.findAll({
          where: query,
        });

        return respHelper(res, {
          status: 200,
          data: designationData,
        });
      } else {
        return respHelper(res, {
          status: 422,
          msg: "Please search designation",
          data: [],
        });
      }
    } catch (error) {
      logger.error("Error while getting designation list", error);
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
      let condition = { isActive: 1 };
      const jobLevelData = await db.jobLevelMaster.findAll({
        where: condition,
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
      let query = { departmentMappingId: req.query.departmentMappingId };
      let subQuery = { isActive: 1 };
      const functionalAreaData = await db.functionalAreaMapping.findAll({
        where: query,
        include: [
          {
            model: db.functionalAreaMaster,
            where: subQuery,
            attributes: [
              "functionalAreaId",
              "functionalAreaName",
              "functionalAreaCode",
            ],
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        data: functionalAreaData,
      });
    } catch (error) {
      logger.error("Error while getting functional area list", error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async state(req, res) {
    try {
      const limit = req.query.limit * 1 || 200;
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
      const limit = req.query.limit * 1 || 200;
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
      let companyId = req.query.companyId;
      if (companyId) {
        let query = { isActive: 1, companyId: companyId };
        const companyLocationData = await db.companyLocationMaster.findAll({
          where: query,
          attributes: ["companyLocationId", "address1", "companyLocationCode"],
          include: [{ model: db.cityMaster, attributes: ["cityName"] }],
        });

        return respHelper(res, {
          status: 200,
          data: companyLocationData,
        });
      } else {
        return respHelper(res, {
          status: 422,
          msg: "Please select company",
          data: [],
        });
      }
    } catch (error) {
      logger.error("Error while getting company location list", error);
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
      const groupId = req.query.groupId || 1;

      let query = {
        isActive: 1,
        ...(groupId && { groupId: groupId }),
      };

      const companyData = await db.companyMaster.findAndCountAll({
        limit,
        offset,
        where: query,
        attributes: ["companyId", "companyName", "companyCode"],
      });

      return respHelper(res, {
        status: 200,
        data: companyData,
      });
    } catch (error) {
      logger.error("Error while getting company list", error);
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
      const { sbuMappingId } = req.query;
      let query = { ...(sbuMappingId && { sbuMappingId: sbuMappingId }) };
      let subQuery = { isActive: 1 };

      const departmentData = await db.departmentMapping.findAll({
        where: query,
        include: [
          {
            model: db.departmentMaster,
            where: subQuery,
            attributes: ["departmentId", "departmentName", "departmentCode"],
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        data: departmentData,
      });
    } catch (error) {
      logger.error("Error while getting department list", error);
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
      const limit = req.query.limit * 1 || 1000;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;
      const cityId = req.query.cityId;
      const pinCodeData = await db.pinCodeMaster.findAndCountAll({
        where: { cityId: cityId },
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

      const redisKey = `educationDetails:${limit}:${offset}:${req.userId}`;
      let educationData;
      const redisData = await client.get(redisKey);

      if (redisData) {
        educationData = JSON.parse(redisData);
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

  async separationReason(req, res) {
    try {
      const separationReasonData = await db.separationReason.findAll({
        where: {
          separationTypeAutoId: req.query.type ? req.query.type : 1,
        },
        attributes: ["separationReasonAutoId", "separationReason"],
      });

      return respHelper(res, {
        status: 200,
        data: separationReasonData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async separationType(req, res) {
    try {
      const separationTypeData = await db.separationType.findAll({
        attributes: ["separationTypeAutoId", "separationTypeName"],
      });

      return respHelper(res, {
        status: 200,
        data: separationTypeData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async hrDocumentMaster(req, res) {
    try {
      const docData = await db.hrDocumentMaster.findAll({
        attributes: ["documentId", "documentName", "typeUpdate"],
      });
      return respHelper(res, {
        status: 200,
        data: docData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }
  async roles(req, res) {
    try {
      const limit = req.query.limit * 1 || Pagination.perPage;
      const pageNo = req.query.page * 1 || 1;
      const offset = (pageNo - 1) * limit;

      const rolesData = await db.roleMaster.findAndCountAll({ limit, offset });
      return respHelper(res, { status: 200, data: rolesData });
    } catch (error) {
      logger.error("ERROR WHILE GETTING ROLES", error);
      return respHelper(res, { status: 500 });
    }
  }

  async shift(req, res) {
    try {
      let searchKey = req.query.searchKey;
      let query = {
        isActive: 1,
        ...(searchKey && { shiftName: { [Op.like]: `%${searchKey}%` } }),
      };

      const shiftData = await db.shiftMaster.findAll({
        where: query,
        attributes: ["shiftId", "shiftName"],
      });
      return respHelper(res, { status: 200, data: shiftData });
    } catch (error) {
      logger.error("ERROR WHILE GETTING SHIFT MASTER DATA", error);
      return respHelper(res, { status: 500 });
    }
  }

  async attendancePlicy(req, res) {
    try {
      let searchKey = req.query.searchKey;
      let query = {
        isActive: 1,
        ...(searchKey && { policyName: { [Op.like]: `%${searchKey}%` } }),
      };
      const attendanceData = await db.attendancePolicymaster.findAll({
        where: query,
        attributes: ["attendancePolicyId", "policyName"],
      });
      return respHelper(res, { status: 200, data: attendanceData });
    } catch (error) {
      logger.error("ERROR WHILE GETTING ATTENDANCE DATA", error);
      return respHelper(res, { status: 500 });
    }
  }

  async weekoff(req, res) {
    try {
      let searchKey = req.query.searchKey;
      let query = {
        isActive: 1,
        ...(searchKey && { weekOffName: { [Op.like]: `%${searchKey}%` } }),
      };
      let weekoffData = await db.weekOffMaster.findAll({
        where: query,
        attributes: ["weekOffId", "weekOffName"],
      });
      return respHelper(res, { status: 200, data: weekoffData });
    } catch (error) {
      logger.error("ERROR WHILE GETTING WEEK OFF DATA", error);
      return respHelper(res, { status: 500 });
    }
  }

  async sbu(req, res) {
    try {
      const buMappingId = req.query.buMappingId;
      let query = { buMappingId: buMappingId };
      let subQuery = { isActive: 1 };

      const buData = await db.sbuMapping.findAll({
        where: query,
        include: [
          {
            model: db.sbuMaster,
            where: subQuery,
            attributes: ["sbuId", "sbuName", "code"],
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        data: buData,
      });
    } catch (error) {
      logger.error("Error while getting sbu list", error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async buhr(req, res) {
    try {
      const buMappingId = req.query.buMappingId;
      let query = { buMappingId: buMappingId };
      let subQuery = { isActive: 1 };

      const buhrData = await db.buMapping.findAll({
        where: query,
        include: [
          {
            model: db.employeeMaster,
            where: subQuery,
            attributes: ["id", "name"],
            as: "buhrData",
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        data: buhrData,
      });
    } catch (error) {
      logger.error("Error while getting buhr list", error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async buhead(req, res) {
    try {
      const buMappingId = req.query.buMappingId;
      let query = { buMappingId: buMappingId };
      let subQuery = { isActive: 1 };

      const buheadData = await db.buMapping.findAll({
        where: query,
        include: [
          {
            model: db.employeeMaster,
            where: subQuery,
            attributes: ["id", "name"],
            as: "buHeadData",
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        data: buheadData,
      });
    } catch (error) {
      logger.error("Error while getting buhead list", error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async probation(req, res) {
    try {
      let query = { isActive: 1 };
      const probationData = await db.probationMaster.findAll({
        where: query,
        attributes: ["probationId", "probationName"],
      });

      return respHelper(res, {
        status: 200,
        data: probationData,
      });
    } catch (error) {
      logger.error("Error while getting probation list", error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async newCustomerName(req, res) {
    try {
      let query = { isActive: 1 };
      const newCustomerNameData = await db.newCustomerNameMaster.findAll({
        where: query,
        attributes: ["newCustomerNameId", "newCustomerName"],
      });

      return respHelper(res, {
        status: 200,
        data: newCustomerNameData,
      });
    } catch (error) {
      logger.error("Error while getting new customer name list", error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async reportModule(req, res) {
    try {
      const {} = req.query;
      let query = { isActive: 1 };
      const reportModule = await db.reportModuleMaster.findAll({
        where: query,
        attributes: ["reportModuleId", "reportModuleName"],
        include: [
          {
            model: db.reportType,
            attributes: ["reportTypeId", "reportTypeName"],
            where: { isActive: 1 },
          },
        ],
      });

      return respHelper(res, {
        status: 200,
        data: reportModule,
      });
    } catch (error) {
      logger.error("Error while getting new customer name list", error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async shiftMaster(req, res) {
    try {
      const {} = req.query;
      let query = { isActive: 1 };
      const reportModule = await db.shiftMaster.findAll({});

      return respHelper(res, {
        status: 200,
        data: reportModule,
      });
    } catch (error) {
      logger.error("Error while getting new customer name list", error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async taskFilter(req, res) {
    try {
      let query = req.query.taskFor == "web"?  { isActive: 1, taskForWeb:1}: { isActive: 1,taskForApp:1 }
      const taskFilter = await db.taskFilterMaster.findAll({
        where: query,
        //attributes: ['']
      });

      return respHelper(res, {
        status: 200,
        data: taskFilter,
      });
    } catch (error) {
      console.log("errorerror", error);
      logger.error("Error while getting new customer name list", error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async separationTasks(req, res) {
    try {
      const separationTasksData = await db.separationTaskMaster.findAll();

      return respHelper(res, {
        status: 200,
        data: separationTasksData,
      });
    } catch (error) {
      console.log("error", error);
      return respHelper(res, {
        status: 500,
      });
    }
  }
  async lwfDesignation(req, res) {
    try {
      let condition = { isActive: 1 };
      const lwfDesignationData = await db.lwfDesignationMaster.findAll({
        where: condition,
        attributes: ["lwfDesignationId", "lwfDesignationName"],
      });
      return respHelper(res, {
        status: 200,
        data: lwfDesignationData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async ptLocation(req, res) {
    try {
      let condition = { isActive: 1, stateId: req.params.stateId };
      const docs = await db.ptLocationMaster.findAll({
        where: condition,
        attributes: ["ptLocationId", "ptLocationName", "ptLocationCode"],
      });
      return respHelper(res, {
        status: 200,
        data: docs,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async unionCode(req, res) {
    try {
      const docs = await db.unionCodIncrementMaster.findAll({
        attributes: ["unionCodeId", "unionCode"],
      });
      return respHelper(res, {
        status: 200,
        data: docs,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async noticePeriod(req, res) {
    try {
      let query = { isActive: 1 };
      const docs = await db.noticePeriodMaster.findAll({
        where: query,
        attributes: ["noticePeriodAutoId", "noticePeriodName"],
      });
      return respHelper(res, {
        status: 200,
        data: docs,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async degree(req, res) {
    try {
      let query = { isActive: 1 };
      const docs = await db.degreeMaster.findAll({
        where: query,
        attributes: ["degreeId", "degreeName"],
      });
      return respHelper(res, {
        status: 200,
        data: docs,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async bank(req, res) {
    try {

      const bankData = await db.bankMaster.findAndCountAll({
        where: {
          isActive: 1,
          ...(req.query.search && {bankName: { [Op.like]: `%${req.query.search}%` }})
        },
        attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('bankName')), 'bankName']],

      });

      return respHelper(res, {
        status: 200,
        data: bankData,
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async ifsc(req, res) {
    try {
      const bankData = await db.bankMaster.findAll({
        where: {
          isActive: 1,
          bankName: { [Op.like]: `%${req.query.bankName}%` },
          ...(req.query.search && {bankIfsc: { [Op.like]: `%${req.query.search}%` }})

        }
      });

      return respHelper(res, {
        status: 200,
        data: bankData,
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
