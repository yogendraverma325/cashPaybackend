import Express from 'express';
import masterImportController from './import.controller.js'
import multer from 'multer';

const upload = multer({ dest: 'uploads/excel/' });

export default Express
    .Router()
    .post("/onboardingEmployee", upload.single('excelFile'), masterImportController.onboardingEmployeeImport)