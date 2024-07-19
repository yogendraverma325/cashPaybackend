import Express from "express";
import attendanceController from "./attendance.controller.js";

<<<<<<< HEAD
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
=======
export default Express
    .Router()
    .post('/markAttendance', attendanceController.attendance)
    .post("/regularizeRequest", attendanceController.regularizeRequest)
    .get("/attendanceList", attendanceController.attendanceList)
    .post("/approveRegularizationRequest", attendanceController.approveRegularizationRequest)
    .get("/regularizeRequestList", attendanceController.regularizeRequestList)
    .put("/revokeRegularizeRequest", attendanceController.revokeRegularizeRequest)
    .post("/attedanceCron", attendanceController.attedanceCron)
     .get(
    "/attendenceDetails",
    attendanceController.attendenceDetails
  );
>>>>>>> b833b46cc88913f2f35970d3220718241fef0840
