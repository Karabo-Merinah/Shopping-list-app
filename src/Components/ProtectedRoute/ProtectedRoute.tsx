import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { type RootState } from "../../app/store"

type ProtectedRouteProps={
    children:React.ReactNode
}

export const ProtectedRoute:React.FC<ProtectedRouteProps>=({children})=>{

    const isUserLoggedIn=useSelector((state:RootState)=> state.user.isUserLoggedIn)

    if(!isUserLoggedIn){
        return <Navigate to = "/"/>
    }
    return children
}