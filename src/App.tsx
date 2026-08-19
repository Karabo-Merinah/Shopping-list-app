import './App.css'
import { RegisterPage } from './Pages/RegisterPage/RegisterPage'
import { LoginPage } from './Pages/LoginPage/LoginPage'
import {BrowserRouter,Route,Routes} from  'react-router-dom'
import { Profile } from './Pages/Profile/Profile'
import { HomePage } from './Pages/HomePage/HomePage'
function App() {
  function RegisterUser(name:string,surname:string,email:string,cellnumber:string,password:string,confirm_password:string){
    const userInfo ={name:name,surname:surname,email:email,cellnumber:cellnumber,password:password}
    localStorage.setItem("userInfo",JSON.stringify(userInfo))
  }
  function loginUser(username:string,password:string){
    const loginInfo={username:username,password:password}
    localStorage.setItem('login',JSON.stringify(loginInfo))
  }
  return (
    <>
    <div className='app-content'>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/> 
        <Route path="/login" element={<div className="wrapping-login"><LoginPage onSubmit={loginUser}/></div>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/register" element={<RegisterPage onSubmit={RegisterUser}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
    </>
    
  )
}

export default App
