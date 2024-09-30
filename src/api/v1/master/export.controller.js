import { Op, where } from "sequelize";
import db from "../../../config/db.config.js";
import respHelper from "../../../helper/respHelper.js";
import xlsx from "json-as-xlsx";
import fs from "fs";
import client from "../../../config/redisDb.config.js";
import pkg from "xlsx";
import bcrypt from "bcrypt";
import moment from "moment";
//const {readFile} = pkg
import helper from "../../../helper/helper.js";
//const XLSX = require('xlsx');

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

  async attendanceReport(req, res) {
    try {
      const { startDate, endDate , search } = req.query;

      const attendanceData = await db.attendanceMaster.findAll({
        attributes: [
          "attendanceDate",
          "attendanceStatus",
          "attendancePresentStatus",
          "attendancePunchInLocation",
          "attendancePunchOutLocation",
          "attendancePunchInTime",
          "attendancePunchOutTime",
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
              isActive:1,
              ...(search && {
                [Op.or]: [
                  { empCode: { [Op.like]: `%${search}%` } },
                  { name: { [Op.like]: `%${search}%` } },
                  { email: { [Op.like]: `%${search}%` } },
                ],
              }),
            },
            include: [
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
        ],
        raw: true,
      });

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
          functionArea:
            record["employee.functionalareamaster.functionalAreaName"] +
            " " +
            "(" +
            record["employee.functionalareamaster.functionalAreaCode"] +
            ")",
          manager:
          (record["employee.managerData.name"] ? 
            record["employee.managerData.name"] + " (" + record["employee.managerData.empCode"] + ")" 
            : "-"),
          attendanceDate: record.attendanceDate,
          attendanceStatus: record.attendanceStatus,
          attendancePresentStatus: record.attendancePresentStatus,
          attendancePunchInTime: record.attendancePunchInTime || "N/A",
          attendancePunchInLocation: record.attendancePunchInLocation,
          attendancePunchOutTime: record.attendancePunchOutTime || "N/A",
          attendancePunchOutLocation:
            record.attendancePunchOutLocation || "N/A",
          status:"APPROVED",  
          shiftName: record["shiftsmaster.shiftName"],
          shiftStartTime: record["shiftsmaster.shiftStartTime"],
          shiftEndTime: record["shiftsmaster.shiftEndTime"],
          attendancePolicyName: record["attendancePolicymaster.policyName"],
          attendancePolicyCode:
            record["attendancePolicymaster.policyCode"] || "N/A",
          weekOffName: record["weekOffMaster.weekOffName"] || "N/A",
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
              { label: "BU Name", value: "buName" },
              { label: "SBU Name", value: "sbuName" },
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
              { label: "Punch Out Time", value: "attendancePunchOutTime" },
              {
                label: "Punch Out Location",
                value: "attendancePunchOutLocation",
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }

async attendanceSummary(req, res) {
  try {
    const { startDate, endDate, search } = req.query;
    const fromDate = moment(startDate, "YYYY-MM-DD"); 
    const toDate = moment(endDate, "YYYY-MM-DD");

    const totalDays = toDate.diff(fromDate, "days") + 1;

    const attendanceData = await db.attendanceMaster.findAll({
      attributes: [
        "employeeId",
        "attendanceDate",
        "attendancePresentStatus",
      ],
      where: {
        //employeeId: 65,
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
          attributes: ["id", "name", "empCode", "weekOffId", "companyLocationId"],
          where: {
            isActive:1,
            ...(search && {
              [Op.or]: [
                { empCode: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
              ],
            }),
          },
        },
        {
          model: db.regularizationMaster,
          as: "latest_Regularization_Request",
          attributes: ["regularizeId"],
        },
      ],
    });

    const employeeIds = [...new Set(attendanceData.map((record) => record.employeeId))];
    const finalData = [];
    const today = moment().startOf("day");

    for (const employeeId of employeeIds) {
      const employeeRecords = attendanceData.filter(
        (record) => record.employeeId === employeeId
      );

      if (employeeRecords.length === 0) continue;

      const employeeRecord = {
        empId: employeeRecords[0].employee?.id || null,
        name: employeeRecords[0].employee?.name || 'Unknown',
        empCode: employeeRecords[0].employee?.empCode || 'N/A',
        weekOffId: employeeRecords[0].employee?.weekOffId || 0,
        companyLocationId: employeeRecords[0].employee?.companyLocationId || 0,
      };

      const dayRecords = {};
      let attendanceCount = { P: 0, A: 0, SA: 0, R: 0, H: 0, W: 0, L: 0, U: 0 };

      // Fetch approved leave transactions for the employee
      const leaveTransactions = await db.employeeLeaveTransactions.findAll({
        attributes: ["employeeId", "leaveAutoId", "leaveCount", "appliedFor"],
        where: {
          employeeId: employeeRecord.empId,
          [Op.or]: [
            { source: { [Op.ne]: 'system_generated' } },  // Source is not 'system_generated'
            { source: null }  // Source is null
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
              attendanceCount.P++;

              // Check for regularization
              if (attendanceRecord.latest_Regularization_Request.length > 0) {
                dayRecords[dayKey] = `${dayRecords[dayKey]},R`; // Append R for regularization
                attendanceCount.R++;
              }

              // If there was a leave, append it after regularization
              if (leave) {
                // Determine the leave status based on leaveCount and leaveAutoId
                let leaveStatus = leave.leaveCount === '1.0' ? 'L' : (leave.leaveAutoId == 6 ? '0.5U' : '0.5L');
                dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                //attendanceCount.L++;
                attendanceCount.L += parseFloat(leave.leaveCount);
              }

              if (isDayWorking === "H") {
                dayRecords[dayKey] = `${dayRecords[dayKey]},H`; // Append R for regularization
                // attendanceCount.R++;
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
                let leaveStatus = leave.leaveCount === '1.0' ? 'L' : (leave.leaveAutoId == 6 ? '0.5U' : '0.5L');
                dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                //attendanceCount.L++;
                attendanceCount.L += parseFloat(leave.leaveCount);
              }

              if (isDayWorking === "H") {
                dayRecords[dayKey] = `${dayRecords[dayKey]},H`; // Append R for regularization
                // attendanceCount.R++;
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
                let leaveStatus = leave.leaveCount === '1.0' ? 'L' : (leave.leaveAutoId == 6 ? '0.5U' : '0.5L');
                dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
               // attendanceCount.L++;
               attendanceCount.L += parseFloat(leave.leaveCount);
              }

              if (isDayWorking === "H") {
                dayRecords[dayKey] = `${dayRecords[dayKey]},H`; // Append R for regularization
                // attendanceCount.R++;
              }

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
              attendanceCount.P++;

              // Check for regularization
              if (attendanceRecord.latest_Regularization_Request.length > 0) {
                dayRecords[dayKey] = `${dayRecords[dayKey]},R`; // Append R for regularization
                attendanceCount.R++;
              }

              // If there was a leave, append it after regularization
              if (leave) {
                // Determine the leave status based on leaveCount and leaveAutoId
                let leaveStatus = leave.leaveCount === '1.0' ? 'L' : (leave.leaveAutoId == 6 ? '0.5U' : '0.5L');
                dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                //attendanceCount.L++;
                attendanceCount.L += parseFloat(leave.leaveCount);
              }

              if (isDayWorking === "W") {
                dayRecords[dayKey] = `${dayRecords[dayKey]},W`; // Append R for regularization
                // attendanceCount.R++;
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
                let leaveStatus = leave.leaveCount === '1.0' ? 'L' : (leave.leaveAutoId == 6 ? '0.5U' : '0.5L');
                dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
               // attendanceCount.L++;
               attendanceCount.L += parseFloat(leave.leaveCount);
              }

              if (isDayWorking === "W") {
                dayRecords[dayKey] = `${dayRecords[dayKey]},W`; // Append R for regularization
                // attendanceCount.R++;
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
                let leaveStatus = leave.leaveCount === '1.0' ? 'L' : (leave.leaveAutoId == 6 ? '0.5U' : '0.5L');
                dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                //attendanceCount.L++;
                attendanceCount.L += parseFloat(leave.leaveCount);
              }

              if (isDayWorking === "W") {
                dayRecords[dayKey] = `${dayRecords[dayKey]},W`; // Append R for regularization
                // attendanceCount.R++;
              }

            } else {
              dayRecords[dayKey] = "W"; // Set to W for week off
              attendanceCount.W++;
            }
          }else{
              dayRecords[dayKey] = "W"; // Set to W for week off
              attendanceCount.W++;
          }
        } 
        else {
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
                  let leaveStatus = leave.leaveCount === '1.0' ? 'L' : (leave.leaveAutoId == 6 ? '0.5U' : '0.5L');
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
                  let leaveStatus = leave.leaveCount === '1.0' ? 'L' : (leave.leaveAutoId == 6 ? '0.5U' : '0.5L');
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
                  let leaveStatus = leave.leaveCount === '1.0' ? 'L' : (leave.leaveAutoId == 6 ? '0.5U' : '0.5L');
                  dayRecords[dayKey] = `${dayRecords[dayKey]},${leaveStatus}`; // Append leave status
                  //attendanceCount.L++;
                  attendanceCount.L += parseFloat(leave.leaveCount);
                }
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
        Payroll:attendanceCount.P,
        PayableDays: attendanceCount.P + attendanceCount.W - attendanceCount.SA
      };

      finalData.push(orderedEmployeeRecord);
    }

    if (finalData.length > 0) {
      const timestamp = Date.now();
      const dayColumns = [];

      for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
        const currentDay = moment(fromDate).add(dayOffset, "days");
        dayColumns.push({ label: currentDay.format("DD-MMM"), value: currentDay.format("DD") });
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
        "Content-disposition": `attachment; filename=attendance_${timestamp}.xlsx`,
      });
      return res.end(buffer);
    } else {
      return respHelper(res, {
        status: 404,
        message: "Data not found",
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

}

export default new MasterController();




