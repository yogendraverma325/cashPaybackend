import Express from "express";
import masterController from "./master.controller.js";
import authentication from "../../../middleware/authentication.js";
import authorization from "../../../middleware/authorization.js";

export default Express.Router()
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
  .get("/separationReason", masterController.separationReason)
  .get("/separationType", masterController.separationType)
  .get("/hrDocument", masterController.hrDocumentMaster)
  .get(
    "/roles",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    masterController.roles
  )
  .get(
    "/shift",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    masterController.shift
  )
  .get(
    "/attendance-policy",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    masterController.attendancePlicy
  )
  .get(
    "/weekoff",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    masterController.weekoff
  )
  .get(
    "/sbu",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    masterController.sbu
  )
  .get(
    "/buhr",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    masterController.buhr
  )
  .get(
    "/buhead",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    masterController.buhead
  )
  .get(
    "/probation",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    masterController.probation
  )
  .get(
    "/newCustomerName",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    masterController.newCustomerName
  )
  .get("/reportModule", masterController.reportModule)
  .get("/taskFilter", masterController.taskFilter)
  .get("/shift", masterController.shift)
  .get(
    "/separationTasks",
    authorization("ADMIN", "SUPERADMIN"),
    masterController.separationTasks
  )
  .get(
    "/lwfDesignation",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    masterController.lwfDesignation
  )
  .get(
    "/ptLocation/:stateId",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    masterController.ptLocation
  )
  .get(
    "/unionCode",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    masterController.unionCode
  );
