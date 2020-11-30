// node server this will handle socket connections
const express = require('express')
const app = express()
const path = require('path')
const http = require('http')             
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// start server
server.listen(PORT, () => console.log(`server is running on PORT ${PORT}`))



const users = [];
const userNames = [];




io.on('connection', socket =>{

   // when new user detected by the server
   socket.on("new-user-joined", (name) =>{
      console.log("new user", name);
      users[socket.id] = name;
      userNames.push(name);
      socket.emit('updated-list-of-names', userNames);
      socket.broadcast.emit('user-joined', name);
   });

   // when new message received by the server 
   socket.on('new-msg-received', message=>{
      socket.broadcast.emit('receive', {name: users[socket.id], message: message})
   });

   // broadcast sticker
   socket.on('send-sticker', stickNum => {
      socket.broadcast.emit('receive-sticker', {name: users[socket.id], sNum: stickNum})
   })

   // when user disconnect from socket server
   socket.on('disconnect', message => {
      socket.broadcast.emit('left', users[socket.id]);
      console.log(`${users[socket.id]} left`);
      var index = userNames.indexOf(users[socket.id]);
      if (index > -1) {
         userNames.splice(index, 1);
      }
   })

});