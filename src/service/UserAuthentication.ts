import bcrypt from 'bcryptjs'
import axios from 'axios'
import { store } from '../app/store'
import { loginUser,registerUser} from '../ReduxStore/userAuth'
import { API_BASE_URL } from '../config/api'

export async function setUserInfo(name:string,surname:string,email:string,cellnumber:string,password:string
){
    const hashPassword= await bcrypt.hash(password,10)
    const userInfo={name,surname,email,cellnumber,password:hashPassword}

    const response=await axios.post(`${API_BASE_URL}/users`,userInfo)
    return response.data
}
export async function login(email:string,password:string){
const response= await axios.get(`${API_BASE_URL}/users?email=${email}`)
const users=response.data

if(users.length === 0){
    throw new Error ("user not found")
}
const user=users[0]
const isMatch= await bcrypt.compare(password,user.password)
 if(!isMatch){
    throw new Error("Invalid password")
 }
 store.dispatch(registerUser({id:user.id,name:user.name,surname:user.surname,email:user.email,cellnumber:user.cellnumber,}))
 store.dispatch(loginUser())
 return user
}