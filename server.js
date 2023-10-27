const express = require('express');
const dotenv = require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const TelegramBot = require('node-telegram-bot-api');
const requestIp = require('request-ip');
const rooms = {};
const token = process.env.TELEGRAM_API;
const chatId = process.env.CHAT_ID
const bot = new TelegramBot(token, {polling: true});

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(requestIp.mw());
app.use((req, res, next) => {
    const clientIP = requestIp.getClientIp(req);
    const userAgent = req.get('user-agent'); 
    console.log(`User-Agent: ${userAgent}`);
    // bot.sendMessage(chatId, `Client IP:  ${clientIP}\nUser-Agent:  ${userAgent}`);
    next();
  });

app.get('/', (req, res) => {
  res.render('index');
});


io.on('connection', (socket) => {

   socket.on('new-user',userId=>{
   try {
    bot.sendMessage(chatId, `New User Logged In: ${userId}`);
   } catch (error) {
    console.log("error sending message")
   }
   })
  // Function to join a room
  socket.on('join-room', (roomName, userId) => {
    // Create the room if it doesn't exist
    if (!rooms[roomName]) {
      rooms[roomName] = { users: [] };
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
