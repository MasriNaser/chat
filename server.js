const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
// call format from utils
const formatMessage = require('./utils/messages');

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// breng static folder
app.use(express.static(path.join(__dirname, 'public')));

// admain var
const botName = 'welcome from';

// run when cleint connect
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit('sms', formatMessage(botName, 'Welcome here!'));

    // broadcast user connects not the user who connects
    socket.broadcast
      .to(user.room)
      .emit(
        'sms',
        formatMessage(botName, `${user.username} has joined the chat`)
      );
  });

  // console.log('new ws connection...');

  // to everyone
  // io.emit();

  // client is left
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'sms',
        formatMessage(botName, `${user.username} has left:(`)
      );
    }
  });
  // Listen for chatSms
  socket.on('chatMessage', msgInput => {
    const user = getCurrentUser(socket.id);
    // console.log(user, 'is the user');
    // console.log(msgInput);
    io.to(user.room).emit('sms', formatMessage(user.username, msgInput));
  });
});

const PORT = 3003 || process.env.PORT;

server.listen(PORT, () => console.log(`shit is here ${PORT}`));
