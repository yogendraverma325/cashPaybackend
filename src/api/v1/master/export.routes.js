import Express from 'express';
import masterExportController from './export.controller.js'
import authentication from '../../../middleware/authentication.js';

    
export default Express
    .Router()
    .get("/employee", masterExportController.employee)
    .get("/employeeRedis", masterExportController.employeeRedis)