import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatSection from '../components/ChatSection';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../lib/axios';
import { setMessages } from '../store/chat.store';
import toast from 'react-hot-toast';

const Home = () => {
  
  return (
    <div className="w-full rounded-lg pt-2 flex flex-row gap-2">
      <div className='w-[20%] drop-shadow-2xl'>
        <Sidebar />
      </div>
      <div className='w-[80%] rounded-lg drop-shadow-2xl overflow-hidden '>
        <ChatSection/>
      </div>

      
    </div>
  );
}

export default Home;
