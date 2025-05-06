import {configureStore} from '@reduxjs/toolkit'

import userReducer from './user.store'
import chatReducer from './chat.store'

export const store = configureStore({
    reducer :  
    {
        user : userReducer,
        chat : chatReducer
    }
})