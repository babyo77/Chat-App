const express = require('express');
const dotenv = require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  maxHttpBufferSize: 2 * 1024 * 1024 * 1024,
  pingTimeout: 600000,  // Set the ping timeout to 10 minutes
  pingInterval: 25000, 
});
const fs = require('fs')

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.render('index');

});

const rooms = {};



io.on('connection', (socket) => {

  // Function to join a room
  socket.on('join-room', (roomName, userId) => {
   // Create the room if it doesn't exist
    if (!rooms[roomName]) {
      rooms[roomName] = { users: [] };
      console.log(socket.request.session)
    }

    // Join the room
    socket.join(roomName);

    // Store the current room in the socket's properties
    socket.room = roomName;

    // Store the user ID in the socket's properties
    socket.userId = userId;

    // Add the user to the room's user list
    rooms[roomName].users.push(userId);

    // Notify other users in the room about the new connection
    socket.broadcast.to(roomName).emit('user-connected', userId);

    socket.on('file-upload', ({ fileName, fileData },userId) => {
      // Process and send the file data to all connected clients
      io.to(roomName).emit('file-receive', { fileName, fileData },userId);
    });

    // Notify the newly connected user about other users in the room
    const usersInRoom = rooms[roomName].users.map((user) => user.userId);
    socket.emit('users-in-room', usersInRoom);

    console.log(`User ${userId} connected to room ${roomName}`);
  });

  socket.on('message', (message, userId) => {

    socket.broadcast.to(socket.room).emit('message', message, userId);
  });
  socket.on('typing', (isTyping,userId) => {
   
    socket.broadcast.to(socket.room).emit('typing', userId, isTyping);
});

  socket.on('disconnect', () => {
    const roomName = socket.room;
    const userId = socket.userId;

    // Remove the user from the room's user list
    if (rooms[roomName]) {
      rooms[roomName].users = rooms[roomName].users.filter((user) => user.userId !== userId);
    }
        
    // Notify other users in the room about the disconnection
    socket.broadcast.to(roomName).emit('user-disconnected', userId);


    console.log(`User ${userId} disconnected from room ${roomName}`);
  });

 
  
  console.log(rooms)
  
});

server.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
