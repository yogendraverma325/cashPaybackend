import Express from 'express';
import adminController from './admin.controller.js'
import commonController from '../common/common.controller.js';
import authorization from '../../../middleware/authorization.js';

export default Express
    .Router()
    .post("/addEmployee", authorization('ADMIN'), adminController.addEmployee)
    .post("/insertOrUpdatePaymentDetails", authorization('ADMIN'), commonController.insertOrUpdatePaymentDetails)
    .get("/dashboardCard/:for", authorization('ADMIN'), adminController.dashboardCard)
    .post("/unlockAccount", authorization('ADMIN'), adminController.unlockAccount)
    .post("/resetPassword", authorization('ADMIN'), adminController.resetPassword)
