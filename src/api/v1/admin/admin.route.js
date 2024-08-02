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
    .post("/addBiographicalDetails", authorization('ADMIN'), commonController.addBiographicalDetails)
    .put("/updateBiographicalDetails", authorization('ADMIN'), commonController.updateBiographicalDetails)
    .get("/getBiographicalDetails/:userId", authorization('ADMIN'), commonController.getBiographicalDetails)
    .post("/addFamilyMembers", authorization('ADMIN'), commonController.addFamilyMembers)
    .put("/updateFamilyMembers", authorization('ADMIN'), commonController.updateFamilyMembers)
    .get("/getFamilyMember/:userId", authorization('ADMIN'), commonController.getFamilyMember)
    .get("/getFamilyList/:userId", authorization('ADMIN'), commonController.getFamilyList)
    .delete("/deleteFamilyMember", authorization('ADMIN'), commonController.deleteFamilyMember)
    .post("/addPaymentDetails", authorization('ADMIN'), commonController.addPaymentDetails)
    .put("/updatePaymentDetails", authorization('ADMIN'), commonController.updatePaymentDetails)
    .put("/updateUserStatus", authorization('ADMIN'), adminController.updateUserStatus)
    .put("/updateManager", authorization('ADMIN'), adminController.updateManager)