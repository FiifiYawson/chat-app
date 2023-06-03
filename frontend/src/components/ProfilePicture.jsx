import { useState, useEffect } from 'react'
import "../styles/profilepic.css"

function ProfilePicture({ id, isOnline }) {
    const [isOK, setIsOK] = useState()

    useEffect(() => {
        fetch(`/files/profilepic/${id}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("auth token")}`
            }
        })
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
    }, [id])
    
    const style = isOK ?
        {
            backgroundImage: `url(${isOK}`,
        }
        :{}
    
    return (
        <div style={style} className='contact-profilepic profilepic'>
            {isOnline && <div className='online-indicator'></div>}
        </div>            
    )
}

export default ProfilePicture