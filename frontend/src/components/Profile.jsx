import ProfilePicture from './ProfilePicture'
import ProfileOptions from './ProfileOptions'
import "../styles/profile.css"

function UserProfile() {
    function profileHover(e) {
        document.getElementById("profile-options").classList.toggle("active")
    }

    return (
        <div id='profile' onMouseEnter={profileHover} onMouseLeave={profileHover}>
            <ProfilePicture isUser={true} contact={{ _id: localStorage.getItem("id") }} />
            <ProfileOptions/>
        </div>
    )
}

export default UserProfile