
import routes from './routes.js';
import Server from './common/server.js';

const server = new Server();

server.router(routes)
server.configureSwagger(8089);
server.handleError();
server.listen(8089);

export default server;
