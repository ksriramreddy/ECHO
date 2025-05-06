import {createSlice} from '@reduxjs/toolkit'
import axios from '../lib/axios.js'
import axiosInstance from '../lib/axios.js'
import { Socket } from 'socket.io-client'

const initialState = {
    user : JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated : JSON.parse(localStorage.getItem('user'))? true : false,
    isLoading : false,
    isError : false,
    isSigningIn : false,
    isSigningUp : false,
    isCheckingAuth : false,
    isUpdatingProfile : false,
    socket : null,
    onlineUsers : []
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers : {
        setLoading : (state,action) => {
            state.isLoading = action.payload
        },
        setError : (state,action) => {
            state.isError = action.payload
            state.isAuthenticated = false
            state.isLoading = false
        },
        setUser : (state,action) => {
            state.user = action.payload
            state.isAuthenticated = true
            state.isLoading = false
        },
        setIsAuthenticated : (state,action) => {
            state.isAuthenticated = action.payload
        },
        setIsCheckeingAuth : (state,action) => {
            state.isCheckingAuth = action.payload
        },
        setIsUpdatingProfile : (state,action) => {
            state.isUpdatingProfile = action.payload
        },
        setSocket : (state,action) => {
            state.socket = action.payload
        },
        setOnlineUsers : (state,action) => {
            state.onlineUsers = action.payload
        },
    }
})

export const {setError,setLoading,setUser,setIsAuthenticated,setIsCheckeingAuth,setSocket,setOnlineUsers} = userSlice.actions

export default userSlice.reducer

export const checkAuth = () => async (dispatch) =>{
    dispatch(setIsCheckeingAuth(true))
    try {
        const res = await axiosInstance.get('/auth/check')
        dispatch(setUser(res.data))
        dispatch(setIsAuthenticated(true))
        console.log("user form user store",res.data);
        dispatch(setLoading(false))
    } catch (error) {
        console.log("Error getting user  checkAuth store ",error);
        dispatch(setUser(null))
        dispatch(setError(true))
        dispatch(setIsAuthenticated(false))
    }
    finally{
        dispatch(setIsCheckeingAuth(false))
    }
}

export const updateProfile = (profilePic) => async (dispatch) => {
    try {
        dispatch(setIsUpdatingProfile(true))
        console.log("Updated user from user store");
         axiosInstance.put('/auth/update-profile', {profilePic : profilePic })
         .then((res)=>{
            localStorage.setItem('user', JSON.stringify(res.data.updatedUser))
            toast.success("Profile updated successfully")
         }) 
    } catch (error) {
        console.log("Error updating profile checkAuth store ",error);
        toast.error("error.response.data.message")
    }
    finally{
        console.log('Updated user from');
        dispatch(setIsUpdatingProfile(false))
    }
}