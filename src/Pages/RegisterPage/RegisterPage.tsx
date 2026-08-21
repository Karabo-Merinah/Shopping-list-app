import { useState } from "react"
import { Texts } from "../../Components/Texts/Texts"
import {PhoneInput} from "react-international-phone"
import "react-international-phone/style.css"
import { Link ,useNavigate} from "react-router-dom"
type RegisterPageProps = {
  onSubmit: (name: string,
    surname: string,
    email: string,
    cellnumber: string,
    password: string,
    confirm_password: string
  ) => Promise<void>
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSubmit }) => {
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cellnumber, setCellnumber] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage,setErrorMessage]=useState("")
  const navigate=useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errorvalidation=errorHandling(name,surname,email,cellnumber,password,confirmPassword)
    if(errorvalidation != ""){
      setErrorMessage(errorvalidation)
      return
    }
    setErrorMessage("")
    try{
      await  onSubmit(name, surname, email, cellnumber, password, confirmPassword)
      navigate("/")
    }
    catch(error){
      alert("Registration failed")
    }
    setName("")
    setSurname("")
    setEmail("")
    setPassword("")
    setCellnumber("")
    setConfirmPassword("")
  }
  const errorHandling = (name: string, surname: string, email: string, cellnumber: string, password: string, confirm_password: string) => {
    if (name.trim() === "") {
      return "Name is required"
    }
    if (surname.trim() === "") {
      return "Surname is required"
    }
    if (email.trim() === "") {
      return "Email is required"
    }
    else if (email.length > 0 && (!email.includes("@") && !email.includes("."))) {
      return "Incorrect format for email"
    }
    if (cellnumber.length === 0) {
      return "Cell number is required"
    }
    else if(cellnumber.length >16){
      return"Not required length for cell number"
    }
    if (password.trim() === "") {
      return "Password is required"
    }
    else if (password != confirm_password) {
      return "Passwords do not match"
    }
    return ""
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="form ">
        <div className="form-content">
          <div className="register-instruction">
            <Texts variant={'p'} style={{fontWeight:'bold'}}>CREATE AN ACCOUNT </Texts>
            <Texts variant={'h3'}>Your shopping list organiser </Texts>
          </div>
           <div className="name-surname">
          <div className="input-container">
            <label id="name" className="labels">Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="input-fields" />
          </div>
          <div className="input-container">
            <label id="surname" className="labels">Surname:</label>
            <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Enter your surname" className="input-fields" />
          </div>
          </div>
          <div className="input-container">
            <label id="email" className="labels">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="input-fields" />
          </div>
          <div className="input-container">
            <label id="cellNumber" className="labels">Phone Number:</label>
            <PhoneInput   defaultCountry="za"  forceDialCode={true} value={cellnumber} onChange={(phone) => setCellnumber(phone)} /> 
          </div>
          <div className="input-container">
            <label id="password" className="labels">Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="input-fields" />
          </div>
          <div className="input-container">
            <label id="confirm_password" className="labels">Confirm Password:</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="input-fields" />
          </div>
          <label><input type="checkbox" />Do you agree to terms and conditions?</label>
          {errorMessage != "" && <Texts variant={'p'} className="error-handling">{errorMessage}</Texts>}
        </div>
        <div className="register-btn">
          <button type="submit">CREATE AN ACCOUNT</button>
        </div>
        <div className="login-register-btn">
          <Texts variant={'p'}>Already have an account?<Link to="/" className="login-reg-btn">Log in</Link></Texts>
        </div>
      </form>

    </div>
  )
}
