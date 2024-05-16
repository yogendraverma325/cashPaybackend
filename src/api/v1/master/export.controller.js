import { Op, where } from "sequelize";
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
            
            const {search,department,designation,buSearch,sbuSearch,areaSearch} = req.query

            const employeeData = await db.employeeMaster.findAndCountAll({
                attributes: ['id', 'empCode', 'name', 'email', 'firstName', 'lastName', 'officeMobileNumber','buId'],
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
                include: [{
                    model: db.designationMaster,
                    attributes: ['name'],
                    where:{ ...(designation && { name:{[Op.like]: `%${designation}%`} })}
                },
                {
                    model: db.functionalAreaMaster,
                    attributes: ['functionalAreaName'],
                    where:{ ...(areaSearch && { functionalAreaName:{[Op.like]: `%${areaSearch}%`} })}
                },
                {
                    model: db.departmentMaster,
                    attributes: ['departmentName'],
                    where:{ ...(department && { departmentName: {[Op.like]: `%${department}%`}})}
                },
                {
                    model: db.buMaster,
                    attributes: ['buName'],
                    where:{ ...(buSearch && { buName:{[Op.like]: `%${buSearch}%`} })},
                    required:true,
                    include:[{
                        model: db.sbuMapping,
                        attributes: ['sbuId'],
                        required:true,
                        include:[{
                            model: db.sbuMaster,
                            attributes:['id','sbuname'],
                            where:{ ...(sbuSearch && { sbuname:{[Op.like]: `%${sbuSearch}%`} })},
                            required:true,   
                        }]
                    }]
                }]
            })
                var arr = []
                await Promise.all(
                    employeeData.rows.map(async (ele) => {
                    let data = {
                        "id": ele.dataValues.id ? ele.dataValues.id :"",
                        "empCode": ele.dataValues.empCode ? ele.dataValues.empCode :"",
                        "name": ele.dataValues.name ? ele.dataValues.name :"",
                        "email": ele.dataValues.email ? ele.dataValues.email:"",
                        "firstName": ele.dataValues.firstName ? ele.dataValues.firstName:"",
                        "lastName": ele.dataValues.lastName ?  ele.dataValues.lastName :"",
                        "officeMobileNumber": ele.dataValues.officeMobileNumber ? ele.dataValues.officeMobileNumber:"",
                        "buId": ele.dataValues.buId ? ele.dataValues.buId :"",
                        "designation_name": ele.dataValues.designationmaster.name ? ele.dataValues.designationmaster.name :"",
                        "functional_area_name": ele.dataValues.functionalareamaster.functionalAreaName ? ele.dataValues.functionalareamaster.functionalAreaName :"",
                        "department_name":ele.dataValues.departmentmaster.departmentName ? ele.dataValues.departmentmaster.departmentName : "",
                        "bu_name":ele.dataValues.bumaster.buName ? ele.dataValues.bumaster.buName:"",
                        "sub_bu_name":ele.dataValues.bumaster.sbumapping.sbumaster.sbuname ?ele.dataValues.bumaster.sbumapping.sbumaster.sbuname:""
                    }
                    arr.push(data)
                }))
 
               if(arr.length > 0){
                let dt = new Date()
                let sheetName = "uploads/temp/dataSheet" //+dt.getTime();
                fs.writeFileSync(sheetName+".xlsx", "", { flag: 'a+' }, (err) => {
                    if (err) {
                      console.error('Error writing file:', err);
                      return;
                    }
                    console.log('File created successfully!');
                  });
                let data = [
                    {
                      sheet: "dataSheet",
                      columns: [
                        { label: "id", value: "id" }, // Top level data
                        { label: "empCode", value : "empCode" }, // Custom format
                        { label: "email", value : "email" }, 
                        { label: "firstName", value : "firstName" }, 
                        { label: "lastName", value : "lastName" }, 
                        { label: "officeMobileNumber", value : "officeMobileNumber" }, 
                        { label: "designation_name", value : "designation_name" }, 
                        { label: "functional_area_name", value : "functional_area_name" }, 
                        { label: "department_name", value : "department_name" }, 
                        { label: "bu_name", value : "bu_name" }, 
                        { label: "sub_bu_name", value : "sub_bu_name" }, 
                      ],
                      content: arr
                    }
                  ]

                  let settings = {
                    fileName: sheetName, // Name of the resulting spreadsheet
                    extraLength: 3, // A bigger number means that columns will be wider
                    writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
                    writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
                    RTL: false, // Display the columns from right-to-left (the default value is false)
                  }
                xlsx(data, settings,()=>{
                   return res.download(sheetName+".xlsx")
                })
                 
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
            const {search,department,designation,buSearch,sbuSearch,areaSearch} = req.query
            const limit = req.query.limit * 1 || 10
            const pageNo = req.query.page * 1 || 1;
            const offset = (pageNo - 1) * limit;
            const cacheKey = `employeeList:${pageNo}`;

            var employeeData=[];
            await client.get("employeeList")
            .then(async(data) => {
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
                attributes: ['id', 'empCode', 'name', 'email', 'firstName', 'lastName', 'officeMobileNumber','buId'],
                include: [{
                    model: db.designationMaster,
                    attributes: ['name'],
                    where:{ ...(designation && { name:{[Op.like]: `%${designation}%`} })}
                },
                {
                    model: db.functionalAreaMaster,
                    attributes: ['functionalAreaName'],
                    where:{ ...(areaSearch && { functionalAreaName:{[Op.like]: `%${areaSearch}%`} })}
                },
                {
                    model: db.departmentMaster,
                    attributes: ['departmentName'],
                    where:{ ...(department && { departmentName: {[Op.like]: `%${department}%`}})}
                },
                {
                    model: db.buMaster,
                    attributes: ['buName'],
                    where:{ ...(buSearch && { buName:{[Op.like]: `%${buSearch}%`} })},
                    required:true,
                    include:[{
                        model: db.sbuMapping,
                        attributes: ['sbuId'],
                        required:true,
                        include:[{
                            model: db.sbuMaster,
                            attributes:['id','sbuname'],
                            where:{ ...(sbuSearch && { sbuname:{[Op.like]: `%${sbuSearch}%`} })},
                            required:true,   
                        }]
                    }]
                }]
                })
                const employeeJson = JSON.stringify(employeeData);
                client.setEx('employeeList',10,employeeJson)
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