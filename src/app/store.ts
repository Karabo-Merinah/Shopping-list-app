import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../ReduxStore/userAuth"


// Create the Redux store
export const store = configureStore({
  reducer: {
     // The "user" slice  is managed by userReducer
    user: userReducer,
  },
})
// RootState ,the full shape of our store’s data
export type RootState = ReturnType<typeof store.getState>


// AppDispatch ,the type for dispatching actions
export type AppDispatch = typeof store.dispatch