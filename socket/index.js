require('dotenv').config();
const allowedOrigins = process.env?.FRONTEND_URLs?.split(',');
let users = []

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
    console.log('a new user add',users)
  }
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
  console.log('a new user deleted',)

};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};


const io = require("socket.io")(8900, {
  cors: {
    origin: allowedOrigins,
  },
});

io.on('connection', (socket) => {

  //io.emit('welcome', 'hi from server ');   io.emit use to emit event from server to all clients
 // connectio ,disconnect are saved event name
 // we use socket.on in both client and server to get the event from the emitter
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log(' a new user get added',userId)
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text,conversationId,mediaUrl,mediaType }) => {
    
    console.log('here is media : ',mediaUrl)

    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
      conversationId,
      mediaUrl,
      mediaType
    });
  });
  socket.on("callUser", (data) => {
     console.log(' call event trigger ', data)
    // console.log('data in hey data.to call ', data.userToCall)

    io.to(data.calleSocketId).emit('hey', { from: data.from});
})
socket.on("acceptCall", (data) => {
 console.log('accept call event trigger ',data)
  io.to(data.to).emit('callAccepted', data.signalData);
})


  socket.on('disconnect', () => {
    console.log("A user disconnected:", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
