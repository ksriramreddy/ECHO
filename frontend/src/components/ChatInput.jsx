import React, { useRef, useState } from 'react';
import {X,Image, Send,Loader} from 'lucide-react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../lib/axios';
import axios from 'axios';
import { setMessages } from '../store/chat.store';
import { useSocketStore } from '../socket.ioStore/socket.ioStore';
const ChatInput = () => {
  const [input, setInput] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [sending, setSending] = useState(false);
  const dispatch = useDispatch();
  const {selectedUser} = useSelector(state => state.chat)
  const {getMessages,messages,userTyping}  = useSocketStore()

  const fileInputRef = useRef();
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
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
            <X size={10} onClick={handleRemoveImage} color='white' className='bg-black rounded-full'/>
          </div>
        </div>)}
      </div>
      <form onSubmit={handleSendMessage}>
        <div className='flex items-center border border-gray-300 justify-between w-full h-12 bg-gray-200 p-2'>
          <input
            type="text"
            value={input} 
            onChange={(e) => {
              setInput(e.target.value)
              userTyping({senderId : JSON.parse(localStorage.getItem('user'))._id, receiverId : selectedUser._id})
            }}
            placeholder="Type a message..." 
            className="w-full p-2 bg-transparent focus:outline-none "
          />
          <input type="file" accept='image/*' ref={fileInputRef} className='hidden' onChange={handleImageChange} />
          <button type='button' className='mr-2 cursor-pointer' onClick={()=> fileInputRef.current.click() }>
          <Image color='green'/>
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