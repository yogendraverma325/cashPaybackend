import Express from 'express';
import userController from './user.controller.js'
import authentication from '../../../middleware/authentication.js';
import commonController from '../common/common.controller.js';

export default Express
    .Router()
    .get("/profileDetails", authentication.authenticate, userController.profileDetails)
    .get("/personalDetails", authentication.authenticate, userController.personalDetails)
    .put("/updateBiographicalDetails", authentication.authenticate, commonController.updateBiographicalDetails)
    .post("/insertOrUpdatePaymentDetails", authentication.authenticate, commonController.insertOrUpdatePaymentDetails)
    .post("/updateFamilyMembers", authentication.authenticate, commonController.updateFamilyMembers)
    .get("/dashboardCard/:for", authentication.authenticate, userController.dashboardCard)
