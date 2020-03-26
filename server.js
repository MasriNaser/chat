const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// breng static folder
app.use(express.static(path.join(__dirname, 'public')));

// run when cleint connect
io.on('connection', socket => {
  // console.log('new ws connection...');

  socket.emit('sms', 'Welcome here!');

  // broadcast user connects not the user who connects
  socket.broadcast.emit('sms', 'A user has joined the chat');

  // to everyone
  // io.emit();

  // client is left
  socket.on('disconnect', () => {
    io.emit('sms', 'A user left!');
  });
  // Listen for chatSms
  socket.on('chatMessage', msgInput => {
    // console.log(msgInput);
    io.emit('sms', msgInput);
  });
});

const PORT = 3003 || process.env.PORT;

server.listen(PORT, () => console.log(`shit is here ${PORT}`));
