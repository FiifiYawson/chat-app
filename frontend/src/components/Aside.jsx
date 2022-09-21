import Contacts from "./Contacts"
import Menu from "./Menu"
import "../styles/aside.css"

function Aside() {
    return (
        <aside>
            <Menu />
            <Contacts />
        </aside>
    )
}

export default Aside