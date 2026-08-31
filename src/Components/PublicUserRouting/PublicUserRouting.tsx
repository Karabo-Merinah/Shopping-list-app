import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { type RootState } from '../../app/store'

type PublicRoutingProps={
    children:React.ReactNode
}
export const PublicUserRouting:React.FC<PublicRoutingProps> = ({children}) => {
    // Grab the "isUserLoggedIn" flag from Redux state
    const isUserLoggedIn=useSelector((root:RootState)=>root.user.isUserLoggedIn)
     // If user IS logged in then  redirect them to "/home"
    if(isUserLoggedIn === true){
        return <Navigate to="/home"/>
    }
    // If user is NOT logged in then show the public content like login/register
  return children
}

