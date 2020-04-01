// grap the chat-from from html
const chatForm = document.getElementById('chat-form');
console.log(chatForm, 'its the form!');
const chatMessagesScroll = document.querySelector('.chat-messages');

// get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
console.log(username, 'this is from url');

const socket = io();
// console.log(socket); 

// join chatroom
socket.emit('joinRoom', { username, room });

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
