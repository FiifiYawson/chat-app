import Contacts from "./Contacts"
import Menu from "./Menu"
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