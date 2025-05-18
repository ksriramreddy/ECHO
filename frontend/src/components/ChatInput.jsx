import React, { useEffect, useRef, useState } from 'react';
import {X,Image, Send,Loader} from 'lucide-react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../lib/axios';
import axios from 'axios';
import { setAIChat, setAITyping, setMessages } from '../store/chat.store';
import { useSocketStore } from '../socket.ioStore/socket.ioStore';
import useSocketIO from '../hooks/useSocket.io';
const ChatInput = () => {
  const [input, setInput] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [sending, setSending] = useState(false);
  const dispatch = useDispatch();
  const {selectedUser,ECHO,aiChat,aiTyping} = useSelector(state => state.chat)
  const {getMessages,messages,userTyping}  = useSocketStore()
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef();
  const {setIsAITyping,isAITyping}= useSocketStore()
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    // console.log(file);
    
    if (!file.type.startsWith('image/')) {
      toast.error('Sorry Selected file is not supported!');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  }
  function handleRemoveImage() {
    setPreviewImage(null);
    fileInputRef.current.value = null; // Clear the file input value
  }
    useEffect(() => {
  console.log("aiTyping state changed:", isAITyping);
}, [isAITyping]);
  async function handleSendMessageToAI(e){
    // dispatch(setAITyping(true))
    setIsAITyping(true)
    e.preventDefault()
    if(!input) { return; }
    // if its loading prevent sending new message
    dispatch(setAIChat([...aiChat,input]))
    console.log("Sending message to AI",aiChat);
    const prompt = input
    setInput('')
    console.log("is ai typing>>>>>>>>>",isAITyping);
    try {
      setIsTyping(true)
      axiosInstance.post('/gemini',{prompt, past: aiChat}) 
      .then((resp)=>{
        dispatch(setAIChat([...aiChat,input, resp.data.resp])) // add the new message to the aiChat array
        console.log(">>>>>>>>>>>>>>>>",aiChat);
    setIsAITyping(false)

      })
    } catch (error) {
      toast.error('Failed to send message!');
    }
    finally {
    // setIsAITyping(true)
    }
  }

  const handleSubmit = (e)=>{
    e.preventDefault()
    if(selectedUser) handleSendMessage(e)
    else handleSendMessageToAI(e)
  }

  async function handleSendMessage(e) {
    if(!input && !previewImage) { return; }
    e.preventDefault()
    if (sending) return;
    setSending(true);
    axiosInstance.post(`/message/send/${selectedUser._id}`, {
      text: input,
      image: previewImage
    }).then((resp)=>{
      // console.log("sent message",resp.data);
      // dispatch(setMessages([...messages, resp.data]))
      getMessages([...messages, resp.data])

      // console.log("messages", messages);
      setInput('')
      setPreviewImage(null)
      setSending(false);
      fileInputRef.current.value = null; // Clear the file input value
    }).catch((err)=>{
      console.error("Error sending message", err);
      toast.error('Failed to send message!');
    })
  }

  return (
    <div className='flex flex-col w-full gap-2 '>
      <div className='w-fit flex flex-col bg-red-500' >
        {previewImage && (<div className='relative  '>
          {
              <img src={previewImage} alt="image" className='contain' height={50} width={50} />
          }
          <div className='absolute top-0 cursor-pointer '>
            <X size={10} onClick={handleRemoveImage} color='white' className=' rounded-full'/>
          </div>
        </div>)}
      </div>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center border  justify-between w-full h-12  p-2'>
          <input
            type="text"
            value={input} 
            onChange={(e) => {
              setInput(e.target.value)
              if(ECHO) return
              userTyping({senderId : JSON.parse(localStorage.getItem('user'))._id, receiverId : selectedUser._id})
            }}
            placeholder="Type a message..." 
            className="w-full p-2 bg-transparent focus:outline-none "
          />
          <input disabled={ECHO} type="file" accept='image/* , .heic ,HEIC' ref={fileInputRef} className='hidden' onChange={handleImageChange} />
          <button type='button' className='mr-2 cursor-pointer' onClick={()=> fileInputRef.current.click() }>
            {
              ECHO? " " : <Image  color='green'/>
            }
          </button>
          <button type='submit' disabled={!input && !previewImage} className='cursor-pointer'>
            { sending ? <Loader size={20} className="text-blue-500" /> : <Send opacity={`${previewImage || input ? 1 : 0.2}`} />}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;