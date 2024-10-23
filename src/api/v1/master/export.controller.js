import { Op, where } from "sequelize";
import db from "../../../config/db.config.js";
import respHelper from "../../../helper/respHelper.js";
import xlsx from "json-as-xlsx";
import fs from "fs";
import client from "../../../config/redisDb.config.js";
import pkg from "xlsx";
import bcrypt from "bcrypt";
import moment from "moment";
import helper from "../../../helper/helper.js";
import validator from "../../../helper/validator.js";

const maritalStatusOptions = {
  Married: 1,
  Single: 2,
  Divorced: 3,
  Separated: 4,
  Widowed: 5,
  Others: 6,
};

async function getDataFromCache(key) {
  return client.lRange(key, 0, -1);
}

class MasterController {
  /***********************************export data********************************************************/
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

      const employeeData = await db.employeeMaster.findAndCountAll({
        attributes: [
          "id",
          "empCode",
          "name",
          "email",
          "firstName",
          "lastName",
          "officeMobileNumber",
          "buId",
          "personalMobileNumber",
        ],
        where: Object.assign(
          search
            ? {
                [Op.or]: [
                  { empCode: { [Op.like]: `%${search}%` } },
                  { name: { [Op.like]: `%${search}%` } },
                  { email: { [Op.like]: `%${search}%` } },
                ],
              }
            : {}
        ),
        include: [
          {
            model: db.designationMaster,
            attributes: ["name"],
            where: {
              ...(designation && { name: { [Op.like]: `%${designation}%` } }),
            },
            required: !!designation,
          },
          {
            model: db.functionalAreaMaster,
            attributes: ["functionalAreaName"],
            where: {
              ...(areaSearch && {
                functionalAreaName: { [Op.like]: `%${areaSearch}%` },
              }),
            },
            required: !!areaSearch,
          },
          {
            model: db.departmentMaster,
            attributes: ["departmentName"],
            where: {
              ...(department && {
                departmentName: { [Op.like]: `%${department}%` },
              }),
            },
            required: !!department,
          },
          {
            model: db.educationDetails,
            attributes: [
              "educationDegree",
              "educationSpecialisation",
              "educationInstitute",
              "educationRemark",
              "educationStartDate",
              "educationCompletionDate",
            ],
          },
          {
            model: db.familyDetails,
            attributes: [
              "name",
              "dob",
              "gender",
              "mobileNo",
              "relationWithEmp",
            ],
            as: "employeefamilydetails",
          },
          {
            model: db.employeeMaster,
            required: false,
            attributes: ["id", "name"],
            as: "managerData",
          },
          {
            model: db.buMaster,
            attributes: ["buName"],
            where: {
              ...(buSearch && { buName: { [Op.like]: `%${buSearch}%` } }),
            },
            required: !!buSearch,
          },
          {
            model: db.sbuMaster,
            attributes: ["sbuname"],
            where: {
              ...(sbuSearch && { sbuname: { [Op.like]: `%${sbuSearch}%` } }),
            },
            required: !!sbuSearch,
          },
        ],
      });

      const arr = await Promise.all(
        employeeData.rows.map(async (ele) => {
          return {
            id: ele.dataValues.id || "",
            empCode: ele.dataValues.empCode || "",
            name: ele.dataValues.name || "",
            email: ele.dataValues.email || "",
            firstName: ele.dataValues.firstName || "",
            lastName: ele.dataValues.lastName || "",
            officeMobileNumber: ele.dataValues.officeMobileNumber || "",
            personalMobileNumber: ele.dataValues.personalMobileNumber || "",
            manager_id: ele.dataValues.managerData
              ? ele.dataValues.managerData.id
              : "",
            manager_name: ele.dataValues.managerData
              ? ele.dataValues.managerData.name
              : "",
            buId: ele.dataValues.buId || "",
            designation_name: ele.dataValues.designationmaster?.name || "",
            functional_area_name:
              ele.dataValues.functionalareamaster?.functionalAreaName || "",
            department_name:
              ele.dataValues.departmentmaster?.departmentName || "",
            bu_name: ele.dataValues.bumaster?.buName || "",
            sub_bu_name: ele.dataValues.sbumaster?.sbuname || "",
          };
        })
      );

      let educationDetails = [];
      let familyDetails = [];

      employeeData.rows.forEach((employee) => {
        employee.employeeeducationdetails.forEach((education) => {
          // Extract only the required fields
          const extractedEducation = {
            userId: education.userId ? education.userId : "",
            name: employee.firstName + " " + employee.lastName,
            empCode: employee.empCode ? employee.empCode : "",
            educationId: education.educationId ? education.educationId : "",
            educationDegree: education.educationDegree
              ? education.educationDegree
              : "",
            educationSpecialisation: education.educationSpecialisation
              ? education.educationSpecialisation
              : "",
            educationStartDate: education.educationStartDate
              ? education.educationStartDate
              : "",
            educationCompletionDate: education.educationCompletionDate
              ? education.educationCompletionDate
              : "",
            educationInstitute: education.educationInstitute
              ? education.educationInstitute
              : "",
            educationRemark: education.educationRemark
              ? education.educationRemark
              : "",
          };
          // Push the extracted education details object into the educationDetails array
          educationDetails.push(extractedEducation);
        });
      });

      employeeData.rows.forEach((employee) => {
        employee.employeefamilydetails.forEach((family) => {
          const extractedFamily = {
            empCode: employee.empCode ? employee.empCode : "",
            name: employee.firstName + " " + employee.lastName,
            familyName: family.name ? family.name : "",
            dob: family.dob ? family.dob : "",
            gender: family.gender ? family.gender : "",
            mobileNo: family.mobileNo ? family.mobileNo : "",
            relationWithEmp: family.relationWithEmp
              ? family.relationWithEmp
              : "",
          };
          familyDetails.push(extractedFamily);
        });
      });

