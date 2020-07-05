const express=require('express')
const http=require('http')
const path=require('path')
const socketio=require('socket.io')
const filter=require('bad-words')
const { generateMessages }=require('./utils/messages')
const { generateLocationmsg }=require('./utils/messages')
const { addusers, removeusers, getuser, getuserroom }=require('./utils/user')
const user = require('./utils/user')
const app=express()
const server=http.createServer(app)
const io=socketio(server)
const publicpath=path.join(__dirname, '../public')
app.use(express.static(publicpath))
io.on('connection',(socket)=>{
    console.log('New connection Established')
    socket.on('join', (options, callback) => {
        const { error, user } = addusers({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }
        socket.join(user.Room)
        

        socket.emit('welcome', generateMessages('Welcome!'))
        socket.broadcast.to(user.Room).emit('welcome', generateMessages(`${user.username} has joined!`))
        io.to(user.Room).emit('RoomData',{
            Room:user.Room,
            users :getuserroom(user.Room)

        })
        callback()
    })
    socket.on('output',(message,callback)=>{
        const fil=new filter()
        const user=getuser(socket.id)
        if(fil.isProfane(message)){
            return callback('Profinity is not allowed')
        }
        io.to(user.Room).emit('welcome',generateMessages(user.username, message))
        callback()
    })
    socket.on('Location', (coords,callback) =>{
        const user=getuser(socket.id)
        io.to(user.Room).emit('locationmessage',generateLocationmsg(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    socket.on('disconnect',()=>{
        const user=removeusers(socket.id)
        if(user){
        io.to(user.Room).emit('welcome',generateMessages(`${user.username} has left`))
        io.to(user.Room).emit('RoomData',{
            Room:user.Room,
            users:getuserroom(user.Room)
        })
        }
      
    })

})
 const port= process.env.PORT || 3000
server.listen(port,()=>{
    console.log('server started')
})