import { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import Semantic from './Semantic'
import logo from "../images/logo.svg"
import { resetError, login } from "../features/authSlice"
import Loader from "./Loader"
import "../styles/form.css"

function Form() {
    const dispatch = useDispatch()

    const navigate = useNavigate()
    
    const auth = useSelector(store => store.auth)

    // Set form state //
    const [status, setStatus] = useState("Login")

    // Setting error state //
    const [error, setError] = useState({
        value: false,
        text: "",
    })

    // Declare states for inputs. //
    const [inputs, setInputs] = useState({
        name: "",
        username: "",
        dob: "",
        password: "",
        confirmPassword: "",
    })

    // change Input state. //
    const changeInput = (e) => {
        if (e.target.name === "username") {
            e.target.value = e.target.value.replace(" ", "_")
        }
        setInputs({
            ...inputs,
            [e.target.name] : e.target.value
        })
    }

    const changeStatus = () => {
        status === "Register" ? setStatus("Login") : setStatus("Register")
    }

    // Login or Register a user. //
    const loginFn = (e) => {
        e.preventDefault()

        // Check  if all input conditions have been met. //
        // and setting appopriate actions to each condition. //
        if (inputs.password !== inputs.confirmPassword & status === "Register") {
            setError({
            ...error,
                value: true,
                text: "incorrect password confirmation"
            })

        } else if ((inputs.name !== "" & inputs.email_or_number !== "" & inputs.password !== "" & status === "Register") | (status === "Login" & inputs.email_or_number !== "" & inputs.password !== "")) {
            dispatch(login({ inputs, status, navigate}));
            
        } else {
            setError({
                ...error,
                value: true,
                text: "fill all forms"
            })
            setInputs({
            ...inputs,
            password: "",
            confirmPassword: ""
            })
        }
    }

    //Remove error message. //
    if (error.value) {
        setTimeout(() => {
        setError({
            ...error,
            value: false,
            text: "",
        })
        }, 5000)
    }

    //Remove error message. //
    if (auth.error.value) {
        setTimeout(() => dispatch(resetError()), 5000)
    }
        
    return (
        <form id='login-form'>
            <img id="logo" src={logo} alt="" />
            {status === "Register" && <input type="text" onChange={changeInput} name="name" value={inputs.name} placeholder="Input name" />}
            <input type="tel" onChange={changeInput} name="username" value={inputs.email_or_number} placeholder="username" />
            {status === "Register" && <input type="date" name="dob" onChange={changeInput} id="" />}
            <input type="password" onChange={changeInput} name="password" value={inputs.password} placeholder="Password" />
            {status === "Register" && <input type="password" onChange={changeInput} name="confirmPassword" value={inputs.confirmPassword} placeholder="Confirm Password" />}
            <div id="info" onClick={changeStatus}>
                {status === "Login"
                    ? <p>Don't have and account? <span className="link"> Register </span>here</p>
                    :<p><span className="link">click here to Login</span> if you already have an account</p>}
            </div>
            {auth.error.value && <Semantic text={auth.error.text} code="warn"/>}
            {error.value && <Semantic text={error.text} code="warn" />}
            {
                auth.loading ?
                    <Loader />
                :
                <button type="submit" onClick={loginFn}>{status}</button>}
        </form>
    )
}

export default Form