export const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HRMS',
            version: '1.0.0',
            description: 'API documentation for HRMS application',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
                description: 'Local server',
            },
            {
                url: `https://teamsproject.teamcomputers.com/hrms-dev`,
                description: 'Dev server',
            },
        ],
        components: {
            securitySchemes: {
                accessTokenAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "accessToken",
                },
            },
        },
        paths: {
            '/api/auth/login': {
                post: {
                    summary: 'Login',
                    tags: ["Auth"],
                    description: 'This Endpoint will be use for Login into Application',
                    requestBody: {
                        required: true,
                        content: {
                           'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        tmc: {
                                            type: 'string',
                                            example: '15368',
                                            description: 'TMC number',
                                        },
                                        password: {
                                            type: 'string',
                                            example: 'test1234',
                                            description: 'User password',
                                        },
                                    },
                                    required: ['tmc', 'password'],
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Success',
                        },
                        '401': {
                            description: `User Doesn't Exists`,
                        },
                        '404': {
                            description: `Invalid Credentials!`,
                        },
                    },
                },
            },
            '/api/master/employee': {
                get: {
                    summary: 'Employee List',
                    tags: ["Master"],
                    description: 'Employee List',
                    security: [
                        {
                            accessTokenAuth: [],
                        },
                    ],
                    parameters: [
                        {
                            name: 'accessToken',
                            in: 'header',
                            required: true,
                            description: 'Access token for authentication',
                            schema: {
                                type: 'string',
                                example: 'yourAccessTokenHere',
                            },
                        },
                        {
                            name: 'search',
                            in: 'query',
                            required: false,
                            description: 'Search term for filtering employees by code, name, or email',
                            schema: {
                                type: 'string'
                            },
                        },
                        {
                            name: 'department',
                            in: 'query',
                            required: false,
                            description: 'Filter by department name',
                            schema: {
                                type: 'string'
                            },
                        },
                        {
                            name: 'designation',
                            in: 'query',
                            required: false,
                            description: 'Filter by designation name',
                            schema: {
                                type: 'string'
                            },
                        },
                        {
                            name: 'buSearch',
                            in: 'query',
                            required: false,
                            description: 'Filter by business unit name',
                            schema: {
                                type: 'string'
                            },
                        },
                        {
                            name: 'sbuSearch',
                            in: 'query',
                            required: false,
                            description: 'Filter by sub-business unit name',
                            schema: {
                                type: 'string'
                            },
                        },
                        {
                            name: 'areaSearch',
                            in: 'query',
                            required: false,
                            description: 'Filter by functional area name',
                            schema: {
                                type: 'string'
                            },
                        },
                        {
                            name: 'pageNo',
                            in: 'query',
                            required: false,
                            description: 'Filter by functional area name',
                            schema: {
                                type: 'integer'
                            },
                        },
                        {
                            name: 'limit',
                            in: 'query',
                            required: false,
                            description: 'Filter by functional area name',
                            schema: {
                                type: 'integer'
                            },
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Success',
                        },
                    },
                },
            },
            '/api/master/bu': {
                get: {
                    summary: 'Bu List',
                    tags: ["Master"],
                    description: 'Bu List',
                    security: [
                        {
                            accessTokenAuth: [],
                        },
                    ],
                    parameters: [
                        {
                            name: 'accessToken',
                            in: 'header',
                            required: true,
                            description: 'Access token for authentication',
                            schema: {
                                type: 'string',
                                example: 'yourAccessTokenHere',
                            },
                        },
                        {
                            name: 'companyId',
                            in: 'query',
                            required: true,
                            description: 'Company ID to filter business units',
                            schema: {
                                type: 'integer',
                                example: '12345',
                            },
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Success',
                        },
                    },
                },
            },
            '/api/master/band': {
                get: {
                    summary: 'Band List',
                    tags: ["Master"],
                    description: 'Band List',
                    security: [
                        {
                            accessTokenAuth: [],
                        },
                    ],
                    parameters: [
                        {
                            name: 'accessToken',
                            in: 'header',
                            required: true,
                            description: 'Access token for authentication',
                            schema: {
                                type: 'string',
                                example: 'yourAccessTokenHere',
                            },
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Success',
                        },
                    },
                },
            },
        },
    },
    apis: ['../index.js'],
};
