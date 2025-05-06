import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    users : [],
    selectedUser : null,
}

const chatSlice = createSlice({
    name : 'chat',
    initialState,
    reducers : {
        setUsers : (state, action) =>{
            state.users = action.payload
        },
        setSelectedUser : (state, action) => {
            state.selectedUser = action.payload
        },
        setMessages : (state, action) => {
            state.messages = action.payload
        }
    },
    
})

export const {setUsers , setSelectedUser,setMessages} = chatSlice.actions
export default chatSlice.reducer