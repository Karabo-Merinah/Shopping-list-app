import { useEffect,useState } from 'react'
import axios from 'axios'
import {Texts } from '../../Components/Texts/Texts'
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


export const SharingList = () => {
    const path=window.location.pathname.split("/")
    const listId=path[path.length -1]
    const [list,setList]=useState<ShoppingList | null>(null)
    const [items,setItems]=useState<ListItems[]>([])
    const [loading,setLoading]=useState(true)
    const [notFound,setNotFound]=useState(false)

    useEffect(()=>{
        async function loadSharedList(){
            try{
                const listResponse=await axios.get(`${API_BASE_URL}/lists/${listId}`)
                setList(listResponse.data)
               const itemResponse=await axios.get(`${API_BASE_URL}/listItems?listId=${listId}`)
               setItems(itemResponse.data)
            }
            catch(error){
                setNotFound(true)
            }
            finally{
                setLoading(false)
            }
        }
        loadSharedList()
    },[listId])
    if(loading){
        return(
            <div className='list-detail'>
                <Texts variant='p'>Loading list ...</Texts>
            </div>
        )
    }
    if(notFound || !list){
        return(
            <div className='list-detail'>
                <Texts variant={'h2'}>List not found</Texts>
            </div>
        )
    }
  return (
    <div className='list-detail'>
        <div className='list-detail-header'>
            <Texts variant ={'h2'}>{list.listName}</Texts>
            <Texts variant={'span'} className='item-count'>{items.length} {items.length === 1 ? "item" : "items"}</Texts> 
        </div>
        <div className='items-list'>
            {items.map((item)=>(
                <div key={item.id} className='item-row'>
                 <div className='item-view'>
                    <div className='item-info'>
                      <img src={item.image} alt={item.name} className='item-image-view' />
                      <div className='item-details'>
                        <Texts variant={'span'} className='item-title'>{item.name}</Texts>
                        <Texts variant={'span'} className='item-data'>Quantity:{item.quantity}</Texts>
                        {item.notes && (
                          <Texts variant={'span'} className='item-data'>Note:{item.notes}</Texts>
                        )}
                      </div>
                    </div>
                    </div>
                    </div>
            ))}
             </div>
        </div>
  )
}
