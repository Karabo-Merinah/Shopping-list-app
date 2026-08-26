import React from 'react'
import axios from 'axios'
import { useState } from 'react'

const PIXABAY_API=import.meta.env.VITE_SHOPPING_API_KEY

export const PixbayPictureSearch = ({onSelect}:{onSelect:(url:string)=>void}) => {
    const [searchTerm,setSearchTerm]=useState("")
    const [images,setImages]=useState<any[]>([])

   const searchImages=async()=>{
    try{
        const results=await axios.get("https://pixabay.com/api",{
            params:{key:PIXABAY_API,q:searchTerm,image_type:"photo",per_page:6}
        })
            setImages(results.data.hits)
    }
    catch(error){
        console.log("Error fetching images")
    }
   } 
  return (
  <div>
    <div className='pictures-btn'>
            <input type="text" onChange={(e)=>setSearchTerm(e.target.value)} placeholder='search for image'/>
            <button type="button" onClick={searchImages} className='search-images-btn'>Search</button>
            </div>
            <div>
                {images.map(img=>(
                    <img key={img.id} src={img.previewURL} alt={img.tags} onClick={() => {onSelect(img.largeImageURL) 
                    setImages([])}}  style={{width:"100px",cursor:"pointer",margin:"5px"}}/>))}
                    </div>
        </div>
  )
}
