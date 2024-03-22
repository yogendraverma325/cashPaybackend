import Express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import respHelper from '../helper/respHelper.js'
import * as http from 'http';
import '../config/db.config.js';

import logger from '../helper/logger.js';
import rootpath from '../helper/rootPath.js';
console.log("server",process.env.DBNAME)
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
          title: 'Project DataLocker',
          version: '1.0.0',
          description: 'API documentation for datalocker app',
        },
        servers: [
          {
            url: `http://localhost:${port}`,
            description: 'Local server',
          },
          {
            url: `https://temsproject.teamcomputers.com/datalocker-devapi`,
            description: 'dev server',
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
      console.log(`secure app is listening @port ${port}`);
      logger.info(`secure app is listening @port ${port}`);
    });
    server.timeout = 50000;
    return this.app;
  }
}

export default ExpressServer;
