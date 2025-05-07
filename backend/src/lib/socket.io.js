import {Server} from 'socket.io'
import http from 'http'

import express from 'express'
import { updateLastSeen } from '../controllers/auth.controller.js'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors : {
        origin : 'http://localhost:5173',
        methods : ['GET','POST'],
    }
})
export function getReceiverSocketId(userId){
    return onlineUsers[userId]
} 

const users = {}
const onlineUsers = {}

io.on('connection', (socket)=>{
    
    console.log('user connected', socket.id);
    const userId = socket.handshake.query.userId
    if(userId){
        onlineUsers[userId] = socket.id
        // users[userId] = socket.id /// every time it will create a new socket id for the user. so its not better to use this ig
    }
    socket.on('register',()=>{

    })
    io.emit('getOnlineUsers', Object.keys(onlineUsers))
    socket.on('disconnect', ()=>{
        console.log('user disconnecteddddddddd', socket.id)
        delete onlineUsers[userId]
        io.emit('getOnlineUsers', Object.keys(onlineUsers))
        updateLastSeen(userId)
        console.log('>>>>>>>>>>>');
        
    })
    socket.on('typing',({senderId,receiverId})=>{
        // console.log('typing', users)
        const receiverSocketId = onlineUsers[receiverId]
        console.log('onlineUsers', onlineUsers);
        
        console.log('typingfgggggggggggggggggg', senderId, receiverSocketId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('userTyping', {senderId})
        }
    })
})

export {io, server, app}