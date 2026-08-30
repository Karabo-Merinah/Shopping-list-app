import { useDispatch,useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar/Navbar'
import { type RootState } from '../../app/store'
import { registerUser } from '../../ReduxStore/userAuth'
import "react-international-phone/style.css"
import {PhoneInput} from "react-international-phone"
import {Texts} from '../../Components/Texts/Texts'
import { useNavigate } from 'react-router'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { ArrowLeftIcon } from 'lucide-react'
import { API_BASE_URL } from '../../config/api'

type ProfileProps={
  mode:"details" | "editPersonal" | "editLogin"
}


export const Profile:React.FC<ProfileProps> = ({mode}) => {
  const user=useSelector((state:RootState)=>state.user)
  const dispatch=useDispatch()
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
 
  useEffect(()=>{
    setView(mode)
  },[mode])
 const saveProfile=async()=>{
  try{
  await axios.patch(`${API_BASE_URL}/users/${user.id}`,{name,surname,cellnumber})
  dispatch(registerUser({id:user.id,name,surname,email:user.email,cellnumber}))
 navigate("/home")
 }
 catch(error){
 }
}
 const saveLogInDetails=async()=>{
  if(newPassword !="" && newPassword !== confirmPassword){
    setPasswordError("New passwords don't match")
    return 
  }
  setPasswordError("")
  try{
  const hashPassword=newPassword !== ""?await bcrypt.hash(newPassword,10):undefined
  await axios.patch(`${API_BASE_URL}/users/${user.id}`,{email,...(hashPassword && {password:hashPassword})})
  dispatch(registerUser({id:user.id,name:user.name,surname:user.surname,email,cellnumber:user.cellnumber}))
  setCurrentPassword("")
  setNewPassword("")
  setConfirmPassword("")
  navigate("/home")
 }
  catch(error){
    setPasswordError("Could not save changes")
  }
}
 const cancelEdit=()=>{
  setName(user.name)
  setSurname(user.surname)
  setEmail(user.email)
  setCellnumber(user.cellnumber)
  setCurrentPassword("")
  setNewPassword("")
  setConfirmPassword("")
  setPasswordError("")
 }
  return (
    <>
    <Navbar/>
    <div className='profile-page'>
      <button type="button"  onClick={()=>navigate("/home")} className='back-home-btn' title="Back to home "><ArrowLeftIcon size={18}/>Back to home</button>
      {view === "details" && (
        <div className='profile-details'>
          <span>{user.name} {user.surname}</span>
          <span>{user.email}</span>
        </div>
      )}
      {view === "editPersonal" && (
        <div className='profile-edit'>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className='profile-input'/>
        <label>Surname</label>
        <input type="text" value={surname} onChange={(e)=>setSurname(e.target.value)} className='profile-input'/>
        <label>Cell Number</label>
        <PhoneInput defaultCountry='za' forceDialCode={true} value={cellnumber} onChange={(phone)=>setCellnumber(phone)} className='profile-input' />
          <div className='profile-bnts'>
             <button onClick={cancelEdit} className='cancel-btn'>Discard changes</button>
       <button onClick={saveProfile} className='save-btn'>Save changes</button>
       </div>
       </div>
      )}
      {view === "editLogin" && (
        <div className="profile-edit">
          <label>Email</label>
          <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} className='profile-input'/>
          <label>Current Password</label>
          <input type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} className='profile-input'/>
          <label>New password</label>
          <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className='profile-input'/>
          <label>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className='profile-input'/>
          {passwordError != "" && <Texts variant={'span'} className='error-text'>{passwordError}</Texts>}
          <div className='profile-bnts'>
                      <button onClick={cancelEdit} className='cancel-btn'>Discard changes</button>
          <button onClick={saveLogInDetails} className='save-btn'>Save changes</button>
          </div>
    </div> 
  )}
  </div>
    </>
  )}
