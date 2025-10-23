import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerGameHandlers } from './socketHandlers/gameHandlers.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  registerGameHandlers(io, socket);
}); 

httpServer.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
 