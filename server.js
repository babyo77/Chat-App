const express = require('express')
const dotenv = require('dotenv').config()
const http = require('http')
const { Server } = require("socket.io");
const app = express()
const server = http.createServer(app) 
const io = new Server(server);

const PORT = process.env.PORT || 3000

app.set('view engine','ejs')
app.use(express.static('public'))

app.get('/',(req,res)=>{
res.render('index')
})

io.on("connection", (socket) => {
    socket.on("message",(message)=>{
        socket.broadcast.emit("message",message)
        console.log(`Message from Socket ${socket.id} ${message}`)
    })
  });

server.listen(PORT,()=>{
    console.log(`Server Running at ${PORT}`)
})