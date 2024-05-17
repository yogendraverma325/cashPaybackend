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
                                            description: 'Description of Field 1',
                                        },
                                        password: {
                                            type: 'string',
                                            example: 'test1234',
                                            description: 'Description of Field 2',
                                        },
                                    },
                                    required: ['field1'],
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Success',
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
