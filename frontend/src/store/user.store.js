import {createSlice} from '@reduxjs/toolkit'
import axios from '../lib/axios.js'

const initialState = {
    user : JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated : JSON.parse(localStorage.getItem('user'))? true : false,
    isLoading : false,
    isError : false,
    isSigningIn : false,
    isSigningUp : false,
    isCheckingAuth : false,
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
        }
    }
})

export const {setError,setLoading,setUser,setIsAuthenticated,setIsCheckeingAuth} = userSlice.actions

export default userSlice.reducer

export const checkAuth = () => async (dispatch) =>{
    dispatch(setIsCheckeingAuth(true))
    try {
        const res = await axios.get('/auth/check')
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