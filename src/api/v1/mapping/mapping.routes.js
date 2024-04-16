import Express from 'express';
import mappingController from './mapping.controller.js'
import authentication from '../../../middleware/authentication.js';

export default Express
    .Router()
    .get("/groupCompany", authentication.authenticate, mappingController.groupCompany)
    .get("/company", authentication.authenticate, mappingController.company)
    .get("/bu", authentication.authenticate, mappingController.bu)
    .get("/sbu", authentication.authenticate, mappingController.sbu)