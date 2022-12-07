import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import { ServerSocket } from './server-socket';
import { Stage } from './stage';
import { apiRouter } from './api';

const app = express();

app.use(bodyParser.json());

// app.use('/assets', express.static(path.join(__dirname, 'assets')));

const port = process.env['port'] || 3333;
const server = http.createServer(app);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = new ServerSocket(server, (channel) => {
  const stage = Stage.instances.get(channel.stageId);

  stage?.scene.connection(channel);
});

app.use('/api', apiRouter(socket));

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
