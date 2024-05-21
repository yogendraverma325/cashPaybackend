import Express from 'express';
import masterExportController from './export.controller.js'
import authentication from '../../../middleware/authentication.js';
import multer from 'multer';

// Set up multer to handle file uploads
const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });
const upload = multer({ dest: 'uploads/excel/' });

export default Express
    .Router()
    .get("/employee", masterExportController.employee)
    .get("/employeeRedis", masterExportController.employeeRedis)
    .get("/employeeImport",upload.single('excelFile'), masterExportController.employeeImport)
    .post("/employeeMissedData", masterExportController.employeeMissedData)

