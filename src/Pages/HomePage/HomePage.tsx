import { Navbar } from '../../Components/Navbar/Navbar'
import { AddListItems } from '../../Components/AddListItems/AddListItems'
import { useEffect, useState ,type FormEvent} from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../../app/store'
import { Texts } from '../../Components/Texts/Texts'
import axios from 'axios'
import empty_state from '../../assets/empty.jpg'
import { Trash2Icon } from 'lucide-react'
import { Edit2Icon } from 'lucide-react'
import empty_search from '../../assets/no_results_search.jpg'

type ShoppingList={
  id:string,
  userid:string,
  listName:string,
  category:string,
  dateAdded:string
}
type ListItems={
  id:string,
  listId:string,
  name:string,
  quantity:number;
  image:string,
  notes?:string
}

export const HomePage = () => {
  const [showForm,setShowForm]=useState(false)
  const[sortingOptions,setSortingoptions]=useState("Name")
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
  const [editImage,setEditImage]=useState("")
  const [editNotes,setEditNotes]=useState("")
  
 //Add field when viewing 
 const [addName,setAddName]=useState("")
const [addQuantity,setAddQuantity]=useState(0)
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
    setEditingId(item.id)
    setEditName(item.name)
    setEditQuantity(item.quantity)
    setEditImage(item.image)
    setEditNotes(item.notes ?? " ")
  }

  async function savedEditedInfo(e:FormEvent,itemId:string){
    e.preventDefault()
    try{
      await axios.patch(`http://localhost:3000/listItems/${itemId}`,{
        name:editName,
        quantity:editQuantity,
        image:editImage,
        notes:editNotes
      })
      setItems(items.map((item)=>item.id === itemId ? {...item,name:editName,quantity:editQuantity,image:editImage,notes:editNotes}:item))
      setEditingId("")
    }
    catch(error){
    console.log(error)
  }
}
async function addItemToList(e:FormEvent){
  e.preventDefault()
  try{
    const response=await axios.post('http://localhost:3000/listItems',{
      listId:openedListId,name:addName,quantity:addQuantity,image:addImage,notes:addNotes})
      setItems([...items,response.data])
      setAddName("")
      setAddQuantity(0)
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

  function SearchbarChange(e:React.ChangeEvent<HTMLInputElement>){
    setListSearch(e.target.value)
    if(e.target.value === ""){
      window.history.replaceState(null,"",window.location.pathname)
    }
    else{
      window.history.replaceState(null,"",`${window.location.pathname}?search=${encodeURIComponent(e.target.value)}`)
    }
  }
  const filterList=listItems.filter((list)=>{
    if(listSearch === "") return true
    return (
      list.listName.toLowerCase().includes(listSearch.toLowerCase()) ||
     wholeList.some((item)=>
      item.listId === list.id && item.name.toLowerCase().includes(listSearch.toLowerCase()))
  )})
 const sortingList=[...filterList].sort((a , b)=>{
  if(sortingOptions === "Name"){
    return a.listName.localeCompare(b.listName)
  }
  if(sortingOptions === "Category"){
    return a.category.localeCompare(b.category)
  }
  if (sortingOptions === "Date Added") {
    return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
  }
  return 0
 })
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
            {item.notes &&( 
            <Texts variant={'span'}>Note:{item.notes}</Texts>
            )}
            </div>
            </div>
            <div className='item-side'>
              <div className='item-qnty-badge'>Qty: {item.quantity}</div>
            <div className='item-actions'>
            <button type="button" onClick={()=>editItemInfo(item)} title="edit" className='actions-images'><Edit2Icon className='actions-btn'/></button>
            <button type="button" onClick={()=>deleteItem(item.id)} title="delete" className='actions-images'><Trash2Icon className='actions-btn'/></button>
            </div>
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
      <input type="text" value={listSearch} onChange={SearchbarChange} placeholder='Search your lists ...' className='list-search'/>
      <div className='home-topbar-actions'>
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
      </div>
<div className='list-items-card'>
  {listItems.length === 0 ? (
    <div className='empty-state'>
      <img src={empty_state} className='empty-state-image' alt="Empty shopping list"/>
      <Texts variant="p">No shopping list yet, add one</Texts>
    </div>
  ) : (
    filterList.length === 0 ? (
      <div className='empty-state'>
        <img src={empty_search} className='empty-state-image' alt="No search results"/>
        <Texts variant="p">
          No results match your search for <strong>{listSearch}</strong>
        </Texts>
      </div>
    ) : (
      sortingList.map((item) => {
        const itemCount = wholeList.filter((items) => items.listId === item.id).length
        return (
          <div key={item.id} className='item-card' onClick={() => openList(item)}>
            <Texts variant="span" className='item-name'>{item.listName}</Texts>
            <div className='list-row'>
              <Texts variant={'span'} className='list-data'>Category:{item.category}</Texts>
              <Texts variant={'span'} className='list-data'>{itemCount} {itemCount === 1 ?"item" : "items"}</Texts>
              </div>
            <div className='view-more-row'>
              <button type="button" onClick={() => openList(item)} className='view-more-btn'>View list</button>
            </div>
          </div>
        )
      })
    )
  )}
</div>

    </div>
    {showForm && 
    <>
    <div className='add-items-background' onClick={()=>setShowForm(false)}></div>
    <AddListItems userId={user.id}  onCancel={()=>{setShowForm(false) 
      getList() }}/>
      </>
    }
        </>
  )}
