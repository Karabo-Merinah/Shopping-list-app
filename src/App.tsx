import './App.css'
import { RegisterPage } from './Pages/RegisterPage/RegisterPage'
import { LoginPage } from './Pages/LoginPage/LoginPage'
import {BrowserRouter,Route,Routes} from  'react-router-dom'
import { Profile } from './Pages/Profile/Profile'
import { HomePage } from './Pages/HomePage/HomePage'
import { ProtectedRoute } from './Components/ProtectedRoute/ProtectedRoute'
import { PublicUserRouting } from './Components/PublicUserRouting/PublicUserRouting'
import { setUserInfo,login } from './service/UserAuthentication'
import { AddListItems } from './Components/AddListItems/AddListItems'

function App() {

  return (
    <>
    <div className='app-content'>
      <BrowserRouter>
      <Routes>
        {/* Public routes  */}
        <Route path="/" element={<PublicUserRouting><div className='wrapping-login'><LoginPage onSubmit={login}/></div></PublicUserRouting>}/> 
        <Route path="/register" element={<PublicUserRouting><RegisterPage onSubmit={setUserInfo}/></PublicUserRouting>}/>
        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile mode="details"/></ProtectedRoute>}/>
        <Route path="/profile/edit" element={<ProtectedRoute><Profile mode="editPersonal"></Profile></ProtectedRoute>}/>
        <Route path="/profile/login" element={<ProtectedRoute><Profile mode="editLogin"></Profile></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
      {/* <AddListItems onSubmit={}/>  */}
    </div>
    </>
  )
}

export default App
