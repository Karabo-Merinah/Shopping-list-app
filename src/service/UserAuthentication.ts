import bcrypt from 'bcryptjs'
import axios from 'axios'
import { store } from '../app/store'
import { loginUser,registerUser} from '../ReduxStore/userAuth'
import { API_BASE_URL } from '../config/api'

export async function setUserInfo(name:string,surname:string,email:string,cellnumber:string,password:string
){
    //Registers a new user and indicates if the user uses an existing email  and hashes user's password for security 
    const convertedEmail=email.toLowerCase()
     const existing =await axios.get(`${API_BASE_URL}/users?email=${convertedEmail}`)
    if(existing.data.length >0){
        throw new Error("An account with this email already exists ")
    }
    const hashPassword= await bcrypt.hash(password,10)
    const userInfo={name,surname,email:convertedEmail,cellnumber,password:hashPassword}

    const response=await axios.post(`${API_BASE_URL}/users`,userInfo)
    return response.data
}
//When user tries to login they are validated to ensure they existing within the database and also if their password matches 
export async function login(email:string,password:string){
const response= await axios.get(`${API_BASE_URL}/users?email=${email.toLowerCase()}`)
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