import express = require('express');
import socketIO = require('socket.io');
import { Application, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

console.clear();
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
  console.log(
    `User   connected\t${socket.id}\tTotal Connected Clients: ${
      Object.keys(io.sockets.sockets).length
    }`,
  );

  // https://stackoverflow.com/questions/19150220/creating-rooms-in-socket-io
  socket.on('new_game', callback => {
    const room = uuidv4();
    socket.join(room, err => {
      if (err) {
        console.log(`new_game => Error: ${err}`);
        callback(err);
      } else {
        console.log(`Room Created\t${room}`);
      }
    });
    callback(room);
    // socket.in(room).emit('commands', data);
  });

  socket.on('join_game', (roomName: string, callback: Function) => {
    socket.join(roomName, err => {
      console.log('join_game => Error: ', err);
      callback(err);
    });
  });

  socket.on('disconnect', () => {
    console.log(
      `User disconnected\t${socket.id}\tTotal Connected Clients: ${
        Object.keys(io.sockets.sockets).length
      }`,
    );
  });
});

const port = process.env.PORT || 5000;
http.listen(port, () =>
  console.log(`Server Started at http://localhost:${port}`),
);
