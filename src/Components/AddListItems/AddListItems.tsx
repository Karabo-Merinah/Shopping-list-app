import React from 'react'
import { useState } from 'react'
import { Texts } from '../Texts/Texts'
import axios from 'axios'
export type AddItemsToList={
    userId:string,
    onCancel:()=>void
}
export const AddListItems:React.FC<AddItemsToList>= ({userId,onCancel}) => {
 const [listName,setListName]=useState("")
 const[listId,setListId]=useState("")
 const [name,setName]=useState("")
 const [quantity,setQuantity]=useState(0)
 const [category,setCategory]=useState("")
 const [otherCategory,setOtherCategory]=useState("")
 const [image,setImages] =useState("")
 const [notes,setNotes]=useState("")
 const [itemsAdded,setItemsAdded]=useState(0)
 const [errorMsg,setErrorMsg]=useState("")


 const errorHandling=()=>{
 if(listName.split("").length>30 ){
   return <Texts variant={'p'} className="error-text">List title exceed required length (30 words)</Texts>
 }
 }
  const addItem=async (e:React.FormEvent)=>{
  e.preventDefault()
  const categorry= category === "Other" ? otherCategory: category
  try{
    await axios.post("http://localhost:3000/listItems",{
    listId,name,quantity,category:categorry,image,notes
    })
    setItemsAdded(itemsAdded+1)
    setName("")
    setQuantity(0)
    setCategory("Grocery")
    setOtherCategory("")
    setImages("")
    setNotes("")
  }
  catch(error){
    setErrorMsg("Could not add item")
  }
 }
 const createList=async (e:React.FormEvent)=>{
 e.preventDefault()
 try{
  const response=await axios.post("http://localhost:3000/lists",{
    userId,listName,dateAdded:new Date().toISOString()
  })
  setListId(response.data.id)
 }
 catch(error){
  setErrorMsg("Could not create a list")
 }
 }
  if(listId === ""){
    return (
        <div className='add-items' >
         <form onSubmit={createList}>
          <Texts variant={'h2'}>Start a new list </Texts>
          <Texts variant={'p'} className='subtitle'>Give your shopping list a name to get started</Texts>
            <label htmlFor="List name">List Name:</label>
            <input type="text"placeholder='e.g Weekly errands grocery' value={listName} onChange={(e)=> setListName(e.target.value)} />
             {errorHandling()} {errorMsg !== "" && <Texts variant={'p'} className='error-text'>{errorMsg}</Texts>}
           
             <div className='add-list'>
              <button type="submit" className='add-list-btn'>Save List</button>
              <button type="button" onClick={onCancel} className='cancel-btn'>Cancel</button>
             </div>
             </form>
             </div>
    )}
    return(
      <div className='add-items'>
        <Texts variant={'h2'}>{listName} </Texts>
        <Texts variant={'p'} className='subtitle'>Add as many items as you need then save </Texts>
        <Texts variant={'p'} className='items-count'>{itemsAdded} item(s) added </Texts>
        <form onSubmit={addItem}>
            <hr/>
             <Texts variant={'p'}>Item Information</Texts>
            <label htmlFor='Item name:'>Name:</label>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
            <label htmlFor='Quantity'>Quantity</label>
            <input type="number" min={0} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}/>
            <label htmlFor='Category'>Category</label>
            <select name="category" value={category} onChange={(e)=>setCategory(e.target.value)}>
                <option value="Food">Food</option>
                <option value="Clothes">Clothes</option>
                <option value="Gagdets">Gadgets</option>
                <option value="Other">Other</option>
            </select>
            {category === "Other" && (
                <div className='other-category'>
                    <label htmlFor='otherCategory'>Please specify</label>
            <input type="text" placeholder="Enter category" value={otherCategory} onChange={(e)=>setOtherCategory(e.target.value)}/>
              </div>
            )}
            <label htmlFor='image'>Item image:</label>
            <input type="text"  value={image} onChange={(e)=>setImages(e.target.value)}/>
            <label htmlFor='notes'>Item note</label>
            <input type="text" value={notes} onChange={(e)=>setNotes(e.target.value)}/>
            <div className='add-items-list'>
            <button type="submit" className="add-item-btn">Save item</button>
            <button type="button" onClick={onCancel} className='cancel-btn'>Cancel</button>
            </div>
        </form>
      </div>
  )
}
