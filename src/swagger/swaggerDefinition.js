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
                    parameters: [
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
            '/api/attendance/regularizeRequest': {
                post: {
                    summary: 'Initiate Regularize Request',
                    tags: ["Attendance"],
                    description: 'To Initiate the Regularization Request',
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
                                        fromDate: {
                                            type: 'string',
                                            example: '',
                                            description: 'From Date (YYYY-MM-DD)',
                                        },
                                        toDate: {
                                            type: 'string',
                                            example: '',
                                            description: 'To Date (YYYY-MM-DD)',
                                        },
                                        attendanceAutoId: {
                                            type: 'number',
                                            example: '',
                                            description: 'Attendance Auto ID from Attendance List',
                                        },
                                        locationType: {
                                            type: 'string',
                                            example: '',
                                            description: "Location Type like as (Home, Office)",
                                        },
                                        punchInTime: {
                                            type: 'string',
                                            example: '',
                                            description: "Punch In time (HH:mm:ss) 24 HR format",
                                        },
                                        punchOutTime: {
                                            type: 'string',
                                            example: '',
                                            description: "Punch In time (HH:mm:ss) 24 HR format",
                                        },
                                        reason: {
                                            type: 'string',
                                            example: '',
                                            description: "Reason of Attendance Regularization",
                                        },
                                        remark: {
                                            type: 'string',
                                            example: '',
                                            description: "User's Remark for Attendance Regularization",
                                        },
                                    },
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

            '/api/attendance/approveRegularizationRequest': {
                post: {
                    summary: 'Approve or Reject Regularization Request',
                    tags: ["Attendance"],
                    description: 'Manager Can Approve and Reject the Request',
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
                                        regularizeId: {
                                            type: 'number',
                                            example: '',
                                            description: 'Id of Regulariation List',
                                        },
                                        remark: {
                                            type: 'string',
                                            example: '',
                                            description: "Manager's Remark",
                                        },
                                        status: {
                                            type: 'number',
                                            example: '',
                                            description: 'This is the Status of the Action\n Approve =1 \n Reject =0',
                                        },
                                    },
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
        },
    },
    apis: ['../index.js'],
};
