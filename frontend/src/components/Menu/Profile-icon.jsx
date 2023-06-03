import { useEffect } from "react"
import { setActiveChat } from "../../features/chatSlice"
import { useDispatch, useSelector } from "react-redux"
import { getProfilePic } from "../../features/authSlice"
import "../../styles/profile-icon.css"
import { useNavigate } from "react-router-dom"

function UserProfile() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {profilepic} = useSelector(store => store.auth)

    const openProfile = () => {
        navigate("/profile")
        dispatch(setActiveChat({}))
    }

    useEffect(() => {
        dispatch(getProfilePic())
    }, [dispatch])
    
    const style = profilepic ?
        {
            backgroundImage: `url(${profilepic})`,
        }
        : {}
    
    return (
        <div style={style} onClick={openProfile} className='user-profilepic profilepic menu-icon'>
        </div>          
    )
}

export default UserProfile