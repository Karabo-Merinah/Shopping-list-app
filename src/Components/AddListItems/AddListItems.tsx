import React from 'react'
import { useState } from 'react'
import { Texts } from '../Texts/Texts'
import axios from 'axios'
import { Notifications } from '../Notifications/Notifications'
import { PixbayPictureSearch } from '../PixbayPictureSearch/PixbayPictureSearch'
import { API_BASE_URL } from '../../config/api'
export type AddItemsToList = {
  userId: string,
  onCancel: () => void
}
export const AddListItems: React.FC<AddItemsToList> = ({ userId, onCancel }) => {
  const [listName, setListName] = useState("")
  const [listId, setListId] = useState("")
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState(0)
  const [category, setCategory] = useState("Food")
  const [otherCategory, setOtherCategory] = useState("")
  const [image, setImages] = useState("")
  const [notes, setNotes] = useState("")
  const [itemsAdded, setItemsAdded] = useState(0)
  const [errorMsg, setErrorMsg] = useState("")
  const [notifications, setNotifications] = useState("")

  const errorHandling = () => {
    if (listName.split("").length > 30) {
      return <Texts variant={'p'} className="error-text">List title exceed required length (30 words)</Texts>
    }
  }
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (listId === "" && listName.trim() === "") {
      setErrorMsg("List name is required")
      return
    }
    setErrorMsg("")
    try {
      let currentListId = listId
      if (currentListId === "") {
        const categorry = category === "Other" ? otherCategory : category
        const response = await axios.post(`${API_BASE_URL}/lists`, {
          userId, listName, category: categorry, dateAdded: new Date().toISOString()
        })
        currentListId = response.data.id
        setListId(currentListId)
        setNotifications("List created successfully")
      } if (name.trim() !== "") {
        await axios.post(`${API_BASE_URL}/listItems`, {
          listId: currentListId, name, quantity, image, notes
        })
        setItemsAdded(itemsAdded + 1)
        setNotifications("Item added successfully")
        setName("")
        setQuantity(0)
        setCategory("Food")
        setOtherCategory("")
        setImages("")
        setNotes("")
      }
      else {
        setNotifications("List saved sucessfully")
      }
    }
    catch (error) {
      setErrorMsg("Could not add item")
    }
  }
  return (
    <div className='add-items'>
      {notifications && <Notifications message={notifications} onClose={() => setNotifications("")} duration={2500} />}
      <Texts variant={'h2'}>{listId === "" ? "Start a new list" : `${itemsAdded} items added`}</Texts>
      <Texts variant={'p'} className='subtitle'>
        {listId === "" ? "Name your list and pick a category to get started" : "Add as many items as you want"}
      </Texts>
      <form onSubmit={addItem}>
        {listId === "" && (
          <>
            <label htmlFor='listName'>List Name</label>
            <input type="text" placeholder="e.g Weekly errands" value={listName} onChange={(e) => setListName(e.target.value)} required />
            <label htmlFor='category'>Category</label>
            <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="Food">Food</option>
              <option value="Clothes">Clothes</option>
              <option value="Gadgets">Gadgets</option>
              <option value="Other">Other</option>
            </select>
            {category === "Other" && (
              <div className='other-category'>
                <label htmlFor='otherCategory'>Please specify</label>
                <input type="text" placeholder="Enter category" value={otherCategory} onChange={(e) => setOtherCategory(e.target.value)} />
              </div>
            )}
            <hr />
          </>
        )}
        <Texts variant={'p'}>Item Information</Texts>
        <label htmlFor='Item name:'>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor='Quantity'>Quantity</label>
        <input type="number" min={0} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <label htmlFor='image'>Item image:</label>
        <PixbayPictureSearch key={itemsAdded} onSelect={(url) => setImages(url)} />
        <label htmlFor='notes'>Item note</label>
        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
        {errorHandling()} {errorMsg !== "" && <Texts variant={'p'} className='error-text'>{errorMsg}</Texts>}
        <div className='actions'>
          <button type="button" onClick={onCancel} className='cancel-btn'>Cancel</button>
          <button type="submit" className='add-list-btn'>Save Item</button>
        </div>
      </form>
    </div>
  )
}

