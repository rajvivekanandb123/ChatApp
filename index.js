import express from 'express';
import cors from 'cors';
import http from 'http';
import  {Server} from 'socket.io';
const app=express();
app.use(cors());
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:['GET','POST']
    }
})
io.on('connection',(socket)=>{
    console.log(`user connected ${socket.id}`)
    socket.on('send-message', (message) => {
        console.log(message);
        // Broadcasting messages to clients
        io.to(message.scnduser).emit('received-message', message);
        // Send acknowledgement back to the client
       
    });

    socket.on('disconnect',()=>{
        //on disconnecting
        console.log('user disconnected')
    })
})
server.listen(5100,()=>{
    console.log('server running on the port 5100')
})
