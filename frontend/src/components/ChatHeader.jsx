import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { setSelectedUser } from '../store/chat.store';
import { useDispatch, useSelector } from 'react-redux';
import useSocketIO from '../hooks/useSocket.io';
import { useSocketStore } from '../socket.ioStore/socket.ioStore';

const ChatHeader = ({user}) => {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(state => state.user)
    const {onlineUsers,socket} = useSocketStore()
        const [isTyping, setIsTyping] = useState(false)
    
    useEffect(()=>{
      socket.on('userTyping',(senderId)=>{
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        if(senderId !== selectedUser?._id){
          setIsTyping(true)
          setTimeout(()=>{
            setIsTyping(false)
          }, 2000)
        }
      })

      return () => socket.off('userTyping')
    },[onlineUsers,socket,selectedUser])
  return (
    <div className='flex flex-row items-center  justify-between w-full h-18 bg-gray-100 shadow-md p-4'>
        <div className='flex flex-row items-center gap-2'>
            <img src={user.profilePic || null} alt="" className='w-10 h-10 rounded-full' />
            <div className='flex flex-col'>
                <span className='text-lg font-semibold'>{user.userName}</span>
                <span className='text-sm text-gray-500'>{ isTyping? "typing...": onlineUsers?.includes(user._id) ? "Online" : "Offline"}</span>
            </div>
        </div>
        <X className=' cursor-pointer' onClick={()=>{dispatch(setSelectedUser(null))}} />
    </div>
  );
}

export default ChatHeader;
