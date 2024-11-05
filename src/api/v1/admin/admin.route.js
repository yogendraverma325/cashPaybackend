import Express from "express";
import adminController from "./admin.controller.js";
import commonController from "../common/common.controller.js";
import authorization from "../../../middleware/authorization.js";

export default Express.Router()
  .post("/addEmployee", adminController.addEmployee)
  .get(
    "/dashboardCard/:for",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    adminController.dashboardCard
  )
  .post(
    "/unlockAccount",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    adminController.unlockAccount
  )
  .post(
    "/resetPassword",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    adminController.resetPassword
  )
  .post(
    "/addBiographicalDetails",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    commonController.addBiographicalDetails
  )
  .put(
    "/updateBiographicalDetails",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    commonController.updateBiographicalDetails
  )
  .get(
    "/getBiographicalDetails/:userId",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    commonController.getBiographicalDetails
  )
  .post(
    "/addFamilyMembers",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    commonController.addFamilyMembers
  )
  .put(
    "/updateFamilyMembers",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    commonController.updateFamilyMembers
  )
  .get(
    "/getFamilyMember/:userId",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    commonController.getFamilyMember
  )
  .get(
    "/getFamilyList/:userId",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    commonController.getFamilyList
  )
  .delete(
    "/deleteFamilyMember",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    commonController.deleteFamilyMember
  )
  .post(
    "/addPaymentDetails",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    commonController.addPaymentDetails
  )
  .put(
    "/updatePaymentDetails",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN", "USER"),
    commonController.updatePaymentDetails
  )
  .put(
    "/updateUserStatus",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    adminController.updateUserStatus
  )
  .put(
    "/updateManager",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    adminController.updateManager
  )
  .post(
    "/addJobDetails",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    commonController.addJobDetails
  )
  .get(
    "/searchEmployee",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    commonController.searchEmployee
  )
  .post(
    "/updateEmergencyContact",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    commonController.updateEmergencyContact
  )
  .post(
    "/updateAddress",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    commonController.updateAddress
  )
  .get(
    "/getSalutation",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    commonController.getSalutation
  )

  .post(
    "/onboardEmployee",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    adminController.onboardEmployee
  )
  .get(
    "/onboardEmployee",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    adminController.getOnboardEmployee
  )
  .post(
    "/createTMC",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    adminController.createTMC
  )
  .delete(
    "/onboardEmployee/:id",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    adminController.changeStatusOnboardEmployee
  )
  .put(
    "/onboardEmployee/:id",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    adminController.updateOnboardEmployee
  )
  .get(
    "/onboardEmployee/:id",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    adminController.getOnboardEmployeeDetails
  )
  .put(
    "/updatePolicyOfEMP",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    adminController.updatePolicyOfEMP
  )
  .put(
    "/updateIQDetails",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    commonController.updateIQDetails
  )
  .delete(
    "/hrDocument/:letterId",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    commonController.deleteHRDocument
  )
  .post(
    "/uploadHRDocuments",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    commonController.uploadHRDocuments
  )
  .patch(
    "/onboardEmployee/:id",
    authorization("ADMIN", "BUHR", "HR_OPS", "SUPERADMIN"),
    adminController.changeStatusOnboardEmployee
  )
