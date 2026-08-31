import React from 'react'
import { useState } from 'react'
import { MdEmail,MdLock } from 'react-icons/md'
import { LogInIcon } from 'lucide-react'
import {Texts} from '../../Components/Texts/Texts'
import {Link,useNavigate} from 'react-router-dom'
type LoginProps={
    onSubmit:(email:string,password:string)=>Promise<void>
}

export const LoginPage:React.FC<LoginProps> = ({onSubmit}) => {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    // Hook to redirect user after login
    const navigate=useNavigate()
     const checkLoginDetails=async (e:React.FormEvent)=>{
      e.preventDefault()
      try{
        await onSubmit(email,password)
          // If login succeeds → go to home page
        navigate("/home")
      }
      catch(error){
        // If login fails then show error message
        alert(error instanceof Error ? error.message :"Login failed:" )
      }
      
    }
  return (
      <div className='wrapping-login'>
      <div className='login-form'>
        <form className="login-fields" onSubmit={checkLoginDetails}>
          <LogInIcon className="login-icon" size={40} />
          <div className="login-instructions">
            <Texts variant={'p'} style={{fontWeight:"bold"}}>Sign in with email</Texts>
            <Texts variant={'p'}>Keep track of everything you need in one list.</Texts>
          </div>
          <div className='login-input-info'>
          <Texts variant={'span'} className='input-icon'><MdEmail/></Texts>
          <input type="email" value={email} placeholder='Email' onChange={(e)=>setEmail(e.target.value)} className='login-inputs'/>
          </div>
           <div className='login-input-info'>
          <Texts variant={'span'} className='input-icon'><MdLock/></Texts>
          <input type="password" value={password} placeholder='Password' onChange={(e)=>setPassword(e.target.value)} className='login-inputs'/>
          </div>
          <button type="submit" className="login-btn">LOGIN </button>
          <Texts variant={'p'}>Don't have an account yet?<Link to="/register" className="login-reg">Register now </Link></Texts>
        </form>
      </div>
      </div>

  )
}
