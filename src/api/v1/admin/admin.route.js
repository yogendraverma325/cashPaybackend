import Express from 'express';
import adminController from './admin.controller.js'
import authorization from '../../../middleware/authorization.js';

export default Express
    .Router()
    .post("/addEmployee", authorization('ADMIN'), adminController.addEmployee)
    .put("/updateBiographicalDetails", authorization('ADMIN'), adminController.updateBiographicalDetails)
<<<<<<< HEAD
    .post("/insertOrUpdatePaymentDetails", authorization('ADMIN'), adminController.insertOrUpdatePaymentDetails)
    .post("/updateFamilyMembers", authorization('ADMIN'), adminController.updateFamilyMembers)
    .get("/dashboardCard/:for", authorization('ADMIN'), adminController.dashboardCard)
=======
    .post("/unlockAccount", authorization('ADMIN'), adminController.unlockAccount)
    .post("/resetPassword", authorization('ADMIN'), adminController.resetPassword)
>>>>>>> 2fc9269e68be4cbd35c08f2b1e5e16bcb7542f48
