import Express from 'express';
import masterController from './master.controller.js'
import authentication from '../../../middleware/authentication.js';
import authorization from '../../../middleware/authorization.js';

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
    .get("/groupCompany", masterController.groupCompany)
    .get("/dashboardCard", masterController.dashboardCard)
    .get("/leave", masterController.leaveMaster)
    .get("/educations", masterController.educationMaster)

    .get("/roles", authorization('ADMIN', 'SUPERADMIN'), masterController.roles)
    .get("/shift", masterController.shift)
    .get("/attendance-policy", masterController.attendancePlicy)
    .get("/weekoff", masterController.weekoff)
    .get("/sbu", masterController.sbu)
    .get("/buhr", masterController.buhr)
    .get("/buhead", masterController.buhead)
