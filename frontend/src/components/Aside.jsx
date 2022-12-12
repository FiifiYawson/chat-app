import Contacts from "./Contacts/Contacts"
import Menu from "./Menu/Menu"
import "../styles/aside.css"
import Profile from "./Profile"

function Aside() {
    return (
        <aside>
            <Menu />
            <Profile/>
            <Contacts />
        </aside>
    )
}

export default Aside