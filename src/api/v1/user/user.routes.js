import Express from 'express';
import userController from './user.controller.js'
import authentication from '../../../middleware/authentication.js';

export default Express
    .Router()
    .get("/profileDetails", authentication.authenticate, userController.profileDetails)
    .get("/personalDetails", authentication.authenticate, userController.personalDetails)
    .get("/groupCompany", authentication.authenticate, userController.groupCompany)
    .get("/company", authentication.authenticate, userController.company)
    .get("/bu", authentication.authenticate, userController.bu)