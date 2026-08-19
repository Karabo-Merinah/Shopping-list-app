import React from 'react'
import { useState } from 'react'
import {Texts} from '../Texts/Texts'
import { UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
export const Navbar = () => {
    const [searchWord,setSearchWord]=useState("")
  return (
    <nav>
    <div>
    <div className='navbar-content'>
     <Texts variant={'h2'}>Logo</Texts>
     <input type="text"  value={searchWord} onChange={(e)=> setSearchWord(e.target.value)} placeholder="search list and list items..." className="navbar-search"/> 
     <Link to="/profile"><UserRound/></Link>
     </div>
     </div>
    </nav>
  )
}
