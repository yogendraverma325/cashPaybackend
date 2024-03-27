import Express from 'express';
import masterController from './master.controller.js'
import authentication from '../../../middleware/authentication.js';

export default Express
    .Router()
    .get("/employee", masterController.employee)
    .get("/reporties", masterController.reporties)
    .get("/band", masterController.band)
    .get("/bu", masterController.bu)
    .get("/costCenter", masterController.costCenter)
    .get("/designation", masterController.designation)
    .get("/grade", masterController.grade)
    .get("/jobLevel", masterController.jobLevel)
    .get("/functionalArea", masterController.functionalArea)
    .get("/state", masterController.state)
    .get("/region", masterController.region)
    .get("/city", masterController.city)
    .get("/companyLocation", masterController.companyLocation)
    .get("/company", masterController.company)
    .get("/companyType", masterController.companyType)
    .get("/country", masterController.country)
    .get("/currency", masterController.currency)
    .get("/department", masterController.department)
    .get("/district", masterController.district)
    .get("/employeeType", masterController.employeeType)
    .get("/industry", masterController.industry)
    .get("/pincode", masterController.pincode)
    .get("/timezone", masterController.timeZone)