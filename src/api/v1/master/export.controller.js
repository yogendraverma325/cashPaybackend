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

const maritalStatusOptions = { 'Married': 1, 'Single': 2, 'Divorced': 3, 'Separated': 4, 'Widowed': 5, 'Others': 6 };


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
            attributes: ["educationDegree", "educationSpecialisation", "educationInstitute", "educationRemark",
              "educationStartDate", "educationCompletionDate"],
          },
          {
            model: db.familyDetails,
            attributes: ['name', 'dob', 'gender', 'mobileNo', 'relationWithEmp'],
            as: 'employeefamilydetails'
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
            relationWithEmp: family.relationWithEmp ? family.relationWithEmp : "",
          };
          familyDetails.push(extractedFamily);
        });
      })

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
              { email: row['Direct Manager Email Id'] },
              { empCode: row['Direct Manager Code'] },
            ],
          },
          transaction // Pass transaction object
        });

        if (existUser) {
          arrMissingData.push(row);

        } else {
          const salt = await bcrypt.genSalt(10);
          const fullName = row["Direct Manager Name"].split(' ');
          let data = {
            empCode: row['Direct Manager Code'],
            name: row["Direct Manager Name"],
            email: row['Direct Manager Email Id'],
            officeMobileNumber: row['officeMobileNumber'],
            personalMobileNumber: row['personalMobileNumber'],
            firstName: fullName[0],
            lastName: fullName.slice(1).join(' '),
            isActive: 1,
            role_id: 3,
            password: await bcrypt.hash("test1234", salt),
          };

          arrPoper.push(data);
          // await db.employeeMaster.create(data, { transaction }); // Add transaction object here
        }
      }

      await db.employeeMaster.bulkCreate(arrPoper)
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

  async onboardingEmployeeImport(req, res) {
    const transaction = await db.sequelize.transaction(); // Start the transaction
    try {
      // Read Excel file
      if (!req.file) {
        return respHelper(res, {
          status: 400,
          msg: "File is required!"
        });
      }
      else {
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
            const { error } = await validator.importOnboardEmployeeSchema.validate(obj);

            const isValidCompany = await validateCompany(obj.company);
            const isValidEmployeeType = await validateEmployeeType(obj.employeeType);
            const isValidProbation = await validateProbation(obj.probation);
            const isValidManager = await validateManager(obj.manager);
            const isValidDesignation = await validateDesignation(obj.designation);
            const isValidFunctionalArea = await validateFunctionalArea(obj.functionalArea);
            const isValidBU = await validateBU(obj.bu, isValidCompany);
            const isValidSBU = await validateSBU(obj.sbu);
            const isValidShift = await validateShift(obj.shift);
            const isValidDepartment = await validateDepartment(obj.department);
            const isValidAttendancePolicy = await validateAttendancePolicy(obj.attendancePolicy);
            const isValidCompanyLocation = await validateCompanyLocation(obj.companyLocation, isValidCompany);
            const isValidWeekOff = await validateWeekOff(obj.weekOff);
            const isValidNewCustomerName = await validateNewCustomerName(obj.newCustomerName);
            const isValidJobLevel = await validateJobLevel(obj.jobLevel);
            const isValidateEmployee = await validateEmployee(obj.personalMobileNumber, obj.email);

            if (!error && isValidCompany.status && isValidEmployeeType.status && isValidProbation.status && isValidManager.status && isValidDesignation.status &&
              isValidFunctionalArea.status && isValidBU.status && isValidSBU.status && isValidCompanyLocation.status && isValidDepartment.status 
              && isValidateEmployee.status && isValidJobLevel.status) {
              
              // prepare employee object
              let newEmployee = {
                name: `${obj.firstName} ${obj.middleName} ${obj.lastName}`,
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
                iqTestApplicable: (obj.iqTestApplicable == 'Yes') ? 1 : 0,
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
                attendancePolicyId: isValidAttendancePolicy.data?.attendancePolicyId,
                companyLocationId: isValidCompanyLocation.data.companyLocationId,
                weekOffId: isValidWeekOff.data?.weekOffId,
                newCustomerNameId: isValidNewCustomerName.data?.newCustomerNameId,
                jobLevelId: isValidJobLevel.data?.jobLevelId
              }

              const password = await helper.generateRandomPassword();
              const encryptedPassword = await helper.encryptPassword(password);
              newEmployee.password = encryptedPassword;
              newEmployee.role_id = 3;
              newEmployee.isTempPassword = 1;
              
              validEmployees.push({ ...newEmployee, index: employee.Index });
              console.log(newEmployee)
              const createdEmployees = await db.employeeStagingMaster.create(newEmployee);
            }
            else {
              const errors = handleErrors(error);
              const masterErrors = {
                index: employee.Index,
                ...errors,
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
                alreadyExist: isValidateEmployee.message
              }
              invalidEmployees.push(masterErrors);
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

        if(failureData.length > 0) {
          const errorRecords = failureData.map((record, index) => (
            Object.entries(record)
              .filter(([key, value]) => value && key !== 'index')
              .map(([key, value]) => {
                return { index: record.index, error: value }
              })
            ));
          console.log(errorRecords)
          // let data = [
          //   {
          //       sheet: `Employee Excel Error Reports`,
          //       columns: [
          //           { label: 'Index', value: (row) => row.user ? row.user.name || "" : "" },
          //           { label: 'Organization / Feeder Name', value: (row) => row.user ? row.user.name || "" : "" }
          //       ],
          //       content: response.data
          //   }
          // ];

          // let settings = {
          //     writeOptions: {
          //         type: 'buffer',
          //         bookType: 'xlsx'
          //     }
          // }

          // const buffer = xlsx(data, settings);
          // let milisecond = moment().valueOf().toString();
          // res.writeHead(200, {
          //     'Content-Type': 'application/octet-stream',
          //     "Content-disposition": `attachment; filename=${sub_category_name}_Reports_${milisecond}.xlsx`
          // });
          // res.end(buffer);
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
    }
    catch (error) {
      await transaction.rollback(); // Rollback the transaction in case of an error
      console.log(error);
      return respHelper(res, {
        status: 500,
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
    maritalStatusSince: (obj.Marital_Since != 'NA' && obj.Marital_Since != '') ? convertExcelDate(obj.Marital_Since) : '',
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
    jobLevel: obj.Job_Level_Name
  }
}

const handleErrors = (error) => {
  const errors = {
    name: error ? error.details.find(d => d.context.key === 'name')?.message : null,
    email: error ? error.details.find(d => d.context.key === 'email')?.message : null,
    personalEmail: error ? error.details.find(d => d.context.key === 'personalEmail')?.message : null,
    firstName: error ? error.details.find(d => d.context.key === 'firstName')?.message : null,
    panNo: error ? error.details.find(d => d.context.key === 'panNo')?.message : null,
    uanNo: error ? error.details.find(d => d.context.key === 'uanNo')?.message : null,
    pfNo: error ? error.details.find(d => d.context.key === 'pfNo')?.message : null,
    employeeType: error ? error.details.find(d => d.context.key === 'employeeType')?.message : null,
    officeMobileNumber: error ? error.details.find(d => d.context.key === 'officeMobileNumber')?.message : null,
    personalMobileNumber: error ? error.details.find(d => d.context.key === 'personalMobileNumber')?.message : null,
    dateOfJoining: error ? error.details.find(d => d.context.key === 'dateOfJoining')?.message : null,
    manager: error ? error.details.find(d => d.context.key === 'manager')?.message : null,
    designation: error ? error.details.find(d => d.context.key === 'designation')?.message : null,
    functionalArea: error ? error.details.find(d => d.context.key === 'functionalArea')?.message : null,
    bu: error ? error.details.find(d => d.context.key === 'bu')?.message : null,
    sbu: error ? error.details.find(d => d.context.key === 'sbu')?.message : null,
    shift: error ? error.details.find(d => d.context.key === 'shift')?.message : null,
    department: error ? error.details.find(d => d.context.key === 'department')?.message : null,
    company: error ? error.details.find(d => d.context.key === 'company')?.message : null,
    buHR: error ? error.details.find(d => d.context.key === 'buHR')?.message : null,
    buHead: error ? error.details.find(d => d.context.key === 'buHead')?.message : null,
    attendancePolicy: error ? error.details.find(d => d.context.key === 'attendancePolicy')?.message : null,
    companyLocation: error ? error.details.find(d => d.context.key === 'companyLocation')?.message : null,
    weekOff: error ? error.details.find(d => d.context.key === 'weekOff')?.message : null,
    gender: error ? error.details.find(d => d.context.key === 'gender')?.message : null,
    maritalStatus: error ? error.details.find(d => d.context.key === 'maritalStatus')?.message : null,
    maritalStatusSince: error ? error.details.find(d => d.context.key === 'maritalStatusSince')?.message : null,
    nationality: error ? error.details.find(d => d.context.key === 'nationality')?.message : null,
    probation: error ? error.details.find(d => d.context.key === 'probation')?.message : null,
    dateOfBirth: error ? error.details.find(d => d.context.key === 'dateOfBirth')?.message : null,
    newCustomerName: error ? error.details.find(d => d.context.key === 'newCustomerName')?.message : null,
    iqTestApplicable: error ? error.details.find(d => d.context.key === 'iqTestApplicable')?.message : null,
    positionType: error ? error.details.find(d => d.context.key === 'positionType')?.message : null
  }
  return errors;
}

const validateCompany = async (name) => {
  let isVerify = await db.companyMaster.findOne({ where: { 'companyName': name }, attributes: ['companyId'] });
  if (isVerify) {
    return { status: true, message: '', data: isVerify }
  }
  else {
    return { status: false, message: 'Invalid company name', data: {} }
  }
}

const validateEmployeeType = async (name) => {
  let isVerify = await db.employeeTypeMaster.findOne({ where: { 'emptypename': name }, attributes: ['empTypeId'] });
  if (isVerify) {
    return { status: true, message: '', data: isVerify }
  }
  else {
    return { status: false, message: 'Invalid employee type', data: {} }
  }
}

const validateProbation = async (name) => {
  let isVerify = await db.probationMaster.findOne({ where: { 'probationName': name }, attributes: ['probationId'] });
  if (isVerify) {
    return { status: true, message: '', data: isVerify }
  }
  else {
    return { status: false, message: 'Invalid probation', data: {} }
  }
}

const validateManager = async (empCode) => {
  let isVerify = await db.employeeMaster.findOne({ where: { 'empCode': empCode }, attributes: ['id'] });
  if (isVerify) {
    return { status: true, message: '', data: isVerify }
  }
  else {
    return { status: false, message: 'Invalid manager', data: {} }
  }
}

const validateDesignation = async (name) => {
  let isVerify = await db.designationMaster.findOne({ where: { 'name': name }, attributes: ['designationId'] });
  if (isVerify) {
    return { status: true, message: '', data: isVerify }
  }
  else {
    return { status: false, message: 'Invalid designation', data: {} }
  }
}

const validateFunctionalArea = async (name) => {
  let isVerify = await db.functionalAreaMaster.findOne({ where: { 'functionalAreaName': name }, attributes: ['functionalAreaId'] });
  if (isVerify) {
    return { status: true, message: '', data: isVerify }
  }
  else {
    return { status: false, message: 'Invalid functional area', data: {} }
  }
}

const validateBU = async (name, isValidCompany) => {
  let isVerify = await db.buMaster.findOne({ where: { 'buName': name }, attributes: ['buId'] });
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
    return { status: true, message: '', data: isVerify }
  }
  else {
    return { status: false, message: 'Invalid BU', data: {} }
  }
}

const validateSBU = async (name) => {
  let isVerify = await db.sbuMaster.findOne({ where: { 'sbuName': name }, attributes: ['sbuId'] });
  if (isVerify) {
    return { status: true, message: '', data: isVerify }
  }
  else {
    return { status: false, message: 'Invalid SBU', data: {} }
  }
}

const validateShift = async (name) => {
  if(name) {
    let isVerify = await db.shiftMaster.findOne({ where: { 'shiftName': name }, attributes: ['shiftId'] });
    if (isVerify) {
      return { status: true, message: '', data: isVerify }
    }
    else {
      return { status: false, message: 'Invalid shift', data: {} }
    }
  }
  else {
    return { status: false, message: '', data: {} }
  }
}

const validateDepartment = async (name) => {
  let isVerify = await db.departmentMaster.findOne({ where: { 'departmentName': name }, attributes: ['departmentId'] });
  if (isVerify) {
    return { status: true, message: '', data: isVerify }
  }
  else {
    return { status: false, message: 'Invalid department', data: {} }
  }
}

const validateAttendancePolicy = async (name) => {
  if(name) {
    let isVerify = await db.attendancePolicymaster.findOne({ where: { 'policyName': name }, attributes: ['attendancePolicyId'] });
    if (isVerify) {
      return { status: true, message: '', data: isVerify }
    }
    else {
      return { status: false, message: 'Invalid attendance policy', data: {} }
    }
  }
  else {
    return { status: false, message: '', data: {} }
  }
}

const validateCompanyLocation = async (cityName, isValidCompany) => {
  if(cityName) {
    cityName = cityName.split(",");

    let isVerify = await db.cityMaster.findOne({ where: { 'cityName': cityName[0] }, attributes: ['cityId'] });
    if (isVerify) {
      isVerify = await db.companyLocationMaster.findOne({ where: { 'cityId': isVerify.cityId, 'companyLocationCode': cityName[1].trim(), 'companyId': isValidCompany.data?.companyId }, attributes: ['companyLocationId'] });
      if(isVerify) {
        return { status: true, message: '', data: isVerify }
      }
      else {
        return { status: false, message: 'This city has not been mapped.', data: {} }
      }
    }
    else {
      return { status: false, message: 'Invalid city', data: {} }
    }
  }
  else {
    return { status: false, message: 'Invalid city', data: {} }
  }
}

const validateWeekOff = async (name) => {
  if(name) {
    let isVerify = await db.weekOffMaster.findOne({ where: { 'weekOffName': name }, attributes: ['weekOffId'] });
    if (isVerify) {
      return { status: true, message: '', message: '', data: isVerify }
    }
    else {
      return { status: false, message: 'Invalid week off', data: {} }
    }
  }
  else {
    return { status: false, message: '', data: {} }
  }
}

const validateNewCustomerName = async (name) => {
  if(name) {
    let isVerify = await db.newCustomerNameMaster.findOne({ where: { 'newCustomerName': name }, attributes: ['newCustomerNameId'] });
    if (isVerify) {
      return { status: true, message: '', message: '', data: isVerify }
    }
    else {
      return { status: false, message: 'Invalid new customer id off', data: {} }
    }
  }
  else {
    return { status: false, message: '', data: {} }
  }
}

const validateJobLevel = async (name) => {
  let isVerify = await db.jobLevelMaster.findOne({ where: { 'jobLevelName': name }, attributes: ['jobLevelId'] });
  if (isVerify) {
    return { status: true, message: '', data: isVerify }
  }
  else {
    return { status: false, message: 'Invalid job level', data: {} }
  }
}

const validateEmployee = async (personalMobileNumber, email) => {
  let isVerify = await db.employeeMaster.findOne({
    where: {
      [Op.or]: [
        { 'personalMobileNumber': personalMobileNumber },
        { 'email': email }
      ]
    },
    attributes: ['id']
  });
  if (isVerify) {
    return { status: false, message: 'User already exist', data: {} }
  }
  else {
    isVerify = await db.employeeStagingMaster.findOne({
      where: {
        [Op.or]: [
          { 'personalMobileNumber': personalMobileNumber },
          { 'email': email }
        ]
      },
      attributes: ['id']
    });
    if (isVerify) {
      return { status: false, message: 'User already exist', data: {} }
    }
    else {
      return { status: true, message: '', data: {} }
    }
  }
}

// Function to convert Excel serial date to JS Date
const convertExcelDate = (serial) => {
  const date = new Date((serial - 25569) * 86400 * 1000);
  return moment(date).format('YYYY-MM-DD');
}

const replaceNAWithNull = (value) => {
  return value === 'NA' ? '' : value; // Replace 'NA' with ''
};

export default new MasterController();
