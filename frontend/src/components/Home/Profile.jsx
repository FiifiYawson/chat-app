import Menu from "../Menu/Menu"
import "../../styles/profile.css"
import profileImg from "../../images/user-pic.svg"
import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getProfilePic } from "../../features/authSlice"
import { FaPencilAlt } from "react-icons/fa"
import { useLocation } from "react-router-dom"
import Home from "./Home"

function Profile() {
    const form = useRef()
    const dispatch = useDispatch()
    const {profilepic} = useSelector(store => store.auth)

    const { pathname } = useLocation()
    
    const [info, updateInfo] = useState({
        username: localStorage.getItem("username"),
        name: localStorage.getItem("name"),
    })

    const [edit, setEdit] = useState(false)
    
    useEffect(() => {
        dispatch(getProfilePic())

    }, [dispatch])

    const onChange = (e) => {
        if (e.target.name === "username") {
            e.target.value = e.target.value.replace(" ", "_")
        }
        
        updateInfo({
            ...info,
            [e.target.name]: e.target.value,
        })
    }

    const editInfo = async (e) => {
        e.preventDefault()

        if (
            info.name === '' ||
            !info.name ||
            info.username === '' ||
            !info.username
        ){
            setEdit(false)
            return 
        }

        const res = await fetch(`/user/edit-details/`, {
            body: JSON.stringify(info),
            headers: {
                authorization: `Bearer ${localStorage.getItem("auth token")}`,
                "Content-Type": "application/json",
            },
            method: "POST",
        })

        if (res.status !== 200) return setEdit(false)

        localStorage.setItem("username", info.username)
        localStorage.setItem("name", info.name)
        setEdit(false)
    }

    const updateProfilePic = async (e) => {
        const form = new FormData()

        form.set("profilepic", e.target.files[0])

        const res = await fetch(`/files/profilepic`, {
            method: "POST",
            body: form,
            headers: {
                authorization: `Bearer ${localStorage.getItem("auth token")}`
            }
        })

        if (res.status !== 200) return
        
        dispatch(getProfilePic())
    }

    return (
        <div id="profile" className={pathname === "/profile" ? "active" : ""}>
            <Menu />
            <div id="profile-head">
                <img id="profile-img" width={250} height={250} src={profilepic ? profilepic : profileImg} alt=""/>
                {
                    edit?
                        <form ref={form} id="edit-form">
                            <div className="input-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" onChange={onChange} value={info.name} name="name" className="edit-input" id="edit-name-input" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" onChange={onChange} value={info.username} name="username" className="edit-input" id="edit-username-input" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="profilepic" id="file-upload">Update Profile Picture</label>
                                <input type="file" onInput={updateProfilePic} name="profilepic" id="profilepic" style={{display: "none"}} accept="image/*" />
                            </div>
                            <input type="submit" onClick={editInfo} value="save" />
                        </form>
                        :
                        <div id="profile-info">
                            <FaPencilAlt title="edit user details" id="pen-img" onClick={()=>{setEdit(true)}}/>
                            <div title={localStorage.getItem("name")} id="profile-name">{ localStorage.getItem("name") }</div>
                            <div title={`@${localStorage.getItem("username")}`} id="profile-username">{`@${ localStorage.getItem("username") }`}</div>
                        </div>                  
                }
            </div>
            <Home/>
        </div>
    )
}

export default Profile