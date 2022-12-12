import {useState, useEffect} from "react"
import "../styles/profile.css"
import upload from '../images/upload.svg'

function UserProfile() {
    const [picture, updatePicture] = useState()

    useEffect(() => {
        fetch(`/files/profilepic/${localStorage.getItem("id")}`)
        .then(res => {
            if (res.ok) {
                return res.blob()
                .then(blob => {
                    const file = URL.createObjectURL(blob)
                    updatePicture(file)
                })
            } else {
                updatePicture(false)
            }
        })
    }, [])
    
    const style = picture ?
        {
            backgroundImage: `url(${picture}`,
        }
        : {}

    async function uploadPic(e) {
        const file = e.target.files[0]

        const form = new FormData()

        form.append("profilepic", file)

        const res = await fetch("/files/profilepic", {
            method: "POST",
            body: form,
            headers: {
                authorization: `Bearer ${localStorage.getItem("auth token")}`
            }
        })

        if (res.ok) {
            const url = URL.createObjectURL(file)

            updatePicture(url)
        }
    }

    return (
        <div id='profile' >
            <div style={style} className={'user-profilepic profilepic'}>
                <div id='profile-options'>
                    <div className="profile-option">
                        <input type="file" name="file" id="file" accept="image/*" onChange={uploadPic} />
                        <label htmlFor="file"><img className='profile-option-image' title="Upload Profile Picture" src={upload} alt="upload profile pic" /></label>
                    </div>
                </div>
            </div>          
        </div>   
    )
}

export default UserProfile