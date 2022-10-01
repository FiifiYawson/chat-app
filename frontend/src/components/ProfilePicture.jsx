import { useState, useEffect } from 'react'
import "../styles/profilepic.css"
import userpic from "../images/user-pic.svg"

function ProfilePicture({ contact, isUser }) {
    const [isOK, setIsOK] = useState()

    useEffect(() => {
        fetch(`/files/profilepic/${contact._id}`)
        .then(res => {
            if (res.ok) {
                return res.blob()
                .then(blob => {
                    const file = URL.createObjectURL(blob)
                    setIsOK(file)
                })
            } else {
                setIsOK(false)
            }
        })
    }, [contact._id])
    
    const style = isOK ?
        {
            backgroundImage: `url(${isOK}`,
        }
        :{}
    
    return (
        <div style={style} className={isUser ? 'user-profilepic profilepic' : 'contact-profilepic profilepic'}>

        </div>            
    )
}

export default ProfilePicture