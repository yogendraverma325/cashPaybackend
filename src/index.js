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

app.use(helmet());
app.use(morgan('dev'));
app.use(cors())
app.use('/api', routes)

helper.checkFolder()

app.get("/api", (req, res) => {

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chat Widget</title>
    </head>
    <body>
    hello
      <script>
        var url = "https://wati-integration-prod-service.clare.ai/v2/watiWidget.js?74754";
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = url;
        var options = {
          enabled: true,
          chatButtonSetting: {
            backgroundColor: "#00e785",
            ctaText: "Chat with us",
            borderRadius: "25",
            marginLeft: "0",
            marginRight: "20",
            marginBottom: "20",
            ctaIconWATI: false,
            position: "right",
          },
          brandSetting: {
            brandName: "Wati",
            brandSubTitle: "undefined",
            brandImg: "https://www.wati.io/wp-content/uploads/2023/04/Wati-logo.svg",
            welcomeText: "Hi there!\\nHow can I help you?",
            messageText: "Hello, %0A I have a question about {{page_link}}",
            backgroundColor: "#00e785",
            ctaText: "Chat with us",
            borderRadius: "25",
            autoShow: true,
            phoneNumber: "7017734526",
          },
        };
        s.onload = function () {
          CreateWhatsappChatWidget(options);
        };
        var x = document.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(s, x);
      </script>
    </body>
    </html>
  `;

  res.send(htmlContent);
})

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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