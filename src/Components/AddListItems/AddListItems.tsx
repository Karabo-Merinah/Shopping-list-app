import React from 'react'
import { useState } from 'react'
import { Texts } from '../Texts/Texts'

export type AddItemsToList={
    onSubmit:(listName:string,
    name:string,
    quantity:number,
    category:string,
    changeCategory:string,
    image:string,
    notes?:string,
    )=>void,
    onCancel:()=>void
}
export const AddListItems:React.FC<AddItemsToList>= ({onSubmit,onCancel}) => {
 const [listName,setListName]=useState("")
 const [name,setName]=useState("")
 const [quantity,setQuantity]=useState(0)
 const [category,setCategory]=useState("")
 const [otherCategory,setOtherCategory]=useState("")
 const [image,setImages] =useState("")
 const [notes,setNotes]=useState("")

 const submittedTask=(e:React.FormEvent)=>{
  e.preventDefault()
  const categorry= category === "Other" ? otherCategory: category
  onSubmit(listName,name,quantity,category,categorry,image,notes)
 }
 const errorHandling=()=>{
 if(listName.split("").length>30 ){
   return <Texts variant={'p'} className="error-text">List title exceed required length (30 words)</Texts>
 }
 }
    return (
        <div className='add-items' >
         <form onSubmit={submittedTask}>
            <label htmlFor="List name">List Name:</label>
            <input type="text" value={listName} onChange={(e)=> setListName(e.target.value)} />
             {errorHandling()}
            <label htmlFor='Item name:'>Name:</label>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
            <label htmlFor='Quantity'>Quantity</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}/>
            <label htmlFor='Category'>Category</label>
            <select name="category" value={category} onChange={(e)=>setCategory(e.target.value)}>
                <option value="Food">Food</option>
                <option value="Clothes">Clothes</option>
                <option value="Gagdets">Gadgets</option>
                <option value="Other">Other</option>
            </select>
            {category === "Other" && (
            <input type="text" value={otherCategory} onChange={(e)=>setOtherCategory(e.target.value)}/>
            )}
            <label htmlFor='image'>Item image:</label>
            <input type="text"  value={image} onChange={(e)=>setImages(e.target.value)}/>
            <input type="text" value={notes} onChange={(e)=>setNotes(e.target.value)}/>
            <div className='add-list'>
            <button type="submit" className="add-list-btn">Add a list</button>
            <button type="button" onClick={onCancel} className='cancel-btn'>Cancel</button>
            </div>
         </form>
        </div>
  )
}
