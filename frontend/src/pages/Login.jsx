import { useDispatch} from "react-redux"
import {useState} from "react"
import { login } from "../features/authSlice"
import { useNavigate } from "react-router-dom"
import Semantic from "../components/Semantic.jsx"
import "../login.css"

const Hello = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [inputs, setInputs] = useState({
    name: "",
    email_or_number: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState({
    value: false,
    text: "",
  })
  
  const [status, setStatus] = useState("Login")
  
  const changeInput = (e) => {
    setInputs({
        ...inputs,
        [e.target.name] : e.target.value
    })
  }

  const loginFn = (e) => {
    e.preventDefault()

    if (inputs.name !== "" & inputs.email_or_number !== "" & inputs.password !== "" & inputs.confirmPassword !== "") {
      dispatch(login({ inputs, status, navigate })) 
      console.log("dispatched")
      
    } else if (inputs.password !== inputs.confirmPassword) {
      setError({
        ...error,
        value: true,
        text: "incorrect password confirmation"
      })

      setTimeout(() => setError({
        ...error,
        value: false,
        text: "",
      }), 3000)

    } else {
      setError({
        ...error,
        value: true,
        text: "fill all forms"
      })

      setTimeout(() => setError({
        ...error,
        value: false,
        text: "",
      }), 3000)
      console.log("error")
    }
    
    setInputs({
      ...inputs,
      password: "",
      confirmPassword: ""
    })
  }

  const changeStatus = (e) => {
    status === "Register" ? setStatus("Login") : setStatus("Register")
  }
  
  return (
    <>
      <div id="container">
        <form >
          <img id="logo" src="./images/logo.png" alt="logo" />
          {status === "Register" && <input type="text" onChange={changeInput} name="name" value={inputs.name} placeholder="Input name" />}
          <input type="text" onChange={changeInput} name="email_or_number" value={inputs.email_or_number} placeholder="Phone number / email" />
          <input type="password" onChange={changeInput} name="password" value={inputs.password} placeholder="Password" />
          {status === "Register" && <input type="password" onChange={changeInput} name="confirmPassword" value={inputs.confirmPassword} placeholder="Confirm Password" />}
          <div id="toggle-submit-option" onClick={changeStatus}>{status === "Login" ? "click here to register" : "click here to log in"}</div>
          {error.value && <Semantic text={error.text} code="warn"/>}
          <button type="submit" onClick={loginFn}>{status }</button>
        </form>
        <div id="space"></div>
        <footer>
          
        </footer>
      </div>
      
    </>
  )
}

export default Hello