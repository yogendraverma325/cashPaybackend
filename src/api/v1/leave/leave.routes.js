import Express from "express";
import LeaveController from "./leave.controller.js";
import authentication from "../../../middleware/authentication.js";

export default Express.Router()
  .get("/history", LeaveController.history)
  .get("/list", LeaveController.leaveMapping)
  .get("/leaveRequestList", LeaveController.leaveRequestList)
  .post("/updateLeaveRequest", LeaveController.updateLeaveRequest)
  .post("/requestForLeave", LeaveController.requestForLeave)
  .post("/revokeLeaveRequest", LeaveController.revokeLeaveRequest)
  .post("/leaveRemainingCount", authentication.authenticate, LeaveController.leaveRemainingCount)
  .get("/leaveHistory/:year", authentication.authenticate, LeaveController.leaveHistory)
  .get("/leaveHistoryDetails", authentication.authenticate, LeaveController.leaveHistoryDetails)
  .put("/leaveIdUpdateForOffRole",authentication.authenticate, LeaveController.leaveIdUpdateForOffRole)
  .post("/leaveAssignEmployee",authentication.authenticate, LeaveController.leaveAssignEmployee)
