// grap the chat-from from html
const chatForm = document.getElementById('chat-form');
console.log(chatForm, 'its the form!');
const chatMessagesScroll = document.querySelector('.chat-messages');

const socket = io();
// console.log(socket);

// sms from server
socket.on('sms', message => {
  console.log(message);
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
  msgInput.focus();
});

// output message to DOM
// dom manipulation
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">Top<span>9/12pm</span></p>
  <p class="text">
  ${message}
  </p>
  `;
  document.querySelector('.chat-messages').appendChild(div);
}
