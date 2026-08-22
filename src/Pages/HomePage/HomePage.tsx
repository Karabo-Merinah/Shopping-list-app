import { Navbar } from '../../Components/Navbar/Navbar'
import { AddListItems } from '../../Components/AddListItems/AddListItems'
import { useEffect, useState ,type FormEvent} from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../../app/store'
import { Texts } from '../../Components/Texts/Texts'
import axios from 'axios'

type ShoppingList={
  id:string,
  userid:string,
  listName:string,
  dateAdded:string
}
type ListItems={
  id:string,
  listId:string,
  name:string,
  quantity:number;
  category:string,
  image:string,
  notes?:string
}

export const HomePage = () => {
  const [showForm,setShowForm]=useState(false)
  const[sortingOptions,setSortingoptions]=useState("Date Added")
  const [listSearch,setListSearch]=useState("")
  const [listItems,setListItems]=useState<ShoppingList[]>([])
  const [wholeList,setWholeList]=useState<ListItems[]>([])
  const [openedListId,setOpenedListId]=useState("")
  const [openListName,setOpenListName]=useState("")
  const [items,setItems]=useState<ListItems[]>([])

  // Edit fields
  const [editingId,setEditingId]=useState("")
  const[editName,setEditName]=useState("")
  const [editQuantity,setEditQuantity]=useState(0)
  const [editCategory,setEditCategory]=useState("")
  const [editOtherCategory,setEditOtherCategory]=useState("")
  const [editImage,setEditImage]=useState("")
  const [editNotes,setEditNotes]=useState("")
  
 //Add field when viewing 
 const [addName,setAddName]=useState("")
const [addQuantity,setAddQuantity]=useState(0)
const [addCategory,setAddCategory]=useState("")
const [addOtherCategory,setAddOtherCategory]=useState("")
const [addImage,setAddImage]=useState("")
const [addNotes,setAddNotes]=useState("")
const [showAddItem,setShowAddItem]=useState(false)

  const user=useSelector((state:RootState)=>state.user)

  //Getting list for displaying,searching and sorting 
  async function getList(){
  try{
    const listResponse=await axios.get(`http://localhost:3000/lists?userId=${user.id}`)
    setListItems(listResponse.data)

    const itemResponse=await axios.get('http://localhost:3000/listItems')
    setWholeList(itemResponse.data)
  }
  catch(error){
      console.log("Could not load list", error)
  }
  }
  useEffect(()=>{
    getList()
  },[])
  async function openList(list:ShoppingList){
    try{
      const response=await axios.get(`http://localhost:3000/listItems?listId=${list.id}`)
      setItems(response.data)
      setOpenedListId(list.id)
      setOpenListName(list.listName)
    }
    catch(error){
      console.log(error)
    }
  }
  function editItemInfo(item:ListItems){
    const categories=["Food","Clothes","Gagdets"]
    if(categories.includes(item.category)){
      setEditCategory(item.category)
      setEditOtherCategory("")
    }
    else{
      setEditCategory("Other")
      setEditOtherCategory(item.category)
    }
    setEditingId(item.id)
    setEditName(item.name)
    setEditQuantity(item.quantity)
    setEditImage(item.image)
    setEditNotes(item.notes ?? " ")
  }

  async function savedEditedInfo(e:FormEvent,itemId:string){
    e.preventDefault()
    try{
      const category=editCategory === "Other" ?editOtherCategory :editCategory
      await axios.patch(`http://localhost:3000/listItems/${itemId}`,{
        name:editName,
        quantity:editQuantity,
        category,
        image:editImage,
        notes:editNotes
      })
      setItems(items.map((item)=>item.id === itemId ? {...item,name:editName,quantity:editQuantity,category,image:editImage,notes:editNotes}:item))
      setEditingId("")
    }
    catch(error){
    console.log(error)
  }
}
async function addItemToList(e:FormEvent){
  e.preventDefault()
  try{
    const category=addCategory === "Other" ? addOtherCategory:addCategory
    const response=await axios.post('http://localhost:3000/listItems',{
      listId:openedListId,name:addName,quantity:addQuantity,category,image:addImage,notes:addNotes})
      setItems([...items,response.data])
      setAddName("")
      setAddQuantity(0)
      setAddCategory("")
      setAddOtherCategory("")
      setAddImage("")
      setAddNotes("")
      setShowAddItem(false)
  }
  catch(error){

  }
}
async function deleteItem(itemId:string){
  try{
    await axios.delete(`http://localhost:3000/listItems/${itemId}`)
    setItems(items.filter((item)=>item.id !== itemId))
  }
  catch(error){
    console.log(error)
  }
}
  async function deleteList(){
    try{
      await axios.delete(`http://localhost:3000/lists/${openedListId}`)
      setOpenedListId("")
      getList()
    }
    catch(error){

    }
  }
if(openedListId !=="")
  return (
    <>
    <Navbar/>
    <div className='list-detail'>
      <Texts variant={'h2'}>{openListName}</Texts>
      {items.map((item)=>(
        <div key={item.id} className='item-row'>
          {editingId === item.id ? (
            <div className='add-items'>
              <form onSubmit={(e)=>savedEditedInfo(e,item.id)}>
                <label htmlFor='Item name:'>Name:</label>
          <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
          <label htmlFor='Quantity'>Quantity</label>
<input type="number" min={0} value={editQuantity} onChange={(e) => setEditQuantity(Number(e.target.value))} placeholder="Quantity" />
<label htmlFor='Category'>Category</label>
<select value={editCategory} onChange={(e)=>setEditCategory(e.target.value)}>
  <option value="Food">Food</option>
  <option value="Clothes">Clothes</option>
  <option value="Gagdets">Gadgets</option>
  <option value="Other">Other</option>
</select>
{editCategory === "Other" && (
  <div className='other-category'>
    <label htmlFor='editOtherCategory'>Please specify</label>
    <input type="text" placeholder="Enter category" value={editOtherCategory} onChange={(e)=>setEditOtherCategory(e.target.value)}/>
  </div>
)}
<label htmlFor='image'>Item image:</label>
<input value={editImage} onChange={(e) => setEditImage(e.target.value)} placeholder="Image URL" />
<label htmlFor='notes'>Item note</label>
<input value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Optional:Notes" />
<div className='add-list'>
<button type="submit" className='add-list-btn'>Save</button>
<button type="button" onClick={()=>setEditingId("")} className='cancel-btn'>Cancel</button>
            </div>
            </form>
            </div>
          ):(
            <div className='item-view'>
            <div className='item-info'>
            <img src={item.image} alt={item.name} className='item-image-view'/>
            <div className='item-details'>
            <Texts variant={'span'}>{item.name}</Texts>
            <Texts variant={'span'}>Quantity:{item.quantity}</Texts>
            <Texts variant={'span'}>Category: {item.category}</Texts>
            {item.notes &&( 
            <Texts variant={'span'}>Note:{item.notes}</Texts>
            )}
            </div>
            </div>
            <div className='item-actions'>
            <button type="button" onClick={()=>editItemInfo(item)}>Edit</button>
            <button type="button" onClick={()=>deleteItem(item.id)}>Delete</button>
            </div>
            </div>
          )}
          </div>
      ))}
      <div className="list-controls">
        <div className='add-item-row'>
        {showAddItem ? (
          <div className='add-items'>
            <form onSubmit={addItemToList}>
          <Texts variant={'p'}>Item Information</Texts>
           <label htmlFor='Item name:'>Name:</label>
          <input type="text" value={addName} onChange={(e)=>setAddName(e.target.value)}/>
          <label htmlFor='Quantity'>Quantity</label>
          <input type="number" min={0} value={addQuantity} onChange={(e)=>setAddQuantity(Number(e.target.value))}/>
           <label htmlFor='Category'>Category</label>
           <select name="category" value={addCategory} onChange={(e)=>setAddCategory(e.target.value)}>
              <option value="Food">Food</option>
                <option value="Clothes">Clothes</option>
                <option value="Gagdets">Gadgets</option>
                <option value="Other">Other</option>
            </select>
             {addCategory === "Other" && (
                <div className='other-category'>
                    <label htmlFor='otherCategory'>Please specify</label>
            <input type="text" placeholder="Enter category" value={addOtherCategory} onChange={(e)=>setAddOtherCategory(e.target.value)}/>
              </div>
            )}
            <label htmlFor='image'>Item image:</label>
          <input type="text" value={addImage} onChange={(e)=>setAddImage(e.target.value)} placeholder="Image Url"/>
            <label htmlFor='notes'>Item note</label>
          <input type="text" value={addNotes} onChange={(e)=>setAddNotes(e.target.value)}/>
          <div className='add-list'>
          <button type="submit"  className='add-list-btn'>Save Item</button>
          <button type="button" onClick={()=>setShowAddItem(false)} className='cancel-btn'>Cancel</button>
          </div>
          </form>
          </div>
          
        ):(
          <button type="button" onClick={()=>setShowAddItem(true)} className='add-list-btn'>Add item</button>
                )}
                </div>
                <div className='list-actions-row'>
          <button type="button" onClick={deleteList} className='cancel-btn'>Delete List</button>
        <button type="button" onClick={()=>setOpenedListId("")} className='cancel-btn'>Back</button>
      </div>
      </div>
    </div>
    </>
  )
  return (
    <>
    <Navbar/>
    <div className='home-page'>
      <div className='home-topbar'>
      <input type="text" value={listSearch} onChange={(e)=>setListSearch(e.target.value)} placeholder='Search your lists ...' className='list-search'/>
      <div className='sorting'>
      <label htmlFor='Sort by'>Sort by:</label>
      <select value={sortingOptions} onChange={(e)=>setSortingoptions(e.target.value) }className="list-sort">
        <option value="Name">Name</option>
        <option value="Category">Category</option>
        <option value="Date Added">Date added</option>
      </select>
      </div>
      <button onClick={()=>setShowForm(true)} className="add-list-overlay">Add a shopping list</button>
      </div>
      <div className='list-items-card'>
        {listItems.map((item)=>{
          const firstItem=wholeList.find((items)=>items.listId === item.id)
          return(
          <div key={item.id} className='item-card' onClick={()=>openList(item)}>
            <Texts variant={'span'} className='item-name'>{item.listName}</Texts>
            {firstItem && (
            <div className='item-preview-row'>
            <img src={firstItem.image} alt={firstItem.name} className='item-image'/>
            <Texts variant={'span'} className='preview'>{firstItem.name}</Texts>
            </div>
        )}
        <div className='view-more-row'>
            <button type="button"  onClick={()=>openList(item)} className='view-more-btn'>View more </button>
            </div>
            </div>
          )
})}
      </div>
    </div>
    {showForm && 
    <AddListItems userId={user.id}  onCancel={()=>{setShowForm(false) 
      getList() }}/>
    }
        </>
  )}
