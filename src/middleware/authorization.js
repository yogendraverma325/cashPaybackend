import respHelper from '../helper/respHelper.js';
import constant from '../constant/messages.js'

const restrictTo =
    (...roles) =>
        async (req, res, next) => {
            !roles.includes(req.userRole)
                ? respHelper(res, {
                    status: 403,
                    msg: constant.UNAUTHORIZED_ACCESS
                })
                : next();
        };

export default restrictTo;

