import Express from 'express';
import userController from './user.controller.js'
import authentication from '../../../middleware/authentication.js';

export default Express
    .Router()
    .get("/profileDetails", authentication.authenticate, userController.profileDetails)
    .get("/personalDetails", authentication.authenticate, userController.personalDetails)
    .put("/updateBiographicalDetails", authentication.authenticate, userController.updateBiographicalDetails)
    .post("/insertOrUpdatePaymentDetails", authentication.authenticate, userController.insertOrUpdatePaymentDetails)
    .post("/updateFamilyMembers", authentication.authenticate, userController.updateFamilyMembers)
    .get("/dashboardCard/:for", authentication.authenticate, userController.dashboardCard)
