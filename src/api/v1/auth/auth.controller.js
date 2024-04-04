import validator from '../../../helper/validator.js';
import db from '../../../config/db.config.js'
import helper from '../../../helper/helper.js';
import respHelper from '../../../helper/respHelper.js'
import constant from '../../../constant/messages.js'
import bcrypt from 'bcrypt';
import moment from 'moment';

class AuthController {

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Returns a hello message
     *     tags:
     *       - Auth
     *     responses:
     *       200:
     *         description: Successful response with a hello message
     */

    login = async (req, res) => {
        try {

            const result = await validator.loginSchema.validateAsync(req.body);
            const existUser = await db.employeeMaster.findOne({
                where: { empCode: result.tmc },
                include: [{
                    model: db.roleMaster,
                },
                {
                    model: db.designationMaster
                }]
            });

            if (!existUser) {
                return respHelper(res, {
                    status: 404,
                    msg: constant.USER_NOT_EXIST,
                })
            }

            const comparePass = await bcrypt.compare(result.password, existUser.password);
            delete existUser.password
            if (!comparePass) {
                return respHelper(res, {
                    status: 404,
                    msg: constant.INVALID_CREDENTIALS,
                })
            }

            await db.employeeMaster.update({ lastLogin: moment() }, {
                where: { id: existUser.id, }
            })

            const payload = {
                user: {
                    id: existUser.id,
                    name: existUser.name,
                    role: existUser.role.name
                },
            };

            const token = await helper.generateJwtToken(payload);

            return respHelper(res, {
                status: 200,
                msg: constant.LOGIN_SUCCESS,
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
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                })
            }
            return respHelper(res, {
                status: 500
            })
        }
    }
}

export default new AuthController();