import Express from 'express';
import adminController from './admin.controller.js'
import commonController from '../common/common.controller.js';
import authorization from '../../../middleware/authorization.js';

export default Express
    .Router()
    .post("/addEmployee", authorization('ADMIN'), adminController.addEmployee)
    .post("/updatePaymentDetails", authorization('ADMIN'), commonController.updatePaymentDetails)
    .get("/dashboardCard/:for", authorization('ADMIN'), adminController.dashboardCard)
    .post("/unlockAccount", authorization('ADMIN'), adminController.unlockAccount)
    .post("/resetPassword", authorization('ADMIN'), adminController.resetPassword)
    .put("/updateBiographicalDetails", authorization('ADMIN'), commonController.updateBiographicalDetails)
    .post("/updateFamilyMembers", authorization('ADMIN'), commonController.updateFamilyMembers)