      if (arr.length > 0) {
        const dt = new Date();
        const sheetName = "uploads/temp/dataSheet"; //+ dt.getTime();
        fs.writeFileSync(sheetName + ".xlsx", "", { flag: "a+" }, (err) => {
          if (err) {
            console.error("Error writing file:", err);
            return;
          }
          console.log("File created successfully!");
        });

        const data = [
          {
            sheet: "Employee",
            columns: [
              { label: "Employee_Code", value: "empCode" },
              { label: "Email", value: "email" },
              { label: "First_Name", value: "firstName" },
              { label: "Last_Name", value: "lastName" },
              { label: "Office_Mobile_Number", value: "officeMobileNumber" },
              {
                label: "Personal_Mobile_Number",
                value: "personalMobileNumber",
              },
              { label: "Manager_Id", value: "manager_id" },
              { label: "Manager_Name", value: "manager_name" },
              { label: "Designation_Name", value: "designation_name" },
              { label: "Department_Name", value: "department_name" },
              { label: "Functional_Area_Name", value: "functional_area_name" },
              { label: "Bu_Name", value: "bu_name" },
              { label: "Sub_Bu_Name", value: "sub_bu_name" },
            ],
            content: arr,
          },
          {
            sheet: "Education",
            columns: [
              { label: "Employee_Code", value: "empCode" },
              { label: "Name", value: "name" },
              {
                label: "Education_Specialisation",
                value: "educationSpecialisation",
              },
              { label: "Education_Institute", value: "educationInstitute" },
            ],
            content: educationDetails,
          },
          {
            sheet: "Family Details",
            columns: [
              { label: "Employee_Code", value: "empCode" },
              { label: "Name", value: "name" },
              { label: "Family_Member_Name", value: "familyName" },
              { label: "Date_Of_Birth", value: "dob" },
              { label: "Gender", value: "gender" },
              { label: "Mobile_Number", value: "mobileNo" },
              { label: "Relation_With_Employee", value: "relationWithEmp" },
            ],
            content: familyDetails,
          },
        ];

        const settings = {
          fileName: sheetName,
          extraLength: 3,
          writeMode: "writeFile",
          writeOptions: {},
          RTL: false,
        };

        xlsx(data, settings, () => {
          return res.download(sheetName + ".xlsx");
        });
      }
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async employeeMissedData(req, res) {
    try {
      const { arrMissingData } = req.body;
      const dt = new Date();
      const sheetName = "uploads/temp/dataSheetMissed"; //+ dt.getTime();
      fs.writeFileSync(sheetName + ".xlsx", "", { flag: "a+" }, (err) => {
        if (err) {
          return;
        }
      });
      const data = [
        {
          sheet: "Employee",
          columns: [
            { label: "Employee_Code", value: "Employee_Code" },
            { label: "Email", value: "Email" },
            { label: "First_Name", value: "First_Name" },
            { label: "Last_Name", value: "Last_Name" },
            { label: "Office_Mobile_Number", value: "Office_Mobile_Number" },
            {
              label: "Personal_Mobile_Number",
              value: "Personal_Mobile_Number",
            },
            { label: "Manager_Id", value: "Manager_Id" },
            { label: "Manager_Name", value: "manager_name" },
            { label: "Designation_Name", value: "Designation_Name" },
            { label: "Department_Name", value: "Department_Name" },
            { label: "Functional_Area_Name", value: "Functional_Area_Name" },
            { label: "Bu_Name", value: "Bu_Name" },
            { label: "Sub_Bu_Name", value: "Sub_Bu_Name" },
          ],
          content: arrMissingData,
        },
      ];

      const settings = {
        fileName: sheetName,
        extraLength: 3,
        writeMode: "writeFile",
        writeOptions: {},
        RTL: false,
      };

      xlsx(data, settings, () => {
        return res.download(sheetName + ".xlsx");
      });
    } catch (error) {
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  /************************************import data****************************************************/

  async employeeImport(req, res) {
    const transaction = await db.sequelize.transaction(); // Start the transaction
    try {
      // Read Excel file
      const workbookEmployee = pkg.readFile(req.file.path);
      const sheetNameEmployee = workbookEmployee.SheetNames[0];
      const sheetToImportEmployee = pkg.utils.sheet_to_json(
        workbookEmployee.Sheets[sheetNameEmployee]
      );

      let arrPoper = [];
      let arrMissingData = [];
      // Insert data into the database
      for (const row of sheetToImportEmployee) {
        if (
          row.Employee_Code &&
          row.Manager_Name &&
          row.Designation_Name &&
          row.Department_Name &&
          row.Functional_Area_Name &&
          row.Bu_Name
        ) {
          let manager_id = await db.employeeMaster.findOne({
            where: { name: row.Manager_Name },
          });
          let department_id = await db.departmentMaster.findOne({
            where: { departmentName: row.Department_Name },
          });
          let designation_id = await db.designationMaster.findOne({
            where: { name: row.Designation_Name },
          });
          let function_area_id = await db.functionalAreaMaster.findOne({
            where: { functionalAreaName: row.Functional_Area_Name },
          });
          let bu_id = await db.buMaster.findOne({
            where: { buName: row.Bu_Name },
          });
          let sub_bu_id = await db.sbuMaster.findOne({
            where: { sbuname: row.Sub_Bu_Name },
          });

          if (
            manager_id &&
            department_id &&
            designation_id &&
            function_area_id &&
            bu_id &&
            sub_bu_id
          ) {
            const existUser = await db.employeeMaster.findOne({
              where: {
                [Op.or]: [
                  { email: row.Email },
                  { officeMobileNumber: row.Office_Mobile_Number },
                ],
              },
              transaction, // Add transaction object here
            });
            if (existUser) {
              arrMissingData.push(row);
            } else {
              const maxCode = await db.employeeMaster.max("empCode", {
                transaction,
              });
              const salt = await bcrypt.genSalt(10);

              let data = {
                name:
                  (row.First_Name ? row.First_Name : "") +
                  " " +
                  (row.Last_Name ? row.Last_Name : ""),
                firstName: row.First_Name ? row.First_Name : "",
                lastName: row.Last_Name ? row.Last_Name : "",
                password: await bcrypt.hash("test1234", salt),
                officeMobileNumber: row.Office_Mobile_Number
                  ? row.Office_Mobile_Number
                  : "",
                personalMobileNumber: row.Personal_Mobile_Number
                  ? row.Personal_Mobile_Number
                  : "",
                role_id: 3,
                empCode: parseInt(maxCode) + 1,
                manager: manager_id.dataValues.id, //row.Manager_Id ? row.Manager_Id : 31,
                email: row.Email ? row.Email : "",
                departmentId: department_id.dataValues.departmentId,
                designation_id: designation_id.dataValues.designationId,
                functionalAreaId: function_area_id.dataValues.functionalAreaId,
                buId: bu_id.dataValues.buId,
                sbuId: sub_bu_id.dataValues.sbuId,
              };

              await db.employeeMaster.create(data, { transaction }); // Add transaction object here
            }
          } else {
            arrMissingData.push(row);
          }
        }
        await transaction.commit(); // Commit the transaction
        return respHelper(res, {
          status: 200,
          msg: "File Uploaded Successfully",
          data: {
            arrPoper: arrPoper,
            arrMissingData: arrMissingData,
          },
        });
      }
    } catch (error) {
      await transaction.rollback(); // Rollback the transaction in case of an error
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async employeeImportNew(req, res) {
    const transaction = await db.sequelize.transaction(); // Start a transaction
    try {
      // Read Excel file
      const workbookEmployee = pkg.readFile(req.file.path);
      const sheetNameEmployee = workbookEmployee.SheetNames[0];
      const sheetToImportEmployee = pkg.utils.sheet_to_json(
        workbookEmployee.Sheets[sheetNameEmployee]
      );

      let arrPoper = [];
      let arrMissingData = [];

      for (const row of sheetToImportEmployee) {
        const existUser = await db.employeeMaster.findOne({
          where: {
            [Op.and]: [
              { email: row["Direct Manager Email Id"] },
              { empCode: row["Direct Manager Code"] },
            ],
          },
          transaction, // Pass transaction object
        });

        if (existUser) {
          arrMissingData.push(row);
        } else {
          const salt = await bcrypt.genSalt(10);
          const fullName = row["Direct Manager Name"].split(" ");
          let data = {
            empCode: row["Direct Manager Code"],
            name: row["Direct Manager Name"],
            email: row["Direct Manager Email Id"],
            officeMobileNumber: row["officeMobileNumber"],
            personalMobileNumber: row["personalMobileNumber"],
            firstName: fullName[0],
            lastName: fullName.slice(1).join(" "),
            isActive: 1,
            role_id: 3,
            password: await bcrypt.hash("test1234", salt),
          };

          arrPoper.push(data);
          // await db.employeeMaster.create(data, { transaction }); // Add transaction object here
        }
      }

      await db.employeeMaster.bulkCreate(arrPoper);
      await transaction.commit(); // Commit the transaction if all operations are successful

      return respHelper(res, {
        status: 200,
        msg: "File Uploaded Successfully",
        data: {
          arrPoper: arrPoper,
          arrMissingData: arrMissingData,
        },
      });
    } catch (error) {
      await transaction.rollback(); // Rollback the transaction in case of an error
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  /*************************************redis**********************************************************/
  //   async employeeRedis(req, res) {
  //     try {
  //       const {
  //         search,
  //         department,
  //         designation,
  //         buSearch,
  //         sbuSearch,
  //         areaSearch,
  //       } = req.query;
  //       const limit = req.query.limit * 1 || 10;
  //       const pageNo = req.query.page * 1 || 1;
  //       const offset = (pageNo - 1) * limit;
  //       const cacheKey = `employeeList:${pageNo}`;

  //       var employeeData = [];
  //       await client.get("employeeList").then(async (data) => {
  //         if (data) {
  //           employeeData = JSON.parse(data);
  //           console.log("Array of objects fetched Redis successfully.");
  //           return respHelper(res, {
  //             status: 200,
  //             data: employeeData,
  //           });
  //         } else {
  //           employeeData = await db.employeeMaster.findAndCountAll({
  //             limit,
  //             offset,
  //             where: Object.assign(
  //               search
  //                 ? {
  //                     [Op.or]: [
  //                       {
  //                         empCode: {
  //                           [Op.like]: `%${search}%`,
  //                         },
  //                       },
  //                       {
  //                         name: {
  //                           [Op.like]: `%${search}%`,
  //                         },
  //                       },
  //                       {
  //                         email: {
  //                           [Op.like]: `%${search}%`,
  //                         },
  //                       },
  //                     ],
  //                   }
  //                 : {}
  //             ),
  //             attributes: [
  //               "id",
  //               "empCode",
  //               "name",
  //               "email",
  //               "firstName",
  //               "lastName",
  //               "officeMobileNumber",
  //               "buId",
  //             ],
  //             include: [
  //               {
  //                 model: db.designationMaster,
  //                 attributes: ["name"],
  //                 required: !!designation,
  //                 where: {
  //                   ...(designation && {
  //                     name: { [Op.like]: `%${designation}%` },
  //                   }),
  //                 },
  //               },
  //               {
  //                 model: db.functionalAreaMaster,
  //                 attributes: ["functionalAreaName"],
  //                 required: !!areaSearch,
  //                 where: {
  //                   ...(areaSearch && {
  //                     functionalAreaName: { [Op.like]: `%${areaSearch}%` },
  //                   }),
  //                 },
  //               },
  //               {
  //                 model: db.departmentMaster,
  //                 attributes: ["departmentName"],
  //                 required: !!department,
  //                 where: {
  //                   ...(department && {
  //                     departmentName: { [Op.like]: `%${department}%` },
  //                   }),
  //                 },
  //               },
  //               {
  //                 model: db.educationDetails,
  //                 attributes: [
  //                   "educationDegree",
  //                   "educationSpecialisation",
  //                   "educationInstitute",
  //                   "educationRemark",
  //                   "educationStartDate",
  //                   "educationCompletionDate",
  //                 ],
  //               },
  //               {
  //                 model: db.employeeMaster,
  //                 required: false,
  //                 attributes: ["name"],
  //                 as: "managerData",
  //               },
  //               {
  //                 model: db.buMaster,
  //                 attributes: ["buName"],
  //                 where: {
  //                   ...(buSearch && { buName: { [Op.like]: `%${buSearch}%` } }),
  //                 },
  //                 required: !!buSearch,
  //               },
  //               {
  //                 model: db.sbuMaster,
  //                 attributes: ["sbuname"],
  //                 where: {
  //                   ...(sbuSearch && {
  //                     sbuname: { [Op.like]: `%${sbuSearch}%` },
  //                   }),
  //                 },
  //                 required: !!sbuSearch,
  //               },
  //             ],
  //           });
  //           const employeeJson = JSON.stringify(employeeData);
  //           client
  //             .setEx("employeeList", 10, employeeJson)
  //             .then(() => {
  //               console.log("Array of objects stored in Redis successfully.");
  //             })
  //             .catch((err) => {
  //               console.error("Error storing array of objects in Redis:", err);
  //             });
  //           return respHelper(res, {
  //             status: 200,
  //             data: employeeData,
  //           });
  //         }
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       return respHelper(res, {
  //         status: 500,
  //       });
  //     }
  //   }
  async employeeRedis(req, res) {
    try {
      const {
        search,
        department,
        designation,
        buSearch,
        sbuSearch,
        areaSearch,
      } = req.query;
      const limit = parseInt(req.query.limit) || 10;
      const pageNo = parseInt(req.query.page) || 1;
      const offset = (pageNo - 1) * limit;
      const cacheKey = `employeeList:${pageNo}:${limit}:${search || ""}:${
        department || ""
      }:${designation || ""}:${buSearch || ""}:${sbuSearch || ""}:${
        areaSearch || ""
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
          employeeData = await db.employeeMaster.findAndCountAll({
            limit,
            offset,
            where: {
              ...(search && {
                [Op.or]: [
                  { empCode: { [Op.like]: `%${search}%` } },
                  { name: { [Op.like]: `%${search}%` } },
                  { email: { [Op.like]: `%${search}%` } },
                ],
              }),
            },
            attributes: [
              "id",
              "empCode",
              "name",
              "email",
              "firstName",
              "lastName",
              "officeMobileNumber",
              "buId",
            ],
            include: [
              {
                model: db.designationMaster,
                attributes: ["name"],
                required: !!designation,
                where: {
                  ...(designation && {
                    name: { [Op.like]: `%${designation}%` },
                  }),
                },
              },
              {
                model: db.functionalAreaMaster,
                attributes: ["functionalAreaName"],
                required: !!areaSearch,
                where: {
                  ...(areaSearch && {
                    functionalAreaName: { [Op.like]: `%${areaSearch}%` },
                  }),
                },
              },
              {
                model: db.departmentMaster,
                attributes: ["departmentName"],
                required: !!department,
                where: {
                  ...(department && {
                    departmentName: { [Op.like]: `%${department}%` },
                  }),
                },
              },
              {
                model: db.educationDetails,
                attributes: [
                  "educationDegree",
                  "educationSpecialisation",
                  "educationInstitute",
                  "educationRemark",
                  "educationStartDate",
                  "educationCompletionDate",
                ],
              },
              {
                model: db.employeeMaster,
                required: false,
                attributes: ["name"],
                as: "managerData",
              },
              {
                model: db.buMaster,
                attributes: ["buName"],
                where: {
                  ...(buSearch && { buName: { [Op.like]: `%${buSearch}%` } }),
                },
                required: !!buSearch,
              },
              {
                model: db.sbuMaster,
                attributes: ["sbuname"],
                where: {
                  ...(sbuSearch && {
                    sbuname: { [Op.like]: `%${sbuSearch}%` },
                  }),
                },
                required: !!sbuSearch,
              },
            ],
          });

          const employeeJson = JSON.stringify(employeeData);
          await client.setEx(cacheKey, 200, employeeJson); // Cache for 10 minutes

          return respHelper(res, {
            status: 200,
            data: employeeData,
          });
        }
      });
    } catch (error) {
      console.error(error);
      return respHelper(res, {
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async allAttendancePunchDetails(req, res) {
    try {
      const {
        startDate,
        endDate,
        search,
        employeeType,
        businessUnit,
        grade,
        department,
        companyLocation,
        attendanceFor,
      } = req.query;
      const attendanceData = await db.attendanceMaster.findAll({
        attributes: [
          "attendanceDate",
          "attendanceStatus",
          "attendancePresentStatus",
          "attendancePunchInLocation",
          "attendancePunchOutLocation",
          "attendancePunchInTime",
          "attendancePunchOutTime",
          "attendancePunchInRemark",
          "attendancePunchOutRemark",
          "attendancePunchInLocationType",
          "attendancePunchOutLocationType",
          "punchInSource",
          "punchOutSource",
          "createdBy",
          "createdAt",
          "updatedBy",
          "updatedAt",
        ],
        where: {
          attendanceDate: {
            [db.Sequelize.Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: db.employeeMaster,
            attributes: ["id", "name", "empCode"],
            where: {
              // isActive: 1,
              // attendanceFor,
              ...(attendanceFor == 0 && { isActive: 0 }),
              ...(attendanceFor == 1 && { isActive: 1 }),
              ...(attendanceFor == 2 && { isActive: [0, 1] }),
              ...(search && { id: { [Op.in]: search.split(",") } }),
              ...(employeeType && {
                employeeType: { [Op.in]: employeeType.split(",") },
              }),
              ...(businessUnit && {
                buId: { [Op.in]: businessUnit.split(",") },
              }),
              ...(department && {
                departmentId: { [Op.in]: department.split(",") },
              }),
              ...(companyLocation && {
                companyLocationId: { [Op.in]: companyLocation.split(",") },
              }),
            },
            include: [
              {
                model: db.departmentMaster,
                attributes: [
                  "departmentId",
                  "departmentName",
                  "departmentCode",
                ],
              },
              {
                model: db.designationMaster,
                attributes: ["name"],
              },
              {
                model: db.jobDetails,
                attributes: ["jobId"],
                where: {
                  ...(grade && { gradeId: { [Op.in]: grade.split(",") } }),
                },
                include: [
                  {
                    model: db.gradeMaster,
                    attributes: ["gradeName"],
                  },
                ],
              },
              {
                model: db.buMaster,
                attributes: ["buName", "buCode"],
                required: false,
              },
              {
                model: db.sbuMaster,
                attributes: ["sbuname", "code"],
                required: false,
              },
              {
                model: db.functionalAreaMaster,
                attributes: ["functionalAreaName", "functionalAreaCode"],
                required: false,
              },
              {
                model: db.employeeMaster,
                required: false,
                as: "managerData",
                attributes: ["id", "name", "email", "empCode"],
              },
            ],
          },
          {
            model: db.shiftMaster,
            attributes: [
              "shiftId",
              "shiftName",
              "shiftStartTime",
              "shiftEndTime",
            ],
          },
          {
            model: db.attendancePolicymaster,
            attributes: ["policyName", "policyCode"],
          },
          {
            model: db.weekOffMaster,
            attributes: ["weekOffName"],
          },
          {
            model: db.employeeMaster,
            attributes: ["id", "name", "empCode"],
            as: "punchInCreatedBy",
          },
          {
            model: db.employeeMaster,
            attributes: ["id", "name", "empCode"],
            as: "punchOutCreatedBy",
          },
        ],
        raw: true,
      });

      if (attendanceData.length > 0) {
        const simplifiedData = await Promise.all(
          attendanceData.map(async (record) => ({
            employeeCode: record["employee.empCode"],
            employeeName: record["employee.name"],
            buName:
              record["employee.bumaster.buName"] +
              " " +
              "(" +
              record["employee.bumaster.buCode"] +
              ")",
            sbuName:
              record["employee.sbumaster.sbuname"] +
              " " +
              "(" +
              record["employee.sbumaster.code"] +
              ")",
            departmentName:
              record["employee.departmentmaster.departmentName"] +
              " " +
              "(" +
              record["employee.departmentmaster.departmentCode"] +
              ")",
            designationName:
              record["employee.designationmaster.name"] +
              " " +
              "(" +
              record["employee.departmentmaster.departmentCode"] +
              ")",
            functionArea:
              record["employee.functionalareamaster.functionalAreaName"] +
              " " +
              "(" +
              record["employee.functionalareamaster.functionalAreaCode"] +
              ")",
            manager: record["employee.managerData.name"]
              ? record["employee.managerData.name"] +
                " (" +
                record["employee.managerData.empCode"] +
                ")"
              : "-",
            attendanceDate: moment(record.attendanceDate).format("DD-MM-YYYY"),
            attendanceStatus: record.attendanceStatus,
            attendancePresentStatus: record.attendancePresentStatus,
            attendancePunchInTime: record.attendancePunchInTime || "N/A",
            attendancePunchInLocation: record.attendancePunchInLocation,
            attendancePunchInLocationType:
              record.attendancePunchInLocationType || "N/A",
            attendancePunchInRemark: record.attendancePunchInRemark || "N/A",
            attendancePunchOutTime: record.attendancePunchOutTime || "N/A",
            attendancePunchOutLocation:
              record.attendancePunchOutLocation || "N/A",
            attendancePunchOutLocationType:
              record.attendancePunchOutLocationType || "N/A",
            attendancePunchOutRemark: record.attendancePunchOutRemark || "N/A",
            status: "APPROVED",
            punchInSource: record.punchInSource || "N/A",
            punchOutSource: record.punchOutSource || "N/A",
            grade: record["employee.employeejobdetail.grademaster.gradeName"],
            shiftName: record["shiftsmaster.shiftName"],
            shiftStartTime: record["shiftsmaster.shiftStartTime"],
            shiftEndTime: record["shiftsmaster.shiftEndTime"],
            attendancePolicyName: record["attendancePolicymaster.policyName"],
            attendancePolicyCode:
              record["attendancePolicymaster.policyCode"] || "N/A",
            weekOffName: record["weekOffMaster.weekOffName"] || "N/A",
            //createdBy: record["punchInCreatedBy.name"] + record["punchInCreatedBy.empCode"] || "N/A",
            //updatedBy: record["punchOutCreatedBy.name"] + record["punchOutCreatedBy.empCode"]|| "N/A",
            createdBy: record["punchInCreatedBy.name"]
              ? `${record["punchInCreatedBy.name"]} (${
                  record["punchInCreatedBy.empCode"] ?? "N/A"
                })`
              : "N/A",
            updatedBy: record["punchOutCreatedBy.name"]
              ? `${record["punchOutCreatedBy.name"]} (${
                  record["punchOutCreatedBy.empCode"] ?? "N/A"
                })`
              : "N/A",
            createdAt:
              record.createdAt != null
                ? moment(record.createdAt).format("DD-MM-YYYY HH:mm:ss")
                : "N/A",
            updatedAt:
              record.updatedAt != null
                ? moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")
                : "N/A",
          }))
        );

        if (simplifiedData.length > 0) {
          const timestamp = Date.now();
          const data = [
            {
              sheet: "Attendance Report",
              columns: [
                { label: "Employee Code", value: "employeeCode" },
                { label: "Employee Name", value: "employeeName" },
                { label: "Grade", value: "grade" },
                { label: "BU Name", value: "buName" },
                { label: "SBU Name", value: "sbuName" },
                { label: "Department Name", value: "departmentName" },
                { label: "Designation", value: "designationName" },
                { label: "Functional Area Name", value: "functionArea" },
                { label: "Manager", value: "manager" },
                { label: "Attendance Date", value: "attendanceDate" },
                { label: "Attendance Status", value: "attendanceStatus" },
                {
                  label: "Attendance Present Status",
                  value: "attendancePresentStatus",
                },
                { label: "Punch In Time", value: "attendancePunchInTime" },
                {
                  label: "Punch In Location",
                  value: "attendancePunchInLocation",
                },
                {
                  label: "Attendance Punch In Location Type",
                  value: "attendancePunchInLocationType",
                },
                { label: "Punch In Source", value: "punchInSource" },
                { label: "Punch In Remark", value: "attendancePunchInRemark" },
                { label: "Punch Out Time", value: "attendancePunchOutTime" },
                {
                  label: "Punch Out Location",
                  value: "attendancePunchOutLocation",
                },
                {
                  label: "Attendance Punch Out Location Type",
                  value: "attendancePunchOutLocationType",
                },
                { label: "Punch Out Source", value: "punchOutSource" },
                {
                  label: "Punch Out Remark",
                  value: "attendancePunchOutRemark",
                },
                { label: "Status(Pending/Approved/Rejected)", value: "status" },
                { label: "Shift Name", value: "shiftName" },
                { label: "Shift Start Time", value: "shiftStartTime" },
                { label: "Shift End Time", value: "shiftEndTime" },
                {
                  label: "Attendance Policy Name",
                  value: "attendancePolicyName",
                },
                {
                  label: "Attendance Policy Code",
                  value: "attendancePolicyCode",
                },
                { label: "Week Off Name", value: "weekOffName" },
                { label: "Created By Punch In", value: "createdBy" },
                { label: "Created On Punch In ", value: "createdAt" },
                { label: "Created By Punch Out", value: "updatedBy" },
                { label: "Created On Punch Out", value: "updatedAt" },
              ],
              content: simplifiedData,
            },
          ];

          let settings = {
            writeOptions: {
              type: "buffer",
              bookType: "xlsx",
            },
          };
          const buffer = xlsx(data, settings);
          res.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-disposition": `attachment; filename=attendance_${timestamp}.xlsx`,
          });
          res.end(buffer);
        }
      } else {
        return respHelper(res, {
          status: 404,
          message: "Data not availble for available dates",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }

  async onboardingEmployeeImport(req, res) {
    const transaction = await db.sequelize.transaction(); // Start the transaction
    try {
      // Read Excel file
      if (!req.file) {
        return respHelper(res, {
          status: 400,
          msg: "File is required!",
        });
      } else {
        const workbookEmployee = pkg.readFile(req.file.path);
        const sheetNameEmployee = workbookEmployee.SheetNames[0];
        const Employees = pkg.utils.sheet_to_json(
          workbookEmployee.Sheets[sheetNameEmployee]
        );

        const successData = [];
        const failureData = [];

        // process data in chunks
        const chunkSize = 10;

        for (let i = 0; i < Employees.length; i += chunkSize) {
          const chunk = Employees.slice(i, i + chunkSize);
          const validEmployees = [];
          const invalidEmployees = [];

          for (const employee of chunk) {
            let obj = createObj(employee);

            // validate fields
            const { error } =
              await validator.importOnboardEmployeeSchema.validate(obj);
            if (!error) {
              const isValidCompany = await validateCompany(obj.company);
              const isValidEmployeeType = await validateEmployeeType(
                obj.employeeType
              );
              const isValidProbation = await validateProbation(obj.probation);
              const isValidManager = await validateManager(obj.manager);
              const isValidDesignation = await validateDesignation(
                obj.designation
              );
              const isValidFunctionalArea = await validateFunctionalArea(
                obj.functionalArea
              );
              const isValidBU = await validateBU(obj.bu, isValidCompany);
              const isValidSBU = await validateSBU(obj.sbu);
              const isValidShift = await validateShift(obj.shift);
              const isValidDepartment = await validateDepartment(
                obj.department
              );
              const isValidAttendancePolicy = await validateAttendancePolicy(
                obj.attendancePolicy
              );
              const isValidCompanyLocation = await validateCompanyLocation(
                obj.companyLocation,
                isValidCompany
              );
              const isValidWeekOff = await validateWeekOff(obj.weekOff);
              const isValidNewCustomerName = await validateNewCustomerName(
                obj.newCustomerName
              );
              const isValidJobLevel = await validateJobLevel(obj.jobLevel);
              const isValidateEmployee = await validateEmployee(
                obj.personalMobileNumber,
                obj.email
              );

              if (
                isValidCompany.status &&
                isValidEmployeeType.status &&
                isValidProbation.status &&
                isValidManager.status &&
                isValidDesignation.status &&
                isValidFunctionalArea.status &&
                isValidBU.status &&
                isValidSBU.status &&
                isValidCompanyLocation.status &&
                isValidDepartment.status &&
                isValidateEmployee.status &&
                isValidJobLevel.status
              ) {
                // prepare employee object
                let newEmployee = {
                  name: `${obj.firstName} ${obj.middleName} ${obj.lastName}`
                    .replace(/\s+/g, " ")
                    .trim(),
                  firstName: obj.firstName,
                  middleName: obj.middleName,
                  lastName: obj.lastName,
                  email: obj.email,
                  personalEmail: obj.personalEmail,
                  panNo: obj.panNo,
                  uanNo: obj.uanNo,
                  pfNo: obj.pfNo,
                  officeMobileNumber: obj.officeMobileNumber,
                  personalMobileNumber: obj.personalMobileNumber,
                  gender: obj.gender,
                  dateOfBirth: obj.dateOfBirth,
                  dateOfJoining: obj.dateOfJoining,
                  maritalStatus: maritalStatusOptions[obj.maritalStatus],
                  maritalStatusSince: obj.maritalStatusSince,
                  nationality: obj.nationality,
                  probationId: isValidProbation.data.probationId,
                  iqTestApplicable: obj.iqTestApplicable == "Yes" ? 1 : 0,
                  positionType: obj.positionType,
                  companyId: isValidCompany.data.companyId,
                  buId: isValidBU.data.buId,
                  sbuId: isValidSBU.data.sbuId,
                  departmentId: isValidDepartment.data.departmentId,
                  functionalAreaId: isValidFunctionalArea.data.functionalAreaId,
                  buHRId: isValidBU.data.buHR,
                  buHeadId: isValidBU.data.buHead,
                  employeeType: isValidEmployeeType.data.empTypeId,
                  manager: isValidManager.data.id,
                  designation_id: isValidDesignation.data.designationId,
                  shiftId: isValidShift.data?.shiftId,
                  attendancePolicyId:
                    isValidAttendancePolicy.data?.attendancePolicyId,
                  companyLocationId:
                    isValidCompanyLocation.data.companyLocationId,
                  weekOffId: isValidWeekOff.data?.weekOffId,
                  newCustomerNameId:
                    isValidNewCustomerName.data?.newCustomerNameId,
                  jobLevelId: isValidJobLevel.data?.jobLevelId,
                };

                newEmployee.role_id = 3;
                validEmployees.push({ ...newEmployee, index: employee.Index });
                const createdEmployees = await db.employeeStagingMaster.create(
                  newEmployee
                );
              } else {
                const masterErrors = {
                  index: employee.Index,
                  companyEmail: obj.email,
                  company: isValidCompany.message,
                  employeeType: isValidEmployeeType.message,
                  probation: isValidProbation.message,
                  manager: isValidManager.message,
                  designation: isValidDesignation.message,
                  functionalArea: isValidFunctionalArea.message,
                  bu: isValidBU.message,
                  sbu: isValidSBU.message,
                  shift: isValidShift.message,
                  attendancePolicy: isValidAttendancePolicy.message,
                  companyLocation: isValidCompanyLocation.message,
                  weekOff: isValidWeekOff.message,
                  department: isValidDepartment.message,
                  jobLevel: isValidJobLevel.message,
                  alreadyExist: isValidateEmployee.message,
                };
                invalidEmployees.push(masterErrors);
              }
            } else {
              const errors = handleErrors(error);
              invalidEmployees.push({
                ...errors,
                index: employee.Index,
                companyEmail: obj.email,
              });
            }
          }

          // bulk create valid data
          if (validEmployees.length > 0) {
            // const createdEmployees = await db.employeeStagingMaster.bulkCreate(validEmployees);
            // successData.push(...createdEmployees.map(e => e.toJSON()));
            successData.push(validEmployees);
          }
          failureData.push(...invalidEmployees);
        }

        return respHelper(res, {
          status: 200,
          msg: "File Uploaded Successfully",
          data: {
            successData,
            failureData,
          },
        });
      }
    } catch (error) {
      await transaction.rollback(); // Rollback the transaction in case of an error
      console.log(error);
      return respHelper(res, {
        status: 500,
      });
    }
  }

  async attendanceSummary(req, res) {
    try {
      const {
        startDate,
        endDate,
        search,
        employeeType,
        designation,
        department,
        areaSearch,
        grade,
        companyLocation,
        attendanceFor,
      } = req.query;
      const fromDate = moment(startDate, "YYYY-MM-DD");
      const toDate = moment(endDate, "YYYY-MM-DD");

      const totalDays = toDate.diff(fromDate, "days") + 1;

      const attendanceData = await db.attendanceMaster.findAll({
        attributes: ["employeeId", "attendanceDate", "attendancePresentStatus"],
        where: {
          // employeeId: 1335,
          attendanceDate: {
            [db.Sequelize.Op.between]: [
              fromDate.format("YYYY-MM-DD"),
              toDate.format("YYYY-MM-DD"),
            ],
          },
        },
        include: [
          {
            model: db.employeeMaster,
            attributes: [
              "id",
              "name",
              "empCode",
              "weekOffId",
              "companyLocationId",
            ],
            where: {
              // isActive: 1,
              ...(attendanceFor == 0 && { isActive: 0 }),
              ...(attendanceFor == 1 && { isActive: 1 }),
              ...(attendanceFor == 2 && { isActive: [0, 1] }),
              ...(search && { id: { [Op.in]: search.split(",") } }),
              ...(employeeType && {
                employeeType: { [Op.in]: employeeType.split(",") },
              }),
              ...(department && {
                departmentId: { [Op.in]: department.split(",") },
              }),
              ...(designation && {
                designation_id: { [Op.in]: designation.split(",") },
              }),
              ...(companyLocation && {
                companyLocationId: { [Op.in]: companyLocation.split(",") },
              }),
              ...(areaSearch && {
                functionalAreaId: { [Op.in]: areaSearch.split(",") },
              }),
            },
            include: [
              {
                model: db.jobDetails,
                attributes: ["jobId"],
                where: {
                  ...(grade && { gradeId: { [Op.in]: grade.split(",") } }),
                },
                include: [
                  {
                    model: db.gradeMaster,
                    attributes: ["gradeName"],
                  },
                ],
              },
              {
                model: db.designationMaster,
                attributes: ["name"],
              },
              {
                model: db.departmentMaster,
                attributes: ["departmentName"],
                // where: {
                //   ...(department && {
                //     departmentId: { [Op.like]: `%${department}%` },
                //   })
                // },
              },
              {
                model: db.functionalAreaMaster,
                seperate: true,
                attributes: ["functionalAreaName"],
                // where: {
                //   ...(areaSearch && {
                //     functionalAreaName: { [Op.like]: `%${areaSearch}%` },
                //   }),
                // },
              },
            ],
          },
          {
            model: db.regularizationMaster,
            as: "latest_Regularization_Request",
            attributes: ["regularizeId"],
          },
        ],
      });

      const employeeIds = [
        ...new Set(attendanceData.map((record) => record.employeeId)),
      ];
      const finalData = [];
      const today = moment().startOf("day");

      for (const employeeId of employeeIds) {
        const employeeRecords = attendanceData.filter(
          (record) => record.employeeId === employeeId
        );

        if (employeeRecords.length === 0) continue;

        const employeeRecord = {
          empId: employeeRecords[0].employee?.id || null,
          name: employeeRecords[0].employee?.name || "Unknown",
          empCode: employeeRecords[0].employee?.empCode || "N/A",
          weekOffId: employeeRecords[0].employee?.weekOffId || 0,
          companyLocationId:
            employeeRecords[0].employee?.companyLocationId || 0,
        };

        const dayRecords = {};
        let attendanceCount = {
          P: 0,
          A: 0,
          SA: 0,
          R: 0,
          H: 0,
          W: 0,
          L: 0,
          U: 0,
        };

        // Fetch approved leave transactions for the employee
        const leaveTransactions = await db.employeeLeaveTransactions.findAll({
          attributes: ["employeeId", "leaveAutoId", "leaveCount", "appliedFor"],
          where: {
            employeeId: employeeRecord.empId,
            [Op.or]: [
              { source: { [Op.ne]: "system_generated" } }, // Source is not 'system_generated'
              { source: null }, // Source is null
            ],
            status: "approved",
            appliedFor: {
              [db.Sequelize.Op.between]: [
                fromDate.format("YYYY-MM-DD"),
                toDate.format("YYYY-MM-DD"),
              ],
            },
          },
          raw: true,
        });
        const getLeaveForDay = (date) =>
          leaveTransactions.find((leave) => leave.appliedFor === date);

        for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
          const currentDay = moment(fromDate).add(dayOffset, "days");
          const currentDate = currentDay.format("YYYY-MM-DD");
          const dayKey = currentDay.format("DD");

          // Check if the day is a holiday or week off using isDayWorking function
          const isDayWorking = await helper.isDayWorkingForReport(
            currentDate,
            employeeRecord.weekOffId,
            employeeRecord.companyLocationId
          );

          // If the day is a holiday, set status to H
          if (isDayWorking === "H") {
            const leave = getLeaveForDay(currentDate);
            const attendanceRecord = employeeRecords.find(
              (record) => record.attendanceDate === currentDate
            );
            if (attendanceRecord) {
              const { attendancePresentStatus } = attendanceRecord;

              // Set attendance based on the presence status
              if (attendancePresentStatus === "present") {
                dayRecords[dayKey] = "P"; // Initially set to P
                //attendanceCount.P++;

                // Check for regularization
                if (attendanceRecord.latest_Regularization_Request.length > 0) {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},R`; // Append R for regularization
                  attendanceCount.R++;
                }

                // If there was a leave, append it after regularization
                if (leave) {
                  // Determine the leave status based on leaveCount and leaveAutoId
                  let leaveStatus =
                    leave.leaveCount === "1.0"
                      ? "L"
                      : leave.leaveAutoId == 6
                      ? "0.5U"
                      : "0.5L";
                  dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                  //attendanceCount.L++;
                  attendanceCount.L += parseFloat(leave.leaveCount);
                }

                if (isDayWorking === "H") {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},H`; // Append R for regularization
                  attendanceCount.H++; // uncommenting this line 10-10-2024
                }
              } else if (attendancePresentStatus === "singlePunchAbsent") {
                dayRecords[dayKey] = "SA";
                attendanceCount.SA++;

                if (attendanceRecord.latest_Regularization_Request.length > 0) {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},R`; // Append R for regularization
                  attendanceCount.R++;
                }

                // If there was a leave, append it after regularization
                if (leave) {
                  // Determine the leave status based on leaveCount and leaveAutoId
                  let leaveStatus =
                    leave.leaveCount === "1.0"
                      ? "L"
                      : leave.leaveAutoId == 6
                      ? "0.5U"
                      : "0.5L";
                  dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                  //attendanceCount.L++;
                  attendanceCount.L += parseFloat(leave.leaveCount);
                }

                if (isDayWorking === "H") {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},H`; // Append R for regularization
                  attendanceCount.H++; // uncommenting this line 10-10-2024
                }
              } else if (attendancePresentStatus === "absent") {
                dayRecords[dayKey] = "A";
                attendanceCount.A++;

                if (attendanceRecord.latest_Regularization_Request.length > 0) {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},R`; // Append R for regularization
                  attendanceCount.R++;
                }

                // If there was a leave, append it after regularization
                if (leave) {
                  // Determine the leave status based on leaveCount and leaveAutoId
                  let leaveStatus =
                    leave.leaveCount === "1.0"
                      ? "L"
                      : leave.leaveAutoId == 6
                      ? "0.5U"
                      : "0.5L";
                  dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                  // attendanceCount.L++;
                  attendanceCount.L += parseFloat(leave.leaveCount);
                }

                if (isDayWorking === "H") {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},H`; // Append R for regularization
                  attendanceCount.H++; // uncommenting this line 10-10-2024
                }
              } else if (attendancePresentStatus === "weeklyOff") {
                dayRecords[dayKey] = "W";
                attendanceCount.W++;
              } else {
                // If there are no attendance records, set to '-'
                dayRecords[dayKey] = "H"; // Set to H for holiday
                attendanceCount.H++;
              }
            } else {
              // If there are no attendance records, set to '-'
              dayRecords[dayKey] = "H"; // Set to H for holiday
              attendanceCount.H++;
            }
          }
          // If the day is a week off, set status to W
          else if (isDayWorking === "W") {
            const leave = getLeaveForDay(currentDate);
            const attendanceRecord = employeeRecords.find(
              (record) => record.attendanceDate === currentDate
            );
            if (attendanceRecord) {
              const { attendancePresentStatus } = attendanceRecord;
              // Set attendance based on the presence status
              if (attendancePresentStatus === "present") {
                dayRecords[dayKey] = "P"; // Initially set to P
                //attendanceCount.P++;

                // Check for regularization
                if (attendanceRecord.latest_Regularization_Request.length > 0) {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},R`; // Append R for regularization
                  attendanceCount.R++;
                }

                // If there was a leave, append it after regularization
                if (leave) {
                  // Determine the leave status based on leaveCount and leaveAutoId
                  let leaveStatus =
                    leave.leaveCount === "1.0"
                      ? "L"
                      : leave.leaveAutoId == 6
                      ? "0.5U"
                      : "0.5L";
                  dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                  //attendanceCount.L++;
                  attendanceCount.L += parseFloat(leave.leaveCount);
                }

                if (isDayWorking === "W") {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},W`; // Append R for regularization
                  attendanceCount.W++; // uncommenting this line 10-10-2024
                }
              } else if (attendancePresentStatus === "singlePunchAbsent") {
                dayRecords[dayKey] = "SA";
                attendanceCount.SA++;

                if (attendanceRecord.latest_Regularization_Request.length > 0) {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},R`; // Append R for regularization
                  attendanceCount.R++;
                }

                // If there was a leave, append it after regularization
                if (leave) {
                  // Determine the leave status based on leaveCount and leaveAutoId
                  let leaveStatus =
                    leave.leaveCount === "1.0"
                      ? "L"
                      : leave.leaveAutoId == 6
                      ? "0.5U"
                      : "0.5L";
                  dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                  // attendanceCount.L++;
                  attendanceCount.L += parseFloat(leave.leaveCount);
                }

                if (isDayWorking === "W") {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},W`; // Append R for regularization
                  attendanceCount.W++; // uncommenting this line 10-10-2024
                }
              } else if (attendancePresentStatus === "absent") {
                dayRecords[dayKey] = "A";
                attendanceCount.A++;

                if (attendanceRecord.latest_Regularization_Request.length > 0) {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},R`; // Append R for regularization
                  attendanceCount.R++;
                }

                // If there was a leave, append it after regularization
                if (leave) {
                  // Determine the leave status based on leaveCount and leaveAutoId
                  let leaveStatus =
                    leave.leaveCount === "1.0"
                      ? "L"
                      : leave.leaveAutoId == 6
                      ? "0.5U"
                      : "0.5L";
                  dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                  //attendanceCount.L++;
                  attendanceCount.L += parseFloat(leave.leaveCount);
                }

                if (isDayWorking === "W") {
                  dayRecords[dayKey] = "W"; //`${dayRecords[dayKey]},W`; // Append R for regularization

                  // dayRecords[dayKey] = "W"//${dayRecords[dayKey]},W`; // Append R for regularization
                  attendanceCount.W++;
                  attendanceCount.A--;
                }
              } else if (attendancePresentStatus === "weeklyOff") {
                dayRecords[dayKey] = "W";
                attendanceCount.W++;
              } else {
                dayRecords[dayKey] = "W"; // Set to W for week off
                attendanceCount.W++;
              }
            } else {
              dayRecords[dayKey] = "W"; // Set to W for week off
              attendanceCount.W++;
            }
          } else {
            // Check for approved leave first
            const leave = getLeaveForDay(currentDate);
            const attendanceRecord = employeeRecords.find(
              (record) => record.attendanceDate === currentDate
            );

            if (attendanceRecord) {
              const { attendancePresentStatus } = attendanceRecord;

              // Set attendance based on the presence status
              if (attendancePresentStatus === "present") {
                dayRecords[dayKey] = "P"; // Initially set to P
                attendanceCount.P++;

                // Check for regularization
                if (attendanceRecord.latest_Regularization_Request.length > 0) {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},R`; // Append R for regularization
                  attendanceCount.R++;
                }

                // If there was a leave, append it after regularization
                if (leave) {
                  // Determine the leave status based on leaveCount and leaveAutoId
                  let leaveStatus =
                    leave.leaveCount === "1.0"
                      ? "L"
                      : leave.leaveAutoId == 6
                      ? "0.5U"
                      : "0.5L";
                  dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                  //attendanceCount.L++;
                  attendanceCount.L += parseFloat(leave.leaveCount);
                }
              } else if (attendancePresentStatus === "singlePunchAbsent") {
                dayRecords[dayKey] = "SA";
                attendanceCount.SA++;

                if (attendanceRecord.latest_Regularization_Request.length > 0) {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},R`; // Append R for regularization
                  attendanceCount.R++;
                }

                // If there was a leave, append it after regularization
                if (leave) {
                  // Determine the leave status based on leaveCount and leaveAutoId
                  let leaveStatus =
                    leave.leaveCount === "1.0"
                      ? "L"
                      : leave.leaveAutoId == 6
                      ? "0.5U"
                      : "0.5L";
                  dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                  //attendanceCount.L++;
                  attendanceCount.L += parseFloat(leave.leaveCount);
                }
              } else if (attendancePresentStatus === "absent") {
                dayRecords[dayKey] = "A";
                attendanceCount.A++;

                if (attendanceRecord.latest_Regularization_Request.length > 0) {
                  dayRecords[dayKey] = `${dayRecords[dayKey]},R`; // Append R for regularization
                  attendanceCount.R++;
                }

                // If there was a leave, append it after regularization
                if (leave) {
                  // Determine the leave status based on leaveCount and leaveAutoId
                  let leaveStatus =
                    leave.leaveCount === "1.0"
                      ? "L"
                      : leave.leaveAutoId == 6
                      ? "0.5U"
                      : "0.5L";
                  dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                  //attendanceCount.L++;
                  attendanceCount.L += parseFloat(leave.leaveCount);
                }
              } else if (attendancePresentStatus === "weeklyOff") {
                dayRecords[dayKey] = "W";
                attendanceCount.W++;
              } else if (attendancePresentStatus === "leave") {
                dayRecords[dayKey] = "L";
                attendanceCount.L++;
              }
            } else {
              // If there are no attendance records, set to '-'
              //dayRecords[dayKey] = "-";
              //If it's a working day

              //new changes
              dayRecords[dayKey] = "A"; // Default to 'A' (Absent)

              if (currentDay.isBefore(today)) {
                dayRecords[dayKey] = "A"; // For past dates, default to "A" if no data
              } else if (currentDay.isSame(today)) {
                dayRecords[dayKey] = "-"; // For today, set "-" if no data
              } else if (currentDay.isAfter(today)) {
                dayRecords[dayKey] = "-"; // For future dates, return blank
              }
            }
            //}
          }

