import Express from 'express';
import adminController from './admin.controller.js'
import commonController from '../common/common.controller.js';
import authorization from '../../../middleware/authorization.js';

export default Express
    .Router()
    .post("/addEmployee", authorization('ADMIN'), adminController.addEmployee)
    .get("/dashboardCard/:for", authorization('ADMIN'), adminController.dashboardCard)
    .post("/unlockAccount", authorization('ADMIN'), adminController.unlockAccount)
    .post("/resetPassword", authorization('ADMIN'), adminController.resetPassword)
    .put("/updateBiographicalDetails", authorization('ADMIN'), commonController.updateBiographicalDetails)
    .put("/updateFamilyMembers", authorization('ADMIN'), commonController.updateFamilyMembers)
    .delete("/deleteFamilyMemberDetails", authorization('ADMIN'), commonController.deleteFamilyMemberDetails)
    .post("/addPaymentDetails", authorization('ADMIN'), commonController.addPaymentDetails)
    .put("/updatePaymentDetails", authorization('ADMIN'), commonController.updatePaymentDetails)
    .put("/updateUserStatus", authorization('ADMIN'), adminController.updateUserStatus)
    .put("/updateManager", authorization('ADMIN'), adminController.updateManager)