import Express from 'express';
import mappingController from './mapping.controller.js'
import authentication from '../../../middleware/authentication.js';

export default Express
    .Router()
    .get("/buMapping", mappingController.buMapping)