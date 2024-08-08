import Express from 'express';
import cronController from './cron.controller.js'

export default Express
    .Router()
    .get("/attendanceCron", cronController.updateAttendance)
    .get("/unlockAccount", cronController.updateActiveStatus)