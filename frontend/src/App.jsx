import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import {Navigate, Route, Routes} from 'react-router-dom'
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, userSlice } from './store/user.store';
import {Loader} from 'lucide-react'
import {Toaster} from 'react-hot-toast'
import useSocketIO from './hooks/useSocket.io';
import { useSocketStore } from './socket.ioStore/socket.ioStore';
const App = () => {
  const {connectSocket} = useSocketStore()

  const dispatch = useDispatch()
  const {user,isAuthenticated,isCheckingAuth,theme} = useSelector(state => state.user)
  const {selectedUser} = useSelector(state => state.chat)

  // console.log(user);
  // const {connectSocket} = useSocketIO()



  useEffect(()=>{
    checkAuth()
    console.log("user from app.jsx",user);

    connectSocket()
  },[checkAuth])

  if(isCheckingAuth){
    return(
      <div>
        <Loader/>
      </div>
    )
  }
  
  return (
    <div  className='pl-10 pr-10 bg-base-100' data-theme={`${theme? "dark" : "light"}`}>
      {
        isAuthenticated && <Navbar/>
      }
      
      <Routes>
        <Route path='/' element={user? <Home/> : <Navigate to={'/signin'}/>} />
        <Route path='/signup' element={user? <Navigate to={'/'}/> : <SignUp/>} />
        <Route path='/signin' element={ user? <Navigate to={'/'}/> : <SignIn/>} />
        <Route path='/profile' element={user? <Profile user={user}/> : <Navigate to={'/signin'}/>} />
        <Route path='/settings' element={<Settings/>} />
      </Routes>
      <Toaster position='top-center' />
    </div>
  );
}

export default App;

