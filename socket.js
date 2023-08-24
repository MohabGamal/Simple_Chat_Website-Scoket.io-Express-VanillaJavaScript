const socketio = require('socket.io');
const formatMessage = require("./utils/messages");
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
  } = require("./utils/users");
  

const bot = "Chat Bot";


LSNERS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    JOINROOM: "joinRoom",
    MESSAGE: "message",
}

EMITERS = {
    MESSAGE: "message",
    ROOMUSERS: "roomUsers"
}

const socketServer = (server) => {
    io = socketio(server)

    /// @param socket is event session of the entered user 
    // socket id is the client id not the session
    io.on(LSNERS.CONNECTION, (socket) => { 
        // join room
        socket.on(LSNERS.JOINROOM, ({username, room}) => {
            const user = userJoin(socket.id, username, room)
            socket.join(user.room)
            // emit this message to entered client
            socket.emit(EMITERS.MESSAGE, formatMessage(bot, 'Welcome to ChatSocket'))
            // emit this message to all clients except the entered client
            socket.broadcast.to(user.room).emit(EMITERS.MESSAGE, formatMessage(bot, `${user.username} has entered the room`))
        
            io.emit(EMITERS.ROOMUSERS, {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        })
        
        // listen to users messages 
        socket.on(LSNERS.MESSAGE, (msg) => {
            const user = getCurrentUser(socket.id)
            // emit server messages to all users
            io.to(user.room).emit(EMITERS.MESSAGE, formatMessage(user.username, msg))
        })

        socket.on(LSNERS.DISCONNECT, (reason) => {
            const user = userLeave(socket.id)
            // emit this message to all clients including the left client
            user && io.to(user.room).emit(EMITERS.MESSAGE, formatMessage(bot, `${user.username} left because ${reason}`))

            user && io.to(user.room).emit(EMITERS.ROOMUSERS, {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        })
    })
}

module.exports = socketServer