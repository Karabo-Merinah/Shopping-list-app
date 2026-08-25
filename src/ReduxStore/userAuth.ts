import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
type UserInfo = {
  id:string,
  name: string
  surname: string
  email: string
  cellnumber: string
  isUserLoggedIn: boolean
}
// Makes sure it remembers the  current user so even when refreshed so  it doesn't go back to login everytime when refreshing 

const persistedUser=localStorage.getItem("user")
const initialState:UserInfo =persistedUser ? JSON.parse(persistedUser):{
  id:"",
  name: "",
  surname: "",
  email: "",
  cellnumber: "",
  isUserLoggedIn: false,
}
const userInfoSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    registerUser: (
      state,
      action: PayloadAction<{ id:string,name: string, surname: string, email: string, cellnumber: string }>
    ) => {
      state.id=action.payload.id
      state.name = action.payload.name
      state.surname = action.payload.surname
      state.email = action.payload.email
      state.cellnumber = action.payload.cellnumber
    },
    loginUser: (state) => {
      state.isUserLoggedIn = true
      localStorage.setItem("user",JSON.stringify(state))
    },
    logoutUser: (state) => {
      state.isUserLoggedIn = false
      localStorage.setItem("user",JSON.stringify(state))
    },
  },
})

export const { registerUser, loginUser, logoutUser } = userInfoSlice.actions
export default userInfoSlice.reducer
