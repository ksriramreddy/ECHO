import React, { useState } from 'react';
import {Mail, User, LockKeyhole, Eye,EyeOff,UserCheck} from 'lucide-react'
import {Link} from 'react-router-dom'
import echo from '../../public/echolightlogo.png'
import {formValidation} from '../lib/formValidation.js'
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../lib/axios';
import {setIsAuthenticated, setUser} from '../store/user.store.js'
import toast from 'react-hot-toast';
import useSocketIO from '../hooks/useSocket.io.js';
import { useSocketStore } from '../socket.ioStore/socket.ioStore.js';
const SignUp = () => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [formData, setFormData] = React.useState({
    fullName : '',
    userName : '',
    email : '',
    password : '',
  })
    const {connectSocket} = useSocketStore()
  
  const dispatch = useDispatch()
  // const {connectSocket} = useSocketIO()
  const {user,isAuthenticated} = useSelector(state=>state.user)
  const [isSigningUp, setIsSigningUp] = useState(false)
  function handleSubmit (e){
    e.preventDefault()
    setIsSigningUp(true)
    const isValid = formValidation(formData)
    if(isValid){
      axiosInstance.post('/auth/signup',formData)
      .then((resp)=>{
        localStorage.setItem('user',JSON.stringify(resp.data))
        dispatch(setUser(resp.data))
        dispatch(setIsAuthenticated(true))
        connectSocket()
        toast.success('Signup Success')
        console.log("asxasx",user);
      })
      .catch((err)=>{
        toast.error(err.response?.data?.message || 'Failed to signup')
      })
      .finally(()=>{
        setIsSigningUp(false)
      })
    }
  }

  function changeEyeStake(e){
    e.preventDefault()
    setIsPasswordVisible(prev=>!prev)
  }
  return (
    <div className='min-h-dvh text-xl text-blac w-full bg-base-100 drop-shadow-2xl  '>
      <div className=' mx-auto flex flex-col items-center gap-3  '>
        <div className='mt-10'>
          <img src={echo} width={120} height={120} className='mx-auto' alt="LOGO" />
        </div>
        <div className='flex flex-col items-center justify-center gap-0'>
          <h1 className=' text-[23px] '>Sign up</h1>
          <h3 className='text-[15px]'>Get your <span className='text-blue-400'>ECHO</span>  account now</h3>
        </div>
        <form onSubmit={handleSubmit} className='flex border-base-300 drop-shadow-lg flex-col items-center justify-center bg-base-300 md:w-[40%] p-3 w-full rounded-2xl gap-3 pb-10 pt-10'>
          <div className='w-[80%]  flex flex-col gap-2'>
            <label htmlFor="email" className='text-[22px]' >Email</label>
            <div className=' flex   gap-5 items-center   border  p-2.5 rounded-lg'>
              <Mail strokeWidth={1} size={22} color='gray'/> 
              <input className='bg-transparent w-full border border-transparent outline-none' type="email" placeholder='Email' value={formData.email} onChange={(e)=>setFormData({...formData , email : e.target.value})} />
            </div>
          </div>
          <div className='w-[80%] flex flex-col gap-2'>
            <label htmlFor="email" className='text-[22px]' >Fullname</label>
            <div className=' flex gap-5 drop-shadow-2xl show items-center  border  p-2.5 rounded-lg'>
              <User strokeWidth={1} size={22} color='gray'/> 
              <input className=' bg-transparent w-full border border-transparent outline-none' type="text" placeholder='Full name' value={formData.fullName} onChange={(e)=>setFormData({...formData , fullName : e.target.value})} />
            </div>
          </div>
          <div className='w-[80%] flex flex-col gap-2'>
            <label htmlFor="username" className='text-[22px]' >Username</label>
            <div className=' flex gap-5 items-center  border  p-2.5 rounded-lg'>
              <UserCheck strokeWidth={1} size={22} color='gray'/> 
              <input className=' bg-transparent w-full border border-transparent outline-none' type="text" placeholder='Username' value={formData.userName} onChange={(e)=>setFormData({...formData , userName : e.target.value})} />
            </div>
          </div>
          <div className='w-[80%] flex flex-col gap-2'>
            <label htmlFor="password" className='text-[22px]' >Password</label>
            <div className=' flex   gap-5 items-center  border  p-2.5 rounded-lg'>
              <LockKeyhole strokeWidth={1} size={22} color='gray'/> 
              <input className=' bg-transparent w-full  border border-transparent outline-none' type={isPasswordVisible? 'text' : 'password'} placeholder='Password' value={formData.password} onChange={(e)=>setFormData({...formData , password : e.target.value})}/>
              <button onClick={changeEyeStake}>
              {
                isPasswordVisible? <Eye strokeWidth={1} color='gray'/> : <EyeOff strokeWidth={1} color='gray'/>
              }   
              </button>
            </div>                                                                   
          </div>
          <div className='bg-blue-400 rounded-lg hover:bg-blue-500 w-[80%] text-center p-3'>
            <input type="submit" className='w-full h-full cursor-pointer' value={isSigningUp? "Signing up..." : "Sign up"}  />
          </div>
        </form>
        <div className='text-center'>
          <h1>Already have an account ? <Link className='text-blue-600' to={'/signin'}>Signin</Link> </h1>
          <p>© 2025 ECHO. Crafted with ❤️ by Sriram</p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
