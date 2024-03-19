import validator from '../../../helper/validator.js';
import db from '../../../config/db.config.js'
import helper from '../../../helper/helper.js';

import bcrypt from 'bcrypt';

class AuthController {

    /**
     * @swagger
     * /api/auth/login:
     *   get:
     *     summary: Returns a hello message
     *     responses:
     *       200:
     *         description: Successful response with a hello message
     */

    login = async (req, res) => {
        try {

            const result = await validator.loginSchema.validateAsync(req.body);
            const existUser = await db.employeeMaster.findOne({ raw: true, where: { email: result.email } });

            if (!existUser) {
                return res.status(404).json({ msg: "user doesn't exist" })
            }

            const comparePass = await bcrypt.compare(result.password, existUser.password);

            if (!comparePass) {

                return res.status(404).json({ msg: "Invalid Credentials!" })
            }

            const payload = {
                user: {
                    id: existUser.id,
                    name: existUser.name,
                },
            };

            const token = await helper.generateSessionToken(payload);

            return res.status(200).json({
                statusCode: "10000",
                message: "Login Success",
                data: {
                    emp: existUser,
                    tokens: {
                        accessToken: token,
                        refreshToken: token
                    }
                }
            })
        } catch (error) {
            console.log(error)
            if (error.isJoi === true) {
                res.status(422).json({ message: error.details[0].message })
            }
            res.status(500).json({ message: 'Something Went Wrong' })
        }
    }
}

export default new AuthController();