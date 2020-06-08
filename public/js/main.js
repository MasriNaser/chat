const chatForm = document.getElementById('chat-form');
const chatMessagesScroll = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
// get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
console.log(username, 'this is from url');

const socket = io();
// console.log(socket); 

// join chatroom
socket.emit('joinRoom', { username, room });

// get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
})

// sms from server
socket.on('sms', message => {
  console.log(message, 'message from socket');
  // adapt the dom
  outputMessage(message);
  // scroll down
  chatMessagesScroll.scrollTop = chatMessagesScroll.scrollHeight;
});

//  sms submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  const msgInput = e.target.elements.msg.value;
  // console.log(msgInput);
  socket.emit('chatMessage', msgInput);

  //  clear input
  e.target.elements.msg.value = '';
  chatForm.focus();
});

// output message to DOM
// dom manipulation
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
  <p class="text">
  ${message.text}
  </p>
  `;
  document.querySelector('.chat-messages').appendChild(div);
}

// add room name to dom
function outputRoomName(room) {
  roomName.innerHTML = room;
}

// add users to dom
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

// deploy

const firebaseConfig = {
  apiKey: "AIzaSyDXZIT7ahVE9jZVIE_ce-_eFhLiH9NAFww",
  authDomain: "chat-exx.firebaseapp.com",
  databaseURL: "https://chat-exx.firebaseio.com",
  projectId: "chat-exx",
  storageBucket: "chat-exx.appspot.com",
  messagingSenderId: "452794203839",
  appId: "1:452794203839:web:a5345509d7673485ed900a",
  measurementId: "G-Y9FNC9B8Z5"
};