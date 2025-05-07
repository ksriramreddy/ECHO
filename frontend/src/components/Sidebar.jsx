import React, { useEffect } from 'react';
import axiosInstance from '../lib/axios';
import { Search } from 'lucide-react';
import { setUsers, setSelectedUser, setEcho } from '../store/chat.store';
import { useDispatch, useSelector } from 'react-redux';
import defaultProfile from '../../public/profile.png';
import { setUser } from '../store/user.store';
import { useSocketStore } from '../socket.ioStore/socket.ioStore';
import Echoai from './echoai';



const Sidebar = () => {
  const [isChatLoading, setIsChatLoading] = React.useState(false);
  const [isChatError, setIsChatError] = React.useState(false);
  const dispatch = useDispatch();
  const { users,selectedUser } = useSelector(state => state.chat)
  // const {onlineUsers} = useSelector(state=>state.user)
  const { onlineUsers } = useSocketStore()
  useEffect(() => {
    const fetchSideBar = async () => {
      setIsChatLoading(true);
      try {
        await axiosInstance.get('/message/users')
          .then((res) => {
            // console.log("Sidebar users",res.data);
            dispatch(setUsers(res.data));
            setIsChatLoading(false);
          })
      } catch (error) {
        console.log(`Error in sidebar`, error);
      }
    }
    fetchSideBar();
  }, [isChatError])
  // console.log("Sidebar", selectedUser );

  return (
    <div className='w-full h-[calc(100vh-100px)]  text-black bg-gray-100 rounded-lg overflow-y-auto shadow-md scroll p-4'>
      <div className='flex items-center justify-between bg-gray-200 rounded-lg'>
        <Search className=' ml-2 text-gray-400' />
        <input type="text" placeholder='Search' className='w-full h-10  p-2 outline-none bg-transparent' />
      </div>
      <div className='flex flex-col gap-2 mt-4 transition-all duration-300'>
        {
          isChatLoading ?
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => <div key={i} className="w-full h-14 bg-gray-300 animate-pulse rounded-md"></div>) :
            <>
            <Echoai/>
            {users.map((user, i) =>
              <div key={i}>
                <button onClick={() => { 
                  dispatch(setSelectedUser(user))
                  dispatch(setEcho(null)) 
                  }} className={`flex  flex-row items-center  gap-2 cursor-pointer min-w-[40px]   p-0 hover:bg-gray-200 w-full rounded-lg sm:p-2 ${user?._id == selectedUser?._id ? "bg-gray-300" : ""}`}>
                  <div className='relative  min-w-fit'>
                    <img src={user?.profilePic || defaultProfile} alt="" className='w-10 h-10 rounded-full'/>
                    <div className={`absolute w-3 h-3 right-0 bottom-[1px]  rounded-full  border border-white ${onlineUsers.includes(user?._id) ? "bg-green-500" : "bg-slate-500"}`}></div>
                  </div>
                  <div className='sm:flex flex-col hidden'>
                    <span className='text-md  text-left font-semibold'>{user?.userName}</span>
                    <span className='text-sm  text-left text-gray-500'>{onlineUsers.includes(user?._id) ? "online" : "offline"}</span>
                  </div>
                </button>
              </div>)}
              </>
        }
      </div>
    </div>
  );
}



export default Sidebar;
