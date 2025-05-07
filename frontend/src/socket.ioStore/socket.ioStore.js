import {create} from 'zustand';
import {io} from 'socket.io-client'
import { useSelector } from 'react-redux';
const BASE_URL = import.meta.env.MODE === "development"? 'http://localhost:5001' : "/"
// const {selectedUser} = useSelector(state => state.chat)
export const useSocketStore  = create((set,get)=>({
    socket       : null,
    onlineUsers  : [],
    messages     : [],
    getMessages : (messages) =>{
        set({messages})
    },
    connectSocket : ()=>{
        const socket = io(BASE_URL,{
            query:{
                userId : JSON.parse(localStorage.getItem('user'))?._id
            }
        })
        socket.on('connect',()=>{
            // console.log('Socket connected from useSocket.io', socket);
            set({socket})
        })
        socket.on('getOnlineUsers', (users) => {
            // console.log('Online users>>>>>>>>>:', users)
            set({onlineUsers : users})
        })
    },
    disconnectSocket : () => {
        if(get().socket?.connected)
        get().socket.disconnect()
        set({socket : null})
    },
    subscribeToMessages : (selectedUser)=>{
        const {socket} = get()
        if(socket){
            socket.on('getMessage',(newMessage)=>{
                if(newMessage.senderId != selectedUser._id) return
                set({messages : [...get().messages, newMessage]})
            })
        }
    },
    unsubscribeFromMessages : () => {
        const {socket} = get()
        if(socket){
            socket.off('getMessage')
        }
    },
    userTyping : (users)=>{
        const {socket} = get()
        if(socket){
            // console.log('users typing from zustang', users);
            socket.emit('typing', users)
        }   
    },
    

}))