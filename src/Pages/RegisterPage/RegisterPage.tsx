import { useState } from "react"
import { Texts } from "../../Components/Texts/Texts"
import {PhoneInput} from "react-international-phone"
import "react-international-phone/style.css"

type RegisterPageProps = {
  onSubmit: (name: string,
    surname: string,
    email: string,
    cellnumber: string,
    password: string,
    confirm_password: string
  ) => void
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSubmit }) => {
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cellnumber, setCellnumber] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(name, surname, email, cellnumber, password, confirmPassword)
    setName("")
    setSurname("")
    setEmail("")
    setPassword("")
    setCellnumber("")
    setConfirmPassword("")
  }
  const errorHandling = (name: string, surname: string, email: string, cellnumber: string, password: string, confirm_password: string) => {
    if (name.trim() === "") {
      return <Texts variant={'p'} className="error-handling">Name is required</Texts>
    }
    if (surname.trim() === "") {
      return <Texts variant={'p'} className="error-handling">Surname is required</Texts>
    }
    if (email.trim() === "") {
      return <Texts variant={'p'} className="error-handling">Email is required</Texts>
    }
    else if (email.length > 0 && (!email.includes("@") && !email.includes("."))) {
      return <Texts variant={'p'} className="error-handling">Incorrect format for email</Texts>
    }
    if (cellnumber.length === 0) {
      return <Texts variant={'p'} className="error-handling">Cell number is required </Texts>
    }
    if (password.trim() === "") {
      return <Texts variant={'p'} className="error-handling">Password is required</Texts>
    }
    else if (password.length > 0 && confirm_password.length > 0 && (password != confirm_password)) {
      return <Texts variant={'p'} className="error-handling">Invalid credentials</Texts>
    }
    return null
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="form ">
        <div className="form-content">
          <div className="input-container">
            <label id="name" className="labels">Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="input-fields" />
          </div>
          <div className="input-container">
            <label id="surname" className="labels">Surname:</label>
            <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Enter your surname" className="input-fields" />
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
          <label><input type="checkbox" />Do you agree to terms and conditions</label>
        </div>
        <div className="register-btn">
          <button type="submit">CREATE AN ACCOUNT</button>
        </div>
      </form>

    </div>
  )
}
