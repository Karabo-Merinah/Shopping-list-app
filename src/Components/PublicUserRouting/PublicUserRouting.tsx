import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { type RootState } from '../../app/store'

type PublicRoutingProps={
    children:React.ReactNode
}


export const PublicUserRouting:React.FC<PublicRoutingProps> = ({children}) => {
   
    const isUserLoggedIn=useSelector((root:RootState)=>root.user.isUserLoggedIn)
     
    if(isUserLoggedIn === true){
        return <Navigate to="/"/>
    }
  return children
}

