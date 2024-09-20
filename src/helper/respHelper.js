import constant from '../constant/messages.js'

const msg = function (res, data) {
    switch (data.status) {
        case 200:
            res.status(data.status).json({
                statusCode: 200,
                status: true,
                token: data.token || res.token,
                message: data.msg,
                data: data.data,
            });
            break;

        case 201:
            res.status(data.status).json({
                statusCode: 201,
                status: true,
                token: data.token,
                message: data.msg,
                data: data.data,
            });
            break;

        case 202:
            res.status(data.status).json({
                statusCode: 202,
                status: true,
                token: data.token,
                message: data.msg,
                data: data.data,
            });
            break;

        case 204:
            res.status(data.status).json({
                statusCode: 204,
                status: false,
                message: data.msg,
                data: data.data,
            });
            break;

        case 400:
            res.status(data.status).json({
                statusCode: 400,
                status: false,
                message: data.msg || constant.BAD_REQUEST,
            });

            break;

        case 401:
            res.status(data.status).json({
                statusCode: 401,
                status: false,
                message: data.msg || constant.UNAUTHORIZED_ACCESS,
            });

            break;

        case 402:
            res.status(data.status).json({
                statusCode: 402,
                status: false,
                message: data.msg
            });

            break;

        case 403:
            res.status(data.status).json({
                statusCode: 403,
                status: false,
                message: data.msg,
            });

            break;

        case 404:
            res.status(data.status).json({
                statusCode: 404,
                status: false,
                message: data.msg || constant.NOT_FOUND
            });

            break;

        case 422:
            res.status(data.status).json({
                statusCode: 422,
                status: false,
                message: data.msg || constant.UNPROCESSABLE_ENTITY,
            });

            break;

        case 429:
            res.status(data.status).json({
                statusCode: 429,
                status: false,
                message: data.msg || constant.TOO_MANY_REQUESTS,
            });

            break;

        case 500:
            res.status(data.status).json({
                statusCode: 500,
                status: false,
                message: data.msg || constant.SOMETHING_WENT_WRONG,
            });

            break;
        case 600:
            res.status(data.status).json(data.data);
            break;
    }
};

export default msg