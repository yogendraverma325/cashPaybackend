import Express from 'express';
import commonController from '../common/common.controller.js';
import authorization from '../../../../middleware/authorization.js';

export default Express
    .Router()

    // company type master routes
    .post("/company-type", authorization('ADMIN', 'SUPERADMIN'), commonController.createCompanyType)
    .get("/company-type-list", authorization('ADMIN', 'SUPERADMIN'), commonController.companyTypeList)
    .get("/company-type-details/:id", authorization('ADMIN', 'SUPERADMIN'), commonController.companyTypeDetails)
    .put("/company-type/:id", authorization('ADMIN', 'SUPERADMIN'), commonController.updateCompanyType)
    .patch("/company-type/:id", authorization('ADMIN', 'SUPERADMIN'), commonController.changeStatusOfCompanyType)
    .delete("/company-type/:id", authorization('ADMIN', 'SUPERADMIN'), commonController.deleteOfCompanyType)

    // band master routes
    .post("/band", authorization('ADMIN', 'SUPERADMIN'), commonController.createBand)
    .get("/band-list", authorization('ADMIN', 'SUPERADMIN'), commonController.bandList)
    .get("/band-details/:id", authorization('ADMIN', 'SUPERADMIN'), commonController.bandDetails)
    .put("/band/:id", authorization('ADMIN', 'SUPERADMIN'), commonController.updateBand)
    .patch("/band/:id", authorization('ADMIN', 'SUPERADMIN'), commonController.changeStatusOfBand)
    .delete("/band/:id", authorization('ADMIN', 'SUPERADMIN'), commonController.deleteOfBand)

     // job level master routes
     .post("/job-level", authorization('ADMIN', 'SUPERADMIN'), commonController.createJobLevel)
     .get("/job-level-list", authorization('ADMIN', 'SUPERADMIN'), commonController.jobLevelList)
     .get("/job-level-details/:id", authorization('ADMIN', 'SUPERADMIN'), commonController.jobLevelDetails)
     .put("/job-level/:id", authorization('ADMIN', 'SUPERADMIN'), commonController.updateJobLevel)
     .patch("/job-level/:id", authorization('ADMIN', 'SUPERADMIN'), commonController.changeStatusOfJobLevel)
     .delete("/job-level/:id", authorization('ADMIN', 'SUPERADMIN'), commonController.deleteOfJobLevel)
 
