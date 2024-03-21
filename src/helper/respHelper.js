// import constant from '../constant/messages.json'

const msg = function (res, data) {
    switch (data.status) {
        case 200:

            res.status(data.status).json({
                statusCode: "10000",
                status: true,
                token: data.token,
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
                message: data.msg || 'Bad request',
            });

            break;

        case 401:
            res.status(data.status).json({
                statusCode: 401,
                status: false,
                message: data.msg || 'Unauthorized Request',
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
                message: data.msg || 'Not Found',
            });

            break;

        case 422:
            res.status(data.status).json({
                statusCode: 422,
                status: false,
                message: data.msg || "Unprocessable Entity",
            });

            break;

        case 429:
            res.status(data.status).json({
                statusCode: 429,
                status: false,
                message: data.msg || "Too Many Requests",
            });

            break;

        case 500:
            res.status(data.status).json({
                statusCode: 500,
                status: false,
                message: data.msg || 'Something Went Wrong',
            });

            break;
        case 600:
            res.status(data.status).json(data.data);
            break;
    }
};

export default msg