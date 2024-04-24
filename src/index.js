import './config/db.config.js'
import './config/redisDb.config.js'
import routes from './routes/routes.js';
import Server from './common/server.js';
import app from './common/app.js';
import io from './services/socketService.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path'
import rootpath from './helper/rootPath.js'
import logger from './helper/logger.js';
import respHelper from './helper/respHelper.js'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'

app.use(helmet());
app.use(morgan('dev'));
app.use(cors())
app.use('/api', routes)

app.get("/api", (req, res) => {
    res.send("App is Running")
})

app.get('/api/uploads/:user/:fileName', (req, res) => {
    res.sendFile(path.join(rootpath, `../uploads/${req.params.user}/${req.params.fileName}`,));
});

app.use((req, res, next) => {
    next()
})

app.use((err, req, res, next) => {
    logger.error(err.stack);
    return respHelper(res, {
        status: 500
    })
});


const swaggerOptions = {
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
                url: `https://teamsproject.teamcomputers.com/hrms-dev/api`,
                description: 'Dev server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [`${rootpath}/api/v1/**/*.js`]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

io.on('connection', socket => {
    console.log('Client Socket Connected');
    // socket.on('new-user-joined', name => {
    //   users[socket.id] = name;
    //   socket.broadcast.emit('user-joined', name);
    // });

    socket.on('disconnect', () => {
        console.log('Client Socket Disconnected');
    });

    // socket.emit('test', 'Socket Connected With Server');
});

export default Server