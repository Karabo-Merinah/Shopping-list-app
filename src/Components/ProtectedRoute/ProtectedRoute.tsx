import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { type RootState } from "../../app/store"

type ProtectedRouteProps={
    children:React.ReactNode
}

export const ProtectedRoute:React.FC<ProtectedRouteProps>=({children})=>{

    // Grab the "isUserLoggedIn" flag from Redux state
    const isUserLoggedIn=useSelector((state:RootState)=> state.user.isUserLoggedIn)
   // If user is NOT logged in redirect them to login
    if(!isUserLoggedIn){
        return <Navigate to = "/"/>
    }
    // If user IS logged in then show the protected content
    return children
}