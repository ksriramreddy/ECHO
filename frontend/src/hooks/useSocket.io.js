import {io} from 'socket.io-client'
const BASE_URL = 'http://localhost:5173/'
import { useDispatch, useSelector } from 'react-redux'
import { setOnlineUsers, setSocket } from '../store/user.store'
import { setMessages } from '../store/chat.store'

function useSocketIO() {
    const {isAuthenticated,onlineUsers} = useSelector(state=>state.user)
    const {selectedUser, messages} = useSelector(state=>state.chat)
    const sockett = localStorage.getItem('socketId')
    const dispatch = useDispatch()
    const BASE_URL = 'http://localhost:5001'
    
    const connectSocket = () => {
        console.log('Connecting to socket>>>>>>...');
        if (!isAuthenticated) return;
        const socket = io(BASE_URL, {
            query:{
                userId : JSON.parse(localStorage.getItem('user'))?._id
            }
        })
        socket.on('connect',()=>{
            console.log('Socket connected from useSocket.io', socket);
            // dispatch(setSocket(socket))
            localStorage.setItem('socketId',JSON.stringify(socket))

        })
        
        socket.on('getOnlineUsers', (users) => {
            console.log('Online users>>>>>>>>>:', users)
            dispatch(setOnlineUsers(users))
        })
    }

    const subscribeToMessages = () => {
        if(!selectedUser) return
        sockett.on('getMessage',(newMessage)=>{
            console.log("New message from socket",newMessage)
            localStorage.setItem('socketId',sockett)
        })
    }
    const unsubscribeFromMessages = () => {
        // sockett.off('getMessage')
    }
    return {connectSocket, subscribeToMessages, unsubscribeFromMessages}
}

export default useSocketIO