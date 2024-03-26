import routes from './routes.js';
import Server from './common/server.js';

const server = new Server();

server.router(routes)
server.configureSwagger(process.env.PORT);
server.handleError();
server.listen(process.env.PORT);

export default server;
