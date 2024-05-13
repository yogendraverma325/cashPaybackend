import Express from 'express';
import attendanceController from './attendance.controller.js'

export default Express
    .Router()
    .post('/markAttendance', attendanceController.attendance)
