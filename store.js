import { configureStore } from '@reduxjs/toolkit'
import managementReducer from './slice'

export const store = configureStore({
    reducer:{
        manage:managementReducer,
    }
})