          // Ensure future or current day shows '-'
          if (currentDay.isAfter(today) || currentDay.isSame(today)) {
            if (!dayRecords[dayKey]) {
              dayRecords[dayKey] = "-"; // Default to '-' for future/current days if not already set
            }
          }
        }

        const orderedEmployeeRecord = {
          name: employeeRecord.name,
          empCode: employeeRecord.empCode,
          ...dayRecords,
          P: attendanceCount.P,
          A: attendanceCount.A,
          SA: attendanceCount.SA,
          R: attendanceCount.R,
          L: attendanceCount.L,
          U: attendanceCount.U,
          H: attendanceCount.H,
          W: attendanceCount.W,
          SU: 0,
          C: 0,
          Payroll: attendanceCount.P,
          PayableDays:
            attendanceCount.P +
            attendanceCount.W +
            attendanceCount.H +
            attendanceCount.L,
        };

        finalData.push(orderedEmployeeRecord);
      }

      if (finalData.length > 0) {
        const timestamp = Date.now();
        const dayColumns = [];

        for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
          const currentDay = moment(fromDate).add(dayOffset, "days");
          dayColumns.push({
            label: currentDay.format("DD-MMM"),
            value: currentDay.format("DD"),
          });
        }

        const data = [
          {
            sheet: "Attendance Summary",
            columns: [
              { label: "Employee Code", value: "empCode" },
              { label: "Employee Name", value: "name" },
              ...dayColumns,
              { label: "P", value: "P" },
              { label: "A", value: "A" },
              { label: "SA", value: "SA" },
              { label: "R", value: "R" },
              { label: "W", value: "W" },
              { label: "H", value: "H" },
              { label: "L", value: "L" },
              { label: "U", value: "U" },
              { label: "SYSTEM U", value: "SU" },
              { label: "C", value: "C" },
              { label: "P (Payroll)", value: "Payroll" },
              { label: "Payable Days", value: "PayableDays" },
            ],
            content: finalData,
          },
        ];

        const buffer = xlsx(data, {
          writeOptions: { type: "buffer", bookType: "xlsx", RTL: true },
        });

        res.writeHead(200, {
          "Content-Type": "application/octet-stream",
          "Content-disposition": `attachment; filename=attendance_1_${timestamp}.xlsx`,
        });
        return res.end(buffer);
      } else {
        return respHelper(res, {
          status: 404,
          message: "Data not availble for available dates",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }

  // async employeeMasterExport(req, res) {
  //   try {
  //     const {
  //       search,
  //       department,
  //       designation,
  //       buSearch,
  //       sbuSearch,
  //       areaSearch,
  //       grade,
  //       attendanceFor,
  //       employeeType,
  //       businessUnit,
  //       companyLocation,
  //     } = req.query;

  //     const employeeData = await db.employeeMaster.findAll({
  //       attributes: [
  //         "id",
  //         "empCode",
  //         "name",
  //         "email",
  //         "firstName",
  //         "lastName",
  //         "officeMobileNumber",
  //         "buId",
  //         "personalMobileNumber",
  //       ],
  //       where: {
  //         ...(attendanceFor == 0 && { isActive: 0 }),
  //         ...(attendanceFor == 1 && { isActive: 1 }),
  //         ...(attendanceFor == 2 && { isActive: [0, 1] }),
  //         ...(search && { id: { [Op.in]: search.split(",") } }),
  //         ...(employeeType && {
  //           employeeType: { [Op.in]: employeeType.split(",") },
  //         }),
  //         ...(businessUnit && {
  //           buId: { [Op.in]: businessUnit.split(",") },
  //         }),
  //         ...(department && {
  //           departmentId: { [Op.in]: department.split(",") },
  //         }),
  //         ...(companyLocation && {
  //           companyLocationId: { [Op.in]: companyLocation.split(",") },
  //         }),
  //       },
  //       include: [
  //         {
  //           model: db.designationMaster,
  //           attributes: ["name"],
  //           required: !!designation,
  //         },
  //         {
  //           model: db.functionalAreaMaster,
  //           attributes: ["functionalAreaName"],
  //           required: !!areaSearch,
  //         },
  //         {
  //           model: db.departmentMaster,
  //           attributes: ["departmentName"],
  //           required: !!department,
  //         },
  //         {
  //           model: db.jobDetails,
  //           attributes: ["jobId"],
  //           where: {
  //             ...(grade && { gradeId: { [Op.in]: grade.split(",") } }),
  //           },
  //           include: [
  //             {
  //               model: db.gradeMaster,
  //               attributes: ["gradeName"],
  //             },
  //           ],
  //         },
  //         {
  //           model: db.educationDetails,
  //           attributes: [
  //             "educationDegree",
  //             "educationSpecialisation",
  //             "educationInstitute",
  //             "educationRemark",
  //             "educationStartDate",
  //             "educationCompletionDate",
  //           ],
  //           where: { isHighestEducation: 1 },
  //           required: false,
  //         },
  //         {
  //           model: db.familyDetails,
  //           attributes: [
  //             "name",
  //             "dob",
  //             "gender",
  //             "mobileNo",
  //             "relationWithEmp",
  //           ],
  //           where:{relationWithEmp:["Father","Mother"]},
  //           reqired:false,
  //           as: "employeefamilydetails",
  //         },
  //         {
  //           model: db.employeeMaster,
  //           required: false,
  //           attributes: ["id", "name"],
  //           as: "managerData",
  //         },
  //         {
  //           model: db.buMaster,
  //           attributes: ["buName"],
  //           required: !!buSearch,
  //         },
  //         {
  //           model: db.sbuMaster,
  //           attributes: ["sbuname"],
  //           required: !!sbuSearch,
  //         },
  //       ],
  //     });

  //     console.log("employeeData", employeeData);
      
  //     const arr = await Promise.all(
  //       employeeData.map(async (ele) => {
  //         return {
  //           id: ele.dataValues.id || "",
  //           empCode: ele.dataValues.empCode || "",
  //           name: ele.dataValues.name || "",
  //           email: ele.dataValues.email || "",
  //           firstName: ele.dataValues.firstName || "",
  //           lastName: ele.dataValues.lastName || "",
  //           officeMobileNumber: ele.dataValues.officeMobileNumber || "",
  //           personalMobileNumber: ele.dataValues.personalMobileNumber || "",
  //           manager_id: ele.dataValues.managerData
  //             ? ele.dataValues.managerData.id
  //             : "",
  //           manager_name: ele.dataValues.managerData
  //             ? ele.dataValues.managerData.name
  //             : "",
  //           buId: ele.dataValues.buId || "",
  //           designation_name: ele.dataValues.designationmaster?.name || "",
  //           functional_area_name:
  //             ele.dataValues.functionalareamaster?.functionalAreaName || "",
  //           department_name:
  //             ele.dataValues.departmentmaster?.departmentName || "",
  //           bu_name: ele.dataValues.bumaster?.buName || "",
  //           sub_bu_name: ele.dataValues.sbumaster?.sbuname || "",
  //           grade:ele.employeejobdetail?.grademaster.gradeName || "",
  //           "father's Name":ele.employeefamilydetails.length > 0 ? ele.employeefamilydetails[0].relationWithEmp : "",
  //           "mother's Name":ele.employeefamilydetails.length > 0 ? ele.employeefamilydetails[1].relationWithEmp : "",
  //         };
  //       })
  //     );

  //     if (arr.length > 0) {
  //       const timestamp = Date.now();
  //       // const data = [
  //       //   {
  //       //     sheet: "Employee",
  //       //     columns: [
  //       //       { label: "Employee_Code", value: "empCode" },
  //       //       { label: "Email", value: "email" },
  //       //       { label: "First_Name", value: "firstName" },
  //       //       { label: "Last_Name", value: "lastName" },
  //       //       { label: "Office_Mobile_Number", value: "officeMobileNumber" },
  //       //       {
  //       //         label: "Personal_Mobile_Number",
  //       //         value: "personalMobileNumber",
  //       //       },
  //       //       { label: "Manager_Id", value: "manager_id" },
  //       //       { label: "Manager_Name", value: "manager_name" },
  //       //       { label: "Designation_Name", value: "designation_name" },
  //       //       { label: "Department_Name", value: "department_name" },
  //       //       { label: "Functional_Area_Name", value: "functional_area_name" },
  //       //       { label: "Bu_Name", value: "bu_name" },
  //       //       { label: "Sub_Bu_Name", value: "sub_bu_name" },
  //       //     ],
  //       //     content: arr,
  //       //   },
  //       //   {
  //       //     sheet: "Education",
  //       //     columns: [
  //       //       { label: "Employee_Code", value: "empCode" },
  //       //       { label: "Name", value: "name" },
  //       //       {
  //       //         label: "Education_Specialisation",
  //       //         value: "educationSpecialisation",
  //       //       },
  //       //       { label: "Education_Institute", value: "educationInstitute" },
  //       //     ],
  //       //     content: educationDetails,
  //       //   },
  //       //   {
  //       //     sheet: "Family Details",
  //       //     columns: [
  //       //       { label: "Employee_Code", value: "empCode" },
  //       //       { label: "Name", value: "name" },
  //       //       { label: "Family_Member_Name", value: "familyName" },
  //       //       { label: "Date_Of_Birth", value: "dob" },
  //       //       { label: "Gender", value: "gender" },
  //       //       { label: "Mobile_Number", value: "mobileNo" },
  //       //       { label: "Relation_With_Employee", value: "relationWithEmp" },
  //       //     ],
  //       //     content: familyDetails,
  //       //   },
  //       // ];

  //       // let settings = {
  //       //   writeOptions: {
  //       //     type: "buffer",
  //       //     bookType: "xlsx",
  //       //   },
  //       // };
  //       // const buffer = xlsx(data, settings);
  //       // res.writeHead(200, {
  //       //   "Content-Type": "application/octet-stream",
  //       //   "Content-disposition": `attachment; filename=attendance_${timestamp}.xlsx`,
  //       // });
  //       // res.end(buffer);
  //       return respHelper(res, {
  //         status: 200,
  //         msg: "File Uploaded Successfully",
  //         data: arr,
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({
  //       status: false,
  //       message: "Internal Server Error",
  //     });
  //   }
  // }
  async employeeMasterExport(req, res) {
    try {
      const {
        search,
        department,
        designation,
        buSearch,
        sbuSearch,
        areaSearch,
        grade,
        attendanceFor,
        employeeType,
        businessUnit,
        companyLocation,
      } = req.query;
  
      const employeeData = await db.employeeMaster.findAll({
        attributes: [
          "id",
          "empCode",
          "name",
          "email",
          "firstName",
          "lastName",
          "officeMobileNumber",
          "buId",
          "personalMobileNumber",
          "drivingLicence",
          "lastIncrementDate",
          "iqTestApplicable"
        ],
        where: {
          ...(attendanceFor == 0 && { isActive: 0 }),
          ...(attendanceFor == 1 && { isActive: 1 }),
          ...(attendanceFor == 2 && { isActive: [0, 1] }),
          ...(search && { id: { [Op.in]: search.split(",") } }),
          ...(employeeType && {
            employeeType: { [Op.in]: employeeType.split(",") },
          }),
          ...(businessUnit && {
            buId: { [Op.in]: businessUnit.split(",") },
          }),
          ...(department && {
            departmentId: { [Op.in]: department.split(",") },
          }),
          ...(companyLocation && {
            companyLocationId: { [Op.in]: companyLocation.split(",") },
          }),
        },
        include: [
          {
            model: db.employeeTypeMaster,
            attributes:['emptypename','emptypename'],
            requried:false           
          },
          {
            model: db.biographicalDetails,
            required:false           
          },
          {
            model: db.costCenterMaster,
            attributes:['costCenterId','costCenterName','costCenterCode'],
            required:false     
          },
          {
            model: db.designationMaster,
            attributes: ["name"],
            required: !!designation,
          },
          {
            model: db.functionalAreaMaster,
            attributes: ["functionalAreaName","functionalAreaCode"],
            required: !!areaSearch,
          },
          {
            model: db.departmentMaster,
            attributes: ["departmentName"],
            required: !!department,
          },
          {
            model: db.jobDetails,
            attributes: ["jobId","dateOfJoining","residentEng"],
            where: {
              ...(grade && { gradeId: { [Op.in]: grade.split(",") } }),
            },
            include: [
              {
                model: db.gradeMaster,
                attributes: ["gradeName"],
              },
              {
                model: db.bandMaster,
                attributes: ['bandDesc'],
              },
              {
                model:db.jobLevelMaster,
                attributes:['jobLevelName','jobLevelCode'],
              }
             
            ],
          },
          {
            model: db.educationDetails,
            attributes: [
              "educationDegree",
              "educationSpecialisation",
              "educationInstitute",
              "educationRemark",
              "educationStartDate",
              "educationCompletionDate",
            ],
            where: { isHighestEducation: 1 },
            required: false,
          },
          {
            model: db.familyDetails,
            attributes: ["name", "dob", "gender", "mobileNo", "relationWithEmp"],
            where: { relationWithEmp: ["Father", "Mother"] },
            required: false,
            as: "employeefamilydetails",
          },
          {
            model: db.employeeMaster,
            required: false,
            attributes: ["id", "name",'empCode','email'],
            as: "managerData",
          },
          {
            model: db.buMaster,
            attributes: ["buName"],
            required: !!buSearch,
          },
          {
            model: db.sbuMaster,
            attributes: ["sbuname"],
            required: !!sbuSearch,
          },
          {
            model: db.companyLocationMaster,
            attributes: ["address1"],
            include: [
              {
                model: db.countryMaster,
                attributes: ["countryId", "countryName"],
              },
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
          {
            model: db.companyMaster,
            attributes: ["companyName","companyCode"],
          },
        ],
      });

  
      const arr = await Promise.all(
        employeeData.map(async (ele) => {
          return {
            id: ele.dataValues.id || "",
            empCode: ele.dataValues.empCode || "",
            name: ele.dataValues.name || "",
            email: ele.dataValues.email || "",
            firstName: ele.dataValues.firstName || "",
            lastName: ele.dataValues.lastName || "",
            officeMobileNumber: ele.dataValues.officeMobileNumber || "",
            personalMobileNumber: ele.dataValues.personalMobileNumber || "",
            manager_code: ele.dataValues.managerData?.empCode || "",
            manager_name: ele.dataValues.managerData?.name || "",
            manager_email_id: ele.dataValues.managerData?.email || "",
            designation_name: ele.dataValues.designationmaster?.name || "",
            functional_area_name:
              ele.dataValues.functionalareamaster?.functionalAreaName || "",
              functional_area_code:
              ele.dataValues.functionalareamaster?.functionalAreaCode || "",
            department_name: ele.dataValues.departmentmaster?.departmentName || "",
            bu_name: ele.dataValues.bumaster?.buName || "",
            sub_bu_name: ele.dataValues.sbumaster?.sbuname || "",
            grade: ele.employeejobdetail?.grademaster?.gradeName || "",
            band: ele.employeejobdetail?.bandmaster?.bandDesc || "",
            jobLevel: ele.employeejobdetail?.joblevelmaster?.jobLevelName || "",
            jobLevelCode: ele.employeejobdetail?.joblevelmaster?.jobLevelCode || "",
            costCenter: ele.costcentermaster?.costCenterName +" "+ ele.costcentermaster?.costCenterCode|| "",
            dateOfJoining: ele.employeejobdetail?.dateOfJoining ? moment(ele.employeejobdetail.dateOfJoining).format("DD-MM-YYYY") : "",
            residentEng: ele.employeejobdetail?.residentEng || "",
            fathersName: ele.employeefamilydetails.find(f => f.relationWithEmp === "Father")?.name || "",
            motherName: ele.employeefamilydetails.find(m => m.relationWithEmp === "Mother")?.name || "",
            nationality: ele.employeebiographicaldetail?.nationality || "",
            maritalStatus: ele.employeebiographicaldetail?.maritalStatus
            ? Object.keys(maritalStatusOptions).find(
                (key) => maritalStatusOptions[key] === ele.employeebiographicaldetail.maritalStatus
              ) || ""
            : "",
            maritalStatusSince: ele.employeebiographicaldetail.maritalStatusSince || "",
            gender: ele.employeebiographicaldetail?.gender,
            dateOfBirth: ele.employeebiographicaldetail?.dateOfBirth ? moment(ele.employeebiographicaldetail.dateOfBirth).format("DD-MM-YYYY"): "",
            office_country:ele.companylocationmaster?.countrymaster?.countryName,
            office_state:ele.companylocationmaster?.statemaster?.stateName,
            office_city:ele.companylocationmaster?.citymaster?.cityName,
            employeeType:ele.employeetypemaster?.emptypename || "",
            groupCompany:ele.companymaster?.companyName || "",
            groupCode:ele.companymaster?.companyCode || "",
            drivingLicence:ele.dataValues.drivingLicence || "",
            lastIncrementDate:ele.dataValues.lastIncrementDate || "",
            iqTestApplicable:ele.dataValues.iqTestApplicable
          }
            
        })
      );
  
      if (arr.length > 0) {
        const timestamp = Date.now();

        const data = [
          {
            sheet: "Employee",
            columns: [
              { label: "Employee_Code", value: "empCode" },
              { label: "Email", value: "email" },
              { label: "First_Name", value: "firstName" },
              { label: "Last_Name", value: "lastName" },
              { label: "Office_Mobile_Number", value: "officeMobileNumber" },
              {
                label: "Personal_Mobile_Number",
                value: "personalMobileNumber",
              },
              { label: "Direct Manager Code", value: "manager_code" },
              { label: "Direct Manager Name", value: "manager_name" },
              { label: "Direct Manager Email Id", value: "manager_email_id" },
              { label: "Designation_Name", value: "designation_name" },
              { label: "Department_Name", value: "department_name" },
              { label: "Functional_Area_Name", value: "functional_area_name" },
              { label: "Functional_Area_Code", value: "functional_area_code" },
              { label: "Bu_Name", value: "bu_name" },
              { label: "Sub_Bu_Name", value: "sub_bu_name" },
              { label: "Grade", value: "grade" },
              { label: "Band", value: "band" },
              { label: "Job Level", value: "jobLevel" },
              { label: "Job Level Code", value: "jobLevelCode" },
              { label: "date Of Joining",value: "dateOfJoining"},
              { label: "FathersName", value: "fathersName" },
              { label: "MotherName", value: "motherName" },
              { label: "Nationality", value: "nationality" },
              { label: "MaritalStatus", value: "maritalStatus" },
              { label: "MaritalStatusSince", value: "maritalStatusSince" },
              { label: "Gender", value: "gender" },
              { label: "Office Country", value: "office_country" },
              { label: "Office State", value: "office_state"},
              { label: "Office City", value: "office_city" },
              { label: "Employee Type", value: "employeeType" },
              { label: "Last Increment Date", value: "lastIncrementDate" },
              { label: "Iq Test Applicable", value: "iqTestApplicable" },
              { label: "RE", value: "residentEng" },             
            ],
            content: arr,
          }
        ];
        const buffer = xlsx(data, {
          writeOptions: { type: "buffer", bookType: "xlsx", RTL: true },
        });

        res.writeHead(200, {
          "Content-Type": "application/octet-stream",
          "Content-disposition": `attachment; filename=attendance_1_${timestamp}.xlsx`,
        });
        return res.end(buffer);
        // return respHelper(res, {
        //   status: 200,
        //   msg: "File Uploaded Successfully",
        //   data: arr,
        // });
      }
    } catch (error) {
      console.error("Error in employeeMasterExport:", error);
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: error.message, // Adding error message for better debugging
      });
    }
  }
  
}

const createObj = (obj) => {
  return {
    email: obj.Email,
    personalEmail: obj.Personal_Email,
    firstName: obj.First_Name,
    middleName: replaceNAWithNull(obj.Middle_Name),
    lastName: replaceNAWithNull(obj.Last_Name),
    panNo: replaceNAWithNull(obj.Pan_No),
    uanNo: replaceNAWithNull(obj.UAN_No),
    pfNo: replaceNAWithNull(obj.PF_No),
    employeeType: obj.Employee_Type_Name,
    officeMobileNumber: obj.Official_Mobile_Number?.toString(),
    personalMobileNumber: obj.Personal_Mobile_Number?.toString(),
    gender: obj.Gender,
    dateOfBirth: convertExcelDate(obj.Date_of_Birth),
    dateOfJoining: convertExcelDate(obj.Date_of_Joining),
    maritalStatus: obj.Marital_Status,
    maritalStatusSince:
      obj.Marital_Since != "NA" && obj.Marital_Since != ""
        ? convertExcelDate(obj.Marital_Since)
        : "",
    nationality: obj.Nationality_Name,
    probation: obj.Probation_Name,
    newCustomerName: replaceNAWithNull(obj.New_Customer_Name),
    iqTestApplicable: obj.IQ_Test_Applicable,
    positionType: obj.Position_Type,
    manager: obj.Manager_EMP_CODE,
    designation: obj.Designation_Name,
    functionalArea: obj.Functional_Area_Name,
    bu: obj.BU_Name,
    sbu: obj.SBU_Name,
    shift: replaceNAWithNull(obj.Shift_Name),
    department: obj.Department_Name,
    company: obj.Company_Name,
    attendancePolicy: replaceNAWithNull(obj.Attendance_Policy_Name),
    companyLocation: obj.Company_Location_Name,
    weekOff: replaceNAWithNull(obj.Week_Off_Name),
    jobLevel: obj.Job_Level_Name,
  };
};

const handleErrors = (error) => {
  const errors = {
    name: error
      ? error.details.find((d) => d.context.key === "name")?.message
      : null,
    email: error
      ? error.details.find((d) => d.context.key === "email")?.message
      : null,
    personalEmail: error
      ? error.details.find((d) => d.context.key === "personalEmail")?.message
      : null,
    firstName: error
      ? error.details.find((d) => d.context.key === "firstName")?.message
      : null,
    panNo: error
      ? error.details.find((d) => d.context.key === "panNo")?.message
      : null,
    uanNo: error
      ? error.details.find((d) => d.context.key === "uanNo")?.message
      : null,
    pfNo: error
      ? error.details.find((d) => d.context.key === "pfNo")?.message
      : null,
    employeeType: error
      ? error.details.find((d) => d.context.key === "employeeType")?.message
      : null,
    officeMobileNumber: error
      ? error.details.find((d) => d.context.key === "officeMobileNumber")
          ?.message
      : null,
    personalMobileNumber: error
      ? error.details.find((d) => d.context.key === "personalMobileNumber")
          ?.message
      : null,
    dateOfJoining: error
      ? error.details.find((d) => d.context.key === "dateOfJoining")?.message
      : null,
    manager: error
      ? error.details.find((d) => d.context.key === "manager")?.message
      : null,
    designation: error
      ? error.details.find((d) => d.context.key === "designation")?.message
      : null,
    functionalArea: error
      ? error.details.find((d) => d.context.key === "functionalArea")?.message
      : null,
    bu: error
      ? error.details.find((d) => d.context.key === "bu")?.message
      : null,
    sbu: error
      ? error.details.find((d) => d.context.key === "sbu")?.message
      : null,
    shift: error
      ? error.details.find((d) => d.context.key === "shift")?.message
      : null,
    department: error
      ? error.details.find((d) => d.context.key === "department")?.message
      : null,
    company: error
      ? error.details.find((d) => d.context.key === "company")?.message
      : null,
    buHR: error
      ? error.details.find((d) => d.context.key === "buHR")?.message
      : null,
    buHead: error
      ? error.details.find((d) => d.context.key === "buHead")?.message
      : null,
    attendancePolicy: error
      ? error.details.find((d) => d.context.key === "attendancePolicy")?.message
      : null,
    companyLocation: error
      ? error.details.find((d) => d.context.key === "companyLocation")?.message
      : null,
    weekOff: error
      ? error.details.find((d) => d.context.key === "weekOff")?.message
      : null,
    gender: error
      ? error.details.find((d) => d.context.key === "gender")?.message
      : null,
    maritalStatus: error
      ? error.details.find((d) => d.context.key === "maritalStatus")?.message
      : null,
    maritalStatusSince: error
      ? error.details.find((d) => d.context.key === "maritalStatusSince")
          ?.message
      : null,
    nationality: error
      ? error.details.find((d) => d.context.key === "nationality")?.message
      : null,
    probation: error
      ? error.details.find((d) => d.context.key === "probation")?.message
      : null,
    dateOfBirth: error
      ? error.details.find((d) => d.context.key === "dateOfBirth")?.message
      : null,
    newCustomerName: error
      ? error.details.find((d) => d.context.key === "newCustomerName")?.message
      : null,
    iqTestApplicable: error
      ? error.details.find((d) => d.context.key === "iqTestApplicable")?.message
      : null,
    positionType: error
      ? error.details.find((d) => d.context.key === "positionType")?.message
      : null,
  };
  return errors;
};

const validateCompany = async (name) => {
  let isVerify = await db.companyMaster.findOne({
    where: { companyName: name },
    attributes: ["companyId"],
  });
  if (isVerify) {
    return { status: true, message: "", data: isVerify };
  } else {
    return { status: false, message: "Invalid company name", data: {} };
  }
};

const validateEmployeeType = async (name) => {
  let isVerify = await db.employeeTypeMaster.findOne({
    where: { emptypename: name },
    attributes: ["empTypeId"],
  });
  if (isVerify) {
    return { status: true, message: "", data: isVerify };
  } else {
    return { status: false, message: "Invalid employee type", data: {} };
  }
};

const validateProbation = async (name) => {
  let isVerify = await db.probationMaster.findOne({
    where: { probationName: name },
    attributes: ["probationId"],
  });
  if (isVerify) {
    return { status: true, message: "", data: isVerify };
  } else {
    return { status: false, message: "Invalid probation", data: {} };
  }
};

const validateManager = async (empCode) => {
  let isVerify = await db.employeeMaster.findOne({
    where: { empCode: empCode },
    attributes: ["id"],
  });
  if (isVerify) {
    return { status: true, message: "", data: isVerify };
  } else {
    return { status: false, message: "Invalid manager", data: {} };
  }
};

const validateDesignation = async (name) => {
  let isVerify = await db.designationMaster.findOne({
    where: { name: name },
    attributes: ["designationId"],
  });
  if (isVerify) {
    return { status: true, message: "", data: isVerify };
  } else {
    return { status: false, message: "Invalid designation", data: {} };
  }
};

const validateFunctionalArea = async (name) => {
  let isVerify = await db.functionalAreaMaster.findOne({
    where: { functionalAreaName: name },
    attributes: ["functionalAreaId"],
  });
  if (isVerify) {
    return { status: true, message: "", data: isVerify };
  } else {
    return { status: false, message: "Invalid functional area", data: {} };
  }
};

const validateBU = async (name, isValidCompany) => {
  let isVerify = await db.buMaster.findOne({
    where: { buName: name },
    attributes: ["buId"],
  });
  if (isVerify) {
    const headAndHrData = await db.buMapping.findOne({
      where: { buId: isVerify.buId, companyId: isValidCompany.data.companyId },
      include: [
        {
          model: db.employeeMaster,
          attributes: ["id", "name"],
          as: "buHeadData",
        },
        {
          model: db.employeeMaster,
          attributes: ["id", "name"],
          as: "buhrData",
        },
      ],
    });

    if (headAndHrData) {
      isVerify.buHead = headAndHrData.buHeadData.id;
      isVerify.buHR = headAndHrData.buhrData.id;
    }
    return { status: true, message: "", data: isVerify };
  } else {
    return { status: false, message: "Invalid BU", data: {} };
  }
};

const validateSBU = async (name) => {
  let isVerify = await db.sbuMaster.findOne({
    where: { sbuName: name },
    attributes: ["sbuId"],
  });
  if (isVerify) {
    return { status: true, message: "", data: isVerify };
  } else {
    return { status: false, message: "Invalid SBU", data: {} };
  }
};

const validateShift = async (name) => {
  if (name) {
    let isVerify = await db.shiftMaster.findOne({
      where: { shiftName: name },
      attributes: ["shiftId"],
    });
    if (isVerify) {
      return { status: true, message: "", data: isVerify };
    } else {
      return { status: false, message: "Invalid shift", data: {} };
    }
  } else {
    return { status: false, message: "", data: {} };
  }
};

const validateDepartment = async (name) => {
  let isVerify = await db.departmentMaster.findOne({
    where: { departmentName: name },
    attributes: ["departmentId"],
  });
  if (isVerify) {
    return { status: true, message: "", data: isVerify };
  } else {
    return { status: false, message: "Invalid department", data: {} };
  }
};

const validateAttendancePolicy = async (name) => {
  if (name) {
    let isVerify = await db.attendancePolicymaster.findOne({
      where: { policyName: name },
      attributes: ["attendancePolicyId"],
    });
    if (isVerify) {
      return { status: true, message: "", data: isVerify };
    } else {
      return { status: false, message: "Invalid attendance policy", data: {} };
    }
  } else {
    return { status: false, message: "", data: {} };
  }
};

const validateCompanyLocation = async (cityName, isValidCompany) => {
  if (cityName) {
    cityName = cityName.split(",");

    let isVerify = await db.cityMaster.findOne({
      where: { cityName: cityName[0] },
      attributes: ["cityId"],
    });
    if (isVerify) {
      isVerify = await db.companyLocationMaster.findOne({
        where: {
          cityId: isVerify.cityId,
          companyLocationCode: cityName[1].trim(),
          companyId: isValidCompany.data?.companyId,
        },
        attributes: ["companyLocationId"],
      });
      if (isVerify) {
        return { status: true, message: "", data: isVerify };
      } else {
        return {
          status: false,
          message: "This city has not been mapped.",
          data: {},
        };
      }
    } else {
      return { status: false, message: "Invalid city", data: {} };
    }
  } else {
    return { status: false, message: "Invalid city", data: {} };
  }
};

const validateWeekOff = async (name) => {
  if (name) {
    let isVerify = await db.weekOffMaster.findOne({
      where: { weekOffName: name },
      attributes: ["weekOffId"],
    });
    if (isVerify) {
      return { status: true, message: "", message: "", data: isVerify };
    } else {
      return { status: false, message: "Invalid week off", data: {} };
    }
  } else {
    return { status: false, message: "", data: {} };
  }
};

const validateNewCustomerName = async (name) => {
  if (name) {
    let isVerify = await db.newCustomerNameMaster.findOne({
      where: { newCustomerName: name },
      attributes: ["newCustomerNameId"],
    });
    if (isVerify) {
      return { status: true, message: "", message: "", data: isVerify };
    } else {
      return {
        status: false,
        message: "Invalid new customer id off",
        data: {},
      };
    }
  } else {
    return { status: false, message: "", data: {} };
  }
};

const validateJobLevel = async (name) => {
  let isVerify = await db.jobLevelMaster.findOne({
    where: { jobLevelName: name },
    attributes: ["jobLevelId"],
  });
  if (isVerify) {
    return { status: true, message: "", data: isVerify };
  } else {
    return { status: false, message: "Invalid job level", data: {} };
  }
};

const validateEmployee = async (personalMobileNumber, email) => {
  let isVerify = await db.employeeMaster.findOne({
    where: {
      [Op.or]: [
        { personalMobileNumber: personalMobileNumber },
        { email: email },
      ],
    },
    attributes: ["id"],
  });
  if (isVerify) {
    return { status: false, message: "User already exist", data: {} };
  } else {
    isVerify = await db.employeeStagingMaster.findOne({
      where: {
        [Op.or]: [
          { personalMobileNumber: personalMobileNumber },
          { email: email },
        ],
      },
      attributes: ["id"],
    });
    if (isVerify) {
      return { status: false, message: "User already exist", data: {} };
    } else {
      return { status: true, message: "", data: {} };
    }
  }
};

// Function to convert Excel serial date to JS Date
const convertExcelDate = (serial) => {
  const date = new Date((serial - 25569) * 86400 * 1000);
  return moment(date).format("YYYY-MM-DD");
};

const replaceNAWithNull = (value) => {
  return value === "NA" || value === undefined || value === "" || value === null
    ? ""
    : value; // Replace 'NA' with ''
};

export default new MasterController();
