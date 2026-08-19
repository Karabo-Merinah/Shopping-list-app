import React from 'react'
import { useState } from 'react'
import { MdEmail,MdLock } from 'react-icons/md'
import { LogInIcon } from 'lucide-react'
import {Texts} from '../../Components/Texts/Texts'
import {Link} from 'react-router-dom'
type LoginProps={
    onSubmit:(email:string,password:string)=>void
}

export const LoginPage:React.FC<LoginProps> = ({onSubmit}) => {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    // const checkLoginDetails=(e:React.FormEvent)=>{
    //  e.preventDefault()
    //  onSubmit(email,password)
    // }
  return (
    <div>
      <div className='login-form'>
        <form className="login-fields">
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
          <Texts variant={'p'}>Don't have account?<Link to="/register" className="login-reg">Register now </Link></Texts>
        </form>
      </div>
    </div>
  )
}
