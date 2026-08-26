import { useState } from "react"
import { Texts } from "../../Components/Texts/Texts"
import { PhoneInput } from "react-international-phone"
import "react-international-phone/style.css"
import { Link, useNavigate } from "react-router-dom"
import { MdPerson, MdEmail, MdLock } from "react-icons/md"
import { Notifications } from "../../Components/Notifications/Notifications"
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
  const [errorMessage, setErrorMessage] = useState("")
  const [notifications, setNotifications] = useState("")
  const navigate = useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errorvalidation = errorHandling(name, surname, email, cellnumber, password, confirmPassword)
    if (errorvalidation != "") {
      setErrorMessage(errorvalidation)
      return
    }
    setErrorMessage("")
    try {
      await onSubmit(name, surname, email, cellnumber, password, confirmPassword)
      navigate("/")
    }
    catch (error) {
      setNotifications("Registration failed")
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
    else if (cellnumber.length > 16) {
      return "Not required length for cell number"
    }
    if (password.trim() === "") {
      return "Password is required"
    }
    if (password.length < 6 || password.length > 10) {
      return "Password length should be 6-10 characters"
    }
    const errors: string[] = []
    if (!/[0-9]/.test(password)) errors.push("Must contain a digit")
    if (!/[a-z]/.test(password)) errors.push("Must contain a lowercase letter")
    if (!/[A-Z]/.test(password)) errors.push("Must contain an uppercase letter")
    if (!/[!@#$%&]/.test(password)) errors.push("Must contain a special character")
    if (password !== confirm_password) errors.push("Passwords do not match")
    return errors.join(", ")
  }
  {
    notifications && (
      <Notifications message={notifications} onClose={() => setNotifications("")} duration={2500} />
    )
  }
  return (
    <div className="register-form">
      <form onSubmit={handleSubmit} className="form ">
        <div className="form-content">
          <div className="register-instruction">
            <Texts variant={'h3'} style={{ fontWeight: 'bold' }}>Let's get you set up </Texts>
            <Texts variant={'p'}>Your shopping list organiser. </Texts>
          </div>
          <div className="name-surname">
            <div className="input-container">
              <label htmlFor="name" className="labels">Name</label>
              <div className="input-icon-register">
                <MdPerson className="input-icon" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name " className="input-fields" />
              </div>
            </div>
            <div className="input-container">
              <label htmlFor="surname" className="labels">Surname</label>
              <div className="input-icon-register">
                <MdPerson className="input-icon" />
                <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Enter your surname " className="input-fields"autoComplete="off" />
              </div>
            </div>
          </div>
          <div className="input-container">
            <label htmlFor="email" className="labels">Email</label>
            <div className="input-icon-register">
              <MdEmail className="input-icon" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email " className="input-fields" />
            </div>
          </div>
          <div className="input-container">
            <div className='phone-styling'>
              <PhoneInput defaultCountry="za" forceDialCode={true} value={cellnumber} onChange={(phone) => setCellnumber(phone)} className="phone" />
            </div>
          </div>
          <div className="input-container">
            <label htmlFor="password" className="labels">Password</label>
            <div className="input-icon-register">
              <MdLock className="input-icon" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password " className="input-fields" autoComplete="new-password"/>
            </div>
          </div>
          <div className="input-container">
            <label htmlFor="confirm_password" className="labels">Confirm Password</label>
            <div className="input-icon-register">
              <MdLock className="input-icon" />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password " className="input-fields" autoComplete="new-password" />
            </div>
          </div>
          {errorMessage != "" && <Texts variant={'p'} className="error-handling">{errorMessage}</Texts>}
        </div>
        <div className="register-btn">
          <Texts variant={'p'} className="tagline">You are just one step away from creating your first list</Texts>
          <button type="submit">CREATE AN ACCOUNT</button>
        </div>
        <div className="login-register-btn">
          <Texts variant={'p'} style={{ textAlign: "center" }}>Already have an account?<Link to="/" className="login-reg-btn">Log in</Link></Texts>
        </div>
      </form>

    </div>
  )
}
