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
const defaultUser:UserInfo={
  id:"",
  name:"",
  surname:"",
  email:"",
  cellnumber:"",
  isUserLoggedIn:false,
}
function loadPersistedUser():UserInfo{
  const persistedUser=localStorage.getItem("user")
  if(!persistedUser) return defaultUser
  try{
    const parsed=JSON.parse(persistedUser)
    //Falls back to defaultUser instead of making user undefined 
    return {...defaultUser, ...parsed}
  }
  catch{
    //removes left users to avoid making malformed data
    localStorage.removeItem("user")
    return defaultUser
  }
}

const initialState:UserInfo =loadPersistedUser()
// Stored the logged in users and registered users profile information and persist to localstorage 
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
            localStorage.setItem("user",JSON.stringify(state))
    },
    //Marks users as logged in 
    loginUser: (state) => {
      state.isUserLoggedIn = true
      localStorage.setItem("user",JSON.stringify(state))
    },
    //Clears out user so no previous user info stops or crashes the next login of different user
    logoutUser: (state) => {
      state.id=""
      state.name=""
      state.surname=""
      state.email=""
      state.cellnumber=""
      state.isUserLoggedIn = false
      localStorage.removeItem("user")
    },
  },
})

export const { registerUser, loginUser, logoutUser } = userInfoSlice.actions
export default userInfoSlice.reducer
