import { Eye, EyeOff, LockKeyhole, Mail, User, UserCheck } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import echo from '../../public/echolightlogo.png'
import { formValidation } from '../lib/formValidation.js';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuthenticated, setUser } from '../store/user.store';
import axiosInstance from '../lib/axios.js';
import useSocketIO from '../hooks/useSocket.io.js';
import { useSocketStore } from '../socket.ioStore/socket.ioStore.js';

const SignIn = () => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  })
  const [isloggingIn, setIsLoggingIn] = React.useState(false)
  const {connectSocket} = useSocketStore()
  const dispatch = useDispatch()
  const { user, isSigningUp, isAuthenticated } = useSelector(state => state.user)
  // const {connectSocket} = useSocketIO()
  function handleSubmit(e) {
    e.preventDefault()
    axiosInstance.post('/auth/signin', formData)
      .then((resp) => {
        localStorage.setItem('user', JSON.stringify(resp.data))
        dispatch(setUser(resp.data))
        dispatch(setIsAuthenticated(true))
        connectSocket()
        toast.success('Login Success')
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to signup')
      })
    
  }
  function changeEyeStake(e){
    e.preventDefault()
    setIsPasswordVisible(prev=>!prev)
  }

  return (
    <div className='min-h-dvh text-xl text-black w-full bg-slate-300  '>
      <div className=' mx-auto flex flex-col items-center gap-3  '>
        <div className='mt-10'>
          <img src={echo} width={120} height={120} className='mx-auto' alt="LOGO" />
        </div>
        <div className='flex flex-col items-center justify-center gap-0'>
          <h1 className=' text-[23px] '>Sign in</h1>
          <h3 className='text-[15px]'> Welcome back to you  <span className='text-blue-400'>ECHO</span>  account</h3>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center bg-white md:w-[40%] p-3 w-full rounded-2xl gap-3 pb-10 pt-10'>
          <div className='w-[80%] flex flex-col gap-2'>
            <label htmlFor="email" className='text-[22px]' >Email</label>
            <div className=' flex   gap-5 items-center bg-slate-100  border border-slate-300 p-2.5 rounded-lg'>
              <Mail strokeWidth={1} size={22} color='gray' />
              <input className=' bg-slate-100  w-full  border border-transparent outline-none' type="email" placeholder='Email' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div className='w-[80%] flex flex-col gap-2'>
            <label htmlFor="password" className='text-[22px]' >Password</label>
            <div className=' flex   gap-5 items-center bg-slate-100 border border-slate-300 p-2.5 rounded-lg'>
              <LockKeyhole strokeWidth={1} size={22} color='gray' />
              <input className=' bg-transparent w-full  border border-transparent outline-none' type={isPasswordVisible ? 'text' : 'password'} placeholder='Password' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button onClick={changeEyeStake}>
                {
                  isPasswordVisible ? <Eye strokeWidth={1} color='gray' /> : <EyeOff strokeWidth={1} color='gray' />
                }
              </button>
            </div>
          </div>
          <div className='bg-blue-400 rounded-lg hover:bg-blue-500 w-[80%] text-center p-3'>
            <input type="submit" value={isloggingIn? "Logging in..." : "Login"} className='w-full h-full cursor-pointer' />
          </div>
        </form>
        <div className='text-center'>
          <h1>Don't have an account ? <Link className='text-blue-600' to={'/signup'}>Signup</Link> </h1>
          <p>© 2025 ECHO. Crafted with ❤️ by Sriram</p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
