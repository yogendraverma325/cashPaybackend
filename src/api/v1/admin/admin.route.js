import Express from 'express';
import adminController from './admin.controller.js'
import authorization from '../../../middleware/authorization.js';

export default Express
    .Router()
    .post("/addEmployee", authorization('ADMIN'), adminController.addEmployee)
    .put("/updateBiographicalDetails", authorization('ADMIN'), adminController.updateBiographicalDetails)
    .post("/insertOrUpdatePaymentDetails", authorization('ADMIN'), adminController.insertOrUpdatePaymentDetails)
    .post("/updateFamilyMembers", authorization('ADMIN'), adminController.updateFamilyMembers)
    .get("/dashboardCard/:for", authorization('ADMIN'), adminController.dashboardCard)
