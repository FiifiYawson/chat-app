import { useState, useEffect } from 'react'
import "../styles/profilepic.css"

function ProfilePicture({ id }) {
    const [isOK, setIsOK] = useState()

    useEffect(() => {
        fetch(`/files/profilepic/${id}`)
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
        <div style={style} className='contact-profilepic profilepic'></div>            
    )
}

export default ProfilePicture