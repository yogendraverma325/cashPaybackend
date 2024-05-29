import Express from 'express';
import adminController from './admin.controller.js'
import authorization from '../../../middleware/authorization.js';

export default Express
    .Router()
    .post("/addEmployee", authorization('ADMIN'), adminController.addEmployee)
    .put("/updateBiographicalDetails", authorization('ADMIN'), adminController.updateBiographicalDetails)
    .post("/unlockAccount", authorization('ADMIN'), adminController.unlockAccount)
    .post("/resetPassword", authorization('ADMIN'), adminController.resetPassword)