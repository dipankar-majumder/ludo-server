import express = require('express');
import socketIO = require('socket.io');
import { Application, Request, Response } from 'express';

console.log('Server Execution Started.');

const app: Application = express();
const http = require('http').createServer(app);
const io = socketIO(http);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    data: 'JSON REST API',
  });
});

io.on('connection', socket => {
  console.log(`User connected ${socket.id}`);
  // https://stackoverflow.com/questions/19150220/creating-rooms-in-socket-io
  socket.on('create_room', room => {
    socket.join(room);
    // socket.in(room).emit('commands', data);
  });
});

http.listen(process.env.PORT || 5000);
