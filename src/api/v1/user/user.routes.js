import Express from 'express';
import userController from './user.controller.js'
import authentication from '../../../middleware/authentication.js';
import commonController from '../common/common.controller.js';

export default Express
    .Router()
    .get("/profileDetails", authentication.authenticate, userController.profileDetails)
    .get("/personalDetails", authentication.authenticate, userController.personalDetails)
    .post("/addBiographicalDetails", authentication.authenticate, commonController.addBiographicalDetails)
    .put("/updateBiographicalDetails", authentication.authenticate, commonController.updateBiographicalDetails)
    .get("/getBiographicalDetails/:userId", authentication.authenticate, commonController.getBiographicalDetails)
    .put("/updatePaymentDetails", authentication.authenticate, commonController.updatePaymentDetails)
    .post("/addFamilyMembers", authentication.authenticate, commonController.addFamilyMembers)
    .put("/updateFamilyMembers", authentication.authenticate, commonController.updateFamilyMembers)
    .get("/getFamilyMember/:userId", authentication.authenticate, commonController.getFamilyMember)
    .get("/getFamilyList/:userId", authentication.authenticate, commonController.getFamilyList)
    .get("/dashboardCard/:for", authentication.authenticate, userController.dashboardCard)
    .delete("/deleteFamilyMember", authentication.authenticate, commonController.deleteFamilyMember)
    .post("/addPaymentDetails", authentication.authenticate, commonController.addPaymentDetails)
    .get("/leave", authentication.authenticate, commonController.addPaymentDetails)
    .post("/changePassword", authentication.authenticate, userController.changePassword)
    .get("/globalSearch/:search", authentication.authenticate, userController.globalSearch)
    .post("/addJobDetails", authentication.authenticate, commonController.addJobDetails)
    .put("/updateEducationDetails", authentication.authenticate, commonController.updateEducationDetails)
    .post("/addEducationDetails", authentication.authenticate, commonController.addEducationDetails)
    .get("/searchEmployee", authentication.authenticate, commonController.searchEmployee)
    .get("/taskBoxCount", authentication.authenticate, userController.taskBoxCount)
    .put("/updateProfilePicture", authentication.authenticate, userController.updateProfilePicture)
    .post("/updateEmergencyContact", authentication.authenticate, commonController.updateEmergencyContact)
    .post("/forgotPassword", userController.forgotPassword)
    .post("/verifyOTP",userController.verifyOTP)
    .put("/resetPassword",userController.resetPassword)

    
