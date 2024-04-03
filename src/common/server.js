import Express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import respHelper from '../helper/respHelper.js'
import helper from '../helper/helper.js';
import logger from '../helper/logger.js';
import rootpath from '../helper/rootPath.js';
import path from 'path';
import * as http from 'http';
import '../config/db.config.js';
import '../config/redisDb.config.js';

helper.checkFolder()

class ExpressServer {
  constructor() {
    this.app = new Express();
    this.app.use(helmet());
    this.app.use(morgan('dev'));
    this.app.use(Express.json())
    // this.app.use(cors({
    //   allowedHeaders: ['Content-Type', 'token', 'x-api-key', 'MimeType'],
    //   exposedHeaders: ['token'],
    //   origin: '*',
    //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    //   preflightContinue: true,
    // }));
    this.app.use(cors())
    this.app.get("/", (req, res) => {
      res.send("App is Running")
    })
    this.app.get('/api/uploads/:user/:fileName', (req, res) => {
      res.sendFile(path.join(rootpath, `../uploads/${req.params.user}/${req.params.fileName}`,));
    });
    this.app.use((req, res, next) => {
      //Global Middleware for Every Request
      next()
    })
  }

  router(routes) {
    routes(this.app);
    return this;
  }


  configureSwagger(port) {
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
            url: `http://localhost:${port}`,
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
      apis: [`${rootpath}/api/v1/**/*.js`] // Adjust the path based on your project structure
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    return this;
  }

  handleError() {
    this.app.use((req, res, next) => {
      return respHelper(res, {
        status: 404
      })
    });

    this.app.use((err, req, res, next) => {
      logger.error(err.stack);
      return respHelper(res, {
        status: 500
      })
    });

    return this;
  }

  listen(port) {
    const server = http.createServer(this.app).listen(port, () => {
      console.log(`App is listening @port ${port}`);
      logger.info(`App is listening @port ${port}`);
    });
    server.timeout = 50000;
    return this.app;
  }
}

export default ExpressServer;
