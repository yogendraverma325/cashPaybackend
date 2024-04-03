import Express from 'express';
import adminController from './admin.controller.js'
import authorization from '../../../middleware/authorization.js';

export default Express
    .Router()
    .post("/addEmployee", authorization('ADMIN'), adminController.addEmployee)