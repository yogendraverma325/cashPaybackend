import Express from 'express';
import paymentController from './payment.controller.js'
import authentication from '../../../middleware/authentication.js';

export default Express
    .Router()
    .get('/payElements', authentication.authenticate, paymentController.payElements)
    .get("/paySlip", authentication.authenticate, paymentController.paySlips)
    .get("/payPackage", authentication.authenticate, paymentController.payPackage)
    .get("/ctcProration", authentication.authenticate, paymentController.ctcProration)
