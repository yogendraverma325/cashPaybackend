import Express from "express";
import LeaveController from "./leave.controller.js";

export default Express.Router()
  .get("/history", LeaveController.history)
  .get("/list", LeaveController.leaveMapping)
  .get("/leaveRequestList", LeaveController.leaveRequestList)
  .post("/updateLeaveRequest", LeaveController.updateLeaveRequest);
