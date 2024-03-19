import Express from 'express';
import adminController  from './admin.controller.js'

export default Express
.Router()
.get("/check", adminController.checkRoute)