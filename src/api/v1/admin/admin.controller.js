import formidable from 'formidable';
import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';
// import sequelize from '../../../config/db.config.js';
import validator from '../../../helper/validator.js';
import logger from '../../../helper/logger.js'


class checkRoute {

    /**
     * @swagger
     * /api/admin/check:
     *   get:
     *     summary: Returns a hello message
     *     responses:
     *       200:
     *         description: Successful response with a hello message
     */

    checkRoute = async (req, res, next) => {
        try {
            logger.info("it is logged here: checked")
            logger.error("it is logged here: checked")
            // throw new Error('cheking error if it is working!!')
            res.send("check api working")
        } catch (error) {
            next(error)
        }

    }




}

export default new checkRoute();