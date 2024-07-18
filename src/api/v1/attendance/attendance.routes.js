import Express from "express";
import attendanceController from "./attendance.controller.js";

export default Express.Router()
  .post("/markAttendance", attendanceController.attendance)
  .post("/regularizeRequest", attendanceController.regularizeRequest)
  .get("/attendanceList", attendanceController.attendanceList)
  .get("/attendanceListNew", attendanceController.attendanceListNew)
  .post(
    "/approveRegularizationRequest",
    attendanceController.approveRegularizationRequest
  )
  .get("/regularizeRequestList", attendanceController.regularizeRequestList)
  .put("/revokeRegularizeRequest", attendanceController.revokeRegularizeRequest)
  .post("/generateCalendarForEmp", attendanceController.generateCalendarForEmp)
  .get("/attendenceDetails/:employeeId", attendanceController.attendenceDetails);
