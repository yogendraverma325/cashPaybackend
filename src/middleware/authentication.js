import jwt from 'jsonwebtoken';
import helper from '../helper/helper.js';
import respHelper from '../helper/respHelper.js';
import constant from '../constant/messages.js'

class Authentication {
    async authenticate(req, res, next) {
        const token = req.headers['accesstoken'];
        if (!token) {
            return respHelper(res, {
                status: 401,
                msg: constant.INVALID_AUTH,
            });
        }

        jwt.verify(
            token,
            process.env.JWT_KEY,
            async function (err, decoded) {
                if (err) {
                    if (err instanceof jwt.TokenExpiredError) {
                        return respHelper(res, {
                            status: 401,
                            msg: constant.SESSION_EXPIRED,
                        });
                    }

                    if (err instanceof jwt.JsonWebTokenError) {
                        return respHelper(res, {
                            status: 401,
                            msg: constant.INVALID_TOKEN,
                        });
                    }

                    return respHelper(res, {
                        status: 401,
                        msg: constant.INVALID_AUTH,
                    });
                }

                if (!(await helper.checkActiveUser(decoded.user.id))) {
                    return respHelper(res, {
                        status: 401,
                        msg: constant.USER_NOT_EXIST,
                    });
                }
                const token = await helper.generateJwtToken({ user: decoded.user });

                req.userId = decoded.user.id;
                req.sessionToken = token;
                next();
            },
        );
    }

    // async sso(req, res, next) {
    //     const token = req.headers['sso-token'];
    //     if (!token) {
    //         return respHelper(res, {
    //             status: 401,
    //             msg: constant.NOT_LOGGED_IN,
    //         });
    //     }
    //     try {
    //         const authenticatedUser = jwt.decode(token, { algorithms: ['HS256'] });
    //         const expiryTime = new Date(authenticatedUser.exp);
    //         const currentTime = new Date().getTime() / 1000;
    //         if (expiryTime > currentTime) {
    //             req.user = authenticatedUser.sub;
    //             next();
    //         } else {
    //             return respHelper(res, {
    //                 status: 401,
    //                 msg: constant.SESSION_EXPIRED,
    //             });
    //         }
    //     } catch (error) {
    //         return respHelper(res, {
    //             status: 401,
    //             msg: constant.INVALID_TOKEN,
    //         });
    //     }
    // }
}

export default new Authentication();

