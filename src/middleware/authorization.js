import respHelper from '../helper/respHelper';

const restrictTo =
    (...roles) =>
        async (req, res, next) => {
            !roles.includes(req.userRole)
                ? respHelper(res, {
                    status: 403,
                })
                : next();
        };

export default restrictTo;

