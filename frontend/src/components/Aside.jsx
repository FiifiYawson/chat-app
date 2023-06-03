import Contacts from "./Contacts/Contacts"
import Menu from "./Menu/Menu"
import { useLocation } from "react-router-dom"
import "../styles/aside.css"
import {Outlet} from "react-router-dom"
function Aside() {    
    const { pathname } = useLocation()
    
    return (
        <>
            <aside className={pathname === "/" ? "active" : ""}>
                <Menu />
                <Contacts />
            </aside>
            <Outlet />
        </>
    )
}

export default Aside