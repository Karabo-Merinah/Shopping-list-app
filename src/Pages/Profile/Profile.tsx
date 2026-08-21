import { useDispatch,useSelector } from 'react-redux'
import { useState } from 'react'
import { type RootState } from '../../app/store'
import { loginUser, registerUser } from '../../ReduxStore/userAuth'
import "react-international-phone/style.css"
import {PhoneInput} from "react-international-phone"
import {Texts} from '../../Components/Texts/Texts'
import { useNavigate } from 'react-router'
import axios from 'axios'
import bcrypt from 'bcryptjs'
type ProfileProps={
  mode:"details" | "editPersonal" | "editLogin"
}


export const Profile:React.FC<ProfileProps> = ({mode}) => {
  const user=useSelector((state:RootState)=>state.user)
  const dispatch=useDispatch()
  const [editInformation, setEditInformation] = useState(false)
  const [view,setView]=useState(mode)
  const navigate=useNavigate()
  // Retrieving user information from the store to display them for updating and profile icon
  const [currentPassword,setCurrentPassword]=useState("")
  const [newPassword,setNewPassword]=useState("")
  const [confirmPassword,setConfirmPassword]=useState("")
  const [passwordError,setPasswordError]=useState("")

  const [name,setName]=useState(user.name)
  const [email,setEmail]=useState(user.email)
  const [surname,setSurname]=useState(user.surname)
  const [cellnumber,setCellnumber]=useState(user.cellnumber)
 
 const saveProfile=()=>{
  dispatch(registerUser({id:user.id,name,surname,email:user.email,cellnumber}))
  setEditInformation(false)
  setView("details")
 }
 const saveLogInDetails=async()=>{
  if(newPassword !="" && newPassword !== confirmPassword){
    setPasswordError("New passwords don't match")
    return 
  }
  setPasswordError("")
  try{
  const hashPassword=newPassword !== ""?await bcrypt.hash(newPassword,10):undefined
  await axios.put(`http://localhost:3000/users/${user.id}`,{...user,email,...(hashPassword && {password:hashPassword})})
  dispatch(registerUser({id:user.id,name:user.name,surname:user.surname,email,cellnumber:user.cellnumber}))
  setCurrentPassword("")
  setNewPassword("")
  setConfirmPassword("")
  setView("details")
 }
  catch(error){
    setPasswordError("Could not save changes")
  }
}
 const cancelEdit=()=>{
  navigate("/profile")
 }
  return (
    <div className='profile-page'>
      {view === "details" && (
        <div className='profile-details'>
          <span>{user.name} {user.surname}</span>
          <span>{user.email}</span>
        </div>
      )}
      {view === "editPersonal" && (
        <div className='profile-edit'>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
        <label>Surname</label>
        <input type="text" value={surname} onChange={(e)=>setSurname(e.target.value)}/>
        <label>Cell Number</label>
        <PhoneInput defaultCountry='za' forceDialCode={true} value={cellnumber} onChange={(phone)=>setCellnumber(phone)} />
       <button onClick={saveProfile}>Save</button>
       <button onClick={()=>setEditInformation(false)}>Cancel</button>
       </div>
      )}
      {view === "editLogin" && (
        <div className="profile-edit">
          <label>Email</label>
          <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          <label>Current Password</label>
          <input type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)}/>
          <label>New password</label>
          <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
          <label>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
          {passwordError != "" && <Texts variant={'span'} className='error-text'>{passwordError}</Texts>}
          <button onClick={saveLogInDetails}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
    </div> 
  )}
  </div>
  )}
