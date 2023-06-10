import { useState, useEffect } from 'react'
import "../styles/profilepic.css"
import Loader from "../components/Loader"

function ProfilePicture({ id, isOnline }) {
    const [isOK, setIsOK] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch(`/files/profilepic/${id}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("auth token")}`
            }
        })
        .then(res => {
            if (res.ok) {
                res.blob()
                .then(blob => {
                    const file = URL.createObjectURL(blob)
                    setIsOK(file)
                })
            } else {
                setIsOK(false)
            }

            setIsLoading(false)
        })
        .catch(err => console.log(err))
    }, [id])
    
    const style = isOK ?
        {
            backgroundImage: `url(${isOK}`,
        }
        :{}
    
    return (
        <div style={style} className={isLoading ? "contact-profilepic profilepic loading" : 'contact-profilepic profilepic'}>
            {isOnline && <div className='online-indicator'></div>}
            {isLoading && <Loader className="loader"/>}
        </div>            
    )
}

export default ProfilePicture