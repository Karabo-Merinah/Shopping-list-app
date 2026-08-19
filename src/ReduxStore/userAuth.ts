import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
type UserInfo = {
  name: string
  surname: string
  email: string
  cellnumber: string
  isUserLoggedIn: boolean
}
const initialState: UserInfo = {
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
      action: PayloadAction<{ name: string; surname: string; email: string; cellnumber: string }>
    ) => {
      state.name = action.payload.name
      state.surname = action.payload.surname
      state.email = action.payload.email
      state.cellnumber = action.payload.cellnumber
    },
    loginUser: (state) => {
      state.isUserLoggedIn = true
    },
    logoutUser: (state) => {
      state.isUserLoggedIn = false
    },
  },
})

export const { registerUser, loginUser, logoutUser } = userInfoSlice.actions
export default userInfoSlice.reducer
