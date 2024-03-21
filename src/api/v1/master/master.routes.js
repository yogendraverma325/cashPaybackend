import Express from 'express';
import masterController from './master.controller.js'

export default Express
    .Router()
    .get("/reporties", masterController.reporties)
    .get("/band", masterController.band)
    .get("/bu", masterController.bu)
    .get("/costCenter", masterController.costCenter)
    .get("/designation", masterController.designation)
    .get("/grade", masterController.grade)
    .get("/jobLevel", masterController.jobLevel)
    .get("/functionalArea", masterController.functionalArea)
    .get("/state", masterController.state)
    .get("/region", masterController.region)
