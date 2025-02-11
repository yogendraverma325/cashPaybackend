import './config/db.config.js'
import './config/redisDb.config.js'
import './services/cronService.js';
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
import { swaggerOptions } from './swagger/swaggerDefinition.js';
import helper from './helper/helper.js';
import detectDevice from './middleware/detectDevice.js';

app.use(helmet());
app.use(morgan('dev'));
app.use(cors())
app.use('/api', detectDevice, routes)

helper.checkFolder()

app.get("/api", (req, res) => {
  res.redirect(process.env.CLIENT_URL)
})

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// add this
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.get('/api/uploads/:user/:fileName', (req, res) => {
  res.sendFile(path.join(rootpath, `../uploads/${req.params.user}/${req.params.fileName}`,));
});

app.use((req, res, next) => {
  next()
})

app.use((err, req, res, next) => {
  console.log(err)
  logger.error(err.stack);
  return respHelper(res, {
    status: 500
  })
});

io.on('connection', socket => {
  console.log('Client Socket Connected');
  // console.log(socket)
  socket.on('new-user-joined', name => {
    //   users[socket.id] = name;

    socket.broadcast.emit('user-joined', name);
  });

  socket.on('disconnect', () => {
    console.log('Client Socket Disconnected');
  });

  socket.emit('test', 'Socket Connected With Server');
});

export default Server