import Express from 'express';
import authController from './auth.controller.js'
import authentication from '../../../middleware/authentication.js';

export default Express
    .Router()
    .post("/login", authController.login)
    .get("/sso", authentication.sso, authController.sso)

    // .get("/test", authController.testapi)