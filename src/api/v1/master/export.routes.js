import Express from 'express';
import masterExportController from './export.controller.js'
import authentication from '../../../middleware/authentication.js';
import multer from 'multer';
import rateLimit from '../../../middleware/rateLimit.js';
import authorization from '../../../middleware/authorization.js';

// Set up multer to handle file uploads
const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });
const upload = multer({ dest: 'uploads/excel/' });

export default Express
    .Router()
    .get("/employee", rateLimit.limiter, masterExportController.employee)
    .get("/employeeRedis", masterExportController.employeeRedis)
    .get("/employeeImport", upload.single('excelFile'), masterExportController.employeeImport)
    .get("/employeeImportNew", upload.single('excelFile'), masterExportController.employeeImportNew)
    .post("/employeeMissedData", masterExportController.employeeMissedData)
    .get("/allAttendancePunchDetails", masterExportController.allAttendancePunchDetails)
    .get("/attendanceSummary", masterExportController.attendanceSummary)
    .get("/employeeMasterExport", masterExportController.employeeMasterExport)
    .get("/sperationPending", masterExportController.sperationPending)
    .get("/sperationApproved", masterExportController.sperationApproved)
    .get("/sperationApprovedHistory", masterExportController.sperationApprovedHistory)




