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

            // Auth APIs
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
                                            example: '',
                                            description: "User's TMC"
                                        },
                                        password: {
                                            type: 'string',
                                            example: 'test1234',
                                            description: 'Password',
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
                    },
                },
            },

            // Master APIs
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

            // Attendance APIs
            '/api/attendance/markAttendance': {
                post: {
                    summary: 'Mark Attendance',
                    tags: ["Attendance"],
                    description: 'Using this API user Can Mark Their Attendance',
                    security: [
                        {
                            accessTokenAuth: [],
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        locationType: {
                                            type: 'string',
                                            example: '',
                                            description: 'Punch In/Out Location Type',
                                        },
                                        remark: {
                                            type: 'string',
                                            example: '',
                                            description: 'Punch In/Out Remark (Optional)',
                                        },
                                        location: {
                                            type: 'string',
                                            example: '',
                                            description: 'Punch In/Out Location (Address)',
                                        },
                                        latitude: {
                                            type: 'string',
                                            example: '',
                                            description: "Punch In/Out Location's Latitude",
                                        },
                                        longitude: {
                                            type: 'string',
                                            example: '',
                                            description: "Punch In/Out Location's Longitude",
                                        },
                                    },
                                    required: ['locationType', 'location', 'latitude', 'longitude'],
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Success',
                        },
                        '500': {
                            description: 'Error',
                        },
                    },
                },
            },
            "/api/attendance/attendanceList": {
                get: {
                    summary: "Get Attendance List",
                    tags: ["Attendance"],
                    security: [
                        {
                            accessTokenAuth: [],
                        },
                    ],
                    parameters: [
                        {
                            name: "year",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                                example: "2024"
                            }
                        },
                        {
                            name: "month",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                                example: "05"
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Success',
                        },
                        '500': {
                            description: 'Error',
                        },
                    },
                },
            },
        },
    },
    apis: ['../index.js'],
};
