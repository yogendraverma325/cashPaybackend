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
      const { fromDate, toDate } = req.query;

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
            [db.Sequelize.Op.between]: [fromDate, toDate],
          },
        },
        include: [
          {
            model: db.employeeMaster,
            attributes: ["id", "name", "empCode"],
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
            record["employee.managerData.name"] +
            " " +
            "(" +
            record["employee.managerData.empCode"] +
            ")",
          attendanceDate: record.attendanceDate,
          attendanceStatus: record.attendanceStatus,
          attendancePresentStatus: record.attendancePresentStatus,
          attendancePunchInTime: record.attendancePunchInTime || "N/A",
          attendancePunchInLocation: record.attendancePunchInLocation,
          attendancePunchOutTime: record.attendancePunchOutTime || "N/A",
          attendancePunchOutLocation:
            record.attendancePunchOutLocation || "N/A",
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
// working fine for form date to to Date
// async attendanceSummary(req, res) {
//   try {
//     const { year, month } = req.params;

//     // Define start and end dates for the month
//     const fromDate = moment(`${year}-${month}-01`, "YYYY-MM-DD");
//     const toDate = moment(`${year}-${month}-22`, "YYYY-MM-DD");
//     const totalDays = toDate.date(); // Get total number of days in the month

//     // Fetch all attendance data for the specified month
//     const attendanceData = await db.attendanceMaster.findAll({
//       attributes: [
//         "employeeId",
//         "attendanceDate",
//         "attendanceStatus",
//         "attendancePresentStatus",
//       ],
//       where: {
//         //employeeId: 1119, // Adjust as needed
//         attendanceDate: {
//           [db.Sequelize.Op.between]: [
//             fromDate.format("YYYY-MM-DD"),
//             toDate.format("YYYY-MM-DD"),
//           ],
//         },
//       },
//       include: [
//         {
//           model: db.employeeMaster,
//           attributes: ["id", "name", "empCode","weekOfId"],
//         },
//         {
//           model: db.regularizationMaster,
//           as: "latest_Regularization_Request",
//           attributes: ["regularizeId"], // Adjust based on schema
//         },
//       ],
//     });

//     // Create a unique list of employee IDs from the attendance data
//     const employeeIds = [
//       ...new Set(attendanceData.map((record) => record.employeeId)),
//     ];

//     const finalData = [];

//     // Use for loop to process each employee's data sequentially
//     for (let i = 0; i < employeeIds.length; i++) {
//       const employeeId = employeeIds[i];

//       const employeeRecords = attendanceData.filter(
//         (record) => record.employeeId === employeeId
//       );

//       // Initialize employee data, starting with name and empCode first
//       const employeeRecord = {
//         name: employeeRecords[0].employee.name,
//         empCode: employeeRecords[0].employee.empCode,
//       };

//       // Initialize an object for all days, with default status 'A' (Absent)
//       const dayRecords = {};
//       for (let day = 1; day <= totalDays; day++) {
//         const dayKey = day > totalDays? `0${day}` : `${day}`;
//         dayRecords[dayKey] = "A"; // Default to 'A' (Absent)
      
//       }

//       // Process each attendance record for the employee
//       employeeRecords.forEach((record) => {
//         const day = moment(record.attendanceDate).format("DD");
//         let status = "A"; // Default to 'A' (Absent)

//         // Update status based on attendancePresentStatus
//         if (record.attendancePresentStatus === "present") {
//           status = "P";
//         } else if (record.attendancePresentStatus === "singlePunchAbsent") {
//           status = "SA";
//         } else if (record.attendancePresentStatus === "absent") {
//           status = "A";
//         }
// console.log("record.latest_Regularization_Request",record.latest_Regularization_Request.length)
//         // Modify status if there are regularization requests
//         if (record.latest_Regularization_Request.length > 0) {
//           if (status === "P") {
//             status = "P,R";
//           } else if (status === "SA") {
//             status = "SA,R";
//           } else if (status === "A") {
//             status = "A,R";
//           }
//         }
//         dayRecords[day] = status;
//       });

//       // Combine name, empCode, and the ordered days
//       const orderedEmployeeRecord = {
//         name: employeeRecord.name,
//         empCode: employeeRecord.empCode,
//         ...dayRecords,
//       };
//       finalData.push(orderedEmployeeRecord); // Push each employee record into finalData array
//     }

//     if (finalData.length > 0) {
//        const timestamp = Date.now();
//       // const data = [
//       //   {
//       //     sheet: "Attendance Summary",
//       //     columns: [
//       //       { label: "Employee Code", value: "empCode" },
//       //       { label: "Employee Name", value: "name" },
//       //       { label: "01.", value: "1" },
//       //       { label: "02.", value: "2" },
//       //       { label: "03.", value: "3" },
//       //       { label: "04.", value: "4" },
//       //       { label: "05.", value: "5" },
//       //       { label: "06.", value: "6" },
//       //       { label: "07.", value: "7" },
//       //       { label: "08.", value: "8" },
//       //       { label: "09.", value: "9" },
//       //       { label: "10.", value: "10" },
//       //       { label: "11.", value: "11" },
//       //       { label: "12.", value: "12" },
//       //       { label: "13.", value: "13" },
//       //       { label: "14.", value: "14" },
//       //       { label: "15.", value: "15" },
//       //       { label: "16.", value: "16" },
//       //       { label: "17.", value: "17" },
//       //       { label: "18.", value: "18" },
//       //       { label: "19.", value: "19" },
//       //       { label: "20.", value: "20" },
//       //       { label: "21.", value: "21" },
//       //       { label: "22.", value: "22" },
//       //       { label: "23.", value: "23" },
//       //       { label: "24.", value: "24" },
//       //       { label: "25.", value: "25" },
//       //       { label: "26.", value: "26" },
//       //       { label: "27.", value: "27" },
//       //       { label: "28.", value: "28" },
//       //       { label: "29.", value: "29" },
//       //       { label: "30.", value: "30" },
//       //       { label: "31.", value: "31" }
//       //     ],
//       //     content: finalData,
//       //   },
//       // ];
//       // Dynamically generate columns for each day of the month
//       const dayColumns = [];
//       for (let day = 1; day <= totalDays; day++) {
//         const dayLabel = day < 10 ? `0${day}.` : `${day}.`;
//         dayColumns.push({ label: dayLabel, value: `${day}` });
//       }

//       const data = [
//         {
//           sheet: "Attendance Summary",
//           columns: [
//             { label: "Employee Code", value: "empCode" }, // Fixed column
//             { label: "Employee Name", value: "name" },    // Fixed column
//             ...dayColumns,                                // Dynamic day columns
//           ],
//           content: finalData,
//         },
//       ];
      

//       let settings = {
//         writeOptions: {
//           type: "buffer",
//           bookType: "xlsx",
//           RTL: true,
//         },
//       };
//       const buffer = xlsx(data, settings);
//       res.writeHead(200, {
//         "Content-Type": "application/octet-stream",
//         "Content-disposition": `attachment; filename=attendance_${timestamp}.xlsx`,
//       });
//       res.end(buffer);
//     }
//     else{
//         return respHelper(res, {
//         status: 200,
//         message: "data not found",
//       });
//     }
//     // Return the processed final data
//     // return respHelper(res, {
//     //   status: 200,
//     //   data: finalData,
//     // });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: false,
//       message: "Internal Server Error",
//     });
//   }
// }

// async attendanceSummary(req, res) {
//   try {
//     const { year, month } = req.params;

//     // Define start and end dates for the month
//     const fromDate = moment(`${year}-${month}-01`, "YYYY-MM-DD");
//     const toDate = moment(`${year}-${month}-22`, "YYYY-MM-DD");
//     const totalDays = toDate.date(); // Get total number of days in the month

//     // Fetch all attendance data for the specified month
//     const attendanceData = await db.attendanceMaster.findAll({
//       attributes: [
//         "employeeId",
//         "attendanceDate",
//         "attendanceStatus",
//         "attendancePresentStatus",
//       ],
//       where: {
//         //employeeId: 1119, // Adjust as needed
//         attendanceDate: {
//           [db.Sequelize.Op.between]: [
//             fromDate.format("YYYY-MM-DD"),
//             toDate.format("YYYY-MM-DD"),
//           ],
//         },
//       },
//       include: [
//         {
//           model: db.employeeMaster,
//           attributes: ["id", "name", "empCode","weekOfId"],
//         },
//         {
//           model: db.regularizationMaster,
//           as: "latest_Regularization_Request",
//           attributes: ["regularizeId"], // Adjust based on schema
//         },
//       ],
//     });

//     // Create a unique list of employee IDs from the attendance data
//     const employeeIds = [
//       ...new Set(attendanceData.map((record) => record.employeeId)),
//     ];

//     const finalData = [];

//     // Use for loop to process each employee's data sequentially
//     for (let i = 0; i < employeeIds.length; i++) {
//       const employeeId = employeeIds[i];

//       const employeeRecords = attendanceData.filter(
//         (record) => record.employeeId === employeeId
//       );

//       // Initialize employee data, starting with name and empCode first
//       const employeeRecord = {
//         name: employeeRecords[0].employee.name,
//         empCode: employeeRecords[0].employee.empCode,
//       };

//       // Initialize an object for all days, with default status 'A' (Absent)
//       const dayRecords = {};
//       for (let day = 1; day <= totalDays; day++) {
//         const dayKey = day > totalDays? `0${day}` : `${day}`;
//         dayRecords[dayKey] = "A"; // Default to 'A' (Absent)
//       }

//       // Process each attendance record for the employee
//       employeeRecords.forEach((record) => {
//         const day = moment(record.attendanceDate).format("DD");
//         let status = "A"; // Default to 'A' (Absent)

//         // Update status based on attendancePresentStatus
//         if (record.attendancePresentStatus === "present") {
//           status = "P";
//         } else if (record.attendancePresentStatus === "singlePunchAbsent") {
//           status = "SA";
//         } else if (record.attendancePresentStatus === "absent") {
//           status = "A";
//         }
//         // Modify status if there are regularization requests
//         if (record.latest_Regularization_Request.length > 0) {
//           if (status === "P") {
//             status = "P,R";
//           } else if (status === "SA") {
//             status = "SA,R";
//           } else if (status === "A") {
//             status = "A,R";
//           }
//         }
//         dayRecords[day] = status;
//       });

//       // Combine name, empCode, and the ordered days
//       const orderedEmployeeRecord = {
//         name: employeeRecord.name,
//         empCode: employeeRecord.empCode,
//         ...dayRecords,
//       };
//       finalData.push(orderedEmployeeRecord); // Push each employee record into finalData array
//     }

//     if (finalData.length > 0) {
//        const timestamp = Date.now();
//       // Dynamically generate columns for each day of the month
//       const dayColumns = [];
//       for (let day = 1; day <= totalDays; day++) {
//         const dayLabel = day < 10 ? `0${day}.` : `${day}.`;
//         dayColumns.push({ label: dayLabel, value: `${day}` });
//       }

//       const data = [
//         {
//           sheet: "Attendance Summary",
//           columns: [
//             { label: "Employee Code", value: "empCode" }, // Fixed column
//             { label: "Employee Name", value: "name" },    // Fixed column
//             ...dayColumns,                                // Dynamic day columns
//           ],
//           content: finalData,
//         },
//       ];
      

//       let settings = {
//         writeOptions: {
//           type: "buffer",
//           bookType: "xlsx",
//           RTL: true,
//         },
//       };
//       const buffer = xlsx(data, settings);
//       res.writeHead(200, {
//         "Content-Type": "application/octet-stream",
//         "Content-disposition": `attachment; filename=attendance_${timestamp}.xlsx`,
//       });
//       res.end(buffer);
//     }
//     else{
//         return respHelper(res, {
//         status: 200,
//         message: "data not found",
//       });
//     }
//     // Return the processed final data
//     // return respHelper(res, {
//     //   status: 200,
//     //   data: finalData,
//     // });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: false,
//       message: "Internal Server Error",
//     });
//   }
// }
async attendanceSummary(req, res) {
  try {
    const { year, month } = req.params;

    // Define start and end dates for the month
    const fromDate = moment(`${year}-${month}-01`, "YYYY-MM-DD");
    const toDate = moment(`${year}-${month}-22`, "YYYY-MM-DD");
    const totalDays = toDate.date(); // Get total number of days in the month

    // Fetch all attendance data for the specified month
    const attendanceData = await db.attendanceMaster.findAll({
      attributes: [
        "employeeId",
        "attendanceDate",
        "attendanceStatus",
        "attendancePresentStatus",
      ],
      where: {
        //employeeId: 1119, // Adjust as needed
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
          attributes: ["id", "name", "empCode"],
        },
        {
          model: db.regularizationMaster,
          as: "latest_Regularization_Request",
          attributes: ["regularizeId"], // Adjust based on schema
        },
      ],
    });

    // Create a unique list of employee IDs from the attendance data
    const employeeIds = [
      ...new Set(attendanceData.map((record) => record.employeeId)),
    ];

    const finalData = [];

    // Use for loop to process each employee's data sequentially
    for (let i = 0; i < employeeIds.length; i++) {
      const employeeId = employeeIds[i];

      const employeeRecords = attendanceData.filter(
        (record) => record.employeeId === employeeId
      );

      // Initialize employee data, starting with name and empCode first
      const employeeRecord = {
        name: employeeRecords[0].employee.name,
        empCode: employeeRecords[0].employee.empCode,
      };

      // Initialize an object for all days, with default status 'A' (Absent)
      const dayRecords = {};
      let attendanceCount = {
        P: 0,
        A: 0,
        SA: 0,
        R: 0 // To track regularization requests
      };

      for (let day = 1; day <= totalDays; day++) {
        const dayKey = day < 10 ? `0${day}` : `${day}`;
        dayRecords[dayKey] = "A"; // Default to 'A' (Absent)
      }

      // Process each attendance record for the employee
      employeeRecords.forEach((record) => {
        const day = moment(record.attendanceDate).format("DD");
        let status = "A"; // Default to 'A' (Absent)

        // Update status based on attendancePresentStatus
        if (record.attendancePresentStatus === "present") {
          status = "P";
          attendanceCount.P++; // Increment Present count
        } else if (record.attendancePresentStatus === "singlePunchAbsent") {
          status = "SA";
          attendanceCount.SA++; // Increment Single Punch Absent count
        } else if (record.attendancePresentStatus === "absent") {
          status = "A";
          attendanceCount.A++; // Increment Absent count
        }

        // Modify status if there are regularization requests
        if (record.latest_Regularization_Request) {
          attendanceCount.R++; // Increment Regularization count
          if (status === "P") {
            status = "P,R";
          } else if (status === "SA") {
            status = "SA,R";
          } else if (status === "A") {
            status = "A,R";
          }
        }
        dayRecords[day] = status;
      });

      // Combine name, empCode, ordered days, and the attendance counts as separate fields
      const orderedEmployeeRecord = {
        name: employeeRecord.name,
        empCode: employeeRecord.empCode,
        ...dayRecords, // Spread day records to ensure they come after name and empCode
        P: attendanceCount.P,    // Present count
        A: attendanceCount.A,    // Absent count
        SA: attendanceCount.SA,  // Single Punch Absent count
        R: attendanceCount.R,    // Regularization count
      };

      finalData.push(orderedEmployeeRecord); // Push each employee record into finalData array
    }

    if (finalData.length > 0) {
      const timestamp = Date.now();

      // Dynamically generate columns for each day of the month
      const dayColumns = [];
      for (let day = 1; day <= totalDays; day++) {
        const dayLabel = day < 10 ? `0${day}.` : `${day}.`;
        dayColumns.push({ label: dayLabel, value: `${day}` });
      }

      const data = [
        {
          sheet: "Attendance Summary",
          columns: [
            { label: "Employee Code", value: "empCode" }, // Fixed column
            { label: "Employee Name", value: "name" },    // Fixed column
            ...dayColumns,                                // Dynamic day columns
            { label: "P", value: "P" },                   // Present count column
            { label: "A", value: "A" },                   // Absent count column
            { label: "SA", value: "SA" },                 // Single Punch Absent count column
            { label: "R", value: "R" },                   // Regularization count column
          ],
          content: finalData,
        },
      ];

      let settings = {
        writeOptions: {
          type: "buffer",
          bookType: "xlsx",
          RTL: true,
        },
      };

      const buffer = xlsx(data, settings);
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-disposition": `attachment; filename=attendance_${timestamp}.xlsx`,
      });
      res.end(buffer);
    } else {
      return respHelper(res, {
        status: 200,
        message: "data not found",
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

