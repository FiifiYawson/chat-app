import React from 'react'
import upload from '../images/upload.svg'
import "../styles/profile-options.css"

function ProfileOptions() {
    let input
    let form
    async function uploadPic() {
        input = document.createElement("input")
        form = new FormData()
        input.type = "file"
        input.onchange = () => {
            form.append("profilepic", input.files[0])
            fetch("/files/profilepic", {
                method: "POST",
                body: form,
                headers: {
                    authorization: `Bearer ${localStorage.getItem("auth token")}`
                }
            })
        }
        input.click()
    }

    return (
        <>
                <div id='profile-options'>
                    <div className="profile-option" onClick={uploadPic}>
                        <img className='profile-option-image' src={upload} alt="upload profile pic" />
                    </div>
                </div>
        </>
    )
}

export default ProfileOptions