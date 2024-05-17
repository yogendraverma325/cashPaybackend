import { Op } from "sequelize";
import db from "../../../config/db.config.js";
import respHelper from '../../../helper/respHelper.js'
import xlsx from "json-as-xlsx"
import fs from "fs"
import client from "../../../config/redisDb.config.js";

async function getDataFromCache(key) {
    return client.lRange(key, 0, -1);
}

class MasterController {

    async employee(req, res) {
        try {
            const { search, department, designation, buSearch, sbuSearch, areaSearch } = req.query;

            const employeeData = await db.employeeMaster.findAndCountAll({
                attributes: ['id', 'empCode', 'name', 'email', 'firstName', 'lastName', 'officeMobileNumber', 'buId'],
                where: Object.assign(
                    (search) ? {
                        [Op.or]: [
                            { empCode: { [Op.like]: `%${search}%` } },
                            { name: { [Op.like]: `%${search}%` } },
                            { email: { [Op.like]: `%${search}%` } }
                        ]
                    } : {}
                ),
                include: [
                    {
                        model: db.designationMaster,
                        attributes: ['name'],
                        where: { ...(designation && { name: { [Op.like]: `%${designation}%` } }) }
                    },
                    {
                        model: db.functionalAreaMaster,
                        attributes: ['functionalAreaName'],
                        where: { ...(areaSearch && { functionalAreaName: { [Op.like]: `%${areaSearch}%` } }) }
                    },
                    {
                        model: db.departmentMaster,
                        attributes: ['departmentName'],
                        where: { ...(department && { departmentName: { [Op.like]: `%${department}%` } }) }
                    },
                    {
                        model: db.educationDetails,
                        //attributes: ['departmentName'],
                        // where: { ...(department && { departmentName: { [Op.like]: `%${department}%` } }) }
                    },
                    {
                        model: db.buMaster,
                        attributes: ['buName'],
                        where: { ...(buSearch && { buName: { [Op.like]: `%${buSearch}%` } }) },
                        // required: true,
                        include: [
                            {
                                model: db.sbuMapping,
                                attributes: ['sbuId'],
                                // required: true,
                                include: [
                                    {
                                        model: db.sbuMaster,
                                        attributes: ['id', 'sbuname'],
                                        where: { ...(sbuSearch && { sbuname: { [Op.like]: `%${sbuSearch}%` } }) },
                                        // required: true,
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            const arr = await Promise.all(employeeData.rows.map(async (ele) => {
                return {
                    id: ele.dataValues.id || "",
                    empCode: ele.dataValues.empCode || "",
                    name: ele.dataValues.name || "",
                    email: ele.dataValues.email || "",
                    firstName: ele.dataValues.firstName || "",
                    lastName: ele.dataValues.lastName || "",
                    officeMobileNumber: ele.dataValues.officeMobileNumber || "",
                    buId: ele.dataValues.buId || "",
                    designation_name: ele.dataValues.designationmaster?.name || "",
                    functional_area_name: ele.dataValues.functionalareamaster?.functionalAreaName || "",
                    department_name: ele.dataValues.departmentmaster?.departmentName || "",
                    bu_name: ele.dataValues.bumaster?.buName || "",
                    sub_bu_name: ele.dataValues.bumaster?.sbumapping?.sbumaster?.sbuname || ""
                };
            }));

            let educationDetails = []
            employeeData.rows.forEach(employee => {
                employee.employeeeducationdetails.forEach(education => {
                    // Extract only the required fields
                    const extractedEducation = {
                        userId: education.userId ? education.userId : "",
                        name: employee.firstName + " " + employee.lastName,
                        empCode: employee.empCode ? employee.empCode : "",
                        educationId: education.educationId ? education.educationId : "",
                        educationDegree: education.educationDegree ? education.educationDegree : "",
                        educationSpecialisation: education.educationSpecialisation ? education.educationSpecialisation : "",
                        educationStartDate: education.educationStartDate ? education.educationStartDate : "",
                        educationCompletionDate: education.educationCompletionDate ? education.educationCompletionDate : "",
                        educationInstitute: education.educationInstitute ? education.educationInstitute : "",
                        educationRemark: education.educationRemark ? education.educationRemark : ""
                    };
                    // Push the extracted education details object into the educationDetails array
                    educationDetails.push(extractedEducation);
                });
            });

            if (arr.length > 0) {
                const dt = new Date();
                const sheetName = "uploads/temp/dataSheet" //+ dt.getTime();
                fs.writeFileSync(sheetName + ".xlsx", "", { flag: 'a+' }, (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('File created successfully!');
                });

                const data = [
                    {
                        sheet: "Employee",
                        columns: [
                            { label: "Employee Code", value: "empCode" },
                            { label: "Email", value: "email" },
                            { label: "First Name", value: "firstName" },
                            { label: "Last Name", value: "lastName" },
                            { label: "Office Mobile Number", value: "officeMobileNumber" },
                            { label: "Designation Name", value: "designation_name" },
                            { label: "Department Name", value: "department_name" },
                            { label: "Functional Area Name", value: "functional_area_name" },
                            { label: "Bu Name", value: "bu_name" },
                            { label: "Sub Bu Name", value: "sub_bu_name" },
                        ],
                        content: arr
                    },
                    {
                        sheet: "Education",
                        columns: [
                            { label: "Employee Code", value: "empCode" },
                            { label: "Name", value: "name" },
                            { label: "Education Specialisation", value: "educationSpecialisation" },
                            { label: "Education Institute", value: "educationInstitute" }
                        ],
                        content: educationDetails
                    }
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
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }

    async employeeRedis(req, res) {

        try {
            const { search, department, designation, buSearch, sbuSearch, areaSearch } = req.query
            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;
            const cacheKey = `employeeList:${pageNo}`;

            var employeeData = [];
            await client.get("employeeList")
                .then(async (data) => {
                    if (data) {
                        employeeData = JSON.parse(data);
                        console.log('Array of objects fetched Redis successfully.');
                        return respHelper(res, {
                            status: 200,
                            data: employeeData
                        })
                    } else {
                        employeeData = await db.employeeMaster.findAndCountAll({
                            limit,
                            offset,
                            where: Object.assign(
                                (search) ? {
                                    [Op.or]: [{
                                        empCode: {
                                            [Op.like]: `%${search}%`
                                        }
                                    }, {
                                        name: {
                                            [Op.like]: `%${search}%`
                                        }
                                    }, {
                                        email: {
                                            [Op.like]: `%${search}%`
                                        }
                                    }]
                                } : {}
                            ),
                            attributes: ['id', 'empCode', 'name', 'email', 'firstName', 'lastName', 'officeMobileNumber', 'buId'],
                            include: [{
                                model: db.designationMaster,
                                attributes: ['name'],
                                where: { ...(designation && { name: { [Op.like]: `%${designation}%` } }) }
                            },
                            {
                                model: db.functionalAreaMaster,
                                attributes: ['functionalAreaName'],
                                where: { ...(areaSearch && { functionalAreaName: { [Op.like]: `%${areaSearch}%` } }) }
                            },
                            {
                                model: db.departmentMaster,
                                attributes: ['departmentName'],
                                where: { ...(department && { departmentName: { [Op.like]: `%${department}%` } }) }
                            },
                            {
                                model: db.buMaster,
                                attributes: ['buName'],
                                where: { ...(buSearch && { buName: { [Op.like]: `%${buSearch}%` } }) },
                                required: true,
                                include: [{
                                    model: db.sbuMapping,
                                    attributes: ['sbuId'],
                                    required: true,
                                    include: [{
                                        model: db.sbuMaster,
                                        attributes: ['id', 'sbuname'],
                                        where: { ...(sbuSearch && { sbuname: { [Op.like]: `%${sbuSearch}%` } }) },
                                        required: true,
                                    }]
                                }]
                            }]
                        })
                        const employeeJson = JSON.stringify(employeeData);
                        client.setEx('employeeList', 10, employeeJson)
                            .then(() => {
                                console.log('Array of objects stored in Redis successfully.');
                            })
                            .catch((err) => {
                                console.error('Error storing array of objects in Redis:', err);
                            })
                        return respHelper(res, {
                            status: 200,
                            data: employeeData
                        })
                    }
                })

        } catch (error) {
            console.log(error)
            return respHelper(res, {
                status: 500
            })
        }
    }
}

export default new MasterController()