import React from 'react';
import echo from '../../public/echolightlogo.png'
import { LogOut, Settings, User } from 'lucide-react';
import axiosInstance from '../lib/axios';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated, setUser } from '../store/user.store';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useSocketStore } from '../socket.ioStore/socket.ioStore';


const Navbar = () => {
  const {disconnectSocket} =  useSocketStore()
  const dispatch = useDispatch()
  function handleLogout(){

    axiosInstance.post('/auth/logout')
    .then((resp)=>{
      localStorage.removeItem('user')
      dispatch(setUser(null))
      dispatch(setIsAuthenticated(false))
      disconnectSocket()
      toast.success("Logged out")
    })
    .catch((error)=>{
      console.log("Error logging out user: ",error);
      toast.error(error.response.data.message)
    })
  }

  return (
    <div className='w-full text-black bg-white flex flex-row items-center rounded-lg p-1 justify-between'>
      <div className='  w-[100px] h-[65px] flex items-center justify-center'>
        <img src={echo} className='w-[100px] h-[50px]' alt="" />
      </div>
      <div className='flex gap-5 sm:gap-6'>
        <Link to={'/profile'}>
          <div className='flex flex-row items-center hover: justify-center gap-1 cursor-pointer'>
            <User strokeWidth={1} size={22} color='black'/> 
            <span className='text-xl hidden sm:block'>Profile</span>
          </div>
        </Link>
        <Link to={'/settings'}>
          <div className='flex flex-row items-center justify-center gap-1 cursor-pointer'>
            <Settings strokeWidth={1} size={22} color='black'/> 
            <span className='text-xl hidden sm:block'>Settings</span>
          </div>
        </Link>
        <button onClick={handleLogout} className='mr-4 flex flex-row items-center justify-center gap-1 cursor-pointer'>
          <LogOut  strokeWidth={1} size={22} color='black'/> 
          <span className='text-xl hidden sm:block '>LogOut</span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;