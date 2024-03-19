import Express from 'express';
import authController from './auth.controller.js'

export default Express
    .Router()
    .post("/login", authController.login)