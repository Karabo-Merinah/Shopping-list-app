import { Navbar } from '../../Components/Navbar/Navbar'
import { AddListItems } from '../../Components/AddListItems/AddListItems'
import { useState } from 'react'
export const HomePage = () => {
  const [showForm,setShowForm]=useState(false)
  const[sortingOptions,setSortingoptions]=useState("Date Added")
  const [listSearch,setListSearch]=useState("")
  function handleAddItem(listName:string,name:string,quantity:number,category:string,changeCategory:string,images:string,notes?:string){
    const actualCategory=category === "Other" ? changeCategory :category
    setShowForm(false)
  }
  return (
    <>
    <Navbar/>
    <div className='home-page'>
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
    {showForm && <AddListItems onSubmit={handleAddItem} onCancel={()=>setShowForm(false)}/>}
    </>
  )
}
