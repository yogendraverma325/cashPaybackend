import Express from "express";
import attendanceController from "./attendance.controller.js";

export default Express
  .Router()
  .post('/markAttendance', attendanceController.attendance)
  .post("/regularizeRequest", attendanceController.regularizeRequest)
  .get("/attendanceList", attendanceController.attendanceList)
  .post("/approveRegularizationRequest", attendanceController.approveRegularizationRequest)
  .get("/regularizeRequestList", attendanceController.regularizeRequestList)
  .put("/revokeRegularizeRequest", attendanceController.revokeRegularizeRequest)
  .post("/attedanceCron", attendanceController.attedanceCron)
  .get("/attendenceDetails", attendanceController.attendenceDetails);
