import Express from "express";
import userController from "./user.controller.js";
import authentication from "../../../middleware/authentication.js";
import commonController from "../common/common.controller.js";

export default Express.Router()
    .get(
        "/profileDetails",
        authentication.authenticate,
        userController.profileDetails
    )
    .get(
        "/personalDetails",
        authentication.authenticate,
        userController.personalDetails
    )
    .post(
        "/addBiographicalDetails",
        authentication.authenticate,
        commonController.addBiographicalDetails
    )
    .put(
        "/updateBiographicalDetails",
        authentication.authenticate,
        commonController.updateBiographicalDetails
    )
    .get(
        "/getBiographicalDetails/:userId",
        authentication.authenticate,
        commonController.getBiographicalDetails
    )
    .put(
        "/updatePaymentDetails",
        authentication.authenticate,
        commonController.updatePaymentDetails
    )
    .post(
        "/addFamilyMembers",
        authentication.authenticate,
        commonController.addFamilyMembers
    )
    .put(
        "/updateFamilyMembers",
        authentication.authenticate,
        commonController.updateFamilyMembers
    )
    .get(
        "/getFamilyMember/:userId",
        authentication.authenticate,
        commonController.getFamilyMember
    )
    .get(
        "/getFamilyList/:userId",
        authentication.authenticate,
        commonController.getFamilyList
    )
    .get(
        "/dashboardCard/:for",
        authentication.authenticate,
        userController.dashboardCard
    )
    .delete(
        "/deleteFamilyMember",
        authentication.authenticate,
        commonController.deleteFamilyMember
    )
    .post(
        "/addPaymentDetails",
        authentication.authenticate,
        commonController.addPaymentDetails
    )
    .get(
        "/leave",
        authentication.authenticate,
        commonController.addPaymentDetails
    )
    .post(
        "/changePassword",
        authentication.authenticate,
        userController.changePassword
    )
    .get(
        "/globalSearch/:search",
        authentication.authenticate,
        userController.globalSearch
    )
    .post(
        "/addJobDetails",
        authentication.authenticate,
        commonController.addJobDetails
    )
    .put(
        "/updateEducationDetails",
        authentication.authenticate,
        commonController.updateEducationDetails
    )
    .post(
        "/addEducationDetails",
        authentication.authenticate,
        commonController.addEducationDetails
    )
    .get(
        "/searchEmployee",
        authentication.authenticate,
        commonController.searchEmployee
    )
    .get(
        "/taskBoxCount",
        authentication.authenticate,
        userController.taskBoxCount
    )
    .put(
        "/updateProfilePicture",
        authentication.authenticate,
        userController.updateProfilePicture
    )
    .post(
        "/updateEmergencyContact",
        authentication.authenticate,
        commonController.updateEmergencyContact
    )
    .post("/forgotPassword", userController.forgotPassword)
    .post("/verifyOTP", userController.verifyOTP)
    .put("/resetPassword", userController.resetPassword)
    .post(
        "/updateAddress",
        authentication.authenticate,
        commonController.updateAddress
    )
    .get("/getSalutation", commonController.getSalutation)
    .put(
        "/uploadDocument",
        authentication.authenticate,
        commonController.uploadDocument
    )
    .put(
        "/updateEmployeeInfo",
        authentication.authenticate,
        commonController.updateEmployeeInfo
    )
    .post(
        "/addWorkExperience",
        authentication.authenticate,
        commonController.addWorkExperience
    )
    .put(
        "/updateWorkExperience",
        authentication.authenticate,
        commonController.updateWorkExperience
    )
    .post(
        "/uploadHrDocuments",
        authentication.authenticate,
        commonController.uploadHrDocuments
    )
    .post(
        "/addCertificates",
        authentication.authenticate,
        commonController.addCertificates
    )
    .put(
        "/updateCertificates",
        authentication.authenticate,
        commonController.updateCertificates
    )
    .put(
        "/updateContactInfo",
        authentication.authenticate,
        commonController.updateContactInfo
    )
    .post(
        "/initiateSeparation",
        authentication.authenticate,
        userController.initiateSeparation
    )
    .get(
        "/separationDetails",
        authentication.authenticate,
        userController.separationDetails
    )
    .post(
        "/managerInputOnseparation",
        authentication.authenticate,
        userController.managerInputOnseparation
    )
    .post(
        "/onBehalfManager",
        authentication.authenticate,
        userController.onBehalfManager
    )
    .post(
        "/onBehalfBUHr",
        authentication.authenticate,
        userController.onBehalfBUHr
    )
    .post(
        "/rejectSeparation",
        authentication.authenticate,
        userController.rejectSeparation
    )
    .post(
        "/buhrInputOnseparation",
        authentication.authenticate,
        userController.buhrInputOnSeparation
    )
    .post(
        "/revokeSeparation",
        authentication.authenticate,
        userController.revokeSeparation
    )
    .get(
        "/separationTrails",
        authentication.authenticate,
        userController.separationTrails
    )
    .get(
        "/taskHistoryAttendance",
        authentication.authenticate,
        userController.taskHistoryAttendance
    )
    .get(
        "/taskHistoryLeave",
        authentication.authenticate,
        userController.taskHistoryLeave
    )
    .get(
        "/separationTaskForm/:id",
        authentication.authenticate,
        userController.separationTaskForm
    )
    .post(
        "/separationTaskValues",
        authentication.authenticate,
        userController.separationTaskValues
    )
    .get(
        "/initiatedTask",
        authentication.authenticate,
        userController.initiatedTaskList
    )
    .get(
        "/empInitiatedTask",
        authentication.authenticate,
        userController.empInitiatedTask
    )
    // manager history
    .get(
        "/managerHistory",
        authentication.authenticate,
        userController.managerHistory
    )
    // manager history
    // User's POLICY history
    .get(
        "/userPolicyHistory",
        authentication.authenticate,
        userController.userPolicyHistory
    )

//   .get("/taskFieldValue")
// User's POLICY history
