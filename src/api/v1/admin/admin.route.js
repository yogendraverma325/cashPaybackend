import Express from 'express';
import adminController from './admin.controller.js'
import commonController from '../common/common.controller.js';
import authorization from '../../../middleware/authorization.js';

export default Express
    .Router()
    .post("/addEmployee", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN'), adminController.addEmployee)
    .get("/dashboardCard/:for", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), adminController.dashboardCard)
    .post("/unlockAccount", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), adminController.unlockAccount)
    .post("/resetPassword", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), adminController.resetPassword)
    .post("/addBiographicalDetails", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), commonController.addBiographicalDetails)
    .put("/updateBiographicalDetails", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), commonController.updateBiographicalDetails)
    .get("/getBiographicalDetails/:userId", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), commonController.getBiographicalDetails)
    .post("/addFamilyMembers", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), commonController.addFamilyMembers)
    .put("/updateFamilyMembers", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), commonController.updateFamilyMembers)
    .get("/getFamilyMember/:userId", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), commonController.getFamilyMember)
    .get("/getFamilyList/:userId", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), commonController.getFamilyList)
    .delete("/deleteFamilyMember", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), commonController.deleteFamilyMember)
    .post("/addPaymentDetails", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), commonController.addPaymentDetails)
    .put("/updatePaymentDetails", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN', 'USER'), commonController.updatePaymentDetails)
    .put("/updateUserStatus", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN'), adminController.updateUserStatus)
    .put("/updateManager", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN'), adminController.updateManager)
    .post("/addJobDetails", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN'), commonController.addJobDetails)
    .get("/searchEmployee", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN'), commonController.searchEmployee)
    .post("/updateEmergencyContact", authorization('ADMIN', 'BUHR', 'HR_OPS', 'SUPERADMIN'), commonController.updateEmergencyContact)