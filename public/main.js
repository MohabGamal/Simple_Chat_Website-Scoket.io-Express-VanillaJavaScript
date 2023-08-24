const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

console.log(chatForm)
// parse url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io()

LSNERS = {
    MESSAGE: "message",
    SUBMIT: "submit",
    ROOMUSERS: "roomUsers"
}

EMITERS = {
    MESSAGE: "message",
    JOINROOM: "joinRoom",
}

socket.emit(EMITERS.JOINROOM, {username, room})

// Get room and users
socket.on(LSNERS.ROOMUSERS, ({ room, users }) => {
    // console.log(room, users)
    outputRoomName(room);
    outputUsers(users);
});

// listen to all server messages
socket.on(LSNERS.MESSAGE, (msg) => {
    // show message in html
    outputMessage(msg)
    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

chatForm.addEventListener(LSNERS.SUBMIT, (e) => {
    e.preventDefault()
    const inputMsg = e.target.elements.msg.value
    // emit input messages to server
    socket.emit(EMITERS.MESSAGE, inputMsg);

    // clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})


function outputMessage(message) {
    console.log("nnnn", message);
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span> ${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
} 

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}
  
  // Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) window.location = '../index.html';
})