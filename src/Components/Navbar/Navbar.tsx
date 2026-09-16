import { useDispatch, useSelector } from 'react-redux'
import { Texts } from '../Texts/Texts'
import { Link, useNavigate } from 'react-router-dom'
import { type RootState } from '../../app/store'
import { useState } from 'react'
import { logoutUser } from '../../ReduxStore/userAuth'
import { ListCheck,UserPen,KeyRound,LogOut } from 'lucide-react'
export const Navbar = () => {
  const user = useSelector((state: RootState) => state.user)
  const userLetter = (user.name || "").substring(0, 1).toUpperCase()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [logoutConfirmation,setLogoutConfirmation]=useState(false)
 //Logs user out and send them to login page 
  const Logout = () => {
    setShowMenu(false)
    dispatch(logoutUser())
    navigate("/")
  }
  return (
    <nav>
      <div>
        <div className='navbar-content'>
          <Texts variant={'h2'} className='logo'>
            <ListCheck className='logo-icon'/>
            ListIt
            </Texts>
          <div className='profile-menu'>
            {/* Circle showing user first name then they can click to view profile dropdown */}
            <div className='profile-icon' onClick={() => setShowMenu(true)}>{userLetter}</div>
            {showMenu && (
              <div className='profile-dropdown'>
                <button className='dropdown-close' onClick={() => setShowMenu(false)}>X</button>
                <div className='profile-card'>
                  <div className='profile-icon' onClick={() => setShowMenu(true)}>{userLetter}</div>
                  <Texts variant={'span'} className='profile-card-name'>{user.name}</Texts>
                  <Texts variant={'span'} className='profile-card-email'>{user.email}</Texts>
                </div>
                {/* Links poinying to different profile subpages where user can edit their personal information or login information */}
                <Link to="/profile/edit" onClick={() => setShowMenu(false)} className='profile-dropdown-links' ><UserPen className='dropdown-link-icon'/>Edit Profile details</Link>
                <Link to="/profile/login" onClick={() => setShowMenu(false)} className='profile-dropdown-links'><KeyRound className='dropdown-link-icon'/>Edit log in credentials</Link>
                <button onClick={()=>setLogoutConfirmation(true)}className='logout-btn' title="Logout"><LogOut className='profile-link-icon'/>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Logout confirmation window in case user pressed button mistakenly ,they get to cancel or proceed */}
      {logoutConfirmation && (
        <>
        <div className='add-items-background' onClick={()=>setLogoutConfirmation(false)}></div>
        <div className='add-items confirm-dialog'>
          <Texts variant={''}>Are you sure you want to log out?</Texts>
          <div className='add-list'>
            <div className='confirm-actions'>
              <button type="button" onClick={()=>setLogoutConfirmation(false)} className='cancel-btn'>Cancel</button>
              <button type="button" onClick={Logout} className='delete-list-btn confirm-delete-bt'>Yes,Logout</button>
            </div>
          </div>
        </div>
        </>
      )}
    </nav>
  )
}
