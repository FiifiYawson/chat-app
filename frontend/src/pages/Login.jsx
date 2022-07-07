import { useDispatch} from "react-redux"
import {useState} from "react"
import { login } from "../features/authSlice"
import{useNavigate} from "react-router-dom"

const Hello = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [inputs, setInputs] = useState({
    name: "111",
    email_or_number: "111",
    password: "111"
  })
  
  const [status, setStatus] = useState("Register")
  
  const changeInput = (e) => {
    setInputs({
        ...inputs,
        [e.target.name] : e.target.value
    })
  }

  const loginFn = (e) => {
    e.preventDefault()

    dispatch(login({ inputs, status, navigate }))
    
    setInputs({
      ...inputs,
      password: "",
    })
  }

  const changeStatus = (e) => {
    status === "Register" ? setStatus("Login") : setStatus("Register")
  }
  
  return (
    <div>
      <form >
        <input type="text" onChange={changeInput} name="name" value={inputs.name} placeholder="input name" />
        <input type="text" onChange={changeInput} name="email_or_number" value={inputs.email_or_number} placeholder="input phone number" />
        <input type="password" onChange={changeInput} name="password" value={inputs.password} placeholder="set password" />
        <div onClick={changeStatus}>{ status === "Login" ? "click here to register" : "click here to log in" }</div>
        <button type="submit" onClick={loginFn}>{status }</button>
      </form>
    </div>
  )
}

export default Hello