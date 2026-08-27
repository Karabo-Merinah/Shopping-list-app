import { Navbar } from '../../Components/Navbar/Navbar'
import { AddListItems } from '../../Components/AddListItems/AddListItems'
import { useEffect, useState, type FormEvent } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../../app/store'
import { Texts } from '../../Components/Texts/Texts'
import axios from 'axios'
import empty_state from '../../assets/empty.jpg'
import { Share2Icon, Trash2Icon,Link2,Mail } from 'lucide-react'
import { Edit2Icon } from 'lucide-react'
import empty_search from '../../assets/no_results_search.jpg'
import { Notifications } from '../../Components/Notifications/Notifications'
import { PixbayPictureSearch } from '../../Components/PixbayPictureSearch/PixbayPictureSearch'
import { API_BASE_URL } from '../../config/api'

type ShoppingList = {
  id: string,
  userid: string,
  listName: string,
  category: string,
  dateAdded: string
}
type ListItems = {
  id: string,
  listId: string,
  name: string,
  quantity: number;
  image: string,
  notes?: string
}

export const HomePage = () => {
  const [showForm, setShowForm] = useState(false)
  const [sortingOptions, setSortingoptions] = useState("Name")
  const [listSearch, setListSearch] = useState("")
  const [listItems, setListItems] = useState<ShoppingList[]>([])
  const [wholeList, setWholeList] = useState<ListItems[]>([])
  const [openedListId, setOpenedListId] = useState("")
  const [openListName, setOpenListName] = useState("")
  const [items, setItems] = useState<ListItems[]>([])
  const [notifications, setNotifications] = useState("")
  const [openSharingId,setOpenSharingId]=useState<string|null>(null)
  // Edit fields
  const [editingId, setEditingId] = useState("")
  const [editName, setEditName] = useState("")
  const [editQuantity, setEditQuantity] = useState(0)
  const [editImage, setEditImage] = useState("")
  const [editNotes, setEditNotes] = useState("")

  //Add field when viewing 
  const [addName, setAddName] = useState("")
  const [addQuantity, setAddQuantity] = useState(0)
  const [addImage, setAddImage] = useState("")
  const [addNotes, setAddNotes] = useState("")
  const [showAddItem, setShowAddItem] = useState(false)

  const user = useSelector((state: RootState) => state.user)


  //Getting list for displaying,searching and sorting 
  async function getList() {
    try {
      const listResponse = await axios.get(`${API_BASE_URL}/lists?userId=${user.id}`)
      setListItems(listResponse.data)

      const itemResponse = await axios.get(`${API_BASE_URL}/listItems`)
      setWholeList(itemResponse.data)
    }
    catch (error) {
      console.log("Could not load list", error)
    }
  }
  useEffect(() => {
    getList()
  }, [])
  async function openList(list: ShoppingList) {
    try {
      const response = await axios.get(`${API_BASE_URL}/listItems?listId=${list.id}`)
      setItems(response.data)
      setOpenedListId(list.id)
      setOpenListName(list.listName)
    }
    catch (error) {
      console.log(error)
    }
  }
  function editItemInfo(item: ListItems) {
    setEditingId(item.id)
    setEditName(item.name)
    setEditQuantity(item.quantity)
    setEditImage(item.image)
    setEditNotes(item.notes ?? " ")
  }

  async function savedEditedInfo(e: FormEvent, itemId: string) {
    e.preventDefault()
    try {
      await axios.patch(`${API_BASE_URL}/listItems/${itemId}`, {
        name: editName,
        quantity: editQuantity,
        image: editImage,
        notes: editNotes
      })
      setItems(items.map((item) => item.id === itemId ? { ...item, name: editName, quantity: editQuantity, image: editImage, notes: editNotes } : item))
      setEditingId("")
      setNotifications("Item updated sucessfully")
    }
    catch (error) {
      console.log(error)
    }
  }
  async function addItemToList(e: FormEvent) {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/listItems`, {
        listId: openedListId, name: addName, quantity: addQuantity, image: addImage, notes: addNotes
      })
      setItems([...items, response.data])
      setAddName("")
      setAddQuantity(0)
      setAddImage("")
      setAddNotes("")
      setShowAddItem(false)
      setNotifications("Item added sucessfully")
    }
    catch (error) {
    }
  }
  async function deleteItem(itemId: string) {
    try {
      await axios.delete(`${API_BASE_URL}/listItems/${itemId}`)
      setNotifications("List deleted successfully")
      setItems(items.filter((item) => item.id !== itemId))
      setNotifications("Item deleted successfully")
    }
    catch (error) {
      console.log(error)
    }
  }
  async function deleteList(listId: string) {
    try {
      await axios.delete(`${API_BASE_URL}/lists/${listId}`)
      if (openedListId === listId) setOpenedListId("")
      getList()
      setNotifications("List deleted successfully")
    }
    catch (error) {
    }
  }

  async function changeQuantity(item: ListItems, newQuantity: number) {
    if (newQuantity < 1) return
    try {
      await axios.patch(`${API_BASE_URL}/listItems/${item.id}`, {
        quantity: newQuantity,
      })
      setItems(items.map(i =>
        i.id === item.id ? { ...i, quantity: newQuantity } : i
      ))
    } catch (error) {
      console.error(error)
    }
  }
  function formulateShareText(list:ShoppingList){
  // Get all items that belong to this list
  const listItemsToShare = wholeList.filter((item) => item.listId === list.id)

  const itemCountLabel=listItemsToShare.length === 1 ? "1 item" :`${listItemsToShare.length} items`
  const heading=`${list.listName} (${list.category}) \n ${itemCountLabel}\n`
  //  Format each item into a line: name, quantity, and image URL
   let sharingFormat=""
   if(listItemsToShare.length === 0){
    sharingFormat="No items yet"
   }
   else{
    listItemsToShare.forEach((item,index)=>{
      sharingFormat+=`\n ${index +1} . ${item.name} \n Quantity: ${item.quantity}`
      if(item.notes){
        sharingFormat+=`\n  Note: ${item.notes}`
      }
      sharingFormat += "\n"
    })
   }
  const shareurl=`${window.location.origin}/shared/${list.id}`
  const shareText = `${heading} ${sharingFormat}\nView list:${shareurl}`
  return {shareText,shareurl}
  }
  async function copyListLink(list:ShoppingList){
    const {shareurl}=formulateShareText(list)
    try{
      await navigator.clipboard.writeText(shareurl)
      setNotifications("Link copied to clipboard")
    }
    catch(error){
      setNotifications("Could not copy link")
    }
    setOpenSharingId(null)
  }
  function emailList(list:ShoppingList){
    const {shareText}=formulateShareText(list)
    const subject=encodeURIComponent(`${list.listName}-Shopping List`)
    const body=encodeURIComponent(shareText) 
    window.location.href=`mailto:?subject=${subject}&body=${body}`
    setOpenSharingId(null)
  }

  function SearchbarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setListSearch(value)
    const search_params = new URLSearchParams(window.location.search)

    if (value === "") {
      search_params.delete("search")
    } else {
      search_params.set("search", value)
    }
    search_params.set("sort", sortingOptions)
    window.history.replaceState(null, "", `${window.location.pathname}?${search_params.toString()}`)
  }
  useEffect(() => {
    const search_params = new URLSearchParams(window.location.search)
    search_params.set("sort", sortingOptions)
    if (listSearch) search_params.set("search", listSearch)
    window.history.replaceState(null, "", `${window.location.pathname}?${search_params.toString()}`)
  }, [sortingOptions, listSearch]) 

  const filterList = listItems.filter((list) => {
    if (listSearch === "") return true
    return (
      list.listName.toLowerCase().includes(listSearch.toLowerCase()) ||
      wholeList.some(
        (item) =>
          item.listId === list.id &&
          item.name.toLowerCase().includes(listSearch.toLowerCase())
      )
    )
  })
  const sortingList = [...filterList].sort((a, b) => {
    if (sortingOptions === "Name") {
      return a.listName.localeCompare(b.listName)
    }
    if (sortingOptions === "Category") {
      return (a.category || "").localeCompare(b.category || "")
    }
    if (sortingOptions === "Date Added") {
      return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
    }
    return 0
  })
  useEffect(() => {
    window.history.replaceState(null, "", `${window.location.pathname}?sort=${encodeURIComponent(sortingOptions)}`)
  }, [sortingOptions])
  if (openedListId !== "")
    return (
      <>
        <Navbar />

        <div className='list-detail'>
          <div className='list-detail-header'>
            <Texts variant={'h2'}>{openListName}</Texts>
            {/* Checks number of items added if its is one then it is written as "item" then more than as "items" */}
            <Texts variant={'span'} className='item-count'>{items.length} {items.length === 1 ? "item" : "items"}</Texts>
          </div>
          <div className='items-list'>
            {items.map((item) => (
              <div key={item.id} className='item-row'>
                {editingId === item.id ? (
                  <div className='add-items'>
                    <form onSubmit={(e) => savedEditedInfo(e, item.id)}>
                      <label htmlFor='Item name:'>Name:</label>
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
                      <label htmlFor='Quantity'>Quantity</label>
                      <input type="number" min={0} value={editQuantity} onChange={(e) => setEditQuantity(Number(e.target.value))} placeholder="Quantity" />
                      <label htmlFor='image'>Item image:</label>
                      <PixbayPictureSearch onSelect={(url) => setEditImage(url)} />
                      <label htmlFor='notes'>Item note</label>
                      <input value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Optional:Notes" />
                      <div className='add-list'>
                        <button type="submit" className='add-list-btn'>Save</button>
                        <button type="button" onClick={() => setEditingId("")} className='cancel-btn'>Cancel</button>
                      </div>
                    </form>
                  </div>
                ) : (
                  // When user selects the view list ,list of items appear in a row each with their own image
                  <div className='item-view'>
                    <div className='item-info'>
                      <img src={item.image || undefined}alt={item.name} className='item-image-view' />
                      <div className='item-details'>
                        <Texts variant={'span'} className='item-title'>{item.name}</Texts>
                        <Texts variant={'span'} className='item-data'>Quantity:{item.quantity}</Texts>
                        {item.notes && (
                          <Texts variant={'span'} className='item-data'>Note:{item.notes}</Texts>
                        )}
                      </div>
                    </div>
                    {/* Subtracting and adding quantity styling as each have their own buttons */}
                    <div className='item-side'>
                      <div className="item-qnty-operations">
                        <button type="button" className="qnty-btn" title="Decrease quantity" onClick={() => changeQuantity(item, item.quantity - 1)}>-</button>
                        <Texts variant={'span'} className='qnty-value'>{item.quantity}</Texts>
                        <button type="button" className="qnty-btn" title="Increase quantity" onClick={() => changeQuantity(item, item.quantity + 1)}>+</button>
                      </div>
                      <div className='item-actions'>
                        <button type="button" onClick={() => editItemInfo(item)} title="edit" className='actions-images'><Edit2Icon className='actions-btn' /></button>
                        <button type="button" onClick={() => deleteItem(item.id)} title="delete" className='actions-images'><Trash2Icon className='actions-btn' /></button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="list-controls">
            {!showAddItem && (
              <div className='list-controls-row'>
                  <button type="button" onClick={() => setOpenedListId("")} className='cancel-btn'>Cancel</button>
                  <button type="button" onClick={() => setShowAddItem(true)} className='add-list-btn'>Add item</button>
                </div>
            )}
             {/* If user clicks on the add item button a form is displayed so they can fill information */}
            {showAddItem && (
              <div className='add-items'>
                <form onSubmit={addItemToList}>
                  <Texts variant={'p'}>Item Information</Texts>
                  <label htmlFor='Item name:'>Name:</label>
                  <input type="text" value={addName} onChange={(e) => setAddName(e.target.value)} />
                  <label htmlFor='Quantity'>Quantity</label>
                  <input type="number" min={0} value={addQuantity} onChange={(e) => setAddQuantity(Number(e.target.value))} />
                  <label htmlFor='image'>Item image:</label>
                  <PixbayPictureSearch onSelect={(url) => setAddImage(url)} />
                  <label htmlFor='notes'>Item note</label>
                  <input type="text" value={addNotes} onChange={(e) => setAddNotes(e.target.value)} />
                  <div className='actions'></div>
                  <div className='add-list'>
                    <button type="button" onClick={() => setShowAddItem(false)} className='cancel-btn'>Cancel</button>
                    <button type="submit" className='add-list-btn'>Save Item</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </>
    )
  return (
    <>
      {notifications && (<Notifications message={notifications} onClose={() => setNotifications("")} duration={2500} />)}
      <Navbar />
      <div className='home-page'>
        <Texts variant={'h1'} className='home-title'>Your shopping lists</Texts>
        <div className='home-topbar'>
          <div className='home-topbar-row'>
            <input type="text" value={listSearch} onChange={SearchbarChange} placeholder='Search your lists ...' className='list-search' />
            <div className='sorting'>
              <label htmlFor='Sort by'>Sort by:</label>
              <select value={sortingOptions} onChange={(e) => setSortingoptions(e.target.value)} className="list-sort">
                <option value="Name">Name</option>
                <option value="Category">Category</option>
                <option value="Date Added">Date added</option>
              </select>
            </div>
          </div>
          <div className='home-topbar-row home-topbar-actions'>
            <Texts variant={'p'} className='home-instructions'>Create and manage multiple shopping lists effectively</Texts>
            <button onClick={() => setShowForm(true)} className="add-list-overlay">Add a shopping list</button>
          </div>
        </div>
        <div className='list-items-card'>
          {listItems.length === 0 ? (
            <div className='empty-state'>
              <img src={empty_state} className='empty-state-image' alt="Empty shopping list" />
              <Texts variant="p">No shopping list yet, add one</Texts>
            </div>
          ) : (
            filterList.length === 0 ? (
              <div className='empty-state'>
                <img src={empty_search} className='empty-state-image' alt="No search results" />
                <Texts variant="p">
                  No results match your search for <strong>{listSearch}</strong>
                </Texts>
              </div>
            ) : (
              sortingList.map((item) => {
                const itemCount = wholeList.filter((items) => items.listId === item.id).length
                return (
                  <div key={item.id} className='item-card' onClick={() => openList(item)}>
                    <div className='items-top'>
                    <Texts variant="span" className='item-name'>{item.listName}</Texts>
                    <div className='share-menu-wrap'>
                    <button type="button" onClick={(e)=>{e.stopPropagation() 
                    setOpenSharingId(openSharingId === item.id ? null :item.id)}} title="Share list" className='share-list-btn'><Share2Icon size={16}/></button>
                    {openSharingId === item.id && (
                      <div className='share-menu' onClick={(e)=>e.stopPropagation()}>
                        <button type="button" className='share-menu-option' onClick={()=>copyListLink(item)}>
                          <Link2 size={16}/>Copy link</button>
                        <button type="button" className='share-menu-option' onClick={()=>emailList(item)}><Mail size={16}/>Email</button>
                      </div>
                    )}
                    </div>
                    </div>
                    <div className='list-row'>
                      <Texts variant={'span'} className='list-data'>Category:{item.category}</Texts>
                      <Texts variant={'span'} className='list-data'>{itemCount} {itemCount === 1 ? "item" : "items"}</Texts>
                    </div>
                    <div className='view-more-row'>
                      <button type="button" onClick={() => openList(item)} className='view-more-btn'>View list</button>
                      <button type="button" onClick={(e) => { e.stopPropagation() 
                        deleteList(item.id) }} title="Delete the list "  className='delete-list-btn'><Trash2Icon size={16} /></button>
                    </div>
                  </div>
                )
              }))
            )}
              </div>
              </div>
      {showForm &&
        <>
          <div className='add-items-background' onClick={() => setShowForm(false)}></div>
          <AddListItems userId={user.id} onCancel={() => {
            setShowForm(false)
            getList()
          }} />
        </>
      }
    </>
  )
}

