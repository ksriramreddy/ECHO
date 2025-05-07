import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    users : [],
    selectedUser : null,
    ECHO : null,
    aiChat : [],
    aiTyping : false,
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
        },
        setEcho : (state, action) => {
            state.ECHO = action.payload
        },
        setAIChat : (state, action) => {
            state.aiChat = action.payload
        },
        setAITyping : (state, action) => {
            state.aiTyping = action.payload
        },
    },
    
})

export const {setUsers , setSelectedUser,setMessages,setEcho,setAIChat,setAITyping} = chatSlice.actions
export default chatSlice.reducer