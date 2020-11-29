const socket = io();

const form = document.querySelector('.form');
const formInp = document.querySelector('#inputbox')
const messageContainer = document.querySelector('.chatBox');
var audio = new Audio('../sound/sound.mp3')


// appending messages
const append = (message, position) => {
   const newMessageBox = document.createElement('div')
   newMessageBox.innerText = message
   newMessageBox.classList.add('bubble')
   newMessageBox.classList.add(position)
   messageContainer.append(newMessageBox)
   messageContainer.scrollTop = messageContainer.scrollHeight;       // auto scroll
   if(position === 'left' || position === 'center') audio.play();
}

// appending our stickers
const appendSticker = (stickNum) =>{
   messageContainer.innerHTML += `<div class="bubble-img right"><img src="img/sticker-${stickNum}.png"></div>`;
   append('you: ', 'right');
   messageContainer.scrollTop = messageContainer.scrollHeight;       // auto scroll
   socket.emit('send-sticker', stickNum);
}

// appending others sticker
const receiveNewSticker = (name, stkNum) => {
   messageContainer.innerHTML += `<div class="bubble-img left"><img src="img/sticker-${stkNum}.png"></div>`;
   append(`${name}:`, 'left')
   messageContainer.scrollTop = messageContainer.scrollHeight;       // auto scroll
}


// form submit (sending message)
form.addEventListener('submit', (e) => {
   e.preventDefault();
   const message = formInp.value;
   append(`You: ${message}`, 'right');
   socket.emit('new-msg-received', message)
   formInp.value = '';
})


const username = prompt("Enter your name to join");
socket.emit("new-user-joined", username);

// adding new user joined to chatbox
socket.on('user-joined', name => {
   append(`${name} joined the chat`, 'center')
})

// adding new chat 
socket.on('receive', data => {
   append(`${data.name}:   ${data.message}`, 'left')
})

// receive sticker
socket.on('receive-sticker', data => {
   receiveNewSticker(data.name, data.sNum)
})

// user left message
socket.on('left', name => {
   append(`${name} left`, 'center')
})