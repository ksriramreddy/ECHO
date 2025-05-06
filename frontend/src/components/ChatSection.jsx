import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatPlaceholder from './ChatPlaceholder';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import ChatSkeleton from './ChatSkeletion';
import { setMessages } from '../store/chat.store';
import axiosInstance from '../lib/axios';
import useSocketIO from '../hooks/useSocket.io';
import { useSocketStore } from '../socket.ioStore/socket.ioStore';

const ChatSection = () => {
    const {selectedUser} = useSelector(state => state.chat);
    // console.log("Selected user from chat section",selectedUser);
    // const {subscribeToMessages,unsubscribeFromMessages} = useSocketIO()
    const {subscribeToMessages,unsubscribeFromMessages,messages,getMessages,socket} = useSocketStore()
  const [isLoading, setIsLoading] = React.useState(false)
  const dispatch = useDispatch()
  const messageEndRef = useRef(null)
  useEffect(()=>{
    
    async function fetchMessages(){
      setIsLoading(true)
      axiosInstance.get(`message/${selectedUser._id}`)
      .then((resp)=>{
        // console.log("messages",resp.data);
        getMessages(resp.data)
        // dispatch(setMessages(resp.data))
      })
      .catch((err)=>{
        toast.error('Failed to fetch messages!');
        console.error("Error fetching messages", err);
      })
      .finally(()=>{
        setIsLoading(false)
      })
    }
    if(selectedUser){
      fetchMessages()
    }
    
    subscribeToMessages(selectedUser)

    return () => {
      unsubscribeFromMessages()
    }
  },[selectedUser,subscribeToMessages,unsubscribeFromMessages])

  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  },[messageEndRef, messages])

  if(!selectedUser) {
    return <ChatPlaceholder />
}

const styleComponent = ""
    
  return (
    <div className='flex flex-col h-full w-[100%] overflow-hidden text-black '>
         <ChatHeader user={selectedUser}/>
          {/* <ChatMessages /> */}
          {/* <ChatSkeleton/> */}
          <div className='flex flex-col h-[70vh] overflow-y-auto p-2 gap-2 w-[99%]'>
          {
            isLoading ? <ChatSkeleton /> : messages.length > 0 ? messages.map((message, index) => (
                <div key={index} className={`bg-blue-300 text-[20px] relative mb-1 p-3 w-fit rounded-lg pl-3  pr-3 ${message.senderId === selectedUser._id ? ' self-start' : 'self-end'}`} ref={messageEndRef}>

                    {message.image && <img src={message.image}  alt="image" className='contain rounded-md' height={200} width={200} />}
                    {message.text}
                    <div className='absolute bottom-0.5 right-1 text-[10px] font-bold text-gray-500'>{new Date(message.createdAt).toLocaleTimeString().slice(0,5)}</div>
                </div>
            )) : <ChatPlaceholder />
          }
          </div>
          <ChatInput />
    </div>
  );    
}

export default ChatSection;
