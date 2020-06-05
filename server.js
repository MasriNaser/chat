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

// Set static folder
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
    // send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
  // client is left
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'sms',
        formatMessage(botName, `${user.username} has left:(`)
      );
      // send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.rrom)
      });
    }
  });
  // Listen for chatSms
  socket.on('chatMessage', msgInput => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('sms', formatMessage(user.username, msgInput));
  });
});

const PORT = 3003 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
