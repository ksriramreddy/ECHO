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
const App = () => {

  const dispatch = useDispatch()
  const {user,isAuthenticated,isCheckingAuth} = useSelector(state => state.user)
  console.log(user);

  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  console.log("user from app.jsx",user);

  if(isCheckingAuth){
    return(
      <div>
        <Loader/>
      </div>
    )
  }
  
  return (
    <div  className='pl-10 pr-10 dark:text-white'>
      {
        isAuthenticated && <Navbar/>
      }
      
      <Routes>
        <Route path='/' element={user? <Home/> : <Navigate to={'/signin'}/>} />
        <Route path='/signup' element={user? <Navigate to={'/'}/> : <SignUp/>} />
        <Route path='/signin' element={ user? <Navigate to={'/'}/> : <SignIn/>} />
        <Route path='/profile' element={user? <Profile/> : <Navigate to={'/signin'}/>} />
        <Route path='/settings' element={<Settings/>} />
      </Routes>
      <Toaster position='top-center' />
    </div>
  );
}

export default App;

