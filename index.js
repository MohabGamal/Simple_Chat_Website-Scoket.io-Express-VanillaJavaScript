const express = require('express');
const http = require('http');
const path = require('path');

const socketServer = require('./socket.js');

const app = express();
const server = http.createServer(app);
// const io = socketio(server)
socketServer(server)

//static
app.use(express.static(path.join(__dirname, 'public')))

const PORT = 5000 || process.env.PORT
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));